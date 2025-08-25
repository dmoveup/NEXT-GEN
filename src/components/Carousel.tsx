import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselProps {
  children: React.ReactNode[];
  itemsPerView?: number;
  gap?: string;
  className?: string;
}

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export const Carousel: React.FC<CarouselProps> = ({ 
  children, 
  itemsPerView = 3, 
  gap = '1.5rem',
  className = '' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(itemsPerView);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(itemsPerView);
      }
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, [itemsPerView]);

  const maxIndex = Math.max(0, children.length - itemsToShow);
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < maxIndex;

  const goLeft = () => {
    if (canGoLeft) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goRight = () => {
    if (canGoRight) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const itemWidth = `calc((100% - ${gap} * ${itemsToShow - 1}) / ${itemsToShow})`;

  return (
    <div className={`relative ${className}`}>
      {/* Navigation Buttons */}
      <button
        onClick={goLeft}
        disabled={!canGoLeft}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-black/10 dark:border-white/20 flex items-center justify-center transition-all duration-300 ${
          canGoLeft 
            ? 'hover:bg-brand-mint hover:text-black shadow-lg hover:scale-110' 
            : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <button
        onClick={goRight}
        disabled={!canGoRight}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-black/10 dark:border-white/20 flex items-center justify-center transition-all duration-300 ${
          canGoRight 
            ? 'hover:bg-brand-mint hover:text-black shadow-lg hover:scale-110' 
            : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      {/* Carousel Container */}
      <div className="overflow-hidden mx-12">
        <motion.div
          ref={containerRef}
          className="flex"
          style={{ gap }}
          animate={{
            x: `-${currentIndex * (100 / itemsToShow)}%`
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: itemWidth }}
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots Indicator */}
      {maxIndex > 0 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-brand-mint w-6' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};