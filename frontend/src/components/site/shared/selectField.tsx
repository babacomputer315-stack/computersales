import React from "react";
import Select, { StylesConfig } from "react-select";
import Label from "./Label";
import { colors } from "@/utils/colors";

interface OptionType {
  value: string;
  label: string;
  id?: string;
}

const SelectField = ({
  onChange,
  value,
  label,
  options,
  placeholder,
}: {
  onChange: (value: string | null) => void;
  value: string | null | undefined;
  label: string;
  options: OptionType[];
  placeholder: string;
}) => {
  const selectedOption =
    value == null
      ? null
      : options.find((opt) => String(opt.value) === String(value)) || null;

  const handleChange = (selectedOption: OptionType | null) => {
    onChange(selectedOption ? selectedOption.value : null);
  };

  const customStyles: StylesConfig<OptionType, boolean> = {
    control: (provided, state) => ({
      ...provided,
      border: "none",
      outline: "none",
      // outline: state.isFocused
      //   ? `2px solid ${colors["primary-500"]} !important`
      //   : `2px solid ${colors.stroke} !important`,
      transition: "all 0.2s",
      borderRadius: "8px",
      height: "44px",
      fontSize: "14px",
      backgroundColor: "#f4f6fa",
      boxShadow: "none",
      "&:hover": {
        borderColor: colors.stroke,
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: colors.light,
      fontSize: "14px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? colors["primary-500"]
        : state.isFocused
        ? colors["primary-100"]
        : "transparent",
      fontSize: "14px",
      color: state.isSelected ? "white" : colors.dark,
      "&:active": {
        backgroundColor: colors["primary-600"],
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: colors["primary-100"],
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: colors["primary-700"],
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px",
    }),
  };

  return (
    <div className={`flex flex-col`}>
      <Label label={label} />
      <Select
        options={options as OptionType[]}
        onChange={(opt) => handleChange(opt as OptionType | null)}
        value={selectedOption}
        getOptionValue={(option) => option.value}
        getOptionLabel={(option) => option.label}
        placeholder={placeholder || "انتخاب ..."}
        noOptionsMessage={() => "گزینه‌ای یافت نشد"}
        styles={customStyles}
        menuPlacement="auto"
        classNamePrefix="react-select"
        isClearable
      />
    </div>
  );
};

export default SelectField;
