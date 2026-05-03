import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Plus } from 'lucide-react';
import Modal, { VideoForm } from '../components/Modal';
import VideoGrid from '../components/VideoGrid';
import { authAPI, videosAPI, settingsAPI } from '../api';
import { useAuthStore, useVideosStore } from '../store';
import { useTranslation } from '../i18n';

export const Admin = () => {
  const { isAuthenticated, setToken, logout } = useAuthStore();
  const { videos, settings, setVideos, setSettings, addVideo, updateVideo, removeVideo } = useVideosStore();
  const { t } = useTranslation();
  
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(!isAuthenticated);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchVideos();
      fetchSettings();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.login(password);
      setToken(response.data.token);
      setPassword('');
      setShowLoginForm(false);
      await fetchVideos();
      await fetchSettings();
    } catch (error) {
      setError(t('invalidPassword'));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await videosAPI.getAll();
      setVideos(response.data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
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

  const handleSaveVideo = async (formData) => {
    setIsLoading(true);
    try {
      if (editingVideo) {
        await videosAPI.update(editingVideo.id, formData);
        updateVideo(editingVideo.id, formData);
      } else {
        const response = await videosAPI.create(formData);
        addVideo(response.data);
      }
      setShowVideoModal(false);
      setEditingVideo(null);
    } catch (error) {
      setError(t('saveFailed'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!confirm(t('deleteConfirm'))) return;

    try {
      await videosAPI.delete(id);
      removeVideo(id);
    } catch (error) {
      setError(t('deleteFailed'));
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLoginForm(true);
  };

  const handleSettingChange = async (key, value) => {
    try {
      await settingsAPI.update(key, value);
      setSettings({ [key]: value });
    } catch (error) {
      setError(t('updateFailed'));
    }
  };

  if (showLoginForm) {
    return (
      <div className="min-h-screen bg-darker carbon-bg relative flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_32rem)] pointer-events-none" />

        <div className="relative z-10 max-w-md w-full">
          <div className="surface-panel p-8">
            <div className="flex justify-center mb-6">
              <Lock size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-center mb-2 text-white">{t('adminAccess')}</h1>
            <p className="text-center text-gray-400 mb-8">{t('enterPassword')}</p>

            {error && (
              <div className="mb-4 p-3 bg-danger/15 border border-danger/40 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                className="w-full px-4 py-3 bg-black border border-white/15 rounded-lg text-white placeholder-gray-600 focus:border-accent focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white text-black font-bold rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
              >
                {isLoading ? t('verifying') : t('login')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">
                {t('backToGallery')}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darker carbon-bg relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_32rem)] pointer-events-none" />

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-white/10 bg-black/70 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-soft">
                <span className="text-black font-black">VP</span>
              </div>
              <h1 className="text-2xl font-bold text-white">{t('adminPanel')}</h1>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-500 transition-colors"
            >
              <LogOut size={16} />
              {t('logout')}
            </button>
          </div>
        </nav>

        {/* Settings section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">{t('settings')}</h2>
            <div className="surface-panel p-6 space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoScroll}
                    onChange={(e) => handleSettingChange('autoScroll', e.target.checked)}
                    className="w-5 h-5"
                  />
                  <span className="text-white font-semibold">{t('autoScroll')}</span>
                </label>
              </div>

              {settings.autoScroll && (
                <div>
                  <label className="block text-sm font-semibold text-accent mb-2">
                    {t('autoScrollInterval')}
                  </label>
                  <input
                    type="number"
                    value={settings.autoScrollInterval}
                    onChange={(e) => handleSettingChange('autoScrollInterval', parseInt(e.target.value))}
                    min="1000"
                    step="500"
                    className="w-full px-4 py-2 bg-black border border-white/15 rounded-lg text-white focus:border-accent focus:outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">{t('minimumInterval')}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Videos management section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">{t('manageVideos')}</h2>
              <button
                onClick={() => {
                  setEditingVideo(null);
                  setShowVideoModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-accent transition-colors"
              >
                <Plus size={20} />
                {t('addVideo')}
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-danger/15 border border-danger/40 rounded-lg text-red-200">
                {error}
              </div>
            )}

            <VideoGrid
              videos={videos}
              autoScroll={settings.autoScroll}
              autoScrollInterval={settings.autoScrollInterval}
              onEditVideo={(video) => {
                setEditingVideo(video);
                setShowVideoModal(true);
              }}
              onDeleteVideo={handleDeleteVideo}
              isAdmin={true}
              t={t}
            />
          </div>
        </section>
      </div>

      {/* Video Modal */}
      <Modal
        isOpen={showVideoModal}
        title={editingVideo ? t('editVideo') : t('addNewVideo')}
        onClose={() => {
          setShowVideoModal(false);
          setEditingVideo(null);
        }}
      >
        <VideoForm
          video={editingVideo}
          onSubmit={handleSaveVideo}
          isLoading={isLoading}
          t={t}
        />
      </Modal>
    </div>
  );
};

export default Admin;
