export interface ATSBulletImprovement {
  section: string;
  original: string;
  improved: string;
  scoreBefore: number;
  scoreAfter: number;
  explanation: string;
  appliedFramework: string;
}

export interface ATSKeyword {
  name: string;
  category: "hard" | "soft" | "tool";
  count?: number;
  importance?: "critical" | "recommended";
}

export interface ATSIndustryBenchmark {
  detectedProfession: string;
  seniorityLevel: string;
  industryPercentile: number;
  topTierStandards: string[];
  candidateComparison: Array<{
    dimension: string;
    candidateStatus: string;
    topTierStandard: string;
    status: "exceeds" | "meets" | "below";
  }>;
  adviceForTop1Percent: string;
}

export interface ATSContentAddition {
  id?: string;
  category: "missing_section" | "missing_tools" | "missing_scope" | "missing_certification";
  title: string;
  whyNeeded: string;
  suggestedHeading: string;
  suggestedContent: string;
  impactPoints: number;
}

export interface ATSScanResult {
  overallScore: number;
  grade: string;
  summary: string;
  categoryScores: {
    keywordMatch: number;
    hardSkills: number;
    softSkills: number;
    formatting: number;
    impactAndMetrics: number;
  };
  keywords: {
    found: Array<{ name: string; category: "hard" | "soft" | "tool"; count: number }>;
    missing: Array<{ name: string; category: "hard" | "soft" | "tool"; importance: "critical" | "recommended" }>;
  };
  formatAudit: {
    status: "pass" | "warning" | "fail";
    issues: Array<{
      title: string;
      severity: "high" | "medium" | "low";
      description: string;
      fix: string;
    }>;
  };
  bulletImprovements: ATSBulletImprovement[];
  recommendedAdditions?: ATSContentAddition[];
  industryBenchmark?: ATSIndustryBenchmark;
  meta?: {
    analyzedAt?: string;
    characterCount?: number;
  };
  actionPlan: string[];
}

export interface SampleProfile {
  title: string;
  company: string;
  resumeText: string;
  jobDescription: string;
  mockResult: ATSScanResult;
}

export const SAMPLE_DATA: Record<"softwareEngineer" | "productManager", SampleProfile> = {
  softwareEngineer: {
    title: "Senior Full Stack Engineer",
    company: "Stripe / Vercel",
    resumeText: `ALEX MORGAN
Senior Software Engineer | alex.morgan@email.com | (555) 382-9102 | San Francisco, CA | github.com/alexmorgan

SUMMARY:
Passionate Software Engineer with 6+ years of experience building modern web applications using TypeScript, React, Node.js, and Cloud Infrastructure. Experience in scaling APIs, distributed systems, and frontend performance optimization.

EXPERIENCE:
Staff Software Engineer — CloudScale Technologies (2021 – Present)
- Worked on core web application using React, Next.js, and TypeScript.
- Managed database queries with PostgreSQL and Redis caching.
- Helped improve page load times by optimizing bundle sizes and implementing lazy loading.
- Collaborated with product and design teams to launch new checkout flow.
- Built microservices in Node.js and Docker deployed on AWS ECS.

Full Stack Developer — Nexus Labs (2018 – 2021)
- Developed REST APIs in Express and GraphQL endpoints for mobile app.
- Maintained CI/CD pipelines using GitHub Actions.
- Wrote unit tests using Jest and Cypress for end-to-end testing.
- Mentored junior engineers and conducted code reviews.

EDUCATION:
B.S. in Computer Science — University of California, Berkeley (2018)

SKILLS:
Languages: TypeScript, JavaScript, Python, SQL, Go
Frontend: React, Next.js, Tailwind CSS, Redux, HTML5/CSS3
Backend: Node.js, Express, PostgreSQL, Redis, GraphQL
DevOps & Cloud: AWS (ECS, S3, RDS), Docker, GitHub Actions, CI/CD, Kubernetes`,
    jobDescription: `Job Title: Senior Full-Stack Engineer (Core Infrastructure & Platform)
Company: NextGen Financial

About the Role:
We are seeking a Senior Full-Stack Engineer to scale our mission-critical global billing and payment processing platform. You will design resilient, low-latency microservices and high-performance React frontends that process over $100M+ in annual transactions.

Requirements & Qualifications:
- 5+ years of production experience in TypeScript, React, Next.js, and Node.js.
- Strong knowledge of Distributed Systems, Event-Driven Architecture (Kafka / RabbitMQ), and PostgreSQL optimization.
- Proven track record of optimizing Core Web Vitals (LCP, FID, CLS) and frontend architecture.
- Hands-on experience with AWS / GCP cloud deployments, Docker, Kubernetes, and Terraform.
- Experience with payment gateways (Stripe, Adyen), PCI compliance, and automated testing (Jest, Playwright).
- Demonstrated experience using the STAR method for technical leadership and cross-functional execution.`,
    mockResult: {
      overallScore: 82,
      grade: "High Potential (ATS Match 82%)",
      summary: "Alex Morgan's profile is a strong technical fit for NextGen Financial's Senior Full-Stack role. Core frontend and backend languages align well, but the resume lacks specific event-driven systems (Kafka/RabbitMQ), cloud infrastructure as code (Terraform), and quantifiable business impact metrics on revenue/latency.",
      categoryScores: {
        keywordMatch: 84,
        hardSkills: 88,
        softSkills: 78,
        formatting: 95,
        impactAndMetrics: 68,
      },
      keywords: {
        found: [
          { name: "TypeScript", category: "hard", count: 4 },
          { name: "React / Next.js", category: "hard", count: 3 },
          { name: "Node.js", category: "hard", count: 3 },
          { name: "PostgreSQL", category: "hard", count: 2 },
          { name: "AWS & Docker", category: "tool", count: 2 },
          { name: "CI/CD & GitHub Actions", category: "tool", count: 2 },
          { name: "GraphQL & REST APIs", category: "hard", count: 2 },
        ],
        missing: [
          { name: "Kafka / Event-Driven Architecture", category: "hard", importance: "critical" },
          { name: "Terraform / IaC", category: "tool", importance: "critical" },
          { name: "Core Web Vitals (LCP, CLS)", category: "hard", importance: "recommended" },
          { name: "Payment Processing / PCI", category: "hard", importance: "recommended" },
          { name: "Playwright / E2E Automation", category: "tool", importance: "recommended" },
        ],
      },
      formatAudit: {
        status: "pass",
        issues: [
          {
            title: "Single-Column Structure Verified",
            severity: "low",
            description: "No complex multi-column frames or invisible tables detected. High parse reliability on Workday & Taleo.",
            fix: "Keep standard linear section headers.",
          },
          {
            title: "Vague Action Verbs in Experience",
            severity: "medium",
            description: "Lines starting with 'Worked on' or 'Helped improve' weaken ATS candidate ranking algorithms.",
            fix: "Replace passive verbs with high-impact power verbs: 'Architected', 'Spearheaded', 'Optimized'.",
          },
        ],
      },
      bulletImprovements: [
        {
          section: "CloudScale Technologies — Experience",
          original: "Helped improve page load times by optimizing bundle sizes and implementing lazy loading.",
          improved: "Engineered bundle-splitting & dynamic asset lazy loading in Next.js, slashing LCP by 42% (3.2s → 1.85s) and lifting checkout conversion by $1.4M annually.",
          scoreBefore: 58,
          scoreAfter: 96,
          explanation: "Injected quantifiable latency metrics (42%), exact technical mechanisms (Next.js bundle splitting), and downstream revenue impact.",
          appliedFramework: "Google XYZ / STAR Method (Accomplished [X] as measured by [Y], by doing [Z])",
        },
        {
          section: "CloudScale Technologies — Experience",
          original: "Worked on core web application using React, Next.js, and TypeScript.",
          improved: "Architected core modular micro-frontend architecture in Next.js 14 & TypeScript serving 450K+ daily active users with 99.98% uptime.",
          scoreBefore: 52,
          scoreAfter: 94,
          explanation: "Transformed passive 'worked on' into architectural ownership with scale metrics (450K DAU, 99.98% uptime).",
          appliedFramework: "STAR (Scale + Architecture + Measurable Uptime)",
        },
        {
          section: "Nexus Labs — Experience",
          original: "Maintained CI/CD pipelines using GitHub Actions.",
          improved: "Automated Docker container builds and matrix testing via GitHub Actions, reducing deployment cycle times from 45 mins to 8 mins across 14 staging environments.",
          scoreBefore: 61,
          scoreAfter: 95,
          explanation: "Added before-and-after pipeline speed benchmarks (45m → 8m) and environment scale.",
          appliedFramework: "Efficiency & Automation Benchmark",
        },
      ],
      actionPlan: [
        "Add 'Event-Driven Architecture' or messaging queues (Kafka/RabbitMQ) if applicable to past distributed systems work.",
        "Include metrics on transaction volume, latency reduction, or monetary business impact in your 2021-Present role.",
        "Mention Terraform alongside AWS to score 100% on cloud infrastructure screening filters.",
      ],
    },
  },
  productManager: {
    title: "Senior Product Manager",
    company: "Airbnb / Uber",
    resumeText: `JORDAN LEE
Senior Product Manager | jordan.lee@email.com | (415) 890-1234 | New York, NY | linkedin.com/in/jordanlee

PROFESSIONAL SUMMARY:
Results-oriented Senior Product Manager with 7+ years driving 0-to-1 consumer and enterprise B2B SaaS products. Specialized in user onboarding, product-led growth (PLG), data analytics, and agile cross-functional leadership.

EXPERIENCE:
Lead Product Manager — FinVibe SaaS (2021 – Present)
- Led a cross-functional team of 12 engineers, 2 designers, and 1 data scientist.
- Redesigned user onboarding flow which helped increase customer activation.
- Managed product roadmap, user research, backlog prioritization, and sprint planning.
- Partnered with marketing and sales to drive product adoption in the enterprise tier.

Product Manager — GrowthPulse (2018 – 2021)
- Managed feature experiments using A/B testing and Amplitude analytics.
- Increased free-to-paid conversion rate through pricing experiments.
- Conducted 50+ customer discovery interviews to inform new product features.

SKILLS:
Product Strategy, Roadmap Management, A/B Testing, User Research, SQL, Amplitude, Mixpanel, Jira, Figma, Agile/Scrum`,
    jobDescription: `Position: Principal Product Manager - Growth & Monetization
Company: Horizon Cloud

We are looking for a Principal Product Manager to own our self-serve conversion funnel and global subscription pricing engine. 

Key Responsibilities:
- Drive North Star growth metrics: Free-to-Paid Conversion, Net Revenue Retention (NRR), and Annual Recurring Revenue (ARR).
- Build experimentation pipelines conducting 50+ multivariate A/B tests annually using Amplitude and statistical rigor.
- Define GTM pricing tiers, product-led expansion (PLG), and self-serve onboarding.
- Work closely with C-suite and Engineering leads on 12-month strategic roadmaps.`,
    mockResult: {
      overallScore: 86,
      grade: "Strong Match (ATS Match 86%)",
      summary: "Jordan Lee demonstrates exceptional experience in PLG, user onboarding, and experiment design. To hit the top 1% ATS tier, the resume should explicitly quantify ARR/NRR growth metrics and emphasize statistical rigor in experimentation.",
      categoryScores: {
        keywordMatch: 88,
        hardSkills: 90,
        softSkills: 92,
        formatting: 98,
        impactAndMetrics: 72,
      },
      keywords: {
        found: [
          { name: "Product-Led Growth (PLG)", category: "hard", count: 3 },
          { name: "A/B Testing & Amplitude", category: "tool", count: 4 },
          { name: "User Onboarding & Roadmap", category: "hard", count: 4 },
          { name: "SQL & Analytics", category: "hard", count: 2 },
        ],
        missing: [
          { name: "Net Revenue Retention (NRR)", category: "hard", importance: "critical" },
          { name: "Annual Recurring Revenue (ARR)", category: "hard", importance: "critical" },
          { name: "Multivariate Testing Rigor", category: "hard", importance: "recommended" },
        ],
      },
      formatAudit: {
        status: "pass",
        issues: [
          {
            title: "ATS-Compliant Layout",
            severity: "low",
            description: "Headers and contact information cleanly detected with zero parsing anomalies.",
            fix: "Format is optimal.",
          },
        ],
      },
      bulletImprovements: [
        {
          section: "FinVibe SaaS — Experience",
          original: "Redesigned user onboarding flow which helped increase customer activation.",
          improved: "Spearheaded 0-to-1 redesign of self-serve onboarding funnel, boosting Day-7 user activation by +34% and accelerating enterprise ARR by $3.2M within 2 quarters.",
          scoreBefore: 60,
          scoreAfter: 97,
          explanation: "Replaced vague statement with precise D7 activation metric (+34%) and quantifiable ARR impact ($3.2M).",
          appliedFramework: "Metric-Driven Growth Impact",
        },
      ],
      actionPlan: [
        "Include Dollar figures for ARR growth and customer acquisition cost (CAC) reduction.",
        "Add explicit mention of Net Revenue Retention (NRR) in the executive summary.",
      ],
    },
  },
};
