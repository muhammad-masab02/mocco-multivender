import React from "react";
import HeroSwiper from "./HeroSwiper";

const HeroSection = ({ handleCategoryClick }) => {
  return (
    <section className="w-full m-0 p-0 overflow-hidden">
      <HeroSwiper handleCategoryClick={handleCategoryClick} />
    </section>
  );
};

export default HeroSection;
