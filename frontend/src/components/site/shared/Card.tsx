import Image from "next/image";
import React from "react";

const Card = ({
  header,
  children,
  icon,
  className,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  icon: string;
  className?: string;
}) => {
  return (
    <div
      className={`lg:border border-stroke rounded-2xl lg:p-8 ${className || ""}`}
    >
      <div className="flex items-center gap-2 pb-8 mb-8 border-b border-stroke">
        <Image src={icon} alt="icon" width={16} height={16} />
        <span className="font-bold">{header}</span>
      </div>
      {children}
    </div>
  );
};

export default Card;
