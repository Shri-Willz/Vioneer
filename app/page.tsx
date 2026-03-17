import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { Problem } from '@/components/problem';
import { Features } from '@/components/features';
import { Industries } from '@/components/industries';
import { HowItWorks } from '@/components/how-it-works';
import { CTA } from '@/components/cta';
import { Footer } from '@/components/footer';
import { use } from 'react';

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) 
{
  const params = use(searchParams);
  console.log([params])
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />
      <Problem />
      <Features />
      <Industries />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
