
export const SEO_PRESETS: Record<string, {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    structuredData: any;
}> = {
    "home": {
        metaTitle: "WebsMoniter - Free Uptime Monitoring Service | Website Status",
        metaDescription: "Monitor your website uptime, SSL certificates, and APIs for free. Get instant downturn alerts via Email, Slack, & SMS. Start monitoring in seconds.",
        keywords: "uptime monitor, website monitoring, free status page, ping monitor, ssl check, api monitoring, server status",
        ogTitle: "WebsMoniter - Best Free Uptime Monitoring Tool",
        ogDescription: "Ensure your website is always online. 50 monitors for free, 1-minute checks, and instant alerts.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "WebsMoniter",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Web",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            }
        }
    },
    "pricing": {
        metaTitle: "Pricing Patterns - Free Forever & Pro Plans | WebsMoniter",
        metaDescription: "Transparent pricing for every stage. Free plan includes 50 monitors. Pro plans start at $29/mo with 30-second checks and SMS alerts.",
        keywords: "uptime robot pricing, website monitoring cost, free vs pro monitoring, ssl monitoring price",
        ogTitle: "WebsMoniter Pricing - Simple & Affordable",
        ogDescription: "Start for free. Scale when you need to. No hidden fees or contracts.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "PriceSpecification",
            "price": "0.00",
            "priceCurrency": "USD",
            "name": "Free Tier"
        }
    },
    "features": {
        metaTitle: "Features - SSL, Ping, Port & Keyword Monitoring | WebsMoniter",
        metaDescription: "Explore our comprehensive monitoring features: SSL expiration alerts, keyword tracking, ping monitoring, and beautiful public status pages.",
        keywords: "ssl monitoring, keyword monitoring, port monitoring, status pages, cron job monitoring",
        ogTitle: "Everything You Need to Monitor Your Infrastructure",
        ogDescription: "From simple ping checks to complex API transaction monitoring. We have it all.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Website Monitoring",
            "provider": {
                "@type": "Organization",
                "name": "WebsMoniter"
            }
        }
    },
    "solutions": {
        metaTitle: "Monitoring Solutions for eCommerce, SaaS & DevOps | WebsMoniter",
        metaDescription: "Tailored monitoring solutions for eCommerce shops, SaaS platforms, and DevOps teams. Prevent revenue loss with instant downtime alerts.",
        keywords: "ecommerce uptime, saas monitoring, devops alerts, agency monitoring tools",
        ogTitle: "Industry Specific Monitoring Solutions",
        ogDescription: "See how WebsMoniter helps your specific industry stay online and profitable.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "For eCommerce"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "For SaaS"
                }
            ]
        }
    },
    "docs": {
        metaTitle: "WebsMoniter Documentation - API & Setup Guides",
        metaDescription: "Complete documentation for WebsMoniter. Learn how to configure monitors, set up status pages, and use our REST API.",
        keywords: "websmoniter api docs, uptime monitoring documentation, how to setup monitor",
        ogTitle: "WebsMoniter Developer Hub & Docs",
        ogDescription: "Master the platform with our comprehensive guides and API reference.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": "WebsMoniter Documentation",
            "description": "Technical documentation for WebsMoniter platform"
        }
    },
    "careers": {
        metaTitle: "Careers at WebsMoniter - Join the Reliability Team",
        metaDescription: "Help us build the most reliable monitoring service on the web. View open positions for Engineering, Design, and Support.",
        keywords: "remote engineering jobs, devops careers, startup jobs, websmoniter hiring",
        ogTitle: "Build the Future of Reliability",
        ogDescription: "We are hiring! Join a team obsessed with uptime and performance.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "WebsMoniter",
            "sameAs": "https://websmoniter.online",
            "jobLocation": {
                "@type": "Place",
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "Remote"
                }
            }
        }
    },
    "about": {
        metaTitle: "About WebsMoniter - Our Mission & Story",
        metaDescription: "We believe a faster, more reliable internet is better for everyone. Learn about our team and why we built WebsMoniter.",
        keywords: "about websmoniter, company mission, uptime monitoring team",
        ogTitle: "About WebsMoniter",
        ogDescription: "Our mission is to make downtime a thing of the past.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "mainEntity": {
                "@type": "Organization",
                "name": "WebsMoniter",
                "foundingDate": "2024"
            }
        }
    },
    "contact": {
        metaTitle: "Contact Support - WebsMoniter Help Center",
        metaDescription: "Need help? Contact our 24/7 support team. We are here to assist with account issues, billing, and technical questions.",
        keywords: "contact websmoniter, uptime robot support, customer service",
        ogTitle: "Contact WebsMoniter Support",
        ogDescription: "Get in touch with our team. We respond to all queries within 24 hours.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "mainEntity": {
                "@type": "Organization",
                "name": "WebsMoniter",
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+1-555-0123-456",
                    "contactType": "customer support"
                }
            }
        }
    },
    "partners": {
        metaTitle: "Partner Program - Affiliate & Reseller | WebsMoniter",
        metaDescription: "Become a WebsMoniter partner. Earn recurring commissions by referring customers or reselling our monitoring solutions.",
        keywords: "affiliate program, reseller hosting, agency partnership",
        ogTitle: "WebsMoniter Partner Program",
        ogDescription: "Earn up to 30% recurring commission for every customer you refer.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "WebsMoniter Partner Program"
        }
    }
};

export const GLOBAL_PRESET = {
    defaultKeywords: "uptime monitoring, website status, server monitoring, ssl check, ping monitor, free uptime robot",
    defaultDescription: "WebsMoniter is the leading free website monitoring service. Get instant alerts when your site goes down. Monitor HTTP, HTTPS, Ping, Port, and SSL.",
    robotsTxt: "User-agent: *\nAllow: /\nDisallow: /dashboard/\nDisallow: /api/\nDisallow: /admin/\n\nSitemap: https://websmoniter.online/sitemap.xml",
    knowledgeGraph: {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "WebsMoniter",
        "url": "https://websmoniter.online",
        "logo": "https://websmoniter.online/logo.png",
        "sameAs": [
            "https://twitter.com/websmoniter",
            "https://github.com/websmoniter",
            "https://linkedin.com/company/websmoniter"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-0123-456",
            "contactType": "customer support"
        }
    }
};
