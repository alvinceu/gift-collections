import HeroSection from '@/components/about/HeroSection';
import ProblemSection from '@/components/about/ProblemSection';
import SolutionSection from '@/components/about/SolutionSection';
import HowItWorksSection from '@/components/about/HowItWorksSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
    </div>
  );
}
