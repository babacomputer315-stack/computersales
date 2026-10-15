import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumb from "../shared/Breadcrumb";
import dynamic from "next/dynamic";
const BottomNavigation = dynamic(() => import("../shared/BottomNavigation"), {
  ssr: false,
});

const SiteLayout = ({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb?: { title: string; href: string }[];
}) => {
  return (
    <>
      <div className="site font-peyda text-main-text pb-24 lg:pb-0">
        <Header />
        <div className="min-h-[60vh]">
          {breadcrumb && <Breadcrumb items={breadcrumb} />}
          {children}
        </div>
        <Footer />
      </div>
      <BottomNavigation />
    </>
  );
};

export default SiteLayout;
