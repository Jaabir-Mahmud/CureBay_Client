import React from 'react';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import DiscountSection from '../components/DiscountSection';
import ExtraSection1 from '../components/ExtraSection1';
import ExtraSection2 from '../components/ExtraSection2';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <DiscountSection />
      <ExtraSection1 />
      <ExtraSection2 />
    </div>
  );
};

export default HomePage;

