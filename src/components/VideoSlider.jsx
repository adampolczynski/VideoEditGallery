import React, { useState, useRef, useEffect } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

export const VideoSlider = ({ beforeUrl, afterUrl, title, autoScroll = false, autoScrollInterval = 5000, fitMode = 'contain', t = (key) => key }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef(null);
  const autoScrollRef = useRef(null);
  const directionRef = useRef(1);

  const effectiveAutoScroll = autoScroll && !isInteracting;
  const videoFitClass = fitMode === 'cover' ? 'object-cover' : 'object-contain';

  useEffect(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }

    if (!effectiveAutoScroll) return;

    autoScrollRef.current = setInterval(() => {
      setSliderPosition((currentPosition) => {
        let nextPosition = currentPosition + directionRef.current * (100 / (autoScrollInterval / 100));

        if (nextPosition >= 100 || nextPosition <= 0) {
          directionRef.current *= -1;
          nextPosition = Math.max(0, Math.min(100, nextPosition));
        }

        return nextPosition;
      });
    }, 100);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };
  }, [effectiveAutoScroll, autoScrollInterval]);

  const updateSliderPosition = (clientX) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseMove = (e) => {
    if (effectiveAutoScroll) return;
    updateSliderPosition(e.clientX);
  };

  const handleTouchStart = (e) => {
    setIsInteracting(true);
    updateSliderPosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (effectiveAutoScroll || !containerRef.current) return;
    updateSliderPosition(e.touches[0].clientX);
  };

  const handleClick = (e) => {
    setIsInteracting(true);
    updateSliderPosition(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-72 rounded-lg overflow-hidden group cursor-col-resize surface-panel bg-black"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Before video */}
      <video
        src={beforeUrl}
        className={`absolute inset-0 w-full h-full ${videoFitClass}`}
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
          className={`absolute inset-0 w-full h-full ${videoFitClass}`}
          autoPlay
          muted
          loop
        />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white group-hover:w-2 transition-all"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      />
      <div
        className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `clamp(24px, ${sliderPosition}%, calc(100% - 24px))` }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-neon ring-2 ring-white/80">
          <ChevronsLeftRight size={26} strokeWidth={3} aria-hidden="true" />
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
