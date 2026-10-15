import React from "react";

const Divider = ({
  height,
  className,
}: {
  height?: number;
  className?: string;
}) => {
  return (
    <div
      style={{ height: height || "1px" }}
      className={`w-full bg-stroke ${className}`}
    />
  );
};

export default Divider;
