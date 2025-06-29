"use client"
import Link from 'next/link'
import Image from 'next/image'
import React, { useRef, useEffect } from 'react'
import { Button } from './ui/button'

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    const scrollThreshold = 100;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Call once to set initial state
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (

    <section className="w-full pt-36 md:pt-48 pb-10">
          <div className='space-y-6 text-center'>
              <div className='space-y-6 mx-auto'>
                  <h1 className=' text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title'>Your AI Coach for
                      <br />
                      Personal Growth
          </h1>
          <p className='mx-auto max-w-[600px] text-muted-foreground md:text-xl'>Advance your career with personalized guidance, interview prep and 
            AI powered tools for job success.
          </p>
        </div>
        <div>
          <Link href="/dashboard">
            <Button size="lg" className="px-8" >Get Started</Button>
          </Link>
        </div>
        <div className='hero-image-wrapper mt-5 md:mt-0'>
          <div ref={imageRef} className='hero-image' >   
            <Image src="/banner3.jpeg" width={1280} height={720} alt="Dashboard-Preview" className='rounded-lg shadow-2xl border mx-auto' priority />
          </div>
        </div>
        </div>
    </section>
  )
}

export default HeroSection