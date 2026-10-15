import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div className="lg:container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[2.1fr_1fr] gap-6 mt-6 lg:mt-10 mb-6 lg:mb-8 items-stretch px-5 lg:px-0">
        <Image
          src={"/assets/images/slide-1.svg"}
          width={1000}
          height={500}
          alt="slide"
          className="object-cover rounded-lg w-full"
        />
        <div className="flex-col gap-6 hidden lg:flex">
          <Image
            src={"/assets/images/slide-2.svg"}
            width={1000}
            height={500}
            alt="slide"
          />
          <Image
            src={"/assets/images/slide-3.svg"}
            width={1000}
            height={500}
            alt="slide"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
