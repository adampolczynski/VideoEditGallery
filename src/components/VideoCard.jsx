import React from 'react';
import VideoSlider from './VideoSlider';

export const VideoCard = ({ 
  video, 
  autoScroll = false, 
  autoScrollInterval = 5000,
  onEdit = null,
  onDelete = null,
  isAdmin = false,
  t = (key) => key,
}) => {
  return (
    <div className="group">
      <div className="relative">
        <VideoSlider 
          beforeUrl={video.before_video} 
          afterUrl={video.after_video}
          title={video.title}
          autoScroll={autoScroll}
          autoScrollInterval={autoScrollInterval}
          t={t}
        />
        
        {/* Admin controls overlay */}
        {isAdmin && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center gap-2 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
            {onEdit && (
              <button
                onClick={() => onEdit(video)}
                className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-accent transition-colors pointer-events-auto"
              >
                {t('edit')}
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(video.id)}
                className="px-4 py-2 bg-danger text-white rounded-lg font-semibold hover:bg-red-500 transition-colors pointer-events-auto"
              >
                {t('delete')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 p-3 surface-panel">
        <h3 className="text-lg font-bold text-white truncate">{video.title}</h3>
        {video.description && (
          <p className="text-sm text-gray-400 line-clamp-2 mt-1">{video.description}</p>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
