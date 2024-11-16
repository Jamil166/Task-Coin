import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

const slides = [
  {
    title: 'DAILY CHECKIN',
    description: 'Claim daily checkin rewards',
    link: '/checkin',
  },
  {
    title: '$GHOST COMMUNITY',
    description: 'Contact developer',
    link: 'https://t.me/CryptoXwQ',
  },
];

const CommunitySlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startSlideInterval = () => {
    slideInterval.current = setInterval(() => {
      handleNextSlide();
    }, 5000);
  };

  const stopSlideInterval = () => {
    clearInterval(slideInterval.current);
  };

  useEffect(() => {
    startSlideInterval();
    return () => stopSlideInterval();
    // eslint-disable-next-line
  }, []);

  const handleNextSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prevSlide) => prevSlide + 1);
  };

  const handlePrevSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prevSlide) => prevSlide - 1);
  };

  const handleDotClick = (index) => {
    stopSlideInterval();
    setIsTransitioning(true);
    setCurrentSlide(index);
    startSlideInterval();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNextSlide();
    } else if (touchEndX.current - touchStartX.current > 50) {
      handlePrevSlide();
    }
  };

  useEffect(() => {
    if (isTransitioning) {
      const transitionEnd = setTimeout(() => {
        setIsTransitioning(false);
        if (currentSlide >= slides.length) {
          setCurrentSlide(0);
        } else if (currentSlide < 0) {
          setCurrentSlide(slides.length - 1);
        }
      }, 500); // duration of the transition
      return () => clearTimeout(transitionEnd);
    }
  }, [currentSlide, isTransitioning]);

  return (
    <div className="relative w-full max-w-xl mx-auto overflow-hidden">
      <div
        className={`flex ${isTransitioning ? 'transition-transform duration-500' : ''}`}
        style={{ transform: `translateX(-${(currentSlide % slides.length) * 90}%)` }} // adjust 100% to 90% for partial view
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >


        {slides.concat(slides[0]).map((slide, index) => (
          <div key={index} className="min-w-[90%]"> {/* adjust 100% to 90% for partial view */}
            <div className="bg-[#17181A] mr-4 rounded-[12px] py-6 px-4 flex flex-col">
              <h2 className="font-medium">{slide.title}</h2>
              <p className="pb-2 text-[14px]">{slide.description}</p>

              {index === 0 ? (
              <NavLink
              to={slide.link}
              className="bg-btn4 py-1 px-3 text-[16px] font-semibold w-fit rounded-[30px]"
            >
              Claim
            </NavLink>
              ) : (
                <a
                href={slide.link}
                className="bg-btn4 py-1 px-3 text-[16px] font-semibold w-fit rounded-[30px]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join
              </a>
              )}



            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-3 space-x-2">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full cursor-pointer ${
              index === (currentSlide % slides.length) ? 'bg-white' : 'bg-gray-400'
            }`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default CommunitySlider;
