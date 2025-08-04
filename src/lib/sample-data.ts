export const initializeSampleData = () => {
  // Check if sample data already exists
  const existingJobs = localStorage.getItem("jobs");
  if (existingJobs) return;

  const sampleJobs = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "full-time",
      salary: "$120,000 - $150,000",
      description:
        "We're looking for a talented frontend developer to join our growing team. You'll be responsible for building and maintaining our web applications using modern technologies.",
      requirements:
        "5+ years of experience with React, TypeScript, and modern frontend frameworks. Strong understanding of web performance and accessibility.",
      contactEmail: "hr@techcorp.com",
      postedBy: "sample-user-1",
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: [
        {
          id: "app-1",
          name: "John Smith",
          email: "john.smith@email.com",
          appliedAt: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
          coverLetter:
            "I'm excited to apply for this position. I have 6 years of experience with React and TypeScript, and I'm passionate about creating great user experiences.",
          resume: "john-smith-resume.pdf",
        },
      ],
    },
    {
      id: "2",
      title: "UX/UI Designer",
      company: "Design Studio",
      location: "New York, NY",
      type: "full-time",
      salary: "$90,000 - $120,000",
      description:
        "Join our creative team to design amazing user experiences. You'll work closely with product managers and developers to create intuitive and beautiful interfaces.",
      requirements:
        "3+ years of experience with Figma, Adobe Creative Suite, and user research. Strong portfolio demonstrating user-centered design.",
      contactEmail: "careers@designstudio.com",
      postedBy: "sample-user-2",
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: [],
    },
    {
      id: "3",
      title: "Backend Engineer",
      company: "DataFlow Systems",
      location: "Austin, TX",
      type: "full-time",
      salary: "$110,000 - $140,000",
      description:
        "Build scalable backend systems for our data platform. You'll work with Node.js, Python, and cloud technologies to create robust APIs and services.",
      requirements:
        "4+ years of experience with Node.js, Python, PostgreSQL, and AWS. Experience with microservices architecture.",
      contactEmail: "jobs@dataflow.com",
      postedBy: "sample-user-3",
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: [
        {
          id: "app-2",
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          appliedAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
          coverLetter:
            "I'm a backend engineer with 5 years of experience building scalable systems. I'm particularly interested in your data platform and would love to contribute to its growth.",
          resume: "sarah-johnson-resume.pdf",
        },
        {
          id: "app-3",
          name: "Mike Chen",
          email: "mike.chen@email.com",
          appliedAt: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
          coverLetter:
            "I have experience with the exact tech stack you're using and I'm excited about the opportunity to work on your data platform.",
          resume: "mike-chen-resume.pdf",
        },
      ],
    },
    {
      id: "4",
      title: "Product Manager",
      company: "InnovateTech",
      location: "Seattle, WA",
      type: "full-time",
      salary: "$130,000 - $160,000",
      description:
        "Lead product strategy and development for our SaaS platform. You'll work with cross-functional teams to define product vision and execute on roadmap.",
      requirements:
        "6+ years of product management experience. Strong analytical skills and experience with agile methodologies.",
      contactEmail: "talent@innovatetech.com",
      postedBy: "sample-user-4",
      postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: [],
    },
    {
      id: "5",
      title: "DevOps Engineer",
      company: "CloudScale",
      location: "Remote",
      type: "full-time",
      salary: "$100,000 - $130,000",
      description:
        "Manage our cloud infrastructure and deployment pipelines. You'll work with Docker, Kubernetes, and AWS to ensure our systems are scalable and reliable.",
      requirements:
        "3+ years of DevOps experience. Strong knowledge of Docker, Kubernetes, AWS, and CI/CD pipelines.",
      contactEmail: "careers@cloudscale.com",
      postedBy: "sample-user-5",
      postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      applicants: [],
    },
  ];

  localStorage.setItem("jobs", JSON.stringify(sampleJobs));
};
