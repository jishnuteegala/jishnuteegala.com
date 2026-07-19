export type Emphasis = "highlight" | "detail";

export type Bullet = {
  text: string;
  emphasis: Emphasis;
};

export type Role = {
  title: string;
  org: string;
  orgHref?: string;
  orgNote?: string;
  start: string;
  end: string;
  bullets: Bullet[];
};

export type EducationEntry = {
  institution: string;
  location: string;
  start: string;
  end: string;
  details: Bullet[];
};

export type SkillGroup = {
  label: string;
  items: string;
};

export type SelectedProject = {
  name: string;
  summary: string;
  href: string;
};

export type Cv = {
  name: string;
  headline: string;
  location: string;
  workEligibility: string;
  email: string;
  links: { label: string; href: string }[];
  profile: string;
  experience: Role[];
  education: EducationEntry[];
  skills: SkillGroup[];
  certifications: string;
  selectedProjects: SelectedProject[];
};

export const cv: Cv = {
  name: "Jishnu Teegala",
  headline: "DevOps Platforms Engineer",
  location: "London, UK",
  workEligibility: "British citizen, no visa sponsorship required",
  email: "hi@jishnuteegala.com",
  links: [
    { label: "jishnuteegala.com", href: "https://jishnuteegala.com" },
    { label: "GitHub", href: "https://github.com/jishnuteegala" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jishnu-teegala" },
    { label: "GitLab", href: "https://gitlab.com/jishnuteegala" },
    { label: "X", href: "https://x.com/jishnuteegala" },
  ],
  profile:
    "I'm a DevOps Platforms Engineer interested in technology, AI, and finance. I work with GitLab, CI/CD, Bash, Python, and agentic AI engineering tools, and I act as a product expert for GitLab, SonarQube, GitHub Copilot, and GitLab Duo, which comes with an internal developer advocacy role on the side.",
  experience: [
    {
      title: "DevOps Platforms Engineer",
      org: "UBS",
      orgHref: "https://www.ubs.com",
      orgNote: "Full-time, DevOps Platforms, Core Platform Engineering",
      start: "Jul 2026",
      end: "Present",
      bullets: [
        {
          text: "Enable agentic AI software development at the bank by supporting GitLab, SonarQube, GitHub Copilot, and GitLab Duo users, reporting bugs to the vendors, some critical severity and blocking users, and verifying their fixes. In practice an internal DevRel/DevEx role for those products.",
          emphasis: "highlight",
        },
        {
          text: "Run GitLab and SonarQube version upgrades: deprecation and breaking change analysis, implementation plans, Ansible playbook execution, validation, and vendor liaison when something goes wrong.",
          emphasis: "highlight",
        },
      ],
    },
    {
      title: "DevOps Platforms Engineer (Apprentice)",
      org: "UBS",
      orgHref: "https://www.ubs.com",
      orgNote: "Tech Degree Apprenticeship, DevOps Platforms, Core Platform Engineering",
      start: "Aug 2023",
      end: "Jul 2026",
      bullets: [
        {
          text: "Built an end-to-end reporting pipeline in GitLab CI fetching 12,000+ SonarQube projects (73,000+ branches) and producing a CSV of their code quality metrics, mapped to internal application references and business division teams, published to Azure Blob Storage and consumed by a Power BI dashboard. Wrote unit and integration tests with 100% coverage in Pytest.",
          emphasis: "highlight",
        },
        {
          text: "Enabled agentic AI software development at the bank by supporting GitLab, SonarQube, GitHub Copilot, and GitLab Duo users, reporting bugs to the vendors, some critical severity and blocking users, and verifying their fixes. In practice an internal DevRel/DevEx role for those products.",
          emphasis: "highlight",
        },
        {
          text: "Provided L1 support migrating 34 important CS applications (201 repositories) to UBS GitLab: issue templates per repo, evidence validation, running the migration pipeline, and triaging 1,100+ secret scanning findings as false positives. Trained SREs to take over L1 and moved up to L2.",
          emphasis: "highlight",
        },
        {
          text: "Provided L2 support for a further initiative migrating 500+ CS applications (5,000+ repositories), with Power BI reporting for management and PMs. Kept the migration tool within UBS SDLC through test cases and implementation plans, and helped CUSO app teams meet a regulatory MRA by clearing technical queries and blockers.",
          emphasis: "detail",
        },
        {
          text: "Ran 4 GitLab version upgrades: deprecation analysis, implementation plans, Ansible playbook execution, validation, and vendor liaison when issues came up. Supported SonarQube upgrades by analysing deprecated API usage.",
          emphasis: "highlight",
        },
        {
          text: "Implemented log monitoring for SonarQube with Azure Log Analytics: resource group, decentralised workspaces, data collection endpoints, custom table definitions, and data collection rules from a single DCR pattern file, associated to VM lists per environment (Production, PREPROD, DEV), instance type (main and COBOL-specific), and deployment (primary and secondary). Built with GitLab CI/CD, Azure CLI, Bash, and HashiCorp Vault for secrets, ending manual SSH into VMs to view and share logs during incidents and improving debugging for engineering and the production SREs, who alone hold prod access under segregation of duties.",
          emphasis: "highlight",
        },
        {
          text: "Simplified the controls that ensure development compliance in GitLab, working with the vendor on branch protection and merge request approvals to meet the 4-eyes requirements of a regulated bank.",
          emphasis: "highlight",
        },
      ],
    },
    {
      title: "Program Analyst (Apprentice)",
      org: "UBS",
      orgHref: "https://www.ubs.com",
      orgNote: "Tech Degree Apprenticeship, Metadata Management, Global Data Management Office",
      start: "Jan 2023",
      end: "Aug 2023",
      bullets: [
        {
          text: "Created a recruitment statistics dashboard in Power BI, fed by an Excel hiring tracker on SharePoint with scheduled refreshes. Management and crew leads (EDs, DIs, and ADs) used it to track hiring against demand across Metadata Management (around 90 employees).",
          emphasis: "highlight",
        },
        {
          text: "Pitched expanding the dashboard to the whole of GDMO (around 200 employees), with implementation discussions taken forward.",
          emphasis: "detail",
        },
        {
          text: "Created a Power BI dashboard for the management team and crew leads to track delivery of objectives and OKRs across MM streams.",
          emphasis: "detail",
        },
        {
          text: "Automated answers to common questions from Metadata Management teams by linking an existing UBS chatbot to a keyword catalogue of articles, and pitched it to a management forum with EDs in the audience. All before generative AI was popular.",
          emphasis: "highlight",
        },
        {
          text: "Got a grounding in how a programme management team works.",
          emphasis: "detail",
        },
      ],
    },
    {
      title: "Data Management Analyst (Apprentice)",
      org: "UBS",
      orgHref: "https://www.ubs.com",
      orgNote: "Tech Degree Apprenticeship, Data Lineage Metrics, Global Data Management Office",
      start: "Sep 2022",
      end: "Dec 2022",
      bullets: [
        {
          text: "Designed and updated tables in Excel and PowerPoint with formulae, used by MDs and EDs to track data lineage progress for FS transaction monitoring.",
          emphasis: "detail",
        },
        {
          text: "Ran Alteryx workflows updating the scorecard and age trackers that quantify data health for key data outputs at UBS.",
          emphasis: "highlight",
        },
        {
          text: "Built an understanding of data lineage and why data at UBS needs to be accurate, timely, and complete.",
          emphasis: "detail",
        },
      ],
    },
    {
      title: "Freelance UX/UI Tester",
      org: "UserTesting.com / Intellizoom",
      orgHref: "https://www.usertesting.com",
      orgNote: "Freelance, web and app UX/UI testing",
      start: "Sep 2021",
      end: "Sep 2022",
      bullets: [
        {
          text: "Tested websites and apps across sport, clothing, and telecommunications, giving verbal feedback on layout, functionality, and what I would change.",
          emphasis: "highlight",
        },
        {
          text: "Learned to get my point across so clients were satisfied with the work.",
          emphasis: "detail",
        },
      ],
    },
    {
      title: "Intern, Big City Bright Future (BCBF) 2022",
      org: "Bloomberg",
      orgHref: "https://www.bloomberg.com/company/",
      orgNote: "Programme attendee, finance and technology",
      start: "Jul 2022",
      end: "Jul 2022",
      bullets: [
        {
          text: "1 of 120 students selected from over 700 applicants to the BCBF programme.",
          emphasis: "highlight",
        },
        {
          text: "Attended a bootcamp on the skills the professional world expects: teamwork, communication, persuasion, and negotiation among them.",
          emphasis: "detail",
        },
        {
          text: "Networked across Analytics, Sales, Global Data, and Engineering, and came away with a better map of the financial sector (buy side, sell side, market makers, hedge funds, private equity) and Bloomberg's role in fuelling it.",
          emphasis: "detail",
        },
        {
          text: "Completed the Bloomberg Market Concepts certification, covering economic indicators, currencies, equities, and fixed income, plus optional modules on Terminal basics, commodities, equity options, and portfolio management.",
          emphasis: "highlight",
        },
        {
          text: "Volunteered with Bloomberg Philanthropies.",
          emphasis: "detail",
        },
      ],
    },
    {
      title: "Attendee, Pathways Programme",
      org: "Bloomberg",
      orgHref: "https://www.bloomberg.com/company/",
      orgNote: "Programme attendee, finance and technology",
      start: "Nov 2021",
      end: "Jan 2022",
      bullets: [
        {
          text: "Networked with apprentices and learned about the divisions within Bloomberg, such as Global Data and Sales.",
          emphasis: "detail",
        },
      ],
    },
    {
      title: "Mentee, Embrace Mentoring Programme",
      org: "Microsoft",
      orgHref: "https://www.microsoft.com",
      orgNote: "Programme mentee, technology",
      start: "Oct 2021",
      end: "Jun 2022",
      bullets: [
        {
          text: "Learned about Microsoft's products and the roles available within the company.",
          emphasis: "detail",
        },
        {
          text: "Created a personal development plan of strengths and areas to improve, actioned through measurable goals.",
          emphasis: "detail",
        },
      ],
    },
    {
      title: "Attendee, Private Equity Insight Day",
      org: "Inflexion",
      orgHref: "https://www.inflexion.com",
      orgNote: "Insight day attendee, private equity",
      start: "Apr 2022",
      end: "Apr 2022",
      bullets: [
        {
          text: "Learned the basics of private equity and the role Inflexion plays in its portfolio companies.",
          emphasis: "detail",
        },
        {
          text: "Presented the risks of investing in a case study company (hypothetically Gymshark) to the investment committee, and answered their questions on how it could build a recurring revenue product line.",
          emphasis: "highlight",
        },
      ],
    },
    {
      title: "Attendee, Life in Consulting Insight Day",
      org: "Kearney",
      orgHref: "https://www.kearney.com",
      orgNote: "Insight day attendee, consulting",
      start: "Feb 2022",
      end: "Feb 2022",
      bullets: [
        {
          text: 'Took part in a "Crack the Case" workshop simulating consulting case interviews.',
          emphasis: "detail",
        },
        {
          text: "Sized the market opportunity for a hypothetical music streaming firm expanding into South Africa, given inputs like subscription cost and demographics, and got to the answer the consultants were after.",
          emphasis: "highlight",
        },
        {
          text: "Learned about career pathways at Kearney and in consulting generally.",
          emphasis: "detail",
        },
      ],
    },
  ],
  education: [
    {
      institution: "University of Exeter",
      location: "London",
      start: "Sep 2022",
      end: "Jun 2026",
      details: [
        {
          text: "BSc (Hons) Digital and Technology Solutions (Software Engineering), Grade: Upper Second Class (2:1).",
          emphasis: "highlight",
        },
      ],
    },
    {
      institution: "Isaac Newton Academy",
      location: "London",
      start: "Sep 2020",
      end: "Aug 2022",
      details: [
        {
          text: "UK GCE A Level Grades: Mathematics (A*), Physics (A*), Chemistry (A*), Economics (A*).",
          emphasis: "detail",
        },
      ],
    },
    {
      institution: "Dunman Secondary School",
      location: "Singapore",
      start: "Jan 2016",
      end: "Dec 2019",
      details: [
        {
          text: "Singapore-Cambridge GCE O Levels (A1 is the best grade possible): Mathematics (A1), English (A2), Additional Mathematics (A2), Biology (A1), Physics (A2), Chemistry (A2), Humanities, Social Studies/Geography (A1), Hindi (B4).",
          emphasis: "detail",
        },
        {
          text: "Positions: Assistant Sectional Leader of Tenor/Bass, Executive Committee member of Choir Retreat, Class Bio Rep.",
          emphasis: "detail",
        },
      ],
    },
  ],
  skills: [
    {
      label: "Languages",
      items: "English (native), Hindi and Telugu (fluent), and basic Japanese.",
    },
    {
      label: "Tech",
      items:
        "Python, Bash, Linux, SQL, GitLab, CI/CD, SonarQube, GitHub, GitLab Duo, GitHub Copilot, JavaScript/TypeScript, React, Azure, Terraform, Ansible, and generative and agentic AI. Also comfortable with Power BI, Excel, SharePoint, and video editing in DaVinci Resolve.",
    },
    {
      label: "Finance",
      items:
        "I follow finance, banking, and FinTech closely, and my friends and family come to me for advice on stocks, ETFs, bonds, crypto, and other asset classes.",
    },
    {
      label: "News",
      items: "Caught up daily through the Financial Times, Bloomberg, Nikkei, and Reuters.",
    },
  ],
  certifications:
    "Microsoft Certified: Azure Fundamentals; GitLab Certified Duo Agent Platform Associate; Certified GitLab Duo (AI) Associate; Calculus and Linear Algebra for Machine Learning and Data Science; Bloomberg Market Concepts (BMC); Big City Bright Future: Excel Fundamentals 2022; TTNTC Salesforce Level 1",
  selectedProjects: [
    {
      name: "GTA VI Global Pricing",
      summary: "Live PlayStation Store pricing for GTA VI across 73 regions.",
      href: "https://gta-vi-global-pricing.jishnuteegala.com",
    },
    {
      name: "glasspick",
      summary: "Provably fair giveaway picker seeded by the drand randomness beacon.",
      href: "https://github.com/jishnuteegala/glasspick",
    },
    {
      name: "git-chunks",
      summary: "Splits large pushes into chunked commits to beat SCM push limits.",
      href: "https://github.com/jishnuteegala/git-chunks",
    },
  ],
};
