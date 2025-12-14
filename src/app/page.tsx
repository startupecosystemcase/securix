'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Advantages from '@/components/Advantages';
import Partners from '@/components/Partners';
import About from '@/components/About';
import Contacts from '@/components/Contacts';
import Registration from '@/components/Registration';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <Advantages />
      <Partners />
      <About />
      <Contacts />
      <Registration />
      <Footer />
    </div>
  );
}
