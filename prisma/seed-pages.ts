import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const pages = [
    {
      slug: "home",
      title: "Home Page",
      data: {
        heroTitle: "Monitor Your Digital World",
        heroSubtitle: "Ensure 99.99% uptime with our advanced monitoring solution. Real-time alerts, SSL tracking, and detailed analytics in one dashboard.",
        heroButtonStart: "Start Monitoring Now",
        heroButtonExplore: "Explore Features",
        badgeText: "New Generation Monitoring",
        statsMonitors: "5M+",
        statsNotifications: "10B+",
        statsUptime: "99.9%",
        statsSupport: "24/7",
      }
    },
    {
      slug: "about",
      title: "About Us",
      data: {
        title: "About WebMoniter",
        subtitle: "We are on a mission to make the internet more reliable.",
        intro: "Founded in 2026, WebMoniter started with a simple idea: website downtime shouldn't be a mystery. We built a platform that not only tells you when your site is down, but why.",
        mission: "Today, thousands of developers, startups, and enterprises trust us to keep a watchful eye on their digital assets. Our global network of monitoring nodes ensures that we see what your users see, no matter where they are."
      }
    },
    {
      slug: "contact",
      title: "Contact Us",
      data: {
        title: "Get in touch",
        subtitle: "Have a question about our pricing, features, or need support? We're here to help.",
        emailTitle: "Email Us",
        emailDesc: "Our team typically responds within 2 hours.",
        addressTitle: "Visit Us",
        addressDesc: "28 Sandy Pond Pky, Bedford, New Hampshire(NH), 03110",
        phoneTitle: "Call Us",
        phoneDesc: "Mon-Fri from 8am to 5pm."
      }
    },
    {
      slug: "footer",
      title: "Footer Content",
      data: {
        description: "Ensuring the reliability of the internet, one monitor at a time. Join thousands of developers who trust us.",
        copyright: "© 2026 WebMoniter Inc. All rights reserved."
      }
    }
  ];

  for (const page of pages) {
    await prisma.pageContent.upsert({
      where: { slug: page.slug },
      update: { title: page.title, data: page.data },
      create: { slug: page.slug, title: page.title, data: page.data },
    });
  }

  // Update default social links if not set
  await prisma.systemSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      socialTwitter: "#",
      socialGithub: "#",
      socialLinkedin: "#",
      socialFacebook: "#"
    }
  });

  console.log('Page content seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
