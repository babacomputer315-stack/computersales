import SiteLayout from "@/components/site/layout/Layout";
import ProfileSidebar from "@/components/site/layout/ProfileSidebar";
import React, { ReactElement } from "react";

const MessagesPage = () => {
  return (
    <div className="container mx-auto px-6 md:px-0 mt-6 md:mt-8 mb-16 md:mb-32">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6">
        <ProfileSidebar />
        <div className="flex flex-col gap-6">
          <div className="border-1.5 border-stroke p-6 rounded-lg">
            <div className="flex items-center justify-between pb-6 border-b-1.5 border-b-stroke">
              <h4 className="text-base font-semibold font-noora">پیام ها</h4>
            </div>
            <div className="mt-6">
              {/* {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 border-b-1.5 border-b-stroke pb-6 mb-6 last:border-b-0 last:mb-0"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#F5F5F5]">
                    <Image
                      src={"/assets/icons/bell.svg"}
                      alt="bell"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="flex items-center gap-6">
                      <h5 className="font-medium">
                        آخرین محصولات تخفیف خورده سال
                      </h5>
                      <span className="text-secondary-text text-sm">
                        22 تیر ۱۴۰۴
                      </span>
                    </div>
                    <div className="text-sm text-secondary-text leading-7">
                      لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ،
                      و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه
                      روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای
                      شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای
                    </div>
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;

MessagesPage.getLayout = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>;
};
