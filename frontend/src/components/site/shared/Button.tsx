import React from "react";
import BtnLoading from "./BtnLoading";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  loading?: boolean;
  className?: string;
  link?: boolean;
  href?: string;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  title,
  loading,
  className,
  link,
  href,
  variant = "primary",
  ...base
}) => {
  if (!link) {
    return (
      <button
        disabled={loading}
        className={`${
          variant === "primary"
            ? "bg-primary text-white"
            : "bg-[#FDE9EB] text-primary font-semibold"
        } h-12 rounded-xl text-base flex items-center justify-center gap-2 px-5 ${
          loading && "opacity-70"
        } ${className}`}
        {...base}
      >
        <span>{title}</span>
        {loading && <BtnLoading />}
      </button>
    );
  } else {
    return (
      <Link
        href={href || ""}
        className={`${
          variant === "primary"
            ? "bg-primary text-white"
            : "bg-[#FDE9EB] text-primary font-semibold"
        } h-12 rounded-xl text-base flex items-center justify-center gap-2 px-5 ${
          loading && "opacity-70"
        } ${className}`}
      >
        <span>{title}</span>
      </Link>
    );
  }
};

export default Button;
