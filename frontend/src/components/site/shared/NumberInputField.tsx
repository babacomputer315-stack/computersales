import React, { useState, useEffect } from "react";
import Label from "./Label";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  commaFormat?: boolean;
  className?: string;
  placeholder?: string;
}

const formatNumber = (value: string) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const removeNonDigits = (value: string) => {
  return value.toString().replace(/[^\d]/g, "");
};

const NumberInputField: React.FC<Props> = ({
  label,
  value,
  onChange,
  commaFormat,
  className,
  placeholder,
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const clean = removeNonDigits(value || "");
    const formatted = commaFormat ? formatNumber(clean) : clean;
    setDisplayValue(formatted);
  }, [value, commaFormat]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = removeNonDigits(e.target.value);
    const formatted = commaFormat ? formatNumber(raw) : raw;
    setDisplayValue(formatted);
    onChange(raw);
  };

  return (
    <div className={`flex flex-col ${className || ""}`}>
      <Label label={label} />
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        className={`border border-stroke h-11 px-3 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 text-dark placeholder:text-light text-sm placeholder:text-right `}
      />
    </div>
  );
};

export default NumberInputField;
