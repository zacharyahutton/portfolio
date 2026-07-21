(() => {
  const posts = {
    "css-grid": {
      title: "CSS Grid vs Flexbox, When I Reach for Which",
      category: "UI Engineering",
      date: "Nov 04, 2025",
      keywords:
        "css grid, flexbox, frontend layout, responsive design, web development, Zachary Hutton",
      description:
        "Learn when I use CSS Grid versus Flexbox, how I plan responsive layouts, and the practical rules that keep frontend code cleaner and easier to scale.",
      excerpt:
        "I use Grid when the page needs two dimensional structure and Flexbox when alignment flows in one direction. This is the practical decision tree I use on real client work.",
      cover: "../../wp-content/uploads/zach/blog/blog-css-grid.png?v=premium2",
      intro: [
        "CSS Grid and Flexbox only feel confusing when people frame them like rivals. I do not treat them that way. I treat them like two layout tools with different strengths, and once I made that mental shift my CSS got calmer, cleaner, and easier to scale.",
        "The question I ask first is not which feature is newer or more powerful. The question is what kind of layout problem I am solving. If the parent needs to control rows and columns together, Grid usually deserves the first shot. If I am lining items up across one axis, Flexbox is usually the faster and more natural choice.",
        "That may sound obvious, but a lot of frontend frustration comes from skipping that step. We reach for the last tool that worked, then spend the next hour forcing it into a shape it was not meant to own. In real projects, that creates brittle spacing rules, awkward wrappers, and breakpoints that feel more like rescue operations than design decisions."
      ],
      sections: [
        {
          heading: "The mental model I use before writing a single class",
          paragraphs: [
            "I start by deciding whether the layout is one dimensional or two dimensional. One dimensional means I mainly care about distributing content in a row or a column. Two dimensional means I care about both axes together, and I want explicit control over how elements sit across rows and columns as the design changes.",
            "That distinction matters because Grid is best when the parent owns the composition. It gives me structure. Flexbox is best when the children need to align or distribute themselves inside a smaller local region. It gives me flow. When I respect that split, I spend less time patching layout behavior later.",
            "I also think about future edits. Will the client add more cards. Will titles vary wildly in length. Will the section gain another metadata row later. Choosing the right layout system early makes those changes routine instead of painful."
          ]
        },
        {
          heading: "Where Grid wins without much debate",
          subheads: [
            {
              title: "Page structure and section shells",
              paragraphs: [
                "For heroes, blog archives, case study galleries, pricing layouts, and other large compositions, Grid gives me a stronger foundation. I can define the columns once, keep the gaps consistent, and shape the section intentionally instead of letting it drift based on child content.",
                "That matters on portfolio work because visual rhythm is part of credibility. A layout that feels improvised weakens even good content. Grid helps me keep the structure editorial instead of accidental."
              ]
            },
            {
              title: "Repeatable card systems",
              paragraphs: [
                "Grid also shines when content repeats in a gallery or listing. Blog cards, service summaries, and featured work blocks all benefit from a parent that controls the spacing and column behavior. I can use responsive patterns like auto fit without resorting to width percentages or margin hacks on every child.",
                "When the section has to look organized even as content length changes, Grid usually gives me the more resilient result."
              ]
            }
          ]
        },
        {
          heading: "Where Flexbox still feels unbeatable",
          subheads: [
            {
              title: "Alignment inside components",
              paragraphs: [
                "Inside a card, nav item, button row, author block, or icon and label pair, Flexbox is usually my favorite. It handles direction, alignment, spacing, and growth rules elegantly with less setup than Grid. If the problem is local and directional, Flexbox is almost always the clean answer.",
                "This is especially true when content length changes often. One button can grow, another can stay content sized, and the whole row can still wrap gracefully when space tightens."
              ]
            },
            {
              title: "Navigation and controls",
              paragraphs: [
                "Menus, toolbars, filter chips, and small interface controls are directional by nature. They need distribution and alignment more than they need a row and column map. Flexbox is usually the right level of power for that job.",
                "The mistake I see often is using Grid in those places because it feels more modern. Modern does not automatically mean appropriate. Good layout choices are about fit."
              ]
            }
          ]
        },
        {
          heading: "Why I often use both on the same page",
          paragraphs: [
            "The best layouts rarely commit to one forever. I use Grid for the outer section and Flexbox for the inner pieces all the time. A blog archive can be a Grid of cards while each card uses Flexbox for the author row, metadata, and calls to action. A hero can use Grid for the main split and Flexbox for its button cluster or badge row.",
            "That combination works because each tool handles the layer it is best at. Structure outside, alignment inside. Once you see that pattern, the false choice disappears and the code gets more intentional."
          ]
        },
        {
          heading: "Layout mistakes I try to avoid",
          paragraphs: [
            "One mistake is forcing Flexbox to behave like a full page Grid through piles of nested wrappers and arbitrary widths. Another is using Grid for tiny alignment tasks where Flexbox would be simpler and easier to read. Both approaches technically work, but they age badly once content changes.",
            "I also avoid pushing spacing responsibility onto children whenever the parent should own the gap. Parent driven spacing creates more predictable systems, especially in repeated components or sections that reorder on smaller screens.",
            "Finally, I do not let layout convenience break semantics. Good CSS should support meaningful HTML, not demand strange markup just to keep the design standing."
          ]
        },
        {
          heading: "The practical rule I come back to",
          paragraphs: [
            "If I need rows and columns together, I start with Grid. If I need alignment along one axis, I start with Flexbox. If I need both, I use both without apology. That rule is simple enough to apply under deadline pressure, which is when most layout decisions actually happen.",
            "The goal is not to win a CSS debate. The goal is to build layouts that survive real content, real revisions, and real devices. When I keep the choice grounded in the problem, the result is usually stronger.",
            "If you want to see that thinking applied in production style work, explore my <a href=\"../../services/premium-business-websites/index.html\">premium website services</a>, browse the <a href=\"../../portfolio-page/index.html\">case studies</a>, or <a href=\"../../contact-us/index.html\">contact me</a> if you want a frontend that feels deliberate from the first viewport onward."
          ]
        }
      ]
    },
    "weroi": {
      title: "Building the weROI Agency Platform",
      category: "Case Study",
      date: "Nov 11, 2025",
      keywords:
        "weROI case study, agency platform, full stack development, product strategy, Zachary Hutton",
      description:
        "A grounded look at how I think about building agency platforms, balancing marketing clarity, operations, and technical scalability without overcomplicating the first release.",
      excerpt:
        "This is my practical take on building an agency platform that can explain the offer, support operations, and grow without turning into a bloated first release.",
      cover: "../../wp-content/uploads/zach/blog/blog-weroi.png?v=premium2",
      intro: [
        "When people hear agency platform, they often imagine something much bigger than what a useful first release actually needs to be. I have learned that the smartest starting point is usually narrower. An agency platform has to explain the offer clearly, prove capability, and create a clean path from interest to conversation to delivery.",
        "Everything else should earn its place. If a feature exists because it sounds impressive but does not improve clarity, trust, or operations, it probably does not belong in the earliest version. That mindset keeps the platform focused on leverage instead of noise.",
        "This matters because service businesses often overestimate how much custom machinery they need at the start. The better move is usually to build strong foundations, then layer in complexity only where the business actually benefits from it."
      ],
      sections: [
        {
          heading: "What an agency platform really has to accomplish",
          paragraphs: [
            "The first job is positioning. Visitors should understand who the platform serves, what the outcomes are, and why the offer is credible. The second job is trust. Case studies, service structure, visual quality, and confident content all contribute there. The third job is conversion. The site has to make it easy for the right people to move forward without forcing them through avoidable friction.",
            "If those three jobs are weak, adding dashboards, automations, or clever feature layers will not save the platform. A polished but unclear system still underperforms. Strong fundamentals are what make later expansion worthwhile."
          ]
        },
        {
          heading: "Why information architecture matters more than novelty",
          paragraphs: [
            "A lot of agency sites look modern but communicate vaguely. I try to reverse that by making the structure do real work. Services should be easy to scan. Case studies should prove substance instead of acting like decoration. Calls to action should feel like logical next steps, not interruptions.",
            "The architecture matters for SEO too. Clear page purpose, meaningful heading structure, and internal links that reflect real topic relationships help both visitors and search engines understand what the platform is about."
          ]
        },
        {
          heading: "The product thinking behind service businesses",
          paragraphs: [
            "One lesson I come back to often is that service businesses benefit from product thinking. That does not mean pretending every agency is a SaaS company. It means turning repeatable expertise into repeatable systems. Clear service framing, repeatable discovery, structured case studies, and clean handoff flows all make the business easier to run.",
            "That is where full stack thinking becomes valuable. The frontend should not only look sharp. It should support how leads are captured, how content evolves, and how future delivery systems can be layered in without rebuilding the whole foundation."
          ]
        },
        {
          heading: "Technology decisions only matter if they serve the business",
          paragraphs: [
            "I like modern stacks because they give me control, speed, and composability, but I do not confuse stack preference with value. The business outcome comes first. The right architecture is the one that supports publishing, scaling content, maintaining performance, and improving conversions without creating unnecessary complexity.",
            "A strong technical foundation matters because it reduces future drag. Clean routing, reusable page patterns, and maintainable styling systems make the next stage of the platform easier instead of more fragile."
          ]
        },
        {
          heading: "What I would actually measure",
          paragraphs: [
            "The real measures are whether the right people understand the offer faster, whether better leads reach out, and whether the platform becomes easier to update as the business grows. Vanity metrics alone are not enough. A platform is working when it supports business movement, not just when it looks polished in screenshots.",
            "I also care where people stall. Are they reading services but not contacting. Are they landing on the homepage and still unclear on the offer. That kind of friction tells you what the next improvement should be."
          ]
        },
        {
          heading: "What this case study is really about",
          paragraphs: [
            "This is less about pretending a platform is finished the moment the homepage looks good, and more about showing how I think. I care about aligning design, messaging, and technical implementation so the business gets something strategic, not just stylish.",
            "If you want to see related work, visit the <a href=\"../../works/weroi/index.html\">weROI case study</a>, explore my <a href=\"../../services/custom-software/index.html\">custom software service</a>, or <a href=\"../../hire-me/index.html\">hire me</a> if you want help shaping a platform that can support both growth and delivery."
          ]
        }
      ]
    },
    "typescript": {
      title: "TypeScript Generics Without the Headache",
      category: "TypeScript",
      date: "Nov 18, 2025",
      keywords:
        "TypeScript generics, TypeScript tutorial, reusable types, generic functions, frontend engineering",
      description:
        "A practical guide to TypeScript generics, when they help, when they hurt, and how I keep types reusable without making code unreadable.",
      excerpt:
        "Generics are useful when they preserve relationships in your code, not when they turn a simple helper into a type puzzle. This is how I keep them practical.",
      cover: "../../wp-content/uploads/zach/blog/blog-typescript.png?v=premium2",
      intro: [
        "TypeScript generics usually scare people for one of two reasons. Either they look intimidating at first glance, or they have only seen them used in ways that feel more clever than helpful. I try to stay in the middle. Generics are incredibly useful when they preserve relationships between inputs and outputs. They are not useful when they turn readable code into a type performance.",
        "My rule is simple. If the generic makes the intent clearer, reduces duplication, and improves confidence at the call site, it stays. If it mostly exists to show how much the type system can do, I simplify.",
        "That rule keeps TypeScript working for the product instead of becoming its own side quest."
      ],
      sections: [
        {
          heading: "What a generic is actually doing",
          paragraphs: [
            "A generic is just a placeholder for a type that gets supplied later. The point is not the angle brackets. The point is that your function, component, or helper can stay reusable without losing the relationship between what came in and what should come out.",
            "If I pass an array of users into a helper, I want the result to stay tied to users, not dissolve into a vague any shaped result. That is where generics stop feeling abstract and start feeling practical."
          ]
        },
        {
          heading: "The patterns I use most often",
          subheads: [
            {
              title: "Data preserving helpers",
              paragraphs: [
                "Sorting wrappers, object mappers, response helpers, and collection utilities are where generics earn their place quickly. I want those helpers to adapt to different shapes while still preserving type safety. That gives me reuse without giving up editor trust.",
                "These are the kinds of generics I like most because they reflect the real behavior of the code very directly."
              ]
            },
            {
              title: "Reusable components and hooks",
              paragraphs: [
                "Tables, selectors, state wrappers, and form helpers often need to work with multiple record shapes. If they only care about a few shared properties, a light generic plus a small constraint can keep them flexible and clean.",
                "The trick is to constrain only what the abstraction truly needs. Once a generic starts modeling more than the code actually requires, it begins to weigh the whole design down."
              ]
            }
          ]
        },
        {
          heading: "Where generics usually go wrong",
          paragraphs: [
            "The most common failure mode is stacking too many type parameters and helper types until the abstraction becomes harder to understand than the duplication it was supposed to replace. Technically impressive code is not automatically useful code.",
            "Another problem is using generics where a union, overload, or explicit type would be easier. Not every flexible function needs a generic. Sometimes the simplest answer really is the most maintainable one."
          ]
        },
        {
          heading: "How I keep generic code readable",
          paragraphs: [
            "I use descriptive type parameter names when the usual single letters would hide intent. I also keep public APIs small. If a helper requires three companion types and a mental whiteboard to understand, that is usually a smell.",
            "The best generic code feels obvious at the call site. You should not have to decode the type system before you can use the function safely."
          ]
        },
        {
          heading: "Confidence matters more than type theatrics",
          paragraphs: [
            "My goal with TypeScript is confidence. I want the compiler to catch mistakes, guide refactors, and make collaboration safer. A straightforward generic that does that is more valuable than an advanced type trick that nobody wants to edit later.",
            "This matters even more on teams. The type system is part of the developer experience. If it slows every change down, it is no longer helping enough."
          ]
        },
        {
          heading: "When I know a generic was worth writing",
          paragraphs: [
            "A generic was worth it if it removed duplication, improved editor feedback, and made the calling code feel safer without becoming harder to understand. That is the bar I use.",
            "For more engineering notes, browse my <a href=\"../../services/custom-software/index.html\">custom software work</a>, read about <a href=\"../rsc/index.html\">React Server Components</a>, or <a href=\"../../contact-us/index.html\">reach out</a> if you need a TypeScript codebase that stays sharp under real product pressure."
          ]
        }
      ]
    },
    "rsc": {
      title: "React Server Components Explained",
      category: "Next.js",
      date: "Nov 25, 2025",
      keywords:
        "React Server Components, Next.js App Router, server rendering, React performance, Zachary Hutton",
      description:
        "A plain language explanation of React Server Components, what problem they solve, when I use them, and where client components still belong.",
      excerpt:
        "React Server Components make more sense when you stop treating them like magic. This is how I think about the server and client split in real App Router work.",
      cover: "../../wp-content/uploads/zach/blog/blog-rsc.png?v=premium2",
      intro: [
        "React Server Components sound more mysterious than they are. Underneath the branding, the idea is simple. Some UI can be rendered on the server, with access to server side resources, without shipping all of its JavaScript to the browser.",
        "That changes how I think about data fetching, bundle size, and component boundaries. It does not eliminate the need for client components, and it definitely does not remove the need for good architecture. It just gives you a better way to choose where work happens.",
        "Once I started thinking about RSC in terms of responsibility instead of hype, it became much easier to use well."
      ],
      sections: [
        {
          heading: "What problem React Server Components are solving",
          paragraphs: [
            "Client heavy React apps often fetch data in the browser, hydrate a large amount of JavaScript, and only then fully render what the user wants. That is not ideal for every screen, especially when much of the interface is mostly content and does not need to be interactive immediately.",
            "React Server Components let me push more of that work closer to the data and send the browser the result of the render instead of asking it to rebuild everything locally first."
          ]
        },
        {
          heading: "How I split server and client responsibilities",
          subheads: [
            {
              title: "What belongs on the server",
              paragraphs: [
                "Content rich route shells, article bodies, product summaries, dashboards with mostly static presentation, and data shaping logic often belong on the server. If the component mostly reads data and returns markup, it is a strong candidate.",
                "That keeps the browser lighter and often makes the route easier to reason about."
              ]
            },
            {
              title: "What still belongs on the client",
              paragraphs: [
                "As soon as I need browser APIs, event handlers, local state, interaction driven animation, or hooks that only make sense in the browser, I use a client component. That is not a compromise. It is the right boundary.",
                "The real win is not eliminating client code altogether. It is shrinking the client surface area to what the user actually needs."
              ]
            }
          ]
        },
        {
          heading: "Boundaries matter more than slogans",
          paragraphs: [
            "A lot of confusion around RSC comes from looking for one universal rule. Real routes are mixed. Some parts are content heavy and can stay on the server. Some parts are interactive and must live on the client. Strong architecture respects both realities.",
            "I think of it as preserving gravity in the app. Data work and secure logic should stay close to the server when possible. Fine grained interaction should stay close to the browser."
          ]
        },
        {
          heading: "Where teams get tripped up",
          paragraphs: [
            "One trap is accidentally promoting too much UI to the client because a parent imported one interactive child carelessly. Another is expecting server components to behave like client components. Different rules apply, and ignoring those rules creates friction.",
            "The other trap is believing RSC solves weak architecture by itself. It does not. It helps when the structure of the route is already thoughtful."
          ]
        },
        {
          heading: "Why I like them in real work",
          paragraphs: [
            "What I like most is that they encourage better separation of concerns. They make me ask what really needs client side interactivity and what can simply be rendered well on the server. That question alone often improves a route even before performance enters the conversation.",
            "They also pair nicely with SEO sensitive content and marketing pages where reducing unnecessary client code is a real advantage."
          ]
        },
        {
          heading: "The practical takeaway",
          paragraphs: [
            "React Server Components are not about replacing the client. They are about using the server more intelligently. When I treat them that way, they become useful instead of confusing.",
            "If you are interested in the stack decisions behind this kind of work, explore my <a href=\"../../services/premium-business-websites/index.html\">website service</a>, read the <a href=\"../vitals/index.html\">Core Web Vitals guide</a>, or <a href=\"../../hire-me/index.html\">hire me</a> for product minded Next.js work."
          ]
        }
      ]
    },
    "api": {
      title: "REST API Design Habits That Scale",
      category: "Backend",
      date: "Dec 02, 2025",
      keywords:
        "REST API design, backend architecture, API best practices, endpoint design, Zachary Hutton",
      description:
        "The API design habits I rely on to keep backend systems easier to understand, maintain, and extend as real product needs grow.",
      excerpt:
        "Good APIs scale because they stay understandable. These are the naming, response, and error handling habits I rely on in backend work.",
      cover: "../../wp-content/uploads/zach/blog/blog-api.png?v=premium2",
      intro: [
        "A scalable API is usually not the one with the fanciest architecture diagram. It is the one that stays understandable as more developers, more features, and more edge cases show up.",
        "I care about API design because poor decisions at that layer spread pain everywhere. They confuse the frontend, complicate debugging, weaken the business model in code, and make later changes more expensive than they should be.",
        "Good API design has a calming effect on the whole product. That is a big reason it deserves more attention than it often gets."
      ],
      sections: [
        {
          heading: "Consistency is the first scaling strategy",
          paragraphs: [
            "When I say an API should scale, I do not only mean scale in traffic. I also mean scale in team understanding. The easiest way to lose that is inconsistent naming, response shapes, and error handling patterns.",
            "Consistency lowers cognitive load. If routes, status codes, and response bodies behave predictably, both frontend and backend work move faster."
          ]
        },
        {
          heading: "How I think about resource design",
          subheads: [
            {
              title: "Model the domain clearly",
              paragraphs: [
                "Routes should reflect the business domain rather than internal implementation details. Clients, projects, listings, and messages are concepts people can reason about. Naming that mirrors those concepts makes the API easier to use and evolve.",
                "Good naming often forces better modeling, which is one reason I pay close attention to it."
              ]
            },
            {
              title: "Use actions carefully",
              paragraphs: [
                "Some workflows are not simple CRUD, and that is fine. If an endpoint publishes, assigns, approves, or archives something, I want that action to be explicit. Hiding workflow transitions inside vague update endpoints tends to create confusion later.",
                "Clear actions make behavior easier to audit and safer to extend."
              ]
            }
          ]
        },
        {
          heading: "Response shapes matter more than people admit",
          paragraphs: [
            "Stable keys, useful metadata, and honest error bodies make the frontend easier to build. If pagination exists, it should be obvious. If validation fails, the response should make that actionable. If something is missing, the client should not have to guess what happened.",
            "The frontend can only build a smooth product experience if the backend communicates clearly."
          ]
        },
        {
          heading: "Error handling is part of the contract",
          paragraphs: [
            "I treat errors as part of the public surface of the API, not an afterthought. That means using the right status codes, structuring messages predictably, and separating user safe explanation from deeper internal detail.",
            "Better error contracts make debugging calmer because the client can respond correctly without interpreting vague hints."
          ]
        },
        {
          heading: "Versioning, evolution, and restraint",
          paragraphs: [
            "I do not think early API design means overengineering every future scenario. It means leaving room to add fields safely, deprecate carefully, and avoid exposing more than the product actually needs. Every public field becomes something you may need to support later.",
            "A tighter, better considered API surface is easier to secure, document, and maintain."
          ]
        },
        {
          heading: "The backend habit that helps the frontend most",
          paragraphs: [
            "The backend habit that helps the frontend most is empathy. I try to design endpoints the way I would want to consume them, with useful defaults, predictable filters, honest naming, and responses that support real interface needs.",
            "If you want to see how I think across both sides of the stack, explore my <a href=\"../../services/custom-software/index.html\">custom software service</a>, read the <a href=\"../cors/index.html\">CORS article</a>, or <a href=\"../../contact-us/index.html\">contact me</a> if your product needs backend decisions that will still make sense a year from now."
          ]
        }
      ]
    },
    "vitals": {
      title: "Core Web Vitals Guide",
      category: "Performance",
      date: "Dec 09, 2025",
      keywords:
        "Core Web Vitals, website performance, LCP, CLS, INP, frontend optimization, Next.js performance",
      description:
        "My plain language guide to Core Web Vitals, what the metrics mean, what usually hurts them, and how I prioritize fixes that users actually feel.",
      excerpt:
        "Core Web Vitals become useful when you connect them to real user experience. This is how I think about the metrics and the fixes behind them.",
      cover: "../../wp-content/uploads/zach/blog/blog-vitals.png?v=premium2",
      intro: [
        "I like performance work because it rewards honesty. You cannot talk a slow page into feeling fast. You have to understand what the user sees, what the browser is doing, and where the friction actually comes from.",
        "Core Web Vitals help because they turn vague complaints like this feels heavy into measurable signals. But the numbers only matter when they are interpreted through a real user journey.",
        "That is why I care less about performance theater and more about whether the page feels trustworthy, stable, and responsive in the moments that matter."
      ],
      sections: [
        {
          heading: "What Core Web Vitals are really measuring",
          paragraphs: [
            "At a high level, the vitals tell you whether a meaningful visual appears quickly, whether the layout stays stable, and whether the page responds well when the user tries to interact. People do not experience performance as one number. They experience it as a sequence.",
            "That is why I like these metrics. They map more closely to user perception than raw page weight by itself."
          ]
        },
        {
          heading: "How I think about the major signals",
          subheads: [
            {
              title: "Largest Contentful Paint",
              paragraphs: [
                "LCP is about when the main visible content becomes available. Heavy hero media, slow server work, blocked fonts, or too much route level fetching can all make it worse. On content heavy or marketing pages, I usually inspect this first because it shapes the first impression immediately.",
                "A strong LCP often comes from simpler decisions, not only exotic tricks."
              ]
            },
            {
              title: "Layout stability and responsiveness",
              paragraphs: [
                "Layout shift exposes sloppy reservation of space. Images without dimensions, injected bars, unstable embeds, and late loading UI all create that broken trust feeling when the page moves under the user.",
                "Responsiveness tells a different story. If the page looks ready but JavaScript is tying up the main thread, users feel that lag right away."
              ]
            }
          ]
        },
        {
          heading: "The fixes that usually matter most",
          paragraphs: [
            "The highest leverage fixes are often boring in a good way. Compress images. Size media properly. Reserve layout space. Reduce render blocking work. Avoid shipping JavaScript the page does not need on first view. Be careful with third party scripts.",
            "I also look at composition. If the first viewport is trying to do too much, the design itself may be contributing to the performance problem."
          ]
        },
        {
          heading: "Why scores without context can mislead",
          paragraphs: [
            "A lighthouse score can point you in the right direction, but it is not the whole story. Real user performance varies by device, network, and geography. A single lab result is useful, but it is not the final truth.",
            "I use the metrics as guidance, then ask whether the proposed fix improves the real journey. Some optimizations add complexity with little payoff. Others make the site feel better almost immediately."
          ]
        },
        {
          heading: "Performance is also a design discipline",
          paragraphs: [
            "Every extra module, visual treatment, and dependency has a cost. That does not mean design should become flat or timid. It means the experience should spend its budget intentionally.",
            "I would rather build one strong visual idea that loads well than five competing ones that drag the whole page down."
          ]
        },
        {
          heading: "What I optimize for on client work",
          paragraphs: [
            "On client work, I optimize for pages that feel quick, calm, and credible on the devices people actually use. That means balancing SEO, content richness, design quality, and code discipline instead of chasing one vanity score.",
            "If performance matters for your site, see my <a href=\"../../services/performance-optimization/index.html\">performance optimization service</a>, browse the <a href=\"../../portfolio-page/index.html\">case studies</a>, or <a href=\"../../hire-me/index.html\">hire me</a> to improve both the numbers and the user experience."
          ]
        }
      ]
    },
    "cors": {
      title: "CORS Explained for Frontend Developers",
      category: "Web",
      date: "Dec 16, 2025",
      keywords:
        "CORS explained, frontend developers, API security, browser policy, cross origin requests",
      description:
        "A practical CORS explanation for frontend developers, including why the browser blocks requests, what preflight means, and how I debug it without panic.",
      excerpt:
        "CORS becomes easier once you remember that the browser is enforcing a policy, not accusing your app of being broken. This is the debugging path I use.",
      cover: "../../wp-content/uploads/zach/blog/blog-cors.png?v=premium2",
      intro: [
        "CORS is one of those topics that sounds more hostile than it really is. Developers see a browser error, the request fails, and suddenly it feels like the browser, the frontend, and the backend are all in a fight.",
        "The truth is simpler. CORS is the browser enforcing rules about which origins are allowed to access which resources. Once that clicks, the error stops feeling mystical and starts feeling diagnostic.",
        "Understanding that distinction makes debugging much calmer."
      ],
      sections: [
        {
          heading: "The first thing to understand about CORS",
          paragraphs: [
            "CORS is not the same thing as a server being unreachable. Your server may respond and the browser may still refuse to expose that response to your frontend code because the policy handshake was not satisfied.",
            "That is why people often see network activity and still get blocked behavior. The browser is the gatekeeper."
          ]
        },
        {
          heading: "What counts as a different origin",
          paragraphs: [
            "Origin includes protocol, domain, and port. If any one of those changes, you are crossing origins. That means localhost on one port calling another port is cross origin. Http and https are different too.",
            "I always check the exact requesting origin and the exact target origin first. Tiny mismatches waste a lot of time."
          ]
        },
        {
          heading: "Why preflight requests appear",
          subheads: [
            {
              title: "Simple versus preflighted requests",
              paragraphs: [
                "Some requests are simple enough that the browser can send them directly. Others, especially those using certain methods, headers, or content types, require an OPTIONS preflight first. That preflight asks the server what is permitted.",
                "If the server does not answer that preflight correctly, the real request may never complete in the way you expect."
              ]
            },
            {
              title: "Why this changes during development",
              paragraphs: [
                "A request that worked yesterday can fail today because you added a custom header, changed the content type, or started sending credentials. Those changes alter the CORS path. The browser is not being random.",
                "It is enforcing a stricter contract because the request became more sensitive."
              ]
            }
          ]
        },
        {
          heading: "The mistakes I see most often",
          paragraphs: [
            "A common mistake is fixing the main response headers but forgetting the preflight response. Another is trying to combine wildcard origins with credentialed requests. I also see teams blame the frontend when the real issue is a server configuration mismatch.",
            "Sometimes the reverse is true. The backend is configured reasonably, but the frontend sends headers or cookies that change the requirements. Both sides matter."
          ]
        },
        {
          heading: "My debugging workflow for CORS issues",
          paragraphs: [
            "I start in the network tab, not in guesswork. I inspect the request origin, method, headers, and whether a preflight occurred. Then I compare those details with the server response headers for allowed origin, methods, headers, and credentials behavior.",
            "I also separate transport from browser policy. Can the server be reached. Does it respond. Is the browser hiding the response due to policy. Once those questions are separated, the fix usually becomes much clearer."
          ]
        },
        {
          heading: "The practical mindset that keeps CORS manageable",
          paragraphs: [
            "The best mindset is to stop treating CORS as random and start treating it as a contract between the browser, the frontend origin, and the server configuration. When each side is understood, the issue becomes annoying at times but very explainable.",
            "If you build frontend and backend systems together, look at my <a href=\"../../services/custom-software/index.html\">custom software work</a>, pair this with the <a href=\"../api/index.html\">API design article</a>, or <a href=\"../../contact-us/index.html\">contact me</a> if you want help solving the architecture around these problems instead of only patching symptoms."
          ]
        }
      ]
    },
    "debug": {
      title: "Debugging Production Bugs Calmly",
      category: "Ops",
      date: "Dec 23, 2025",
      keywords:
        "debugging production bugs, software debugging, incident response, troubleshooting workflow",
      description:
        "The production debugging workflow I use to stay calm, gather evidence, narrow the blast radius, and fix the real issue instead of guessing under pressure.",
      excerpt:
        "Production bugs feel worse when the debugging process is chaotic. This is the evidence first workflow I use to diagnose issues without making them messier.",
      cover: "../../wp-content/uploads/zach/blog/blog-debug.png?v=premium2",
      intro: [
        "Production bugs test more than technical skill. They test judgment under pressure. A bad bug can trigger panic, rushed patches, and confident guesses that only make the situation harder to understand.",
        "I have learned that the calmest response is often the fastest one. Not passive, but disciplined. Gather evidence first, reduce noise, and only then decide what to change.",
        "That approach protects both accuracy and users."
      ],
      sections: [
        {
          heading: "The first job is stabilizing the situation",
          paragraphs: [
            "My first goal is not to prove how fast I can code. It is to understand the blast radius. Who is affected. What is failing. Is the bug total, partial, or environment specific. Those answers change the right next move.",
            "Stabilization might mean hiding a broken path, degrading gracefully, or putting clearer communication in place while the root cause is being investigated."
          ]
        },
        {
          heading: "Evidence beats intuition",
          paragraphs: [
            "I do not trust my first theory just because it sounds plausible. I gather logs, compare expected and actual inputs, look at recent changes, and try to reproduce the issue in the smallest honest way possible.",
            "Real bugs are often less dramatic than people expect. A missing field, stale environment value, null edge, or policy mismatch causes more production pain than most glamorous theories."
          ]
        },
        {
          heading: "How I narrow the search space",
          subheads: [
            {
              title: "Reproduce the smallest failing case",
              paragraphs: [
                "If I can reproduce the issue, I reduce it to the smallest reliable case. Smaller bugs are easier to reason about. I want to know exactly which input, route, role, or transition makes the problem appear.",
                "That reduction is often the moment confusion turns into clarity."
              ]
            },
            {
              title: "Compare working paths with broken ones",
              paragraphs: [
                "When reproduction is inconsistent, I compare a working case against a broken one and look for the first meaningful divergence. Maybe one role has a field the other lacks. Maybe one environment sends a different header. Comparison is often more useful than broad speculation.",
                "Differential debugging keeps the investigation specific."
              ]
            }
          ]
        },
        {
          heading: "Why rushed fixes can cost more than the bug",
          paragraphs: [
            "A patch written under panic can hide the original issue, create a second issue, or erase the trail you needed to verify the root cause. That is why I separate short term mitigation from the proper fix when I can.",
            "A temporary guard that protects users is useful. A temporary bandage that becomes accidental architecture is not."
          ]
        },
        {
          heading: "What I learn after the fix ships",
          paragraphs: [
            "A production bug is not fully resolved just because the error disappears. I also want to know why it reached production, what signal could have caught it earlier, and what lightweight guardrail would reduce the chance of recurrence.",
            "That might mean better validation, better logging, better rollout discipline, or a clearer contract between systems."
          ]
        },
        {
          heading: "Calm is a technical skill",
          paragraphs: [
            "People sometimes treat calmness like personality, but I see it as a debugging skill. A calm process protects accuracy. It helps you separate symptoms from causes and keeps you from performing theater while users are waiting for a real solution.",
            "If your team needs help improving both product quality and engineering process, look at my <a href=\"../../services/maintenance/index.html\">maintenance service</a>, read the <a href=\"../security/index.html\">security fundamentals article</a>, or <a href=\"../../hire-me/index.html\">hire me</a> for product work that values sharp diagnosis as much as clean implementation."
          ]
        }
      ]
    },
    "security": {
      title: "Security Fundamentals for Web Apps",
      category: "Security",
      date: "Dec 30, 2025",
      keywords:
        "web app security, application security fundamentals, secure development, frontend backend security",
      description:
        "The practical security fundamentals I return to in web app work, from validation and auth boundaries to least privilege and safer defaults.",
      excerpt:
        "Security gets better when it becomes part of everyday engineering. These are the habits and boundaries I rely on most in modern web app work.",
      cover: "../../wp-content/uploads/zach/blog/blog-security.png?v=premium2",
      intro: [
        "Security work is most effective when it becomes normal engineering discipline instead of a panic response near launch. I do not think about security as a decorative layer. I think about it as a series of boundaries, defaults, and habits that reduce avoidable mistakes.",
        "Most teams do not need more fear. They need clearer patterns. Better validation, better access boundaries, safer defaults, and less accidental trust go further than dramatic language ever will.",
        "That is why I like practical security fundamentals. They improve the system every day, not only during audits."
      ],
      sections: [
        {
          heading: "Security starts with trust boundaries",
          paragraphs: [
            "The browser is not the server. An authenticated user is not automatically authorized for every action. A form field is not trustworthy just because the UI constrained it. A third party service is not safe just because its SDK is popular.",
            "A lot of security bugs are really boundary bugs. Data crossed a line without being checked, limited, or interpreted carefully enough."
          ]
        },
        {
          heading: "Validation is one of the highest leverage habits",
          paragraphs: [
            "I like strong validation because it improves correctness and security at the same time. Inputs should be checked where they enter the system, shaped into expected formats, and rejected clearly when they do not belong.",
            "That applies to forms, APIs, query strings, webhook payloads, and any external data crossing into application logic."
          ]
        },
        {
          heading: "Authentication and authorization are different jobs",
          subheads: [
            {
              title: "Who are you",
              paragraphs: [
                "Authentication answers identity. Are you signed in. Are your credentials valid. Is your session or token recognized. That matters, but it is only half the picture."
              ]
            },
            {
              title: "What are you allowed to do",
              paragraphs: [
                "Authorization answers permission. Can this user read, edit, publish, delete, or access this specific resource or workflow. Teams get into trouble when they treat authentication as if it solved authorization automatically.",
                "I try to keep authorization decisions explicit around sensitive actions so access logic does not become accidental."
              ]
            }
          ]
        },
        {
          heading: "Least privilege is a practical design rule",
          paragraphs: [
            "Least privilege simply means giving systems and users only the access they actually need. That includes API keys, database roles, internal tools, and feature permissions. Overbroad access turns small mistakes into larger incidents.",
            "I like least privilege because it reduces blast radius. You may not prevent every bug, but you can prevent many bugs from becoming disasters."
          ]
        },
        {
          heading: "Safer defaults beat heroic cleanup",
          paragraphs: [
            "Security posture comes down to defaults more often than people admit. Secure cookie settings. Sensible rate limits. No secrets in the client. Honest CORS configuration. Conservative file handling. Output escaping where untrusted content appears.",
            "I would rather ship a system with safer defaults than rely on perfect memory during a hectic deadline."
          ]
        },
        {
          heading: "Security should support velocity, not fight it",
          paragraphs: [
            "The goal is not to create a codebase nobody can move in. The goal is to build enough discipline that teams can move quickly without stepping into obvious traps. Good security patterns reduce rework because they make the rules of the system clearer.",
            "If you want help building safer product foundations, review my <a href=\"../../services/custom-software/index.html\">custom software service</a>, pair this with the <a href=\"../api/index.html\">API design article</a>, or <a href=\"../../contact-us/index.html\">contact me</a> for practical web application work that respects both security and delivery."
          ]
        }
      ]
    },
    "pntcog": {
      title: "PNTCOG Ministry Site Notes",
      category: "Client",
      date: "Jan 06, 2026",
      keywords:
        "PNTCOG website, ministry website case study, church site notes, content architecture, Zachary Hutton",
      description:
        "What I learned from shaping ministry site work for PNTCOG, including clarity, maintenance reality, accessibility, and the importance of truthful content structure.",
      excerpt:
        "Ministry sites need clarity, trust, and maintainability more than flashy tricks. These are the practical lessons I take from PNTCOG work.",
      cover: "../../wp-content/uploads/zach/blog/blog-pntcog.png?v=premium2",
      intro: [
        "Ministry sites have a different kind of responsibility from many commercial websites. They still need to look strong and work well, but clarity and trust carry even more weight. People visit for service information, ministries, messages, giving, contact details, and reassurance that the organization behind the site is real and current.",
        "That means the structure has to support everyday needs extremely well. PNTCOG is a good reminder that a useful site is not just about polish. It is about helping people find the right information quickly and confidently.",
        "This kind of work rewards honesty, readability, and maintenance discipline."
      ],
      sections: [
        {
          heading: "The job of a ministry site is practical first",
          paragraphs: [
            "A ministry website absolutely benefits from thoughtful design, but the design has to support utility. If service information, location details, ministries, livestream access, or contact paths are difficult to find, the site is not serving people well no matter how polished it appears.",
            "That is why I value clarity over spectacle on this kind of project. The best design is the design that makes essential information feel easy."
          ]
        },
        {
          heading: "Why truthful content handling matters so much",
          paragraphs: [
            "One of the fastest ways to damage trust on a ministry site is by publishing details that are vague, outdated, or guessed. If dates, contacts, or event details are not confirmed, they should not be invented to make a page feel complete.",
            "This is not only about accuracy. It is also about respect. Real communities rely on these pages for real coordination."
          ]
        },
        {
          heading: "Accessibility and readability are not optional extras",
          paragraphs: [
            "Ministry audiences can be broad across age, device, and technical comfort level. That means readable typography, clear navigation, mobile friendliness, and strong contrast matter a lot. Fancy interaction can be welcome, but never at the expense of usability.",
            "I also care about how content is chunked. Long walls of text make helpful information harder to use than it needs to be."
          ]
        },
        {
          heading: "Maintenance reality should shape the build",
          paragraphs: [
            "A ministry site may not have a full product team behind it. That changes what sustainable design looks like. The content model should be realistic for the people who will maintain it. If updating one service detail requires digging through fragile templates, the system is too brittle.",
            "The best build is not only the one that launches cleanly. It is the one that stays manageable for the people responsible afterward."
          ]
        },
        {
          heading: "What I value most in this kind of project",
          paragraphs: [
            "I value clarity, honesty, and calm structure. A strong ministry site should feel welcoming without feeling generic. It should support someone exploring for the first time, someone returning regularly, and someone who simply needs one piece of information fast.",
            "That is why information architecture matters just as much as visual quality here."
          ]
        },
        {
          heading: "The broader lesson from PNTCOG work",
          paragraphs: [
            "The broader lesson is that good web work begins by respecting the context of the organization, not by forcing the same template logic onto every project. Ministry sites deserve structure built around real communication needs, not generic filler.",
            "If you want to see more of how I approach purpose driven web work, visit my <a href=\"../../services/premium-business-websites/index.html\">website services</a>, browse the <a href=\"../../portfolio-page/index.html\">portfolio</a>, or <a href=\"../../contact-us/index.html\">contact me</a> if you need a site that feels trustworthy and stays practical to maintain."
          ]
        }
      ]
    },
    "jamaica": {
      title: "Shipping Remotely from Jamaica",
      category: "Career",
      date: "Jan 13, 2026",
      keywords:
        "remote work Jamaica, software developer Jamaica, shipping remotely, distributed work, Zachary Hutton",
      description:
        "My perspective on shipping remote product work from Jamaica, including communication, ownership, rhythm, and why location can sharpen discipline instead of limit it.",
      excerpt:
        "Working remotely from Jamaica has shaped how I communicate, document, and deliver. This is my honest take on the discipline behind remote shipping.",
      cover: "../../wp-content/uploads/zach/blog/blog-jamaica.png?v=premium2",
      intro: [
        "Shipping remotely from Jamaica has shaped the way I work in useful ways. It has pushed me to communicate clearly, document decisions well, and make my output speak loudly enough that geography does not become the headline.",
        "Remote work exposes weak process fast. If priorities are vague, ownership is fuzzy, or updates are inconsistent, distance makes those gaps more obvious. But when the process is strong, location can become a strength instead of a constraint.",
        "That is one reason I see remote discipline as an engineering advantage, not just a work style preference."
      ],
      sections: [
        {
          heading: "Remote work rewards clarity more than charisma",
          paragraphs: [
            "In person teams can sometimes cover for weak process with constant conversation. Remote work is less forgiving. If priorities are unclear, handoffs are fuzzy, or decisions live only in somebody's head, progress slows down fast.",
            "That is why I value clear written updates, visible reasoning, and disciplined follow through. Strong remote contributors make the work legible."
          ]
        },
        {
          heading: "Ownership matters even more when nobody is watching",
          paragraphs: [
            "Remote work from Jamaica or anywhere else is not impressive by itself. What matters is whether you can own outcomes. Can you diagnose issues without being handheld. Can you structure your day. Can you communicate early when something is blocked.",
            "I want the quality of the work and the reliability of the process to remove doubt."
          ]
        },
        {
          heading: "Time zone and location are operational details, not excuses",
          paragraphs: [
            "Remote work becomes stronger when time zone differences are handled proactively instead of treated like permanent friction. Clear async updates, scoped tasks, and honest turnaround expectations matter a lot.",
            "Location also changes context in useful ways. Working from Jamaica keeps me aware that global work should still be grounded, practical, and accountable."
          ]
        },
        {
          heading: "Documentation is one of the real superpowers",
          paragraphs: [
            "Good documentation reduces repeated explanation and gives decisions a memory. I rely on it heavily because it keeps projects from becoming dependent on whoever happens to be awake or available in the moment.",
            "It also improves review, handoff, and long term maintenance. Clear notes often save more time than another meeting."
          ]
        },
        {
          heading: "Why output still has to carry the conversation",
          paragraphs: [
            "Remote work can attract a lot of talk about flexibility and setup, but none of that replaces strong output. The work still has to be thoughtful, verifiable, and worth trusting.",
            "Clean implementation, honest communication, and follow through are what make remote collaboration sustainable."
          ]
        },
        {
          heading: "What shipping remotely from Jamaica has taught me",
          paragraphs: [
            "It has taught me to respect process, make reasoning visible, and keep quality high enough that distance stops being the interesting part. That is useful discipline anywhere, but remote work makes it impossible to ignore.",
            "If you want to work with me, explore the <a href=\"../../portfolio-page/index.html\">portfolio</a>, read more on the <a href=\"../../about-me/index.html\">about page</a>, or <a href=\"../../hire-me/index.html\">hire me</a> for product and platform work built with strong communication and clean execution."
          ]
        }
      ]
    }
  };

  const slug = location.pathname.split("/").filter(Boolean).pop() === "post"
    ? "css-grid"
    : location.pathname.split("/").filter(Boolean).slice(-1)[0] || "css-grid";

  const post = posts[slug] || posts["css-grid"];

  function slugify(value) {
    return value.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-");
  }

  function render() {
    const app = document.getElementById("zh-blog-post-app");
    const h1 = document.getElementById("zh-post-title");
    const meta = document.getElementById("zh-post-meta");
    const cover = document.getElementById("zh-post-cover");
    const intro = document.getElementById("zh-post-intro");
    const body = document.getElementById("zh-post-body");
    const toc = document.getElementById("zh-post-toc");
    const excerpt = document.getElementById("zh-post-excerpt");

    const sectionsMarkup = [];
    const tocItems = [];
    let wordCount = post.intro.join(" ").split(/\s+/).length;

    post.sections.forEach((section) => {
      const sectionId = slugify(section.heading);
      tocItems.push(`<li><a href="#${sectionId}">${section.heading}</a></li>`);
      const paragraphs = [];
      (section.paragraphs || []).forEach((paragraph) => {
        wordCount += paragraph.replace(/<[^>]+>/g, "").split(/\s+/).length;
        paragraphs.push(`<p>${paragraph}</p>`);
      });
      (section.subheads || []).forEach((sub) => {
        const subId = slugify(`${section.heading}-${sub.title}`);
        tocItems.push(`<li class="zh-sub-item"><a href="#${subId}">${sub.title}</a></li>`);
        const subParagraphs = sub.paragraphs
          .map((paragraph) => {
            wordCount += paragraph.replace(/<[^>]+>/g, "").split(/\s+/).length;
            return `<p>${paragraph}</p>`;
          })
          .join("");
        paragraphs.push(`<section id="${subId}"><h3>${sub.title}</h3>${subParagraphs}</section>`);
      });
      sectionsMarkup.push(`<section id="${sectionId}"><h2>${section.heading}</h2>${paragraphs.join("")}</section>`);
    });

    const readTime = `${Math.max(8, Math.round(wordCount / 220))} min read`;

    document.title = `${post.title} | Zachary Hutton Blog`;
    document.querySelector('meta[name="description"]').setAttribute("content", post.description);
    document.querySelector('meta[name="keywords"]').setAttribute("content", post.keywords);
    document.querySelector('link[rel="canonical"]').setAttribute("href", `https://zachary-hutton-portfolio.vercel.app/blog/${slug}/`);
    document.querySelector('meta[property="og:title"]').setAttribute("content", `${post.title} | Zachary Hutton Blog`);
    document.querySelector('meta[property="og:description"]').setAttribute("content", post.description);
    document.querySelector('meta[property="og:url"]').setAttribute("content", `https://zachary-hutton-portfolio.vercel.app/blog/${slug}/`);
    document.querySelector('meta[property="og:image"]').setAttribute("content", `https://zachary-hutton-portfolio.vercel.app/revox-mirror/revox.baseecom.com/wp-content/uploads/zach/blog/blog-${slug}.png`);
    document.querySelector('meta[name="twitter:title"]').setAttribute("content", `${post.title} | Zachary Hutton Blog`);
    document.querySelector('meta[name="twitter:description"]').setAttribute("content", post.description);
    document.querySelector('meta[name="twitter:image"]').setAttribute("content", `https://zachary-hutton-portfolio.vercel.app/revox-mirror/revox.baseecom.com/wp-content/uploads/zach/blog/blog-${slug}.png`);

    h1.textContent = post.title;
    excerpt.textContent = post.excerpt;
    cover.src = post.cover;
    cover.alt = post.title;
    meta.innerHTML = `<span>${post.date}</span><span>${readTime}</span><span>${post.category}</span>`;
    intro.innerHTML = post.intro.map((paragraph) => `<p>${paragraph}</p>`).join("");
    body.innerHTML = sectionsMarkup.join("");
    toc.innerHTML = tocItems.join("");
    app.dataset.wordCount = String(wordCount);
    app.dataset.readTime = readTime;
  }

  render();
})();
