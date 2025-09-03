import React from 'react';
import SEOHelmet from '../components/SEOHelmet';
import HeroSlider from '../components/HeroSlider';
import CategorySection from '../components/CategorySection';
import DiscountSection from '../components/DiscountSection';
import ExtraSection1 from '../components/ExtraSection1';
import ExtraSection2 from '../components/ExtraSection2';

const HomePage = () => {
  return (
    <>
      <SEOHelmet 
        title="CureBay - Your Trusted Online Pharmacy & Healthcare Partner"
        description="CureBay offers quality medicines, expert healthcare advice, and fast delivery. Browse our extensive collection of prescription drugs, supplements, and medical supplies with confidence."
        keywords="online pharmacy, prescription drugs, medicines delivery, healthcare products, medical supplies, pharmacy near me, buy medicines online, health supplements"
        type="website"
      />
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <HeroSlider />
        <CategorySection />
        <DiscountSection />
        <ExtraSection1 />
        <ExtraSection2 />
      </div>
    </>
  );
};

export default HomePage;

