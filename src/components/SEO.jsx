import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title = "BlintAI - Encuentra lugares ideales con Inteligencia Artificial",
  description = "Descubre los mejores lugares cerca de ti usando IA. Selecciona tu ubicación, describe tus intereses y encuentra restaurantes, cafés, parques y más lugares perfectos para ti.",
  keywords = "IA, inteligencia artificial, lugares, restaurantes, cafés, parques, búsqueda de lugares, recomendaciones, ubicación, mapas, Google Maps",
  image = "https://blintapp.vercel.app/logo.png",
  url = "https://blintapp.vercel.app",
  type = "website"
}) {
  useEffect(() => {
    // Actualizar el título de la página
    document.title = title;
    
    // Scroll to top en navegación
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <Helmet>
      {/* Meta tags básicos */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="BlintAI" />
      <meta property="og:locale" content="es_ES" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "BlintAI",
          "description": description,
          "url": url,
          "applicationCategory": "TravelApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "creator": {
            "@type": "Organization",
            "name": "BlintAI"
          },
          "featureList": [
            "Búsqueda de lugares con IA",
            "Recomendaciones personalizadas", 
            "Integración con Google Maps",
            "Análisis de intereses del usuario"
          ]
        })}
      </script>
    </Helmet>
  );
} 