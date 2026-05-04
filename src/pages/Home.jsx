import React, { useEffect } from 'react';
import VideoGrid from '../components/VideoGrid';
import { videosAPI, settingsAPI } from '../api';
import { useVideosStore } from '../store';
import { useTranslation } from '../i18n';

export const Home = () => {
  const { videos, settings, loading, error, setVideos, setSettings, setLoading, setError } = useVideosStore();
  const { language, t } = useTranslation();

  useEffect(() => {
    fetchVideos();
    fetchSettings();
  }, []);

  useEffect(() => {
    const title = t('seoTitle');
    const description = t('seoDescription');
    const keywords = t('seoKeywords');
    const siteUrl = window.location.origin;
    const canonicalUrl = `${siteUrl}/`;

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setCanonical(canonicalUrl);
    setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Adam Video Edits',
      url: canonicalUrl,
      email: ['adam_polczynski@yahoo.com', 'beatchemik@gmail.com'],
      telephone: '+48 786 189 122',
      areaServed: 'Worldwide',
      description,
      founder: {
        '@type': 'Person',
        name: 'Adam Polczynski',
      },
      serviceType: [
        'AI video editing',
        'Video object removal',
        'Video object replacement',
        'AI video inpainting',
        'Video cleanup',
        'Before and after transformation editing',
        'Long-form video editing',
      ],
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        category: 'AI video editing service',
      },
    });
  }, [language, t]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await videosAPI.getAll();
      setVideos(response.data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setError(t('videoLoadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getAll();
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  return (
    <div className="min-h-screen bg-darker carbon-bg relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_32rem)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation bar */}
        <nav className="border-b border-white/10 bg-black/70 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center shadow-soft">
                <span className="font-black">AVE</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-normal text-white">{t('brandTitle')}</h1>
            </div>
          </div>
        </nav>

        {/* Hero section */}
        <section className="pt-10 pb-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl sm:text-6xl font-black mb-4 text-white">
              {t('transformations')}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('videosIntro')}
            </p>
            <p className="mt-3 text-base text-gray-400 max-w-3xl mx-auto">
              {t('contactIntro')}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label={t('servicesLabel')}>
              {t('servicePills').map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-sm text-gray-200"
                >
                  {service}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-col items-center gap-1.5 text-base">
              <a
                href="mailto:adam_polczynski@yahoo.com"
                className="text-white hover:text-accent transition-colors"
              >
                adam_polczynski@yahoo.com
              </a>
              <a
                href="mailto:beatchemik@gmail.com"
                className="text-white hover:text-accent transition-colors"
              >
                beatchemik@gmail.com
              </a>
              <a
                href="https://wa.me/48786189122"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-accent transition-colors"
              >
                WhatsApp: +48 786 189 122
              </a>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto grid gap-4 md:grid-cols-3">
            {t('positioningCards').map((card) => (
              <article key={card.title} className="surface-panel p-5">
                <h3 className="text-lg font-bold text-white">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-300">{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="border-y border-white/10 py-5">
              <h2 className="text-2xl font-black text-white">{t('servicesHeading')}</h2>
              <p className="mt-2 max-w-4xl text-gray-300 leading-7">{t('servicesCopy')}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {t('searchServices').map((service) => (
                  <div key={service} className="text-sm text-gray-200">
                    {service}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Videos grid */}
        <section className="pt-4 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-screen-2xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-pulse">
                  <div className="mx-auto mb-4 h-10 w-10 rounded-full border border-white/20 border-t-accent" />
                  <p className="text-gray-300">{t('loadingVideos')}</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-danger text-lg">{error}</p>
              </div>
            ) : (
              <VideoGrid
                videos={videos}
                autoScroll={settings.autoScroll}
                autoScrollInterval={settings.autoScrollInterval}
                columns={settings.galleryColumns}
                t={t}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const setMeta = (attribute, key, content) => {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const setCanonical = (href) => {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
};

const setStructuredData = (data) => {
  const id = 'service-schema';
  let element = document.getElementById(id);

  if (!element) {
    element = document.createElement('script');
    element.id = id;
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
};

export default Home;
