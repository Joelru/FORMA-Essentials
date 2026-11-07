import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { BROW_SERVICES } from '../data/seedData';

interface SEOHeadProps {
  activeView: 'store' | 'admin';
}

export const SEOHead: React.FC<SEOHeadProps> = ({ activeView }) => {
  const { products, settings, selectedProductModal } = useStore();

  useEffect(() => {
    const baseUrl = window.location.origin;

    // 1. Dynamic Title & Meta Description
    if (activeView === 'admin') {
      document.title = 'FORMA | Panel de Administración';
    } else if (selectedProductModal) {
      document.title = `${selectedProductModal.name} | FORMA por Eslen — Ocaña`;
    } else {
      document.title =
        'FORMA — Estudio de Cejas & Cuidado Facial por Eslen | Ocaña, N. de S.';
    }

    const descriptionText = selectedProductModal
      ? `${selectedProductModal.name} en Ocaña ($${selectedProductModal.price.toLocaleString('es-CO')} COP). ${selectedProductModal.description} Entrega rápida en Ocaña, pago contra entrega, Nequi o Daviplata.`
      : 'FORMA Estudio & Cosmética por Eslen en Ocaña, Norte de Santander. Diseño profesional de cejas, visagismo, laminado (Brow Lamination) y productos de cuidado para cejas, pestañas y rostro con domicilio rápido.';

    const setMeta = (selector: string, attr: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[property=')) {
          const prop = selector.match(/property="([^"]+)"/)?.[1];
          if (prop) el.setAttribute('property', prop);
        } else {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) el.setAttribute('name', name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, content);
    };

    setMeta('meta[name="description"]', 'content', descriptionText);
    setMeta(
      'meta[name="robots"]',
      'content',
      activeView === 'admin'
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    setMeta('meta[property="og:title"]', 'content', document.title);
    setMeta('meta[property="og:description"]', 'content', descriptionText);
    setMeta(
      'meta[property="og:image"]',
      'content',
      selectedProductModal?.image?.startsWith('http')
        ? selectedProductModal.image
        : `${baseUrl}${selectedProductModal?.image || '/hero-brows.jpg'}`
    );

    // Canonical Link
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${baseUrl}/`);

    // 2. Dynamic JSON-LD Structured Data for Google Rich Results
    if (activeView === 'admin') return;

    const activeProducts = products.filter((p) => !p.paused);

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['BeautySalon', 'Store', 'LocalBusiness'],
          '@id': `${baseUrl}/#organization`,
          name: 'FORMA — Estudio & Cosmética por Eslen',
          alternateName: ['FORMA Estudio y Cosmética', 'FORMA por Eslen Ocaña', 'FORMA Essentials'],
          description:
            'Estudio especializado en diseño arquitectónico de cejas, visagismo áureo, laminado de cejas (Brow Lamination) y productos de cuidado para cejas, pestañas y rostro en Ocaña, Norte de Santander.',
          url: `${baseUrl}/`,
          logo: `${baseUrl}/forma-logo.png`,
          image: [
            `${baseUrl}/hero-brows.jpg`,
            `${baseUrl}/eslen-profile.jpg`,
            `${baseUrl}/forma-serum.jpg`,
          ],
          telephone: `+57${settings.whatsappNumber.replace(/\D/g, '')}`,
          priceRange: '$$',
          currenciesAccepted: 'COP',
          paymentAccepted: 'Efectivo Contra Entrega, Nequi, Daviplata, Transferencia',
          founder: {
            '@type': 'Person',
            name: settings.ownerName || 'Eslen',
            jobTitle: 'Especialista en Visagismo y Diseño de Cejas (Brow Artist)',
            image: `${baseUrl}/eslen-profile.jpg`,
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: settings.studioAddress,
            addressLocality: 'Ocaña',
            addressRegion: 'Norte de Santander',
            postalCode: '546560',
            addressCountry: 'CO',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 8.2377,
            longitude: -73.356,
          },
          areaServed: {
            '@type': 'City',
            name: 'Ocaña',
            containedInPlace: {
              '@type': 'AdministrativeArea',
              name: 'Norte de Santander, Colombia',
            },
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ],
              opens: '08:30',
              closes: '18:30',
            },
          ],
          sameAs: [settings.instagramUrl, settings.tiktokUrl].filter(Boolean),
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '450',
            bestRating: '5',
            worstRating: '1',
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Servicios de Diseño de Cejas y Catálogo de Cuidado FORMA',
            itemListElement: BROW_SERVICES.map((srv) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: srv.name,
                description: srv.description,
                provider: {
                  '@id': `${baseUrl}/#organization`,
                },
                areaServed: 'Ocaña, Norte de Santander',
              },
              price: srv.price,
              priceCurrency: 'COP',
            })),
          },
        },
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: `${baseUrl}/`,
          name: 'FORMA — Estudio & Cosmética por Eslen | Ocaña',
          inLanguage: 'es-CO',
          publisher: {
            '@id': `${baseUrl}/#organization`,
          },
        },
        {
          '@type': 'ItemList',
          '@id': `${baseUrl}/#catalog`,
          name: 'Catálogo Oficial de Cuidado de Cejas, Pestañas y Rostro FORMA Ocaña',
          numberOfItems: activeProducts.length,
          itemListElement: activeProducts.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              '@id': `${baseUrl}/#product-${product.id}`,
              sku: product.id,
              name: product.name,
              description: product.description,
              category: product.category,
              image: product.image.startsWith('http')
                ? product.image
                : `${baseUrl}${product.image}`,
              brand: {
                '@type': 'Brand',
                name: 'FORMA',
              },
              offers: {
                '@type': 'Offer',
                url: `${baseUrl}/#catalogo`,
                priceCurrency: 'COP',
                price: product.price,
                itemCondition: 'https://schema.org/NewCondition',
                availability:
                  product.stock > 0 && !product.paused
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
                seller: {
                  '@id': `${baseUrl}/#organization`,
                },
              },
            },
          })),
        },
        {
          '@type': 'FAQPage',
          '@id': `${baseUrl}/#faq`,
          mainEntity: [
            {
              '@type': 'Question',
              name: '¿Dónde agendar diseño y laminado de cejas en Ocaña, Norte de Santander?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'En FORMA Estudio & Cosmética por Eslen en Ocaña puedes agendar tu cita de diseño de cejas con visagismo áureo, sombreado semipermanente y laminado de cejas (Brow Lamination) directamente desde nuestra página web.',
              },
            },
            {
              '@type': 'Question',
              name: '¿Tienen domicilios de productos de cuidado de cejas y rostro con pago contra entrega en Ocaña?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Sí, FORMA realiza despachos rápidos el mismo día en todos los barrios del casco urbano de Ocaña, Norte de Santander. Aceptamos Pago Contra Entrega en efectivo, Nequi y Daviplata.',
              },
            },
          ],
        },
      ],
    };

    let scriptEl = document.getElementById('forma-jsonld-seo') as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'forma-jsonld-seo';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(structuredData);
  }, [activeView, products, settings, selectedProductModal]);

  return null;
};
