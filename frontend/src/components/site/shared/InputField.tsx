import React from "react";
import Label from "./Label";
import Image from "next/image";

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  type?: string;
  name?: string;
  id?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  error?: string;
  textAlign?: "left" | "right";
  icon?: string;
}

const InputField: React.FC<Props> = ({
  label,
  value,
  onChange,
  className,
  placeholder,
  type,
  name,
  onFocus,
  autoFocus,
  error,
  textAlign = "right",
  icon,
}) => {
  return (
    <div className={`flex flex-col ${className || ""}`}>
      {label ? <Label label={label} /> : null}
      <div className="bg-input-bg rounded-xl h-12 w-full relative flex items-center flex-col">
        {icon ? (
          <div className="absolute right-0 top-0 bottom-0 px-2 flex items-center justify-center">
            <Image src={icon} alt="mobile" width={24} height={24} />
          </div>
        ) : null}
        <input
          type="text"
          className={`placeholder:text-[#5D6676] text-sm w-full h-full bg-transparent border-none outline-none pl-4 ${
            icon ? "pr-10" : "pr-4"
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ direction: textAlign === "left" ? "ltr" : "rtl" }}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default InputField;
