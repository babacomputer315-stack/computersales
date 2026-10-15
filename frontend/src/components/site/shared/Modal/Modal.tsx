import Image from "next/image";
import React, { useEffect } from "react";
import { Portal } from "react-portal";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
  title?: string | React.ReactNode;
  subTitle?: string;
  icon?: string;
  className?: string;
  headerClassName?: string;
}

const Modal = ({
  open,
  setOpen,
  children,
  title,
  className,
  subTitle,
  icon,
  headerClassName,
}: ModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "auto";
      };
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <Portal>
      {/* Background overlay with fade animation */}
      <div
        onClick={() => setOpen(false)}
        className={`site fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Modal container with different animations for mobile and desktop */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-lg mx-auto pb-6 pt-0 transition-all duration-300 max-h-screen overflow-y-auto ${
            className ? className : ""
          } ${
            open
              ? "md:opacity-100 md:translate-y-0 translate-y-0"
              : "md:opacity-0 md:translate-y-4 translate-y-full"
          }`}
        >
          <div
            className={`flex justify-between sticky top-0 bg-white z-10 pt-6 px-6 ${
              subTitle ? "items-stert pb-6" : "items-center pb-4"
            } mb-6 border-b border-b-stroke ${headerClassName}`}
          >
            <div className="flex items-center gap-4">
              {icon ? (
                <div className="w-14 h-14 rounded-lg bg-[#F5F5F5] flex items-center justify-center">
                  <Image
                    src={icon || ""}
                    alt={typeof title === "string" ? title : "icon"}
                    width={24}
                    height={24}
                  />
                </div>
              ) : null}
              <div className="flex flex-col gap-2">
                {typeof title === "string" ? (
                  <h2 className="font-bold text-base font-noora">{title}</h2>
                ) : (
                  title
                )}
                {subTitle ? (
                  <p className="text-sm text-secondary-text">{subTitle}</p>
                ) : null}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="border border-stroke w-10 h-10 rounded-lg flex items-center justify-center"
            >
              <Image
                src={"/assets/icons/x.svg"}
                alt="close"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
          </div>
          <div className="px-6">{children}</div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
