import React, { useState, useRef, useEffect, useCallback } from "react";
import { formatNumber } from "../../../utils/formatNumber";

interface PriceRangeProps {
  minPrice: number; // کل محدوده
  maxPrice: number;
  initialMin?: number; // مقدار شروعی (از URL)
  initialMax?: number;
  onRangeChange?: (min: number, max: number) => void;
  className?: string;
}

const STEP = 100000;

const snapToStep = (value: number) => {
  return Math.round(value / STEP) * STEP;
};

const PriceRange: React.FC<PriceRangeProps> = ({
  minPrice,
  maxPrice,
  onRangeChange,
  className = "",
  initialMin,
  initialMax,
}) => {
  const [range, setRange] = useState({
    min: initialMin ?? minPrice,
    max: initialMax ?? maxPrice,
  });
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const minInputRef = useRef<HTMLInputElement>(null);
  const maxInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset to default range when no initial values are provided
    if (initialMin === undefined && initialMax === undefined) {
      setRange({
        min: minPrice,
        max: maxPrice,
      });
    } else {
      setRange({
        min: initialMin ?? minPrice,
        max: initialMax ?? maxPrice,
      });
    }
  }, [initialMin, initialMax, minPrice, maxPrice]);

  // Calculate slider positions
  const getMinPosition = () =>
    ((range.min - minPrice) / (maxPrice - minPrice)) * 100;
  const getMaxPosition = () =>
    ((range.max - minPrice) / (maxPrice - minPrice)) * 100;

  // Handle slider drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, handle: "min" | "max") => {
      e.preventDefault();
      setIsDragging(handle);
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const percentage = Math.max(0, Math.min(100, (x / width) * 100));

      let value = (percentage / 100) * (maxPrice - minPrice) + minPrice;
      value = snapToStep(value);

      if (isDragging === "min") {
        const newMin = Math.min(value, range.max - STEP);
        setRange((prev) => ({ ...prev, min: newMin }));
      } else {
        const newMax = Math.max(value, range.min + STEP);
        setRange((prev) => ({ ...prev, max: newMax }));
      }
    },
    [isDragging, range.min, range.max, maxPrice, minPrice]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle input changes
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseInt(e.target.value.replace(/[^\d]/g, "")) || 0;
    const value = snapToStep(rawValue);
    const newMin = Math.min(Math.max(value, minPrice), range.max - STEP);
    setRange((prev) => ({ ...prev, min: newMin }));
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseInt(e.target.value.replace(/[^\d]/g, "")) || 0;
    const value = snapToStep(rawValue);
    const newMax = Math.max(Math.min(value, maxPrice), range.min + STEP);
    setRange((prev) => ({ ...prev, max: newMax }));
  };

  // Notify parent of changes
  useEffect(() => {
    onRangeChange?.(range.min, range.max);
  }, [range, onRangeChange]);

  // Format price for display
  const formatPrice = (price: number) => `${formatNumber(price)} هزار تومان`;

  return (
    <div className={`flex mt-10 flex-col gap-6 ${className}`}>
      {/* Slider */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer bg-stroke"
          onMouseDown={(e) => {
            const rect = sliderRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = e.clientX - rect.left;
            const width = rect.width;
            let value = (x / width) * (maxPrice - minPrice) + minPrice;
            value = snapToStep(value);

            const minDist = Math.abs(value - range.min);
            const maxDist = Math.abs(value - range.max);
            const handle = minDist < maxDist ? "min" : "max";
            handleMouseDown(e, handle);
          }}
        >
          {/* Selected range track */}
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${getMinPosition()}%`,
              width: `${getMaxPosition() - getMinPosition()}%`,
            }}
          />

          {/* Min handle */}
          <div
            className="absolute top-1/2 w-4 h-4 bg-primary border-2 border-white rounded-full shadow-md cursor-pointer transform -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${getMinPosition()}%` }}
            onMouseDown={(e) => handleMouseDown(e, "min")}
          />

          {/* Max handle */}
          <div
            className="absolute top-1/2 w-4 h-4 bg-primary border-2 border-white rounded-full shadow-md cursor-pointer transform -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${getMaxPosition()}%` }}
            onMouseDown={(e) => handleMouseDown(e, "max")}
          />
        </div>

        {/* Price labels */}
        <div className="flex justify-between mt-3 text-sm">
          <span>{formatPrice(maxPrice)}</span>
          <span>{formatPrice(minPrice)}</span>
        </div>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-dark whitespace-nowrap">
            از قیمت :
          </label>
          <input
            ref={minInputRef}
            type="text"
            value={formatNumber(range.min)}
            onChange={handleMinInputChange}
            className="w-full border border-stroke h-11 px-3 rounded-lg focus:outline focus:outline-secondary text-dark text-sm text-right"
            style={{
              textAlign: "left",
              direction: "ltr",
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-dark whitespace-nowrap">
            تا قیمت :
          </label>
          <input
            ref={maxInputRef}
            type="text"
            value={formatNumber(range.max)}
            onChange={handleMaxInputChange}
            className="w-full border border-stroke h-11 px-3 rounded-lg focus:outline focus:outline-secondary text-dark text-sm text-right"
            style={{
              textAlign: "left",
              direction: "ltr",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRange;
