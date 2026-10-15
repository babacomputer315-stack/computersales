import React, { useState } from "react";
import Image from "next/image";

const Accordion = ({ title, content }: { title: string; content: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`w-full px-5 rounded-lg border-stroke border-1.5 ${
        isOpen ? "bg-[#F5F5F5]" : ""
      } transition-all duration-300`}
    >
      <button
        onClick={toggleAccordion}
        className={`w-full flex justify-between items-center py-5 text-black font-semibold ${
          isOpen ? "border-b !border-stone-300" : ""
        }`}
      >
        <span>{title}</span>
        <span
          className={`transition-transform duration-500 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <Image
            src="/assets/icons/chevron-down.svg"
            alt="arrow-down"
            width={24}
            height={24}
          />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="py-5 text-secondary-text">{content}</div>
      </div>
    </div>
  );
};

export default Accordion;
