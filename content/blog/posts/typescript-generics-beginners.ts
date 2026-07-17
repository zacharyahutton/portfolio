import { withReadingMeta } from "../types";

export const typescriptGenericsBeginnersPost = withReadingMeta({
  id: "typescript-generics-beginners",
  title: "TypeScript generics for beginners: reusable types without losing safety",
  blurb:
    "Understand TypeScript generics through practical functions, API responses, constraints, React components, and simple rules for writing safer reusable code.",
  tag: "TypeScript",
  date: "July 2026",
  publishedAt: "2026-07-16",
  href: "/blog/typescript-generics-beginners",
  image: "/blog/typescript-generics-beginners.png",
  primaryKeyword: "TypeScript generics for beginners",
  secondaryKeywords: [
    "TypeScript generic function",
    "generic types TypeScript",
    "TypeScript generic constraints",
    "React TypeScript generics",
  ],
  intro: [
    "TypeScript generics felt abstract when I first saw angle brackets beside a function name. The examples used letters like T and K, then promised that the code was reusable. What finally made generics click was a simpler idea: a generic is a placeholder for a type that the caller will provide or that TypeScript will infer.",
    "Generics let one piece of code preserve information about many possible types. They are not a way to avoid choosing types. They are a way to describe a relationship between input and output. In this guide I will build that idea from a small function to API results and React components, while showing where generics help and where a normal type is clearer.",
  ],
  sections: [
    {
      heading: "The problem generics solve",
      paragraphs: [
        "Imagine a function that returns the first item in an array. If its parameter is any[], the function accepts everything but throws away safety. The result becomes any, so a typo on the returned value compiles. If the parameter is unknown[], the result is safer, but callers must narrow it before doing useful work. Writing separate functions for strings, numbers, and users repeats the same logic.",
        "A generic function captures the item type at the call site and carries it to the return value. Pass a string array and the result is string or undefined. Pass User[] and the result is User or undefined. The implementation stays the same, while the relationship between input and output remains precise.",
      ],
      code: {
        label: "A first generic function",
        language: "typescript",
        code: `function first<T>(items: T[]): T | undefined {
  return items[0];
}

const name = first(["Zachary", "Maya"]);
// name is string | undefined

type User = { id: string; email: string };
const user = first<User>([
  { id: "u1", email: "hello@example.com" },
]);
// user is User | undefined`,
      },
    },
    {
      heading: "Type parameters are relationships, not mystery letters",
      paragraphs: [
        "T is only a variable name for a type. You can name it Item, ResponseData, or Row when that communicates more. A generic becomes useful when the same type parameter appears in more than one place. In first<T>, T connects the array element type to the return type. In a key reader, two parameters can connect an object, one of its keys, and the value behind that key.",
        "TypeScript usually infers generic arguments from function arguments, so callers rarely need to write angle brackets. Explicit arguments are useful when there is no value to infer from or when an empty collection would otherwise become never[]. I prefer inference when it is obvious and explicit types when they make intent clearer.",
      ],
      code: {
        label: "Connecting an object key to its value",
        language: "typescript",
        code: `function getProperty<ObjectType, Key extends keyof ObjectType>(
  object: ObjectType,
  key: Key,
): ObjectType[Key] {
  return object[key];
}

const project = {
  title: "Portfolio",
  published: true,
  year: 2026,
};

const title = getProperty(project, "title"); // string
const year = getProperty(project, "year"); // number
// getProperty(project, "missing") is a compile error`,
      },
    },
    {
      heading: "Generic constraints keep reusable code honest",
      paragraphs: [
        "An unconstrained T could be a string, number, function, or object. That means the implementation cannot assume properties exist. Constraints narrow the set of allowed types while preserving the caller's specific shape. If a function needs an id, use T extends { id: string }. The function can safely read id and still return the complete original type.",
        "Constraints are better than casting because they make requirements visible to callers. A cast tells the compiler to trust you, even if runtime data disagrees. A constraint asks the compiler to verify that every value meets the contract. I use constraints for sorting, entity helpers, table rows, and cache utilities.",
      ],
      code: {
        label: "A constrained entity helper",
        language: "typescript",
        code: `type Identifiable = { id: string };

function indexById<Item extends Identifiable>(
  items: Item[],
): Record<string, Item> {
  return Object.fromEntries(
    items.map((item) => [item.id, item]),
  );
}

const projects = indexById([
  { id: "portfolio", title: "Portfolio", live: true },
]);

projects.portfolio.title; // full item type is preserved`,
      },
    },
    {
      heading: "Modeling API states with generic types",
      paragraphs: [
        "API wrappers are one of the most practical uses for generics. Every endpoint returns different data, but successful and failed requests share a common envelope. A generic ApiResult<Data> can preserve each endpoint's payload while standardizing status, errors, and metadata.",
        "The generic does not validate network data at runtime. I still parse external responses with Zod or another schema validator. After validation, the generic expresses the result throughout the application. This separation matters: runtime schemas prove what arrived, while TypeScript generics preserve that knowledge during development.",
      ],
      code: {
        label: "A reusable API result",
        language: "typescript",
        code: `type ApiResult<Data> =
  | { ok: true; data: Data }
  | { ok: false; error: string; status: number };

async function request<Data>(
  url: string,
  parse: (value: unknown) => Data,
): Promise<ApiResult<Data>> {
  const response = await fetch(url);

  if (!response.ok) {
    return {
      ok: false,
      error: "Request failed",
      status: response.status,
    };
  }

  return {
    ok: true,
    data: parse(await response.json()),
  };
}`,
      },
    },
    {
      heading: "Generic interfaces, defaults, and utility types",
      paragraphs: [
        "Interfaces and type aliases can accept parameters just like functions. A Paginated<Item> type can describe projects, messages, or search results without duplicating the pagination fields. A default type parameter is useful when one option is overwhelmingly common, but defaults should not hide important domain choices.",
        "Built in utility types such as Partial, Pick, Omit, Record, ReturnType, and Awaited use generics. Learning to read their signatures makes TypeScript documentation much less intimidating. Pick<User, \"id\" | \"email\"> means create a type from User using only those keys. The angle brackets contain type arguments, just as parentheses contain value arguments.",
      ],
      code: {
        label: "Generic collections and a default",
        language: "typescript",
        code: `type Paginated<Item> = {
  items: Item[];
  nextCursor: string | null;
  total: number;
};

type SelectOption<Value = string> = {
  label: string;
  value: Value;
};

type ProjectPage = Paginated<{
  id: string;
  title: string;
}>;

const status: SelectOption = {
  label: "Published",
  value: "published",
};`,
      },
    },
    {
      heading: "Generics in React components and hooks",
      paragraphs: [
        "Generic React components help when markup is reusable but data shapes differ. A List component can accept items and a render function. The component does not need to know what an item contains. It only needs a stable key function and a renderer that receives the inferred item type.",
        "The same idea works for hooks that manage selected values, table columns, or form fields. Use generics when the component must preserve a relationship supplied by its parent. Avoid a generic component when there are only one or two known variants. A union with explicit branches often produces clearer props and better accessibility decisions.",
      ],
      code: {
        label: "A generic React list",
        language: "tsx",
        code: `type ListProps<Item> = {
  items: Item[];
  getKey: (item: Item) => React.Key;
  renderItem: (item: Item) => React.ReactNode;
};

function List<Item>({
  items,
  getKey,
  renderItem,
}: ListProps<Item>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}`,
      },
    },
    {
      heading: "Common generic mistakes and simpler alternatives",
      paragraphs: [
        "The most common mistake is adding a type parameter that appears only once. A function like log<T>(message: T): void gains little because nothing depends on T. unknown communicates the same input flexibility more honestly. Another mistake is using several generics and conditional types to model a small fixed set of cases. A discriminated union is usually easier to understand.",
        "Be careful with broad constraints such as T extends object. They exclude primitives but say nothing useful about available properties. Prefer the smallest meaningful capability, such as T extends { createdAt: string }. Also avoid hiding unsafe casts inside a generic helper. A function can look reusable and still be wrong if its implementation returns a value that does not match T.",
      ],
      bullets: [
        "Use a generic when a type relationship must be preserved.",
        "Use unknown when input may be anything and must be checked.",
        "Use a union when the valid cases are known and finite.",
        "Use a concrete type when reuse is speculative.",
        "Name type parameters descriptively when several appear together.",
      ],
    },
    {
      heading: "A learning path that makes generics stick",
      paragraphs: [
        "Start by writing identity, first, and getProperty without copying the final signatures. Hover over every call and observe what TypeScript infers. Then model a real API result or paginated response from your project. Finally, read the definitions of Pick and Record in your editor. This sequence moves from a visible input and output relationship to common production abstractions.",
        "Do not begin with recursive conditional types or library code designed for every edge case. Most application developers get the majority of value from generic functions, constraints, keyof, indexed access types, and generic component props. Build confidence with those tools, then learn more advanced patterns when a real problem requires them.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is a generic in TypeScript?",
      answer:
        "A generic is a type parameter that acts as a placeholder. It lets a function, type, class, or component work with several types while preserving relationships between its inputs and outputs.",
    },
    {
      question: "What does T mean in TypeScript generics?",
      answer:
        "T is a conventional name for a type parameter, short for type. It has no special behavior. You can use a descriptive name such as Item or ResponseData, especially when a declaration has multiple type parameters.",
    },
    {
      question: "When should I use a generic instead of any?",
      answer:
        "Use a generic when the caller's type should be preserved or connected to another type position. any disables checking and loses information. If there is no relationship to preserve, unknown is usually safer than either a generic or any.",
    },
    {
      question: "Are TypeScript generics available at runtime?",
      answer:
        "No. TypeScript removes generic types during compilation. Use runtime validation such as Zod for API responses and user input. Generics then preserve the validated type through your application.",
    },
  ],
  takeaway:
    "TypeScript generics become manageable when you treat them as type relationships. Start with one placeholder, let inference do the work, add constraints for required capabilities, and prefer simpler concrete types or unions when reuse does not improve the design.",
});
