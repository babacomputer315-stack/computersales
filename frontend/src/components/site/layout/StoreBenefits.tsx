"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";

const storeBenefits = [
  {
    title: "بهترین قیمت",
    description: "لذت بازی مقرون‌به‌صرفه",
    icon: "price",
  },
  {
    title: "تضمین کیفیت",
    description: "تضمین کیفیت برای هر بازی",
    icon: "quality",
  },
  {
    title: "پرداخت امن",
    description: "خرید مطمئن، پرداخت ایمن",
    icon: "payment",
  },
  {
    title: "پشتیبانی سریع",
    description: "۷ روز هفته ۲۴ ساعته",
    icon: "support",
  },
];

const StoreBenefits = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // سرعت اسکرول
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={`overflow-x-auto w-full cursor-grab hidden-scrollbar active:cursor-grabbing select-none ${className}`}
    >
      <div className="flex flex-nowrap gap-6 py-2 lg:justify-between">
        {storeBenefits.map((item) => (
          <div
            key={item.icon}
            className="flex gap-2 items-center justify-between min-w-[210px] lg:min-w-[230px]"
          >
            <div className="flex flex-col text-sm gap-1">
              <span className="lg:font-semibold">{item.title}</span>
              <span className="text-secondary-text">
                {item.description}
              </span>
            </div>
            <Image
              src={`/assets/icons/features/${item.icon}.svg`}
              width={56}
              height={56}
              alt={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreBenefits;
