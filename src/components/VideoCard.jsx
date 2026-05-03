import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import VideoSlider from './VideoSlider';

export const VideoCard = ({ 
  video, 
  autoScroll = false, 
  autoScrollInterval = 5000,
  onEdit = null,
  onDelete = null,
  onMove = null,
  canMoveUp = false,
  canMoveDown = false,
  isAdmin = false,
  t = (key) => key,
}) => {
  const effectiveAutoScroll = video.auto_scroll_mode === 'on'
    ? true
    : video.auto_scroll_mode === 'off'
      ? false
      : autoScroll;

  return (
    <div className="group">
      <div className="relative">
        <VideoSlider 
          beforeUrl={video.before_video} 
          afterUrl={video.after_video}
          title={video.title}
          autoScroll={effectiveAutoScroll}
          autoScrollInterval={autoScrollInterval}
          fitMode={video.fit_mode || 'contain'}
          t={t}
        />
        
        {/* Admin controls overlay */}
        {isAdmin && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/70 backdrop-blur-sm rounded-lg flex flex-wrap items-center justify-center gap-2 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
            {onMove && (
              <>
                <button
                  onClick={() => onMove(video.id, -1)}
                  disabled={!canMoveUp}
                  className="p-2 bg-white text-black rounded-lg font-semibold hover:bg-accent transition-colors pointer-events-auto disabled:opacity-40 disabled:hover:bg-white"
                  title={t('moveUp')}
                  aria-label={t('moveUp')}
                >
                  <ArrowUp size={18} />
                </button>
                <button
                  onClick={() => onMove(video.id, 1)}
                  disabled={!canMoveDown}
                  className="p-2 bg-white text-black rounded-lg font-semibold hover:bg-accent transition-colors pointer-events-auto disabled:opacity-40 disabled:hover:bg-white"
                  title={t('moveDown')}
                  aria-label={t('moveDown')}
                >
                  <ArrowDown size={18} />
                </button>
              </>
            )}
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
      </div>
    </div>
  );
};

export default VideoCard;
