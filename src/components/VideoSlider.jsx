import React, { useState, useRef, useEffect } from 'react';

export const VideoSlider = ({ beforeUrl, afterUrl, title, autoScroll = false, autoScrollInterval = 5000, t = (key) => key }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    if (!autoScroll) return;

    const startAutoScroll = () => {
      let direction = 1;
      let position = 50;

      const interval = setInterval(() => {
        position += direction * (100 / (autoScrollInterval / 100));
        
        if (position >= 100 || position <= 0) {
          direction *= -1;
          position = Math.max(0, Math.min(100, position));
        }

        setSliderPosition(position);
      }, 100);

      autoScrollRef.current = interval;
    };

    startAutoScroll();

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [autoScroll, autoScrollInterval]);

  const handleMouseMove = (e) => {
    if (!containerRef.current || autoScroll) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current || autoScroll) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-72 rounded-lg overflow-hidden group cursor-col-resize surface-panel"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Before video */}
      <video
        src={beforeUrl}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
      />

      {/* After video (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <video
          src={afterUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
        />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white group-hover:w-2 transition-all"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white text-black rounded-full p-2 shadow-soft">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.5 4a1 1 0 1 0 0 2h3V4h-3zm-3 7a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm5 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-2 left-2 px-3 py-1 bg-black/70 rounded text-xs font-bold text-white backdrop-blur border border-white/10">
        {t('before')}
      </div>
      <div className="absolute top-2 right-2 px-3 py-1 bg-black/70 rounded text-xs font-bold text-accent backdrop-blur border border-white/10">
        {t('after')}
      </div>
    </div>
  );
};

export default VideoSlider;
