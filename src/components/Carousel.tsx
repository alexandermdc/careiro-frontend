import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Carousel.css';

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  itemsPerPage?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  autoplay?: boolean;
  speed?: number;
  className?: string;
}

export function Carousel<T>({
  items,
  renderItem,
  itemsPerPage = 4,
  showControls = true,
  showIndicators = true,
  autoplay = false,
  speed = 800,
  className = ''
}: CarouselProps<T>) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full max-w-[1108px] mx-auto">
        <Swiper
          modules={[Navigation, Pagination, A11y, Autoplay]}
          spaceBetween={25}
          slidesPerView={1}
          navigation={showControls}
          pagination={showIndicators ? { clickable: true } : false}
          autoplay={autoplay ? { delay: 3000, disableOnInteraction: false } : false}
          speed={speed}
          loop={items.length > itemsPerPage}
          watchSlidesProgress={true}
          slideToClickedSlide={false}
          preventClicks={false}
          preventClicksPropagation={false}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 25
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 25
            },
            1024: {
              slidesPerView: itemsPerPage,
              spaceBetween: 25
            }
          }}
          className="produtos-carousel"
        >
          {items.map((item, index) => (
            <SwiperSlide key={index}>
              {renderItem(item)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
