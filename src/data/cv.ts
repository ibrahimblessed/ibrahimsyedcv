export type Skill = {
  id: string;
  name: string;
  category: string;
  /** 0 = no proficiency shown, 1–5 = shown as a small bar on the CV */
  level: number;
  order: number;
};

export const LEVEL_LABELS = ["Not shown", "Learning", "Familiar", "Proficient", "Advanced", "Expert"];

export const CATEGORY_ORDER = [
  "Languages",
  "Web & Mobile",
  "Cloud & Data",
  "ML & AI",
  "Enterprise",
  "Ways of working",
];

const mk = (category: string, names: string[]): Skill[] =>
  names.map((name, order) => ({
    id: `default-${category}-${name}`,
    name,
    category,
    level: 0,
    order,
  }));

/** Shown on the public CV until skills exist in Firestore. */
export const defaultSkills: Skill[] = [
  ...mk("Languages", ["Java", "C#", "Kotlin", "Python", "JavaScript", "TypeScript", "SQL"]),
  ...mk("Web & Mobile", ["React", "Vite", "HTML/CSS", "Android Studio"]),
  ...mk("Cloud & Data", ["AWS (AI services)", "Microsoft Azure", "Firebase", "Relational database design"]),
  ...mk("ML & AI", ["Supervised learning", "Regression & classification", "Neural networks", "AWS AI services"]),
  ...mk("Enterprise", ["SAP S/4HANA Financial Accounting", "Asset accounting processes"]),
  ...mk("Ways of working", ["Agile delivery", "Team leadership", "OAuth & biometric auth", "Version control"]),
];

export function groupSkills(skills: Skill[]): [string, Skill[]][] {
  const map = new Map<string, Skill[]>();
  for (const s of skills) {
    const list = map.get(s.category) ?? [];
    list.push(s);
    map.set(s.category, list);
  }
  const rank = (c: string) => {
    const i = CATEGORY_ORDER.indexOf(c);
    return i === -1 ? CATEGORY_ORDER.length : i;
  };
  return [...map.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]))
    .map(([cat, list]) => [
      cat,
      [...list].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    ]);
}

export const profile = {
  name: "Ibrahim Syed",
  title: "Graduate Software Developer",
  tagline: "AWS Certified AI Practitioner · SAP S/4HANA FI Certified",
  location: "Johannesburg, Gauteng",
  citizenship: "South African citizen",
  email: "ibrahim.afsyed@gmail.com",
  linkedin: "https://www.linkedin.com/in/ibrahim-syed",
  linkedinLabel: "linkedin.com/in/ibrahim-syed",
  availability: "Open to graduate & internship roles",
  summary:
    "Computer science graduate with 12 distinctions, now completing a BSc Honours in Computing at UNISA. AWS Certified AI Practitioner, and currently working towards the AWS Certified Solutions Architect – Associate. Four freelance projects delivered end to end, from a live Azure-hosted web platform to Android apps with biometric authentication, including one where I led the team. SAP S/4HANA Financial Accounting certified, with growing depth in machine learning through the DeepLearning.AI specialisation. Seeking a graduate or internship role where I can ship production code, work alongside strong engineers, and keep learning fast, on the path to Cloud & AI Solutions Architecture.",
};

export const stats = [
  { value: "12", label: "Distinctions", sub: "BSc Computer & Information Systems" },
  { value: "4", label: "Projects delivered", sub: "Freelance, end to end" },
  { value: "2", label: "Industry certifications", sub: "AWS · SAP" },
];

export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  bullets: string[];
  tags: string[];
  link?: { href: string; label: string };
};

export const experience: ExperienceItem[] = [
  {
    role: "Web Developer, Madrasatul Asma School Platform",
    org: "Madrasatul Asma Islamic school",
    period: "In development",
    tags: ["React", "TypeScript", "Firebase", "Firestore"],
    bullets: [
      "Building a React, TypeScript and Firebase platform with a student portal, principal dashboard and admin portal, secured by role-based access for principals, teachers and students.",
      "Designed the Firestore data model and security rules across students, attendance, grades, exams, live classes and invoices.",
      "Built live class allocation by grade, multiple-choice exams with configurable attempts and decreasing scores, attendance marking, and an invoice generator with payment tracker.",
      "Designed the full interface with a consistent Islamic design language, Arabic typography and Hijri/Gregorian date display.",
    ],
  },
  {
    role: "Freelance Web Developer, ChrisFit Fitness Platform",
    org: "Johannesburg",
    period: "Live in production",
    tags: ["Microsoft Azure", "Responsive web", "Authentication"],
    link: { href: "https://chrisfit.azurewebsites.net", label: "chrisfit.azurewebsites.net" },
    bullets: [
      "Designed, built and deployed a responsive fitness web application on Microsoft Azure, live in production and used by the client's members.",
      "Integrated backend services for user engagement and implemented secure authentication.",
      "Applied modern UI principles and tuned performance for consistent cross-device behaviour.",
    ],
  },
  {
    role: "Team Lead & Developer, Postgraduate Research Management System",
    org: "Dr Majoko Inc., Johannesburg",
    period: "2024 – 2025",
    tags: ["Kotlin", "React", "Vite", "TypeScript", "Firebase"],
    bullets: [
      "Led a student development team delivering a system to manage postgraduate research projects for an external client.",
      "Ran the project using Agile methods (sprint planning, stand-ups and client demos) and owned delivery and handover.",
      "Built with Kotlin, React, Vite and TypeScript on a Firebase backend.",
    ],
  },
  {
    role: "Freelance App Developer, Censible (personal budgeting app)",
    org: "Private client, Johannesburg",
    period: "2025",
    tags: ["Java", "Firebase", "Android Studio"],
    bullets: [
      "Built an Android app for expense tracking, budgeting goals and emergency-fund calculation.",
      "Added a rewards section to drive retention, with Firebase for data storage and sync.",
    ],
  },
  {
    role: "Freelance App Developer, Givly (charity donation app)",
    org: "Private client, Johannesburg",
    period: "2024 – 2025",
    tags: ["Firebase", "Azure", "Biometric auth", "Google Auth"],
    bullets: [
      "Built an app enabling donations and item requests, with barcode scanning to identify and log items.",
      "Implemented biometric authentication and Google Auth for secure access.",
      "Used Firebase and Azure databases for backend support.",
    ],
  },
];

export const education = [
  {
    title: "BSc Honours in Computing",
    place: "University of South Africa (UNISA), Johannesburg",
    period: "2026 – present (in progress)",
    points: [] as string[],
  },
  {
    title: "BSc in Computer & Information Systems",
    place: "Varsity College, Johannesburg",
    period: "2023 – 2025",
    points: [
      "Graduated with 12 distinctions: Network Engineering 1B 89%, Programming 1B 89%, Information Systems 3D 84%, Programming 1A 81%. Year averages 79% / 72% / 74%.",
      "Majors across software engineering, databases, cloud development, networking, and systems analysis, architecture & design.",
    ],
  },
];

export const certifications = [
  { name: "AWS Certified AI Practitioner", issuer: "Amazon Web Services", status: "Certified" },
  { name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", status: "In progress" },
  {
    name: "SAP Certified Application Associate – S/4HANA for Financial Accounting (C_TS4FI_2023)",
    issuer: "SAP · 2025",
    status: "Certified",
  },
  { name: "Performing Asset Accounting Processes in S/4HANA", issuer: "SAP · Sep 2025", status: "Completed" },
  {
    name: "Machine Learning Specialization",
    issuer: "DeepLearning.AI · Jul 2026 · incl. Supervised ML and Advanced Learning Algorithms",
    status: "Completed",
  },
  { name: "Artificial Intelligence in Healthcare", issuer: "Udemy · Feb 2026", status: "Completed" },
  { name: "Certificates of Participation ×4", issuer: "IEEE Educational Activities · Feb–Mar 2026", status: "Completed" },
  { name: "Project Management · Presentation · Communication", issuer: "Udemy", status: "Completed" },
];

export const beyondTheDesk = [
  "First dan black belt, Shotokan karate",
  "Grade 2 boxer (Apex Boxing) and BJJ competitor",
  "Weekly tennis and soccer · learning animation",
];
