#!/usr/bin/env node
// Fails the build when styling leaves shadcn/ui: extra CSS files, rules in
// app/app.css beyond shadcn's theme, native form or overlay elements, inline
// styles, colours that aren't theme tokens, or leftovers from the template's
// old CSS. app/components/ui/ is shadcn's own code and is exempt.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const appDir = join(root, "app");
const uiDir = join(appDir, "components", "ui");
const problems = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function report(file, line, message) {
  problems.push(`${relative(root, file)}:${line}  ${message}`);
}

function lineOf(source, index) {
  return source.slice(0, index).split("\n").length;
}

// 1. One stylesheet.
for (const file of [...walk(appDir), ...walk(join(root, "public"))]) {
  if (file.endsWith(".css") && file !== join(appDir, "app.css")) {
    report(file, 1, "only app/app.css may hold CSS");
  }
}

// 2. app/app.css keeps shadcn's structure: imports, the dark variant, the
// theme mapping, :root and .dark variables, and the base layer.
const ALLOWED_BLOCKS = [
  /^@theme inline$/,
  /^:root$/,
  /^\.dark$/,
  /^@layer base$/,
];
const ALLOWED_STATEMENTS = [
  /^@import "[^"]+"$/,
  /^@custom-variant dark \(.+\)$/,
];
{
  const file = join(appDir, "app.css");
  const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, (c) =>
    c.replace(/[^\n]/g, " "),
  );
  let depth = 0;
  let start = 0;
  for (let i = 0; i < css.length; i++) {
    const char = css[i];
    if (char === "{") {
      if (depth === 0) {
        const prelude = css.slice(start, i).trim();
        if (!ALLOWED_BLOCKS.some((re) => re.test(prelude))) {
          report(
            file,
            lineOf(css, start + css.slice(start, i).search(/\S/)),
            `rule "${prelude}" is not part of shadcn's theme`,
          );
        }
      }
      depth++;
    } else if (char === "}") {
      depth--;
      if (depth === 0) start = i + 1;
    } else if (char === ";" && depth === 0) {
      const statement = css.slice(start, i).trim();
      if (!ALLOWED_STATEMENTS.some((re) => re.test(statement))) {
        report(
          file,
          lineOf(css, start + css.slice(start, i).search(/\S/)),
          `"${statement}" is not part of shadcn's theme`,
        );
      }
      start = i + 1;
    }
  }
}

// 3. Components and routes outside app/components/ui.
const NATIVE_ELEMENTS = [
  "button",
  "select",
  "textarea",
  "details",
  "summary",
  "dialog",
  "style",
];
const COLOUR_UTILITY = String.raw`(?:bg|text|border|ring|outline|fill|stroke|from|via|to|decoration|divide|placeholder|caret|accent|shadow)`;
const PALETTE =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white";
const PATTERNS = [
  [
    new RegExp(
      String.raw`\b${COLOUR_UTILITY}-\[(?:#|rgb|hsl|oklch|oklab|color|var\()`,
      "g",
    ),
    "arbitrary colour; use a shadcn token",
  ],
  [
    new RegExp(
      String.raw`(?<![\w-])${COLOUR_UTILITY}-(?:${PALETTE})(?:-\d{2,3})?(?:\/\d+)?(?![\w-])`,
      "g",
    ),
    "Tailwind palette colour; use a shadcn token",
  ],
  [/\/icons\//g, "template icon; use lucide-react"],
  [
    /(?<![\w-])(?<!(?:\bid|data-testid)=")(?:bg-surface|text-on-surface|bg-on-surface|text-surface|on-surface-secondary|bg-interactive|text-interactive|outline-accent|max-w-page|px-margin|touch-target|min-h-hero|button-(?:primary|secondary|outline|ghost|icon|surface|shop-pay)|badge-(?:default|sale|accent|info|success|warning|soldout)|option-pill|chip-(?:filled|outlined)|swatch-(?:sm|md|lg|buttons|scrim)|filter-(?:checkbox|swatch|check-icon|drawer)|overlay-(?:dark|medium|light|white)|type-(?:display|heading-\w+|body(?:-\w+)?|overline)|drawer-(?:right|left|title|results|query)|number-reset|scrollbar-none|marker-hidden|product-grid|richtext|card-link|quantity-selector-\w+|cart-count-badge|nav-dropdown\w*|logo-size-custom)(?![\w-])/g,
    "template class from the removed tokens.css",
  ],
];

for (const file of walk(appDir)) {
  if (!/\.tsx?$/.test(file) || file.endsWith(".d.ts") || file.startsWith(uiDir))
    continue;
  const source = readFileSync(file, "utf8");

  for (const element of NATIVE_ELEMENTS) {
    for (const match of source.matchAll(
      new RegExp(String.raw`<${element}[\s>/]`, "g"),
    )) {
      report(
        file,
        lineOf(source, match.index),
        `native <${element}>; use the shadcn component`,
      );
    }
  }
  for (const match of source.matchAll(/<input\b[^>]*>/g)) {
    if (!/type="hidden"/.test(match[0])) {
      report(
        file,
        lineOf(source, match.index),
        "native <input>; use Input, Checkbox or another shadcn control",
      );
    }
  }
  // Inline styles may only pass data through: a swatch colour or a CSS variable.
  for (const match of source.matchAll(/style=\{\{([\s\S]*?)\}\}/g)) {
    const keys = [
      ...match[1].matchAll(/(?:^|,)\s*(["']?[\w-]+["']?)\s*:/g),
    ].map((m) => m[1].replace(/["']/g, ""));
    const disallowed = keys.filter(
      (key) => key !== "backgroundColor" && !key.startsWith("--"),
    );
    if (disallowed.length > 0) {
      report(
        file,
        lineOf(source, match.index),
        `inline style (${disallowed.join(", ")}); use utilities or a variant`,
      );
    }
  }
  for (const [pattern, message] of PATTERNS) {
    for (const match of source.matchAll(pattern)) {
      report(file, lineOf(source, match.index), `${message}: "${match[0]}"`);
    }
  }
}

if (problems.length > 0) {
  console.error(`check:styles found ${problems.length} problem(s):\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error(
    '\nshadcn/ui is the source of styling truth. See AGENTS.md, "Styling rules".',
  );
  process.exit(1);
}

console.log("check:styles: styling comes only from shadcn/ui and its theme");
