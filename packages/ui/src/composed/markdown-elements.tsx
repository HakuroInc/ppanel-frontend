"use client";

import { cn } from "@workspace/ui/lib/utils";
import { type Components, defaultUrlTransform } from "react-markdown";
import { defaultSchema, type Options as SanitizeSchema } from "rehype-sanitize";

const APP_DEEPLINK_PROTOCOLS = [
  "clash",
  "clashmeta",
  "shadowrocket",
  "surge",
  "surge3",
  "sing-box",
  "stash",
  "loon",
  "surfboard",
  "hiddify",
  "egern",
  "v2rayng",
  "quantumult-x",
];

const APP_DEEPLINK_SCHEME = new RegExp(
  `^(${APP_DEEPLINK_PROTOCOLS.join("|")}):`,
  "i"
);

// react-markdown strips unknown URL schemes by default, which would break the
// client one-click-import deep links. Everything else keeps the default
// sanitization.
export function appUrlTransform(url: string): string {
  return APP_DEEPLINK_SCHEME.test(url) ? url : defaultUrlTransform(url);
}

// Raw HTML in Markdown comes from admins and a third-party CDN, so it is
// untrusted. Start from the GitHub-style default schema and add only what the
// renderers rely on: language and KaTeX math classes on code, and the app
// deep-link schemes in href. Script, iframe, object, embed and style are
// removed with their content. Event handler attributes, srcdoc and style
// attributes are not allowed, and javascript: or data: links are rejected by
// the protocol allowlists. <source> is dropped because its srcset is not
// checked against the protocol allowlist; the <img> fallback still renders.
export const markdownSanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [["className", /^language-./, "math-inline", "math-display"]],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: [...(defaultSchema.protocols?.href ?? []), ...APP_DEEPLINK_PROTOCOLS],
  },
  strip: [...(defaultSchema.strip ?? []), "style", "iframe", "object", "embed"],
  tagNames: (defaultSchema.tagNames ?? []).filter((tag) => tag !== "source"),
};

export const markdownComponents: Components = {
  h1: ({ node, className, ...props }) => (
    <h1
      className={cn(
        "mb-8 scroll-m-20 font-extrabold text-4xl tracking-tight last:mb-0",
        className
      )}
      {...props}
    />
  ),
  h2: ({ node, className, ...props }) => (
    <h2
      className={cn(
        "mt-8 mb-4 scroll-m-20 font-semibold text-3xl tracking-tight first:mt-0 last:mb-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ node, className, ...props }) => (
    <h3
      className={cn(
        "mt-6 mb-4 scroll-m-20 font-semibold text-2xl tracking-tight first:mt-0 last:mb-0",
        className
      )}
      {...props}
    />
  ),
  h4: ({ node, className, ...props }) => (
    <h4
      className={cn(
        "mt-6 mb-4 scroll-m-20 font-semibold text-xl tracking-tight first:mt-0 last:mb-0",
        className
      )}
      {...props}
    />
  ),
  h5: ({ node, className, ...props }) => (
    <h5
      className={cn(
        "my-4 font-semibold text-lg first:mt-0 last:mb-0",
        className
      )}
      {...props}
    />
  ),
  h6: ({ node, className, ...props }) => (
    <h6
      className={cn("my-4 font-semibold first:mt-0 last:mb-0", className)}
      {...props}
    />
  ),
  p: ({ node, className, ...props }) => (
    <p
      className={cn("mt-5 mb-5 leading-7 first:mt-0 last:mb-0", className)}
      {...props}
    />
  ),
  a: ({ node, className, ...props }) => (
    <a
      className={cn(
        "font-medium text-primary underline underline-offset-4",
        className
      )}
      rel="noreferrer"
      target="_blank"
      {...props}
    />
  ),
  blockquote: ({ node, className, ...props }) => (
    <blockquote
      className={cn("border-l-2 pl-6 italic", className)}
      {...props}
    />
  ),
  ul: ({ node, className, ...props }) => (
    <ul
      className={cn("my-5 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  ),
  ol: ({ node, className, ...props }) => (
    <ol
      className={cn("my-5 ml-6 list-decimal [&>li]:mt-2", className)}
      {...props}
    />
  ),
  hr: ({ node, className, ...props }) => (
    <hr className={cn("my-5 border-b", className)} {...props} />
  ),
  table: ({ node, className, ...props }) => (
    <table
      className={cn(
        "my-5 w-full border-separate border-spacing-0 overflow-y-auto",
        className
      )}
      {...props}
    />
  ),
  th: ({ node, className, ...props }) => (
    <th
      className={cn(
        "bg-muted px-4 py-2 text-left font-bold first:rounded-tl-lg last:rounded-tr-lg [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ node, className, ...props }) => (
    <td
      className={cn(
        "border-b border-l px-4 py-2 text-left last:border-r [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  tr: ({ node, className, ...props }) => (
    <tr
      className={cn(
        "m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg",
        className
      )}
      {...props}
    />
  ),
  sup: ({ node, className, ...props }) => (
    <sup
      className={cn("[&>a]:text-xs [&>a]:no-underline", className)}
      {...props}
    />
  ),
  pre: ({ node, className, ...props }) => (
    <pre
      className={cn("overflow-x-auto rounded-b-lg p-0", className)}
      {...props}
    />
  ),
  code: ({ node, className, ...props }) => (
    <code
      className={cn(
        "rounded border bg-muted/50 px-1 py-0.5 font-mono font-semibold",
        className
      )}
      {...props}
    />
  ),
};
