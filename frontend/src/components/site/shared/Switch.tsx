import React from "react";

interface SwitchProps {
  value: boolean;
  onChange: (value: any) => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <label
      className={`switch-wrapper flex items-center justify-between cursor-pointer ${
        disabled ? "disabled" : ""
      }`}
    >
      <label className="switch">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="slider" />
      </label>
    </label>
  );
};

export default Switch;
