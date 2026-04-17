'use client';

import { Box, Container, Group } from '@mantine/core';

const navLinks = [
  { name: 'Home', href: '#', active: true },
  { name: 'Studio', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Journal', href: '#' },
  { name: 'Reach Us', href: '#' },
];

export function HeroSection() {
  return (
    <Box className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover z-0"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" type="video/mp4" />
      </video>

      {/* Navigation Bar */}
      <Box className="relative z-10 flex flex-row justify-between px-8 py-6 max-w-7xl mx-auto">
        <Box
          className="text-3xl tracking-tight font-['Instrument_Serif',_serif] text-white"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Velorah<sup className="text-xs">®</sup>
        </Box>

        {/* Desktop Nav Links */}
        <Group gap="xl" visibleFrom="md" className="hidden md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm transition-colors hover:text-white ${
                link.active ? 'text-white' : 'text-[hsl(var(--muted-foreground))]'
              }`}
            >
              {link.name}
            </a>
          ))}
        </Group>

        {/* CTA Button */}
        <button className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white hover:scale-[1.03] transition-transform cursor-pointer">
          Begin Journey
        </button>
      </Box>

      {/* Hero Section */}
      <Container
        size="xl"
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-[90px]"
      >
        <h1
          className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-white"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Where{' '}
          <em className="not-italic text-[hsl(var(--muted-foreground))]">dreams</em>
          {' '}rise through the{' '}
          <em className="not-italic text-[hsl(var(--muted-foreground))]">silence.</em>
        </h1>

        <p className="animate-fade-rise-delay text-[hsl(var(--muted-foreground))] text-base sm:text-lg max-w-2xl mt-8 leading-relaxed">
          We're designing tools for deep thinkers, bold creators, and quiet rebels. Amid the chaos, we build digital spaces for sharp focus and inspired work.
        </p>

        <button className="animate-fade-rise-delay-2 liquid-glass rounded-full px-14 py-5 text-base text-white mt-12 hover:scale-[1.03] transition-transform cursor-pointer">
          Begin Journey
        </button>
      </Container>
    </Box>
  );
}