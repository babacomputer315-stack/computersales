import Image from "next/image";
import React from "react";

const LandingPostItem = () => {

  return (
    <div className={`bg-white rounded-lg h-full flex flex-col`}>
      <div className="w-full aspect-[2/1] relative">
        <Image
          src={"/assets/images/post.png"}
          alt="product"
          width={900}
          height={900}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="pb-4 pt-4 flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <h2 className="font-bold text-sm font-noora flex-1">
            چرا تشک مناسب، برای خواب اهمیت دارد؟
          </h2>
        </div>
        <p className="text-sm text-secondary-text mt-2">
          نقش تشک در سلامت خواب و انتخاب بهترین گزینه برای بدن شما
        </p>
        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center gap-2">
            <Image
              src={"/assets/icons/event-note.svg"}
              alt="event-note"
              width={24}
              height={24}
            />
            <span className="text-sm text-secondary-text">2 تیر 1404</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-secondary font-medium">ادامه مطلب</span>
            <Image
              src={"/assets/icons/arrow-up-left-secondary.svg"}
              alt="arrow-up-left"
              width={24}
              height={24}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPostItem;
