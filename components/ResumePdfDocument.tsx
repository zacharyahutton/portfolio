import React from "react";
import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { profile } from "@/content/profile";
import { resumeLinks } from "@/content/resumeLinks";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 48,
    fontFamily: "Times-Roman",
    fontSize: 9,
    lineHeight: 1.38,
    color: "#111111",
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontFamily: "Times-Bold",
    fontSize: 18,
    letterSpacing: 1.2,
    textAlign: "center",
  },
  contactLine: {
    marginTop: 6,
    fontSize: 8.5,
    color: "#333333",
    textAlign: "center",
  },
  linksRow: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    fontSize: 8.5,
    gap: 4,
  },
  link: {
    color: "#111111",
    textDecoration: "none",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginVertical: 10,
  },
  sectionTitle: {
    fontFamily: "Times-Bold",
    fontSize: 10.5,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
    paddingBottom: 2,
    marginBottom: 6,
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  rowTitle: {
    fontFamily: "Times-Bold",
    fontSize: 9.2,
    flex: 1,
  },
  rowDate: {
    fontSize: 8.5,
    color: "#444444",
  },
  body: {
    fontSize: 8.8,
    marginTop: 3,
    color: "#111111",
  },
  bold: {
    fontFamily: "Times-Bold",
  },
  muted: {
    color: "#444444",
    fontSize: 8.5,
  },
  subtle: {
    color: "#555555",
    fontSize: 8.2,
  },
  projectBlock: {
    marginTop: 8,
  },
  projectTitle: {
    fontFamily: "Times-Bold",
    fontSize: 8.8,
  },
  bulletList: {
    marginTop: 6,
    paddingLeft: 12,
  },
  bulletItem: {
    fontSize: 8.8,
    marginBottom: 3,
  },
  skillsLine: {
    fontSize: 8.5,
    marginBottom: 4,
  },
});

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function Bold({ children }: { children: string }) {
  return <Text style={styles.bold}>{children}</Text>;
}

export default function ResumePdfDocument() {
  return (
    <Document title="Zachary Hutton Resume" author="Zachary Hutton">
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>ZACHARY HUTTON</Text>
          <Text style={styles.contactLine}>
            {profile.contact.location} |{" "}
            <Link src={resumeLinks.email} style={styles.link}>
              {profile.contact.email}
            </Link>{" "}
            |{" "}
            <Link src={resumeLinks.phone} style={styles.link}>
              (876) 781-0400
            </Link>
          </Text>
          <View style={styles.linksRow}>
            <Link src={resumeLinks.portfolio} style={styles.link}>
              Portfolio
            </Link>
            <Text> | </Text>
            <Link src={resumeLinks.github} style={styles.link}>
              GitHub
            </Link>
            <Text> | </Text>
            <Link src={resumeLinks.linkedin} style={styles.link}>
              LinkedIn
            </Link>
            <Text> | </Text>
            <Link src={resumeLinks.instagram} style={styles.link}>
              Instagram
            </Link>
          </View>
        </View>

        <View style={styles.divider} />

        <SectionTitle>Education</SectionTitle>
        <View style={styles.row}>
          <Text style={styles.rowTitle}>
            Currently pursuing BSc in Computer Science, University of Technology, Jamaica
          </Text>
          <Text style={styles.rowDate}>Sep 2025 - May 2029 (expected)</Text>
        </View>
        <Text style={[styles.body, styles.bold]}>{"GPA: 3.7 | Dean's List"}</Text>
        <Text style={[styles.body, styles.muted, { marginTop: 6 }]}>
          <Text style={styles.bold}>Ardenne High School</Text> | Sep 2020 - Jul 2025
        </Text>
        <Text style={[styles.body, styles.muted]}>CSEC: Grade I across subjects</Text>
        <Text style={[styles.body, { color: "#666666", fontSize: 7.2 }]}>
          IT, English A, Math, Add. Math, Physics, POB, POA, Industrial Tech (Electrical), Social
          Studies
        </Text>

        <View style={styles.divider} />

        <SectionTitle>Projects</SectionTitle>

        <View style={styles.projectBlock}>
          <Text style={styles.projectTitle}>
            Telegram Demo Bot — Telegram <Text style={styles.subtle}>(t.me/zachtedem_bot)</Text>
          </Text>
          <Text style={styles.body}>
            Built a <Bold>live Telegram bot</Bold> with multi-step booking, support tickets,{" "}
            <Bold>30+ FAQ</Bold> topics, and <Bold>Groq/OpenAI</Bold> chat with <Bold>SQLite</Bold> memory.
            Implemented <Bold>FastAPI</Bold> webhooks, secret-token validation, per-user{" "}
            <Bold>rate limiting</Bold>, and FAQ fallbacks when models fail.
          </Text>
          <Text style={styles.body}>
            Deployed on <Bold>Railway</Bold> with public health endpoint. Open source at{" "}
            github.com/zacharyahutton/telegram-bot-demo.
          </Text>
        </View>

        <View style={styles.projectBlock}>
          <Text style={styles.projectTitle}>
            PNTCOG Ministry Platform <Text style={styles.subtle}>(portmorentcog.org)</Text>
          </Text>
          <Text style={styles.body}>
            Architected a multi-section <Bold>React</Bold> ministry website with events, giving,
            prayer requests, media, and a Jubilee anniversary hub. Structured modular page
            components for team-friendly content updates and <Bold>mobile-first</Bold> navigation.
          </Text>
          <Text style={styles.body}>
            Implemented <Bold>responsive layouts</Bold> across content-heavy pages with
            performance-focused delivery on <Bold>Vercel</Bold>. Built accessible form flows and a
            scalable <Bold>component architecture</Bold> for a live congregation audience.
          </Text>
        </View>

        <View style={styles.projectBlock}>
          <Text style={styles.projectTitle}>
            weROI Agency Platform <Text style={styles.subtle}>(weroi.net)</Text>
          </Text>
          <Text style={styles.body}>
            Engineered a full-stack agency platform: <Bold>React</Bold> / <Bold>TypeScript</Bold>{" "}
            SPA frontend, <Bold>FastAPI</Bold>/<Bold>Python</Bold> backend, and{" "}
            <Bold>MongoDB Atlas</Bold> persistence. Designed document models for leads, audits,
            and admin users.
          </Text>
          <Text style={styles.body}>
            Integrated lead-capture funnels, multi-step audit forms, and an{" "}
            <Bold>admin dashboard</Bold> with <Bold>JWT</Bold> authentication. Built{" "}
            <Bold>RESTful APIs</Bold> for lead management, shipped <Bold>GrowthIQ</Bold> LLM chat with FAQ
            fallbacks, and connected <Bold>Resend</Bold> for transactional email.
          </Text>
          <Text style={styles.body}>
            Deployed frontend on <Bold>Vercel</Bold> and API on <Bold>Railway</Bold> with{" "}
            <Bold>CORS</Bold>, environment configuration, and health-check routing.
          </Text>
        </View>

        <View style={styles.projectBlock}>
          <Text style={styles.projectTitle}>
            Webhook Relay API <Text style={styles.subtle}>(Personal)</Text>
          </Text>
          <Text style={styles.body}>
            Built a developer sandbox API with API-key auth, HMAC-signed <Bold>webhook</Bold>{" "}
            delivery, retry backoff, and per-key <Bold>rate limiting</Bold> for testing outbound
            integrations.
          </Text>
        </View>

        <View style={styles.projectBlock}>
          <Text style={styles.projectTitle}>
            Phone Store REST API <Text style={styles.subtle}>(Personal)</Text>
          </Text>
          <Text style={styles.body}>
            RESTful <Bold>Node.js</Bold>/<Bold>Express</Bold> API with <Bold>JWT</Bold> auth,{" "}
            <Bold>MongoDB</Bold> catalog, stock reservation, and <Bold>HMAC-signed order webhooks</Bold>{" "}
            for async checkout updates.
          </Text>
        </View>

        <View style={styles.divider} />

        <SectionTitle>Experience</SectionTitle>

        <View style={{ marginTop: 6 }}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>Software Developer (Contract), weROI</Text>
            <Text style={styles.rowDate}>2024-Present</Text>
          </View>
          <Text style={styles.body}>
            Delivered production web applications using <Bold>React</Bold>, <Bold>Next.js</Bold>,{" "}
            <Bold>FastAPI</Bold>, and <Bold>MongoDB</Bold>. Built <Bold>REST APIs</Bold>, <Bold>JWT</Bold> auth,{" "}
            <Bold>GrowthIQ</Bold> LLM chat with FAQ fallbacks, <Bold>webhook</Bold> endpoints, email automation, and
            deployment on <Bold>Vercel</Bold> and <Bold>Railway</Bold>.
          </Text>
        </View>

        <View style={{ marginTop: 8 }}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>Freelance Web Developer, Independent</Text>
            <Text style={styles.rowDate}>2023-Present</Text>
          </View>
          <Text style={styles.body}>
            Backend integrations, <Bold>REST APIs</Bold>, <Bold>webhooks</Bold>, and automation alongside responsive{" "}
            <Bold>React</Bold>/<Bold>TypeScript</Bold> sites. Built <Bold>Telegram bots</Bold> with conversation
            flows, <Bold>LLM</Bold> chat, and <Bold>Railway</Bold> deployment. ~3 years combined contract and
            freelance delivery (2023-Present).
          </Text>
        </View>

        <View style={styles.divider} />

        <SectionTitle>Achievements</SectionTitle>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>{"• Dean's List, UTech BSc Computer Science (GPA 3.7)"}</Text>
          <Text style={styles.bulletItem}>- Senior church volunteer and Jamaica Red Cross volunteer</Text>
          <Text style={styles.bulletItem}>
            - Contract and freelance delivery for ministry and agency clients
          </Text>
        </View>

        <View style={styles.divider} />

        <SectionTitle>Technical Skills</SectionTitle>
        <View style={{ marginTop: 6 }}>
          <Text style={styles.skillsLine}>
            <Text style={styles.bold}>Languages;</Text> Proficient in <Bold>Python</Bold>;{" "}
            <Bold>JavaScript</Bold>; <Bold>TypeScript</Bold>; <Bold>Java</Bold>; strong{" "}
            <Bold>SQL</Bold>; proficiency in <Bold>HTML5/CSS3</Bold>
          </Text>
          <Text style={styles.skillsLine}>
            <Text style={styles.bold}>Frameworks;</Text> <Bold>React</Bold>; <Bold>Next.js</Bold>;{" "}
            <Bold>FastAPI</Bold>; <Bold>Node.js</Bold>; <Bold>Express</Bold>;{" "}
            <Bold>Tailwind CSS</Bold>
          </Text>
          <Text style={styles.skillsLine}>
            <Text style={styles.bold}>Backend & data;</Text> <Bold>RESTful APIs</Bold>;{" "}
            <Bold>webhooks</Bold>; <Bold>async Python</Bold>; <Bold>MongoDB</Bold>; <Bold>SQLite</Bold>;{" "}
            <Bold>SQLAlchemy</Bold>; <Bold>JWT authentication</Bold>; <Bold>OAuth</Bold> patterns;{" "}
            <Bold>Pydantic</Bold> validation; <Bold>LLM APIs</Bold> (Groq/OpenAI); <Bold>OWASP</Bold>-aligned
            secure coding
          </Text>
          <Text style={styles.skillsLine}>
            <Text style={styles.bold}>Messaging & bots;</Text> <Bold>Telegram Bot API</Bold>;{" "}
            <Bold>python-telegram-bot</Bold>; multi-step <Bold>conversation flows</Bold>;{" "}
            <Bold>webhook</Bold> delivery and verification; <Bold>LLM integration</Bold> (Groq/OpenAI);{" "}
            <Bold>aiosqlite</Bold>; per-user <Bold>rate limiting</Bold>
          </Text>
          <Text style={styles.skillsLine}>
            <Text style={styles.bold}>Tools;</Text> <Bold>Git</Bold>; <Bold>GitHub</Bold>;{" "}
            <Bold>GitHub Actions</Bold>; <Bold>Vercel</Bold>; <Bold>Railway</Bold>;{" "}
            <Bold>MongoDB Atlas</Bold>; <Bold>Postman</Bold>; <Bold>Insomnia</Bold>;{" "}
            <Bold>Docker</Bold> (basics); <Bold>VS Code</Bold>; <Bold>Cursor</Bold>;{" "}
            <Bold>npm</Bold>; <Bold>pnpm</Bold>; <Bold>Resend</Bold>; <Bold>Figma</Bold>;{" "}
            <Bold>Linux CLI</Bold>; <Bold>Wireshark</Bold> (basics); <Bold>Chrome DevTools</Bold>;{" "}
            <Bold>ESLint</Bold>; <Bold>Prettier</Bold>; <Bold>Calendly</Bold> embeds
          </Text>
          <Text style={styles.skillsLine}>
            <Text style={styles.bold}>Practices;</Text> <Bold>Responsive layouts</Bold>;{" "}
            <Bold>component architecture</Bold>; <Bold>state management</Bold>; <Bold>CI/CD</Bold>{" "}
            pipelines; <Bold>API design</Bold>; <Bold>OpenAPI</Bold> documentation
          </Text>
        </View>
      </Page>
    </Document>
  );
}
