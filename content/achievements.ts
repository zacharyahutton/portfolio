export interface Achievement {
  title: string;
  description: string;
}

export const achievements: Achievement[] = [
  {
    title: "Dean's List",
    description:
      "Strong academic performance in BSc Computer Science at the University of Technology, Jamaica. Holds a 3.7 GPA while balancing contract development and personal projects.",
  },
  {
    title: "Contract and freelance delivery",
    description:
      "Shipped production web apps for ministry and agency clients with React, FastAPI, MongoDB, and modern deploys on Vercel and Railway.",
  },
  {
    title: "Senior church volunteer",
    description:
      "Leads and supports technical roles at church, coordinating events and keeping digital tools running for the community.",
  },
  {
    title: "Jamaica Red Cross volunteer",
    description:
      "Gives time to community service through the Red Cross, building teamwork, communication, and reliability beyond coursework.",
  },
  {
    title: "Security aware engineering",
    description:
      "Applies OWASP aligned practices, secure auth patterns, and networking fundamentals from coursework and self directed labs.",
  },
];
