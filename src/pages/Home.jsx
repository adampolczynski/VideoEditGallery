import React, { useEffect } from 'react';
import VideoGrid from '../components/VideoGrid';
import { videosAPI, settingsAPI } from '../api';
import { useVideosStore } from '../store';
import { useTranslation } from '../i18n';

export const Home = () => {
  const { videos, settings, loading, error, setVideos, setSettings, setLoading, setError } = useVideosStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchVideos();
    fetchSettings();
  }, []);

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
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('videosIntro')}
            </p>
            <p className="mt-3 text-base text-gray-400 max-w-3xl mx-auto">
              {t('contactIntro')}
            </p>
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

        {/* Videos grid */}
        <section className="pt-4 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
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

export default Home;
