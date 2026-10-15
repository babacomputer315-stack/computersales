import React from "react";
import { Map, Marker } from "pigeon-maps";

const StaticMap = () => {
  const latitude = 35.7074042;
  const longitude = 51.4030748;

  const handleNavigation = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const googleMapsURL = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    if (isMobile) {
      const iosURL = `maps://?daddr=${latitude},${longitude}`;
      const androidURL = `geo:${latitude},${longitude}?q=${latitude},${longitude}`;

      const userChoice = window.confirm(
        "می‌خواید مسیر رو در Google Maps باز کنید؟ OK برای Google Maps و Cancel برای برنامه نقشه پیشفرض."
      );
      if (userChoice) {
        window.open(googleMapsURL, "_blank");
      } else {
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.open(iosURL, "_blank");
        } else {
          window.open(androidURL, "_blank");
        }
      }
    } else {
      window.open(googleMapsURL, "_blank");
    }
  };

  return (
    <div className="relative">
      {/* <Map height={350} defaultCenter={[latitude, longitude]} defaultZoom={17}>
        <Marker width={50} anchor={[latitude, longitude]} color="#c4161c" />
      </Map> */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.764834145003!2d51.40307477634376!3d35.70740422853478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e01d9e84f3bf5%3A0x28564ffcf6b87c61!2z2K3Ysdin2Kwg2qnYp9mF2b7bjNmI2KrYsQ!5e0!3m2!1sen!2s!4v1760365538788!5m2!1sen!2s"
        width="100%"
        height="350"
        style={{ border: "0" }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      <div className="absolute bottom-6 right-0 left-0 z-20 flex items-center justify-center">
        <div
          onClick={handleNavigation}
          className="text-sm lg:text-base font-medium cursor-pointer bg-white px-10 h-12 flex items-center justify-center rounded-xl shadow-lg"
        >
          مسیریابی
        </div>
      </div>
    </div>
  );
};

export default StaticMap;
