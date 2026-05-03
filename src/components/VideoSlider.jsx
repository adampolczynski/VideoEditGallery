import React, { useState, useRef, useEffect } from 'react';

export const VideoSlider = ({ beforeUrl, afterUrl, title, autoScroll = false, autoScrollInterval = 5000, fitMode = 'contain', t = (key) => key }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef(null);
  const autoScrollRef = useRef(null);
  const directionRef = useRef(1);
  const isPointerDownRef = useRef(false);
  const lastFrameTimeRef = useRef(null);

  const effectiveAutoScroll = autoScroll && !isInteracting;
  const videoFitClass = fitMode === 'cover' ? 'object-cover' : 'object-contain';

  useEffect(() => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }

    if (!effectiveAutoScroll) return;

    lastFrameTimeRef.current = null;

    const animate = (time) => {
      const lastTime = lastFrameTimeRef.current ?? time;
      const delta = time - lastTime;
      lastFrameTimeRef.current = time;

      setSliderPosition((currentPosition) => {
        let nextPosition = currentPosition + directionRef.current * (delta * 100 / autoScrollInterval);

        if (nextPosition >= 100 || nextPosition <= 0) {
          directionRef.current *= -1;
          nextPosition = Math.max(0, Math.min(100, nextPosition));
        }

        return nextPosition;
      });

      autoScrollRef.current = requestAnimationFrame(animate);
    };

    autoScrollRef.current = requestAnimationFrame(animate);

    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
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
        className="absolute inset-y-0 z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white group-hover:w-1" />
        <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black bg-white text-black shadow-soft ring-1 ring-white/80">
          <span className="block font-black leading-none text-[16px] tracking-normal text-black" aria-hidden="true">
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
