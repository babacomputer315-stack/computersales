import { useEffect, useState } from "react";

export default function SaleTimer({
  saleStartDate,
  saleEndDate,
}: {
  saleStartDate: string;
  saleEndDate: string;
}) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const start = new Date(saleStartDate).getTime();
    const end = new Date(saleEndDate).getTime();
    const now = Date.now();

    if (now < start) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [saleStartDate, saleEndDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex flex-row-reverse items-center gap-2 text-sm text-white font-semibold">
      <span className="border-2 flex items-center justify-center border-white w-8 h-8 rounded-md">
        {String(timeLeft.hours).padStart(2, "0")}
      </span>
      <span className="text-white font-bold text-2xl">:</span>
      <span className="border-2 flex items-center justify-center border-white w-8 h-8 rounded-md">
        {String(timeLeft.minutes).padStart(2, "0")}
      </span>
      <span className="text-white font-bold text-2xl">:</span>
      <span className="border-2 flex items-center justify-center border-white w-8 h-8 rounded-md">
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
