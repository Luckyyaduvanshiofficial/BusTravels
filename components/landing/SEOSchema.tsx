import { FAQ_DATA, VEHICLE_TYPES, POPULAR_ROUTES } from '@/lib/data/landing'

export function SEOSchema() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "BusYatra",
    "image": "https://busbookingapp.com/images/logo.png",
    "@id": "https://busbookingapp.com/#organization",
    "url": "https://busbookingapp.com",
    "telephone": "+919876543210",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Tonk Road",
      "addressLocality": "Jaipur",
      "addressRegion": "Rajasthan",
      "postalCode": "302015",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.9124,
      "longitude": 75.7873
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://www.facebook.com/BusYatra",
      "https://www.instagram.com/BusYatra",
      "https://twitter.com/BusYatra"
    ]
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  const vehicleRentalSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "name": "BusYatra Vehicle Rentals",
    "description": "Premium bus and tempo traveller rentals in Jaipur for weddings, tours, and corporate trips.",
    "url": "https://busbookingapp.com",
    "offers": VEHICLE_TYPES.map(v => ({
      "@type": "Offer",
      "name": `${v.label} Rental`,
      "description": v.description,
      "availability": "https://schema.org/InStock",
      "itemOffered": {
        "@type": "Vehicle",
        "name": v.label,
        "vehicleCapacity": v.capacity
      }
    }))
  }

  const routesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": POPULAR_ROUTES.map((route, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "TravelAction",
        "name": `Bus from ${route.from} to ${route.to}`,
        "distance": route.distance,
        "priceSpecification": {
          "@type": "PriceSpecification",
          "priceCurrency": "INR",
          "description": route.priceRange
        }
      }
    }))
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleRentalSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(routesSchema) }} />
    </>
  )
}
