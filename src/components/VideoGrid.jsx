import React from 'react';
import VideoCard from './VideoCard';

export const VideoGrid = ({ 
  videos = [], 
  autoScroll = false, 
  autoScrollInterval = 5000,
  onEditVideo = null,
  onDeleteVideo = null,
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          autoScroll={autoScroll}
          autoScrollInterval={autoScrollInterval}
          onEdit={onEditVideo}
          onDelete={onDeleteVideo}
          isAdmin={isAdmin}
          t={t}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
