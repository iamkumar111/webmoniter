export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "WebsMoniter",
        "url": "https://websmoniter.online", // Replace with actual domain
        "logo": "https://websmoniter.online/logo.png",
        "sameAs": [
            "https://twitter.com/websmoniter",
            "https://github.com/websmoniter",
            "https://linkedin.com/company/websmoniter"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-555-5555",
            "contactType": "customer service"
        }
    };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `https://websmoniter.online${item.item}`
        }))
    };
}

export function generateSoftwareAppSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "WebsMoniter",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Free website monitoring service to check uptime and SSL certificates.",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "5000"
        }
    };
}
