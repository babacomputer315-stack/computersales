import Image from "next/image";
import React, { useEffect } from "react";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  widthClassName?: string;
  showCloseButton?: boolean;
  children?: React.ReactNode;
};

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  //   title,
  widthClassName = "w-[85%] sm:w-96",
  showCloseButton = true,
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        // aria-label={title || "drawer"}
        className={`fixed right-0 top-0 bottom-0 z-[9999] bg-white shadow-xl ${widthClassName} max-w-[90%] sm:max-w-sm flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 p-4 py-6 border-b border-stroke">
          <div>
            <Image
              src={"/assets/images/logo-full.svg"}
              width={110}
              height={53}
              alt="logo"
            />
          </div>
          {showCloseButton ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="close drawer"
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray/60 transition-colors"
            >
              <span className="text-2xl leading-none">×</span>
            </button>
          ) : null}
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </aside>
    </>
  );
};

export default Drawer;
