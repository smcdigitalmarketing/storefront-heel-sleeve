import { MailIcon, MessageCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import {
  brandButtonClass,
  brandButtonVariant,
} from "~/components/store/BrandButton";
import { storePaths } from "~/components/store/nav";
import { PageTitle } from "~/components/store/PageTitle";
import { Button } from "~/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { brand } from "~/content/brand";
import {
  formatPageTitle,
  getShopNameFromRootMatch,
} from "~/lib/storefront-shop";

import type { Route } from "./+types/contact";

export function meta({ matches }: Route.MetaArgs) {
  return [
    {
      title: formatPageTitle("Contact", getShopNameFromRootMatch(matches[0])),
    },
    { name: "description", content: brand.store.contact.body },
  ];
}

const TOPICS = [
  "My camera",
  "An order",
  "Returns",
  "Press or partnerships",
  "Something else",
];

const FIELD = "bg-card text-card-foreground rounded-none border-foreground/40";

export default function Contact() {
  // No support inbox yet: the form only works once hydrated, so it never falls
  // back to a native submit that would put the message in the URL.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <main className="flex-1 pb-24" id="main-content" tabIndex={-1}>
      <PageTitle
        eyebrow="Contact"
        title={brand.store.contact.headline}
        intro={brand.store.contact.body}
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_20rem]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            toast("Messages aren't connected yet", {
              description:
                "There's no support inbox behind this form yet, so your message wasn't sent or stored.",
            });
          }}
          aria-label="Contact form"
        >
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="contact-name">Name</FieldLabel>
                <Input
                  id="contact-name"
                  name="name"
                  required
                  autoComplete="name"
                  className={`${FIELD} h-11`}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="contact-email">Email</FieldLabel>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={`${FIELD} h-11`}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="contact-topic">Topic</FieldLabel>
              <Select name="topic" defaultValue={TOPICS[0]}>
                <SelectTrigger
                  id="contact-topic"
                  className={`${FIELD} h-11 w-full`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TOPICS.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-message">Message</FieldLabel>
              <Textarea
                id="contact-message"
                name="message"
                required
                rows={6}
                className={`${FIELD} min-h-36`}
              />
            </Field>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                disabled={!ready}
                variant={brandButtonVariant("primary")}
                className={brandButtonClass("primary", "lg")}
              >
                Send message
              </Button>
              <PlaceholderTag
                kind="placeholder"
                label="Form not connected yet · nothing is sent or stored"
              />
            </div>
          </FieldGroup>
        </form>
        <aside
          aria-label="Other ways to reach us"
          className="space-y-6 text-sm"
        >
          <div className="space-y-1">
            <p className="flex items-center gap-2 font-semibold">
              <MailIcon className="size-4" aria-hidden="true" /> Email
            </p>
            <p className="text-muted-foreground">
              Support address to be confirmed <PlaceholderTag kind="tbc" />
            </p>
          </div>
          <div className="space-y-1">
            <p className="flex items-center gap-2 font-semibold">
              <MessageCircleIcon className="size-4" aria-hidden="true" />{" "}
              Response times
            </p>
            <p className="text-muted-foreground">
              To be confirmed <PlaceholderTag kind="tbc" />
            </p>
          </div>
          <p className="text-muted-foreground">
            Many answers are already in the{" "}
            <Link
              to={storePaths.faq}
              className="text-foreground underline underline-offset-4"
            >
              FAQ
            </Link>
            .
          </p>
        </aside>
      </div>
    </main>
  );
}
