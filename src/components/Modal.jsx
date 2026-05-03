import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { uploadAPI } from '../api';

export const Modal = ({ 
  isOpen, 
  title, 
  onClose, 
  children 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="surface-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const VideoForm = ({ 
  video = null, 
  onSubmit, 
  isLoading = false,
  t = (key) => key,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    before_video: '',
    after_video: '',
    auto_scroll_mode: 'global',
    fit_mode: 'contain',
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    before: null,
    after: null,
  });
  const [uploadingField, setUploadingField] = useState(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (video) {
      setFormData({
        ...video,
        auto_scroll_mode: video.auto_scroll_mode || 'global',
        fit_mode: video.fit_mode || 'contain',
      });
    }
  }, [video]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError('');
    setUploadingField(field);

    try {
      const response = await uploadAPI.uploadVideo(file);
      const fieldName = field === 'before' ? 'before_video' : 'after_video';

      setFormData(prev => ({ ...prev, [fieldName]: response.data.url }));
      setUploadedFiles(prev => ({
        ...prev,
        [field]: file.name
      }));
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(t('uploadFailed'));
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          {t('videoTitle')} *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder={t('formTitlePlaceholder')}
          className="w-full px-4 py-2 bg-black border border-white/15 rounded-lg text-white focus:border-accent focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          {t('description')}
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder={t('descriptionPlaceholder')}
          rows="3"
          className="w-full px-4 py-2 bg-black border border-white/15 rounded-lg text-white focus:border-accent focus:outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            {t('beforeVideo')} *
          </label>
          <input
            type="text"
            name="before_video"
            value={formData.before_video}
            onChange={handleInputChange}
            placeholder={t('videoUrlPlaceholder')}
            className="w-full px-4 py-2 bg-black border border-white/15 rounded-lg text-white focus:border-accent focus:outline-none"
            required
          />
          <label className="mt-2 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-white/15 rounded-lg cursor-pointer hover:border-accent transition-colors">
            <Upload size={16} />
            <span className="text-sm">{uploadingField === 'before' ? t('uploading') : t('upload')}</span>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileUpload(e, 'before')}
              className="hidden"
            />
          </label>
          {uploadedFiles.before && <p className="text-xs text-gray-400 mt-1 truncate">{uploadedFiles.before}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            {t('afterVideo')} *
          </label>
          <input
            type="text"
            name="after_video"
            value={formData.after_video}
            onChange={handleInputChange}
            placeholder={t('videoUrlPlaceholder')}
            className="w-full px-4 py-2 bg-black border border-white/15 rounded-lg text-white focus:border-accent focus:outline-none"
            required
          />
          <label className="mt-2 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-white/15 rounded-lg cursor-pointer hover:border-accent transition-colors">
            <Upload size={16} />
            <span className="text-sm">{uploadingField === 'after' ? t('uploading') : t('upload')}</span>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileUpload(e, 'after')}
              className="hidden"
            />
          </label>
          {uploadedFiles.after && <p className="text-xs text-gray-400 mt-1 truncate">{uploadedFiles.after}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          {t('videoAutoScroll')}
        </label>
        <select
          name="auto_scroll_mode"
          value={formData.auto_scroll_mode}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-black border border-white/15 rounded-lg text-white focus:border-accent focus:outline-none"
        >
          <option value="global">{t('videoAutoScrollGlobal')}</option>
          <option value="on">{t('videoAutoScrollOn')}</option>
          <option value="off">{t('videoAutoScrollOff')}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          {t('videoFitMode')}
        </label>
        <select
          name="fit_mode"
          value={formData.fit_mode}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-black border border-white/15 rounded-lg text-white focus:border-accent focus:outline-none"
        >
          <option value="contain">{t('videoFitContain')}</option>
          <option value="cover">{t('videoFitCover')}</option>
        </select>
      </div>

      {uploadError && (
        <div className="p-3 bg-danger/15 border border-danger/40 rounded-lg text-red-200 text-sm">
          {uploadError}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || Boolean(uploadingField)}
          className="flex-1 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
        >
          {isLoading ? t('saving') : video ? t('updateVideo') : t('createVideo')}
        </button>
      </div>
    </form>
  );
};

export default Modal;
