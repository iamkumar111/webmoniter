import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const blogs = [
    {
      title: "The Future of Server Monitoring in 2025",
      slug: "future-of-server-monitoring-2025",
      excerpt: "Explore how AI and ML are revolutionizing the way we monitor infrastructure.",
      content: "As we move into 2025, server monitoring is no longer just about uptime. It's about predictive analytics...",
      date: new Date("2025-12-15"),
      category: "Monitoring",
      author: "Admin",
    },
    {
      title: "Transitioning to Cloud Native: A DevOps Perspective",
      slug: "transitioning-to-cloud-native",
      excerpt: "Best practices for moving your legacy infrastructure to the cloud.",
      content: "Cloud native isn't just about where you host; it's about how you build...",
      date: new Date("2025-10-10"),
      category: "Cloud",
      author: "DevOps Team",
    },
    {
      title: "Mastering Zero Downtime Deployments",
      slug: "mastering-zero-downtime-deployments",
      excerpt: "Learn how to deploy updates without interrupting your users.",
      content: "The goal of every modern DevOps team is to deploy code multiple times a day without friction...",
      date: new Date("2025-08-22"),
      category: "DevOps",
      author: "Site Reliability Engineer",
    },
    {
      title: "SSL Certificates: Why Monitoring Them is Crucial",
      slug: "ssl-certificates-monitoring-crucial",
      excerpt: "Prevent catastrophic outages by tracking SSL expiry dates automatically.",
      content: "An expired SSL certificate is one of the most common causes of preventable downtime...",
      date: new Date("2025-06-05"),
      category: "Security",
      author: "Security Analyst",
    },
    {
      title: "The Impact of Latency on User Experience",
      slug: "impact-of-latency-on-ux",
      excerpt: "How a few milliseconds can affect your conversion rates.",
      content: "In the digital world, speed is a feature. High latency leads to user frustration...",
      date: new Date("2025-04-12"),
      category: "Performance",
      author: "Product Manager",
    },
    {
      title: "Automating Infrastructure with Terraform",
      slug: "automating-infrastructure-terraform",
      excerpt: "Infrastructure as Code (IaC) simplified for beginners.",
      content: "Manual server configuration is a thing of the past. Terraform allows you to define your stack in code...",
      date: new Date("2025-02-28"),
      category: "DevOps",
      author: "Cloud Architect",
    },
    {
      title: "Understanding HTTP/3 and the Future of the Web",
      slug: "understanding-http3",
      excerpt: "What the latest version of the HTTP protocol means for your monitoring.",
      content: "HTTP/3 is built on QUIC and brings significant performance improvements...",
      date: new Date("2024-12-30"),
      category: "Networking",
      author: "Network Engineer",
    },
    {
      title: "Proactive vs Reactive Monitoring",
      slug: "proactive-vs-reactive-monitoring",
      excerpt: "Why waiting for an alert is already too late.",
      content: "Reactive monitoring tells you when something is broken. Proactive monitoring tells you it's about to break...",
      date: new Date("2024-11-15"),
      category: "Strategy",
      author: "CTO",
    },
    {
      title: "Cost Optimization in AWS and Azure",
      slug: "cost-optimization-cloud",
      excerpt: "How to reduce your cloud bill without sacrificing performance.",
      content: "Cloud costs can spiral out of control if not managed properly. Identifying idle resources is key...",
      date: new Date("2024-09-20"),
      category: "Cloud",
      author: "FinOps Specialist",
    },
    {
      title: "The Rise of Edge Computing",
      slug: "rise-of-edge-computing",
      excerpt: "Bringing compute power closer to the user.",
      content: "Edge computing reduces latency by processing data at the edge of the network...",
      date: new Date("2024-07-18"),
      category: "Architecture",
      author: "Tech Visionary",
    },
    {
      title: "Getting Started with websmonitor",
      slug: "getting-started-websmonitor",
      excerpt: "How to set up your first monitor in under 60 seconds.",
      content: "Welcome to websmonitor. We've designed our platform to be as simple as possible...",
      date: new Date("2024-06-19"),
      category: "Announcements",
      author: "Founder",
    },
  ];

  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: blog,
      create: blog,
    });
  }

  console.log('11 blogs seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
