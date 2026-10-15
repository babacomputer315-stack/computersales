import React from "react";

const BtnLoading = ({ className }: { className?: string }) => {
  return (
    <div
      className={`w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin ${className}`}
    ></div>
  );
};

export default BtnLoading;
