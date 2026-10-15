import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import Autoplay, { AutoplayOptionsType } from "embla-carousel-autoplay";
import { NextButton, PrevButton, DotButton } from "./EmblaCarouselButtons";
import styles from "./EmblaCarousel.module.scss";

type EmblaCarouselProps = {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
  slideSize?: string | { min: string; max: string };
  withControls?: boolean;
  withDots?: boolean;
  withAutoplay?: boolean;
  autoplayOptions?: AutoplayOptionsType & {
    delay?: number;
    stopOnInteraction?: boolean;
    stopOnMouseEnter?: boolean;
  };
  className?: string;
  containerClassName?: string;
  viewportClassName?: string;
  slideClassName?: string;
  dotRender?: (
    index: number,
    selected: boolean,
    onClick: () => void
  ) => React.ReactNode;
  dotClassName?: string;
  controlsClassName?: string;
};

const EmblaCarousel: React.FC<EmblaCarouselProps> = ({
  slides,
  options = {},
  slideSize = "100%",
  withControls = true,
  withDots = false,
  withAutoplay = false,
  autoplayOptions = {
    delay: 3000,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
  },
  className = "",
  containerClassName = "",
  viewportClassName = "",
  slideClassName = "",
  dotRender,
  dotClassName = "",
  controlsClassName = "",
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { ...options, direction: "rtl" },
    withAutoplay ? [Autoplay(autoplayOptions)] : undefined
  );
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const slideStyle =
    typeof slideSize === "string"
      ? { flex: `0 0 ${slideSize}`, minWidth: 0 }
      : {
          flex: `0 0 ${slideSize.min}`,
          minWidth: 0,
          "@media (min-width: 768px)": {
            flex: `0 0 ${slideSize.max}`,
          },
        };

  return (
    <div className={`${styles.embla} ${className}`}>
      <div className={`relative ${containerClassName}`}>
        <div
          className={`${styles.embla__viewport} ${viewportClassName}`}
          ref={emblaRef}
        >
          <div className={`${styles.embla__container} ${containerClassName}`}>
            {slides.map((slide, index) => (
              <div
                className={`${styles.embla__slide} ${slideClassName}`}
                key={index}
                style={slideStyle}
              >
                {slide}
              </div>
            ))}
          </div>
        </div>
        {withControls && (
          <div className={`${styles.embla__buttons} ${controlsClassName}`}>
            <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
            <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
          </div>
        )}
      </div>
      {withDots && (
        <div className={`${styles.embla__dots} ${dotClassName}`}>
          {scrollSnaps.map((_, index) =>
            dotRender ? (
              dotRender(index, index === selectedIndex, () => scrollTo(index))
            ) : (
              <DotButton
                key={index}
                selected={index === selectedIndex}
                onClick={() => scrollTo(index)}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default EmblaCarousel;
