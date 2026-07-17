import { withReadingMeta } from "../types";

export const utechGpaToShipPost = withReadingMeta({
  id: "utech-gpa-to-ship",
  title: "From Dean's List to deployed: how computer science student portfolio projects bridge the gap",
  blurb:
    "How a UTech Jamaica CS student with a 3.7 GPA turns coursework into computer science student portfolio projects that prove you can ship real software.",
  tag: "CS notes",
  date: "January 2025",
  publishedAt: "2025-01-23",
  href: "/blog/utech-gpa-to-ship",
  image: "/blog/utech-gpa-to-ship.png",
  primaryKeyword: "computer science student portfolio projects",
  intro: [
    "A 3.7 GPA proves I can learn. The Tendem Demo Bot, weROI, StudySync, and this portfolio prove I can ship. Most computer science students treat these as separate tracks: grades on one side, personal projects on the other. I have found the most growth happens when you deliberately connect them. Every course teaches a concept. Every concept becomes more useful when you push it past the assignment requirements and into something another person can use.",
    "This post is for CS students who want to turn their coursework into computer science student portfolio projects that demonstrate real engineering ability. I am writing from my experience at the University of Technology, Jamaica (UTech), where I am studying Computer Science while building and deploying software for clients and personal projects. The habits I describe here are the ones that have made the biggest difference in how I learn and how I present that learning to the people who might hire me.",
  ],
  sections: [
    {
      heading: "Why GPA alone is not enough to demonstrate engineering ability",
      paragraphs: [
        "A transcript tells an employer that you attended classes, completed assignments, and performed well on exams. It does not tell them how you debug a production issue at 11 PM, how you communicate a delay to a client, or how you decide between two valid architectural approaches when neither is clearly better. Those skills come from building things under real constraints, and they are the skills that separate a strong student from a strong developer.",
        "I respect the GPA. Making the Dean's List at UTech with a 3.7 took consistent effort, especially while working on contract projects simultaneously. But the conversations that lead to opportunities always start with the projects, not the transcript. \"Show me what you built\" opens more doors than \"show me your grades.\" The ideal position is having both: the academic foundation that proves you understand the theory, and the portfolio that proves you can apply it.",
      ],
    },
    {
      heading: "Turning coursework into real portfolio projects",
      paragraphs: [
        "The shift from assignment to portfolio project is smaller than most students think. It comes down to three extensions: authentication (does the API actually verify who is calling it?), error handling (what happens when the input is wrong or the database is unreachable?), and deployment (can someone other than you run this?).",
        "StudySync started as a database course assignment. The spec asked for a REST API with CRUD operations on student records. I fulfilled the spec, then added JWT authentication, ownership checks (so one student cannot read another's data), input validation with Pydantic, and tests that cover the security paths. The assignment earned a grade. The extended version earned a portfolio piece that demonstrates real FastAPI, SQLAlchemy, and security patterns.",
        "The time investment was maybe six extra hours. The return was an artifact I reference in interviews, link from my portfolio, and write about on this blog. That ratio of effort to visibility is hard to beat.",
      ],
    },
    {
      heading: "The courses that show up most in my shipped code",
      paragraphs: [
        "Not every course translates equally to production work. The ones I draw from most frequently are Data Structures and Algorithms, Database Systems, Computer Networking, and Software Engineering. Here is how each one connects to the projects I have built.",
      ],
      subheadings: [
        {
          heading: "Data Structures and Algorithms",
          paragraphs: [
            "This course trained me to think about the cost of operations before choosing a data structure. When I designed the FAQ matching system for the Tendem Demo Bot, I knew that a linear keyword scan works fine for 20 entries but would need a different approach at 2,000. When I built pagination for weROI's admin dashboard, I understood why cursor based pagination outperforms skip/offset on large collections. The course did not teach me MongoDB or Telegram. It taught me to ask \"what happens when this grows?\" before writing the code.",
          ],
        },
        {
          heading: "Database Systems",
          paragraphs: [
            "Normalization, constraints, indexing, and transactions. These concepts appear in every backend I build. On StudySync, I designed the schema with proper foreign keys and cascade deletes before writing a single route. On weROI, I built compound indexes around the admin dashboard's actual query patterns. The course taught me the theory. The projects taught me which parts of the theory matter most in practice.",
          ],
        },
        {
          heading: "Computer Networking",
          paragraphs: [
            "Understanding TCP, DNS, HTTP, and TLS changed how I debug deployment issues. When weROI's frontend could not reach the Railway backend, I diagnosed it as a CORS misconfiguration because I understood what the browser was actually sending and what the server needed to allow. When Telegram webhooks failed intermittently, I traced it to DNS resolution timing because the networking course had taught me where those delays hide.",
          ],
        },
        {
          heading: "Software Engineering",
          paragraphs: [
            "Requirements gathering, version control, testing strategies, and documentation. The course introduced these as process steps. Real projects made them survival skills. Writing clear commit messages, scoping features before coding them, and keeping a README that actually helps someone run the project are habits I practise daily because the software engineering course convinced me they matter.",
          ],
        },
      ],
    },
    {
      heading: "Dean's List habits that transfer to professional development",
      paragraphs: [
        "The academic habits that maintain a high GPA are the same habits that produce reliable software. Both require reading the requirements carefully before starting, breaking large problems into smaller verifiable steps, reviewing your own work before submitting, and managing time so that everything gets the attention it needs.",
        "I study in focused blocks with breaks, not marathon sessions. I start assignments early so I have time to ask questions when I get stuck. I review my test results to understand what I missed, not just to know the grade. Every one of these habits shows up in my development workflow. I scope tasks before coding. I push early and review my own diffs. I log what went wrong on a project so I do not repeat the mistake.",
      ],
      bullets: [
        "Read the full spec or ticket before writing code.",
        "Break the work into parts you can verify independently.",
        "Review your own work with fresh eyes before requesting feedback.",
        "Keep a short journal of what each project taught you.",
        "Start early so blockers surface while there is time to resolve them.",
      ],
    },
    {
      heading: "Building a portfolio while still in school",
      paragraphs: [
        "The biggest advantage of building portfolio projects during university is that you have access to courses, peers, and time in a way that becomes harder after graduation. You can take a database assignment and extend it into a deployed API. You can take a networking concept and apply it to a real webhook integration. You can take a software engineering process and use it to ship a client project.",
        "I maintain this portfolio site on Next.js and Vercel specifically to document that process. Each project page explains what I built, what decisions I made, and what I learned. The blog posts (like this one) go deeper into specific technical topics. Together, they create a body of evidence that a transcript cannot provide.",
        "My advice to CS students who want to start: pick your strongest recent assignment. Add authentication. Add error handling. Deploy it somewhere free (Railway, Vercel, Render). Write a README that explains how to run it. Push it to GitHub. You now have a portfolio project that demonstrates more engineering skill than 90% of student GitHub profiles.",
      ],
    },
    {
      heading: "How I balance university, contracts, and personal projects",
      paragraphs: [
        "Time management is the honest answer. I block my mornings for coursework during the semester, afternoons for contract or project work, and evenings for review and planning. I am not productive for 14 hours straight, and I do not pretend to be. The discipline is in being focused during the blocks I commit to and honest about what I can deliver in the time I have.",
        "When contract work conflicts with a deadline, I communicate early with both sides. I tell the client what I can deliver this week and what will shift. I start the assignment earlier than comfortable so I have buffer. The worst outcome is promising too much and delivering poorly on everything. The best outcome is setting realistic expectations and meeting them consistently. That is a lesson that applies to every project, academic or professional.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I turn a university assignment into a portfolio project?",
      answer:
        "Extend it beyond the assignment requirements. Add authentication (JWT or session based), input validation, error handling, and at least one deployment. Write a clear README that explains how to run the project, what it does, and what you learned. Push it to a public GitHub repository and link it from your portfolio or LinkedIn. The extension typically takes 4 to 8 extra hours and produces an artifact you can reference for years.",
    },
    {
      question: "Is a high GPA important for software developer jobs?",
      answer:
        "It helps, especially for your first role, internships, and companies that use GPA as a screening filter. But it is not sufficient alone. Employers want to see that you can build, not just pass exams. The strongest position is a solid GPA combined with deployed projects and clear technical communication. The projects demonstrate applied skill that a transcript alone does not convey.",
    },
    {
      question: "What programming projects should CS students build for their portfolio?",
      answer:
        "Build projects that demonstrate full stack thinking: a backend API with authentication and database, a frontend that consumes it, and a deployment pipeline. Good starting points are a REST API extending a course assignment, a personal site with a blog, a chatbot with real integrations, or a tool that solves a problem you actually have. Avoid tutorial clones that do not show your own decisions.",
    },
    {
      question: "How do you balance university coursework with freelance development?",
      answer:
        "Block your time. I dedicate mornings to coursework during the semester and afternoons to client or personal projects. I start assignments early to create buffer for contract deadlines. When conflicts arise, I communicate early with both sides and set realistic expectations. The key is being honest about your capacity and consistently meeting the commitments you make.",
    },
    {
      question: "What CS courses are most useful for real world software development?",
      answer:
        "Data Structures and Algorithms (helps you reason about performance), Database Systems (schema design, indexing, queries), Computer Networking (debugging deployment and HTTP issues), and Software Engineering (version control, testing, documentation, process). These four appear in almost every project I have shipped. Operating Systems and Security are also valuable for understanding the platform your code runs on.",
    },
  ],
  takeaway:
    "The bridge between a Dean's List GPA and a strong engineering portfolio is deliberate extension. Take what you learn in class, push it past the assignment requirements, deploy it, document it, and present it as evidence of what you can build. Computer science student portfolio projects are not separate from your education. They are the applied half of it.",
  relatedLink: {
    label: "More about how I build",
    href: "/#about",
  },
});
