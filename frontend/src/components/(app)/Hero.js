"use client";
import React, { useState, useEffect } from "react";
import Search from "@/components/(app)/Search";
import {
  FaMapMarkerAlt,
  FaStar,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const heroSlides = [
    {
      image: "/images/hero/hero1.jpg",
      title: "Découvrez la Tunisie",
      subtitle: "Des destinations magiques vous attendent",
      gradient: "from-primary-900/80 via-primary-800/60 to-transparent",
    },
    {
      image: "/images/hero/hero2.jpg",
      title: "Voyages Inoubliables",
      subtitle: "Explorez le monde avec nous",
      gradient: "from-secondary-900/80 via-secondary-800/60 to-transparent",
    },
    {
      image: "/images/hero/hero3.jpg",
      title: "Séjours de Luxe",
      subtitle: "Hôtels et resorts d'exception",
      gradient: "from-neutral-900/80 via-neutral-800/60 to-transparent",
    },
    {
      image: "/images/hero/hero4.jpg",
      title: "Omra & Pèlerinages",
      subtitle: "Voyages spirituels organisés",
      gradient: "from-primary-900/80 via-primary-700/60 to-transparent",
    },
  ];

  return (
    <div className="relative bg-white">
      {/* Hero Carousel Section */}
      <div className="relative w-full overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          speed={1500}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: ".hero-swiper-button-next",
            prevEl: ".hero-swiper-button-prev",
          }}
          pagination={{
            clickable: true,
            bulletActiveClass: "!bg-primary-500",
          }}
          loop={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="h-[500px] lg:h-[600px]"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[500px] lg:h-[600px]">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    quality={90}
                  />
                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative h-full flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                      {/* Animated Title */}
                      <h1
                        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight text-white drop-shadow-2xl animate-fadeInUp"
                        style={{
                          animation:
                            activeIndex === index
                              ? "fadeInUp 1s ease-out"
                              : "none",
                        }}
                      >
                        {slide.title}
                      </h1>

                      {/* Animated Subtitle */}
                      <p
                        className="text-lg md:text-2xl lg:text-3xl mb-8 md:mb-12 text-white/95 leading-relaxed drop-shadow-lg animate-fadeInUp"
                        style={{
                          animation:
                            activeIndex === index
                              ? "fadeInUp 1s ease-out 0.2s both"
                              : "none",
                        }}
                      >
                        {slide.subtitle}
                      </p>

                      {/* Stats Cards - Only on first slide */}
                      {index === 0 && (
                        <div
                          className="flex flex-wrap justify-center gap-3 md:gap-6 mb-8 md:mb-12 animate-fadeInUp"
                          style={{
                            animation:
                              activeIndex === 0
                                ? "fadeInUp 1s ease-out 0.4s both"
                                : "none",
                          }}
                        >
                          <div className="flex items-center gap-2 md:gap-3 bg-white/95 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-2xl hover:scale-105 transition-transform">
                            <div className="bg-primary-100 p-2 md:p-3 rounded-lg md:rounded-xl">
                              <FaMapMarkerAlt className="text-primary-500 text-base md:text-xl" />
                            </div>
                            <div className="text-left">
                              <p className="text-xl md:text-2xl font-bold text-neutral-800">
                                500+
                              </p>
                              <p className="text-xs md:text-sm text-neutral-500">
                                Destinations
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 md:gap-3 bg-white/95 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-2xl hover:scale-105 transition-transform">
                            <div className="bg-primary-100 p-2 md:p-3 rounded-lg md:rounded-xl">
                              <FaStar className="text-primary-500 text-base md:text-xl" />
                            </div>
                            <div className="text-left">
                              <p className="text-xl md:text-2xl font-bold text-neutral-800">
                                4.8/5
                              </p>
                              <p className="text-xs md:text-sm text-neutral-500">
                                Satisfaction
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 md:gap-3 bg-white/95 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-2xl hover:scale-105 transition-transform">
                            <div className="bg-primary-100 p-2 md:p-3 rounded-lg md:rounded-xl">
                              <FaUsers className="text-primary-500 text-base md:text-xl" />
                            </div>
                            <div className="text-left">
                              <p className="text-xl md:text-2xl font-bold text-neutral-800">
                                1K+
                              </p>
                              <p className="text-xs md:text-sm text-neutral-500">
                                Clients
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Custom Navigation Buttons */}
          <button className="hero-swiper-button-prev cursor-pointer absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-3 md:p-4 rounded-full transition-all hover:scale-110 shadow-xl">
            <FaChevronLeft className="text-lg md:text-xl " />
          </button>
          <button className="hero-swiper-button-next cursor-pointer absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-3 md:p-4 rounded-full transition-all hover:scale-110 shadow-xl">
            <FaChevronRight className="text-lg md:text-xl " />
          </button>
        </Swiper>
      </div>

      {/* Search Bar - Floating Overlay */}
      <div className="relative -mt-24 md:-mt-32 z-20 mb-12 md:mb-16">
        <div className="container mx-auto px-4">
          <Search />
        </div>
      </div>
    </div>
  );
};

export default Hero;
