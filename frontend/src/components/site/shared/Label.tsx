import React from "react";

const Label = ({ label }: { label: string }) => {
  return (
    <div className="mb-2 flex items-end justify-between">
      {label && (
        <>
          <label className="text-sm font-medium">{label}</label>
        </>
      )}
    </div>
  );
};

export default Label;
