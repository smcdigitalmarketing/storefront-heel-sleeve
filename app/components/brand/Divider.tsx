/**
 * Rally's section divider: diagonal lime field-line stripes on a Night band
 * (the mock's `ra-stripes`). An SVG pattern, so it needs no CSS.
 */
export function Divider() {
  return (
    <svg aria-hidden className="bg-secondary block h-3.5 w-full fill-primary">
      <defs>
        <pattern
          id="rally-stripes"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="6" height="16" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#rally-stripes)" />
    </svg>
  );
}
