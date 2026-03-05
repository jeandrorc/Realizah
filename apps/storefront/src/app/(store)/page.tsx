import { HeroSection } from '@/components/store/hero-section';
import { FeaturedProducts } from '@/components/store/featured-products';
import { FeaturedCourses } from '@/components/courses/featured-courses';
import { SubscriptionBanner } from '@/components/store/subscription-banner';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <FeaturedCourses />
      <SubscriptionBanner />
    </>
  );
}
