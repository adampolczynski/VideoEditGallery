import React from 'react';
import VideoCard from './VideoCard';

export const VideoGrid = ({ 
  videos = [], 
  autoScroll = false, 
  autoScrollInterval = 5000,
  columns = 3,
  onEditVideo = null,
  onDeleteVideo = null,
  onMoveVideo = null,
  isAdmin = false,
  t = (key) => key,
}) => {
  if (!videos || videos.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-white/15 bg-white/5" />
          <p className="text-gray-300 text-lg">{t('noVideos')}</p>
        </div>
      </div>
    );
  }

  const desktopColumns = Math.min(5, Math.max(2, Number(columns) || 3));

  return (
    <div
      className="responsive-video-grid grid grid-cols-1 md:grid-cols-2 gap-8"
      style={{ '--desktop-columns': desktopColumns }}
    >
      {videos.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          autoScroll={autoScroll}
          autoScrollInterval={autoScrollInterval}
          onEdit={onEditVideo}
          onDelete={onDeleteVideo}
          onMove={onMoveVideo}
          canMoveUp={index > 0}
          canMoveDown={index < videos.length - 1}
          isAdmin={isAdmin}
          t={t}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
