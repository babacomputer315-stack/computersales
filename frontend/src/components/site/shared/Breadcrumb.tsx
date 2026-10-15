import Link from "next/link";
import React from "react";

const Breadcrumb = ({
  items,
}: {
  items: { title: string; href?: string; h1?: boolean }[];
}) => {
  return (
    <div className="container mx-auto px-6 md:px-0 pt-6 md:pt-8">
      <div className="flex items-center">
        {items.map((item, index) => (
          <div key={index}>
            <Link
              className={`${
                index === items.length - 1
                  ? "text-light"
                  : "text-secondary-text"
              }`}
              href={item.href || "#"}
            >
              {item.title}
            </Link>
            {index !== items.length - 1 && (
              <>
                {item.h1 ? (
                  <h1 className="text-light">{item.title}</h1>
                ) : (
                  <span
                    className={`${
                      index === items.length - 2
                        ? "text-secondary-text"
                        : "text-[#EBEBEB]"
                    } mx-4`}
                  >
                    |
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumb;
