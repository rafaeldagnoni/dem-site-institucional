'use client';

import { useState } from 'react';
import ValuationHero from './components/ValuationHero';
import HowItWorks from './components/HowItWorks';
import ValueFactors from './components/ValueFactors';
import ValuationForm from './components/ValuationForm';
import ValuationResults from './components/ValuationResults';
import ResultsCTA from './components/ResultsCTA';

export default function ValuationPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [valuationData, setValuationData] = useState<any>(null);

  const handleFormSubmit = (data: any) => {
    setValuationData(data);
    setFormSubmitted(true);
    setTimeout(() => {
      const resultSection = document.getElementById('results');
      resultSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <main className="bg-[#0a0e0b] text-white overflow-x-hidden">
      <ValuationHero />
      <HowItWorks />
      <ValueFactors />
      <ValuationForm onSubmit={handleFormSubmit} />
      {formSubmitted && valuationData && (
        <>
          <ValuationResults data={valuationData} />
          <ResultsCTA />
        </>
      )}
    </main>
  );
}
