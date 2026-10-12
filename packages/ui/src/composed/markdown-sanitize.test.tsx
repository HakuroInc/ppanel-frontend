import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MarkdownImpl from "./markdown-impl.js";
import RichMarkdownImpl from "./rich-markdown-impl.js";

describe("markdown raw HTML sanitization", () => {
  it("removes event handler attributes from raw HTML", () => {
    const html = renderToStaticMarkup(
      <MarkdownImpl>{"<img src=x onerror=alert(1)>"}</MarkdownImpl>
    );

    expect(html).toContain('src="x"');
    expect(html).not.toContain("onerror");
  });

  it("removes iframe elements and their srcdoc documents", () => {
    const html = renderToStaticMarkup(
      <MarkdownImpl>
        {'<iframe srcdoc="<script>alert(1)</script>"></iframe>'}
      </MarkdownImpl>
    );

    expect(html).not.toContain("iframe");
    expect(html).not.toContain("srcdoc");
    expect(html).not.toContain("script");
  });

  it("removes raw HTML handlers and iframes in the rich renderer", () => {
    const html = renderToStaticMarkup(
      <RichMarkdownImpl>
        {
          '<img src=x onerror=alert(1)>\n\n<iframe srcdoc="<script>alert(1)</script>"></iframe>\n\n$x^2$'
        }
      </RichMarkdownImpl>
    );

    expect(html).not.toContain("onerror");
    expect(html).not.toContain("iframe");
    expect(html).not.toContain("srcdoc");
    // Math still renders after the sanitizer runs, so KaTeX markup is present.
    expect(html).toContain("katex");
  });

  it("drops style blocks and data: image sources", () => {
    const html = renderToStaticMarkup(
      <MarkdownImpl>
        {
          '<style>body{display:none}</style>\n\n<picture><source srcset="data:image/png;base64,AAAA"><img src="https://x.example/a.png" alt="a"></picture>'
        }
      </MarkdownImpl>
    );

    expect(html).not.toContain("display");
    expect(html).not.toContain("data:");
    expect(html).toContain('src="https://x.example/a.png"');
  });

  it("drops javascript: links", () => {
    const html = renderToStaticMarkup(
      <MarkdownImpl>{"[click](javascript:alert(1))"}</MarkdownImpl>
    );

    expect(html).not.toContain("javascript:");
  });

  it("keeps app deep-link URLs", () => {
    const html = renderToStaticMarkup(
      <MarkdownImpl>
        {"[Import](clash://install-config?url=https://example.com/sub)"}
      </MarkdownImpl>
    );

    expect(html).toContain(
      'href="clash://install-config?url=https://example.com/sub"'
    );
  });

  it("keeps the language class on fenced code blocks", () => {
    const html = renderToStaticMarkup(
      <MarkdownImpl>{"```ts\nconst a = 1\n```"}</MarkdownImpl>
    );

    expect(html).toContain("language-ts");
  });
});
