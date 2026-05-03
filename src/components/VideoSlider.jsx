import React, { useState, useRef, useEffect } from 'react';

export const VideoSlider = ({ beforeUrl, afterUrl, title, autoScroll = false, autoScrollInterval = 5000, fitMode = 'contain', t = (key) => key }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef(null);
  const autoScrollRef = useRef(null);
  const directionRef = useRef(1);
  const isPointerDownRef = useRef(false);

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

  const handlePointerDown = (e) => {
    isPointerDownRef.current = true;
    setIsInteracting(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateSliderPosition(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (e.pointerType === 'touch' && !isPointerDownRef.current) return;
    if (autoScroll && !isInteracting && !isPointerDownRef.current) return;
    e.preventDefault();
    updateSliderPosition(e.clientX);
  };

  const handlePointerUp = (e) => {
    isPointerDownRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-72 rounded-lg overflow-hidden group cursor-col-resize touch-none select-none surface-panel bg-black"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
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
          <span className="block font-black leading-none text-[26px] tracking-normal text-black" aria-hidden="true">
            &lt;&gt;
          </span>
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
