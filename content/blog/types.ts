export type BlogCodeBlock = {
  label?: string;
  language: string;
  code: string;
};

export type BlogSubheading = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  code?: BlogCodeBlock;
};

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  code?: BlogCodeBlock;
  subheadings?: BlogSubheading[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogPost = {
  id: string;
  title: string;
  blurb: string;
  tag: string;
  date: string;
  publishedAt: string;
  readingTime: string;
  wordCount: number;
  href: string;
  image: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  intro: string[];
  sections: BlogSection[];
  faqs: BlogFaq[];
  takeaway: string;
  relatedLink?: {
    label: string;
    href: string;
    external?: boolean;
  };
};

export function countWords(post: Omit<BlogPost, "wordCount" | "readingTime"> & Partial<Pick<BlogPost, "wordCount" | "readingTime">>): number {
  const parts: string[] = [
    post.title,
    post.blurb,
    ...post.intro,
    post.takeaway,
    ...post.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ];

  for (const section of post.sections) {
    parts.push(section.heading, ...section.paragraphs, ...(section.bullets ?? []));
    if (section.code) parts.push(section.code.code);
    for (const sub of section.subheadings ?? []) {
      parts.push(sub.heading, ...sub.paragraphs, ...(sub.bullets ?? []));
      if (sub.code) parts.push(sub.code.code);
    }
  }

  return parts
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function withReadingMeta<T extends Omit<BlogPost, "wordCount" | "readingTime">>(
  post: T,
): BlogPost {
  const wordCount = countWords(post);
  const minutes = Math.max(6, Math.round(wordCount / 200));
  return {
    ...post,
    wordCount,
    readingTime: `${minutes} min`,
  };
}
