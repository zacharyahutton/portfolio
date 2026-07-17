import { withReadingMeta } from "../types";

export const cssGridVsFlexboxPost = withReadingMeta({
  id: "css-grid-vs-flexbox",
  title: "CSS Grid vs Flexbox: how to choose the right layout tool",
  blurb:
    "Learn CSS Grid vs Flexbox with practical rules, responsive examples, and common layout mistakes so you can choose the right tool for every interface today.",
  tag: "CSS",
  date: "July 2026",
  publishedAt: "2026-07-17",
  href: "/blog/css-grid-vs-flexbox",
  image: "/blog/css-grid-vs-flexbox.png",
  primaryKeyword: "CSS Grid vs Flexbox",
  secondaryKeywords: [
    "when to use CSS Grid",
    "when to use Flexbox",
    "responsive CSS layout",
    "CSS layout examples",
  ],
  intro: [
    "CSS Grid vs Flexbox sounds like a competition, but that framing causes most of the confusion. They solve related problems at different scales. Flexbox arranges items along one main direction. Grid controls rows and columns together. A good page normally uses both, often inside the same section.",
    "I learned this distinction by rebuilding portfolio pages and client interfaces that had accumulated margins, width calculations, and media queries. Once I started choosing the layout model from the relationship between elements, instead of choosing whichever syntax I remembered first, the CSS became shorter and the responsive behavior became easier to predict. This guide shares the decision process I now use.",
  ],
  sections: [
    {
      heading: "The simplest mental model for CSS Grid and Flexbox",
      paragraphs: [
        "Flexbox is one dimensional. You choose a row or a column as the main axis, then control how items grow, shrink, align, and wrap along that axis. It is ideal when the content determines the final size. A navigation bar, button group, author row, and centered empty state are all natural Flexbox problems.",
        "Grid is two dimensional. You define tracks across columns and rows, then place items into that structure. It is ideal when the layout determines where content should sit. A project gallery, pricing comparison, article shell with a sidebar, and dashboard region are natural Grid problems. Grid can still adapt to content, but its strength is coordinating both dimensions.",
      ],
      bullets: [
        "Use Flexbox when the relationship is mainly a row or mainly a column.",
        "Use Grid when several rows must share column alignment.",
        "Use content flow as the deciding factor, not the number of elements.",
        "Combine them freely because a Grid item can also be a Flexbox container.",
      ],
    },
    {
      heading: "When Flexbox is the clearer choice",
      paragraphs: [
        "I reach for Flexbox when elements belong to one group and need to distribute available space. A header logo, navigation list, and action button form one horizontal group. The exact width of each item comes from its content, while the container decides the spacing and alignment. Flexbox expresses that intent directly.",
        "Flexbox also handles small responsive changes well. A card footer can be a row on wide screens and a column on narrow screens. A list of tags can wrap without defining columns. The browser measures each item and moves it as space changes. That content driven behavior is often better than forcing every item into equal tracks.",
      ],
      code: {
        label: "A responsive action row with Flexbox",
        language: "css",
        code: `.article-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.article-actions__buttons {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 36rem) {
  .article-actions,
  .article-actions__buttons {
    align-items: stretch;
    flex-direction: column;
  }
}`,
      },
    },
    {
      heading: "When CSS Grid removes layout complexity",
      paragraphs: [
        "Grid becomes valuable when alignment must continue across more than one row. Imagine a list of project cards where every image, title, summary, and link should line up. Flexbox can make each card flexible, but it does not coordinate columns between separate rows. Grid creates that shared structure in one declaration.",
        "Grid is also excellent for page level composition. The article page on this portfolio has a table of contents beside a readable text column. That is a two column relationship, so Grid communicates it clearly. At a smaller breakpoint, the layout returns to one column. There is no need for absolute positioning or manual width subtraction.",
      ],
      code: {
        label: "An automatically filling card grid",
        language: "css",
        code: `.project-list {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 18rem), 1fr)
  );
  gap: clamp(1rem, 3vw, 2rem);
}

.article-layout {
  display: grid;
  grid-template-columns: 14rem minmax(0, 45rem);
  justify-content: center;
  gap: 4rem;
}

@media (max-width: 52rem) {
  .article-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}`,
      },
    },
    {
      heading: "A practical decision checklist",
      paragraphs: [
        "Before writing CSS, I sketch the relationship in plain language. If I say, \"these controls sit in a row and may wrap,\" I choose Flexbox. If I say, \"these cards form columns that repeat,\" I choose Grid. If I say, \"the media sits above the copy inside every card,\" I may use Grid for the collection and Flexbox for each card.",
        "The choice should reduce special cases. If a Flexbox layout needs calculated widths, selectors for every third item, and negative margins, it probably wants Grid. If a Grid layout needs many explicit placements just to keep a few controls together, it probably wants Flexbox. The best tool makes the default browser behavior close to the design.",
      ],
      subheadings: [
        {
          heading: "Questions I ask before choosing",
          paragraphs: [
            "These questions are more reliable than memorizing component recipes because they focus on the actual constraint. They also make code review easier, since another developer can understand why the layout model was chosen.",
          ],
          bullets: [
            "Do I need alignment across both rows and columns?",
            "Should item size come mainly from content or from shared tracks?",
            "Will items wrap naturally, or must they remain in known positions?",
            "Can the browser create columns automatically from a minimum width?",
            "Would nesting one layout model inside the other make each responsibility clearer?",
          ],
        },
      ],
    },
    {
      heading: "Responsive layouts without breakpoint overload",
      paragraphs: [
        "Modern Grid and Flexbox features can remove many media queries. Grid with auto-fit and minmax creates as many columns as fit while preserving a usable minimum. Flexbox with flex-wrap lets content move to another line when needed. Container queries can then handle cases where a component responds to its own width rather than the viewport.",
        "I still use breakpoints when the composition truly changes. A desktop navigation becoming a menu is a behavioral change, not just a smaller row. An article sidebar moving above the content changes reading order. The goal is not zero media queries. The goal is to let intrinsic layout handle ordinary resizing so breakpoints represent meaningful design decisions.",
      ],
    },
    {
      heading: "Common mistakes that make both tools feel difficult",
      paragraphs: [
        "The first mistake is setting fixed widths too early. A grid with three 400 pixel columns cannot respond gracefully on a 900 pixel screen. Prefer flexible tracks, minimum sizes, and max width containers. The second mistake is forgetting min-width: 0 on flexible children. Long code, URLs, or headings can force a track wider than expected unless the child is allowed to shrink.",
        "The third mistake is using order or manual Grid placement to create a visual sequence that differs from the document. Keyboard and screen reader navigation still follows source order. Keep meaningful reading order in the HTML, then use CSS for presentation. The fourth mistake is treating gap as decoration. Gap belongs to the layout relationship and usually produces cleaner spacing than child margins.",
      ],
      bullets: [
        "Avoid fixed column widths unless the design truly requires them.",
        "Add min-width: 0 to children that contain text or code.",
        "Keep source order logical for accessibility.",
        "Prefer gap on the parent over margins on every child.",
        "Test long names, translated copy, and zoom at 200 percent.",
      ],
    },
    {
      heading: "How I combine Grid and Flexbox in real components",
      paragraphs: [
        "A project archive is a good example. The archive container uses Grid to create responsive card columns. Each card uses Flexbox in a column so its action link can sit at the bottom even when summaries have different lengths. The metadata row inside the card uses Flexbox again because tags and dates are a one dimensional group.",
        "This nesting is not excessive. Each layer owns one relationship. Grid coordinates cards across the page. Flexbox coordinates content inside one card. A smaller Flexbox row coordinates metadata. When the CSS mirrors the visual hierarchy, changes stay local. Adding a badge does not require rebuilding the page grid, and changing the number of archive columns does not affect card internals.",
        "Browser developer tools make these boundaries visible. Turn on Grid and Flexbox overlays, resize the container, and watch which parent controls each gap and alignment. That quick inspection often reveals a misplaced responsibility before you add another selector.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is CSS Grid better than Flexbox?",
      answer:
        "Neither is generally better. Grid is stronger for two dimensional layouts with shared rows and columns. Flexbox is stronger for one dimensional groups where content size and distribution matter. Most production interfaces use both.",
    },
    {
      question: "Can I use Flexbox inside CSS Grid?",
      answer:
        "Yes. A Grid item can be a Flexbox container, and a Flexbox item can be a Grid container. This is a normal pattern. Use each layout model for the relationship it controls rather than trying to make one tool manage the entire page.",
    },
    {
      question: "Should I use Grid or Flexbox for cards?",
      answer:
        "Use Grid for the collection when cards need consistent responsive columns. Inside each card, use Flexbox when content should stack and an action should align at the bottom. If the cards are a single horizontal scroller, Flexbox may handle the collection too.",
    },
    {
      question: "Does CSS Grid replace media queries?",
      answer:
        "Grid can reduce media queries through auto-fit, minmax, and flexible tracks, but it does not replace them completely. Use a breakpoint when the composition, interaction, or reading order needs a deliberate change.",
    },
  ],
  takeaway:
    "The useful answer to CSS Grid vs Flexbox is not one or the other. Choose Flexbox for a single flow, choose Grid for coordinated rows and columns, and combine them at clear component boundaries. Your CSS should describe relationships, not fight the browser with width calculations.",
});
