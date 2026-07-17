import type { BlogPost } from "./types";
import { telegramFastapiPost } from "./posts/telegram-fastapi";
import { weroiPlatformPost } from "./posts/weroi-platform";
import { pntcogMinistrySitePost } from "./posts/pntcog-ministry-site";
import { webhookHmacRetriesPost } from "./posts/webhook-hmac-retries";
import { jwtAdminWithoutDramaPost } from "./posts/jwt-admin-without-drama";
import { nextjsPortfolioShipPost } from "./posts/nextjs-portfolio-ship";
import { fastapiAsyncTelegramPost } from "./posts/fastapi-async-telegram";
import { railwayVercelSplitPost } from "./posts/railway-vercel-split";
import { openapiTypedClientsPost } from "./posts/openapi-typed-clients";
import { studysyncJwtSqlitePost } from "./posts/studysync-jwt-sqlite";
import { securityFundamentalsPost } from "./posts/security-fundamentals";
import { jamaicaRemoteShipPost } from "./posts/jamaica-remote-ship";
import { llmFaqFallbackPost } from "./posts/llm-faq-fallback";
import { mongodbAtlasLeadsPost } from "./posts/mongodb-atlas-leads";
import { resendEmailAutomationPost } from "./posts/resend-email-automation";
import { utechGpaToShipPost } from "./posts/utech-gpa-to-ship";
import { cssGridVsFlexboxPost } from "./posts/css-grid-vs-flexbox";
import { typescriptGenericsBeginnersPost } from "./posts/typescript-generics-beginners";
import { reactServerComponentsExplainedPost } from "./posts/react-server-components-explained";
import { restApiDesignBestPracticesPost } from "./posts/rest-api-design-best-practices";
import { debuggingProductionBugsPost } from "./posts/debugging-production-bugs";
import { coreWebVitalsGuidePost } from "./posts/core-web-vitals-guide";
import { corsExplainedFrontendDevelopersPost } from "./posts/cors-explained-frontend-developers";

export type {
  BlogPost,
  BlogSection,
  BlogFaq,
  BlogCodeBlock,
  BlogSubheading,
} from "./types";

/** Newest first. The homepage shows the first HOMEPAGE_BLOG_COUNT entries. */
export const HOMEPAGE_BLOG_COUNT = 6;

export const blogPosts: BlogPost[] = [
  cssGridVsFlexboxPost,
  typescriptGenericsBeginnersPost,
  reactServerComponentsExplainedPost,
  restApiDesignBestPracticesPost,
  debuggingProductionBugsPost,
  coreWebVitalsGuidePost,
  corsExplainedFrontendDevelopersPost,
  telegramFastapiPost,
  weroiPlatformPost,
  pntcogMinistrySitePost,
  webhookHmacRetriesPost,
  jwtAdminWithoutDramaPost,
  nextjsPortfolioShipPost,
  fastapiAsyncTelegramPost,
  railwayVercelSplitPost,
  openapiTypedClientsPost,
  studysyncJwtSqlitePost,
  securityFundamentalsPost,
  jamaicaRemoteShipPost,
  llmFaqFallbackPost,
  mongodbAtlasLeadsPost,
  resendEmailAutomationPost,
  utechGpaToShipPost,
];

export function getHomepagePosts(): BlogPost[] {
  return blogPosts.slice(0, HOMEPAGE_BLOG_COUNT);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === slug);
}

export function getBlogPostSlugs(): string[] {
  return blogPosts.map((post) => post.id);
}
