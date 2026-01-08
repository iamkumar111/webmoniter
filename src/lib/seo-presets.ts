
export const SEO_PRESETS: Record<string, {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    structuredData: any;
}> = {
    "home": {
        metaTitle: "WebsMonitor - Free Uptime Monitoring Service | Website Status",
        metaDescription: "Monitor your website uptime, SSL certificates, and APIs for free. Get instant downturn alerts via Email, Slack, & SMS. Start monitoring in seconds.",
        keywords: "uptime monitor, website monitoring, free status page, ping monitor, ssl check, api monitoring, server status",
        ogTitle: "WebsMonitor - Best Free Uptime Monitoring Tool",
        ogDescription: "Ensure your website is always online. 50 monitors for free, 1-minute checks, and instant alerts.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "WebsMonitor",
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
        metaTitle: "Pricing Patterns - Free Forever & Pro Plans | WebsMonitor",
        metaDescription: "Transparent pricing for every stage. Free plan includes 50 monitors. Pro plans start at $29/mo with 30-second checks and SMS alerts.",
        keywords: "uptime robot pricing, website monitoring cost, free vs pro monitoring, ssl monitoring price",
        ogTitle: "WebsMonitor Pricing - Simple & Affordable",
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
        metaTitle: "Features - SSL, Ping, Port & Keyword Monitoring | WebsMonitor",
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
                "name": "WebsMonitor"
            }
        }
    },
    "solutions": {
        metaTitle: "Monitoring Solutions for eCommerce, SaaS & DevOps | WebsMonitor",
        metaDescription: "Tailored monitoring solutions for eCommerce shops, SaaS platforms, and DevOps teams. Prevent revenue loss with instant downtime alerts.",
        keywords: "ecommerce uptime, saas monitoring, devops alerts, agency monitoring tools",
        ogTitle: "Industry Specific Monitoring Solutions",
        ogDescription: "See how WebsMonitor helps your specific industry stay online and profitable.",
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
        metaTitle: "WebsMonitor Documentation - API & Setup Guides",
        metaDescription: "Complete documentation for WebsMonitor. Learn how to configure monitors, set up status pages, and use our REST API.",
        keywords: "WebsMonitor api docs, uptime monitoring documentation, how to setup monitor",
        ogTitle: "WebsMonitor Developer Hub & Docs",
        ogDescription: "Master the platform with our comprehensive guides and API reference.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": "WebsMonitor Documentation",
            "description": "Technical documentation for WebsMonitor platform"
        }
    },
    "careers": {
        metaTitle: "Careers at WebsMonitor - Join the Reliability Team",
        metaDescription: "Help us build the most reliable monitoring service on the web. View open positions for Engineering, Design, and Support.",
        keywords: "remote engineering jobs, devops careers, startup jobs, WebsMonitor hiring",
        ogTitle: "Build the Future of Reliability",
        ogDescription: "We are hiring! Join a team obsessed with uptime and performance.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "WebsMonitor",
            "sameAs": "https://WebsMonitor.online",
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
        metaTitle: "About WebsMonitor - Our Mission & Story",
        metaDescription: "We believe a faster, more reliable internet is better for everyone. Learn about our team and why we built WebsMonitor.",
        keywords: "about WebsMonitor, company mission, uptime monitoring team",
        ogTitle: "About WebsMonitor",
        ogDescription: "Our mission is to make downtime a thing of the past.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "mainEntity": {
                "@type": "Organization",
                "name": "WebsMonitor",
                "foundingDate": "2024"
            }
        }
    },
    "contact": {
        metaTitle: "Contact Support - WebsMonitor Help Center",
        metaDescription: "Need help? Contact our 24/7 support team. We are here to assist with account issues, billing, and technical questions.",
        keywords: "contact WebsMonitor, uptime robot support, customer service",
        ogTitle: "Contact WebsMonitor Support",
        ogDescription: "Get in touch with our team. We respond to all queries within 24 hours.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "mainEntity": {
                "@type": "Organization",
                "name": "WebsMonitor",
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+1-555-0123-456",
                    "contactType": "customer support"
                }
            }
        }
    },
    "partners": {
        metaTitle: "Partner Program - Affiliate & Reseller | WebsMonitor",
        metaDescription: "Become a WebsMonitor partner. Earn recurring commissions by referring customers or reselling our monitoring solutions.",
        keywords: "affiliate program, reseller hosting, agency partnership",
        ogTitle: "WebsMonitor Partner Program",
        ogDescription: "Earn up to 30% recurring commission for every customer you refer.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "WebsMonitor Partner Program"
        }
    }
};

export const GLOBAL_PRESET = {
    defaultKeywords: "uptime monitoring, website status, server monitoring, ssl check, ping monitor, free uptime robot",
    defaultDescription: "WebsMonitor is the leading free website monitoring service. Get instant alerts when your site goes down. Monitor HTTP, HTTPS, Ping, Port, and SSL.",
    robotsTxt: "User-agent: *\nAllow: /\nDisallow: /dashboard/\nDisallow: /api/\nDisallow: /admin/\n\nSitemap: https://WebsMonitor.online/sitemap.xml",
    knowledgeGraph: {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "WebsMonitor",
        "url": "https://WebsMonitor.online",
        "logo": "https://WebsMonitor.online/logo.png",
        "sameAs": [
            "https://twitter.com/WebsMonitor",
            "https://github.com/WebsMonitor",
            "https://linkedin.com/company/WebsMonitor"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-0123-456",
            "contactType": "customer support"
        }
    }
};
