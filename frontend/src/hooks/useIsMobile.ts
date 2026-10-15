import { useEffect, useState } from "react";

export function useIsMobile(initialValue: boolean = false): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(initialValue);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  return isMobile;
}
