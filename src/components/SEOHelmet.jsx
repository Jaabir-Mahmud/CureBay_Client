import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHelmet = ({ 
  title = 'CureBay - Your Trusted Healthcare Partner',
  description = 'CureBay is your trusted online pharmacy offering quality medicines, expert care, and fast delivery. Browse our extensive collection of medicines and healthcare products.',
  keywords = 'online pharmacy, medicines, healthcare, prescription drugs, medical supplies, pharmacy delivery, health products',
  image = '/logo.png',
  url = window.location.href,
  type = 'website',
  siteName = 'CureBay',
  twitterCard = 'summary_large_image'
}) => {
  const canonicalUrl = url.split('?')[0]; // Remove query parameters for canonical URL
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="CureBay" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@curebay" />
      <meta name="twitter:creator" content="@curebay" />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      
      {/* Structured Data for Healthcare */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Pharmacy",
          "name": "CureBay",
          "description": description,
          "url": "https://curebay.com",
          "logo": image,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "306 Chapmans Lane",
            "addressLocality": "San Ysidro",
            "addressRegion": "NM",
            "postalCode": "87053",
            "addressCountry": "US"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-123-4567",
            "contactType": "Customer Service",
            "availableLanguage": ["English", "Spanish"]
          },
          "openingHours": "Mo-Su 00:00-23:59",
          "sameAs": [
            "https://facebook.com/curebay",
            "https://twitter.com/curebay",
            "https://instagram.com/curebay"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEOHelmet;