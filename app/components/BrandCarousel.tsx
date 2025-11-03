'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './BrandCarousel.module.css';

type Brand = {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  background?: string;
};

const brands: Brand[] = [
  {
    id: 'northwave',
    name: 'Northwave Apparel',
    logoUrl: 'https://dummyimage.com/240x120/0f172a/ffffff&text=Northwave',
    description:
      'Performance-driven outerwear with recycled fabrics and minimal environmental footprint.',
    background: '#f8fafc'
  },
  {
    id: 'lumen',
    name: 'Lumen Electronics',
    logoUrl: 'https://dummyimage.com/240x120/1d4ed8/ffffff&text=Lumen',
    description:
      'Premium audio gear crafted for immersive experiences and modern living spaces.',
    background: '#eff6ff'
  },
  {
    id: 'ember',
    name: 'Ember & Co.',
    logoUrl: 'https://dummyimage.com/240x120/7c3aed/ffffff&text=Ember+%26+Co',
    description:
      'Handmade lifestyle essentials inspired by warm palettes and slow living.',
    background: '#f5f3ff'
  },
  {
    id: 'terra',
    name: 'Terra Botanica',
    logoUrl: 'https://dummyimage.com/240x120/0f766e/ffffff&text=Terra',
    description:
      'Organic skincare tailored to everyday rituals powered by adaptogenic botanicals.',
    background: '#ecfdf5'
  },
  {
    id: 'vertex',
    name: 'Vertex Studio',
    logoUrl: 'https://dummyimage.com/240x120/7c2d12/ffffff&text=Vertex',
    description:
      'Architectural furniture with sculptural silhouettes for bold, modern interiors.',
    background: '#fef3c7'
  },
  {
    id: 'astrid',
    name: 'Astrid Optics',
    logoUrl: 'https://dummyimage.com/240x120/312e81/ffffff&text=Astrid',
    description:
      'Innovative eyewear fusing aerospace-grade materials with everyday comfort.',
    background: '#e0e7ff'
  },
  {
    id: 'cascade',
    name: 'Cascade Supply',
    logoUrl: 'https://dummyimage.com/240x120/0369a1/ffffff&text=Cascade',
    description:
      'Adventure staples designed for durability in unpredictable climates worldwide.',
    background: '#e0f2fe'
  },
  {
    id: 'atelier',
    name: 'Atelier Noir',
    logoUrl: 'https://dummyimage.com/240x120/334155/ffffff&text=Atelier',
    description:
      'Limited-run fashion capsules featuring art-forward collaborations each season.',
    background: '#f1f5f9'
  }
];

const AUTO_SCROLL_DELAY = 3500;

const getScrollAmount = (track: HTMLDivElement | null): number => {
  if (!track) return 220;
  const firstCard = track.querySelector('[data-card]') as HTMLDivElement | null;
  if (!firstCard) return 220;
  const computed = window.getComputedStyle(track);
  const gap = parseFloat(computed.columnGap || '0');
  return firstCard.getBoundingClientRect().width + gap;
};

export function BrandCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [openBrandId, setOpenBrandId] = useState<string | null>(null);

  const brandsLoop = useMemo(() => [...brands, ...brands], []);

  const handleScroll = useCallback(
    (direction: 'next' | 'prev') => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport) return;
      const amount = getScrollAmount(track);
      viewport.scrollBy({
        left: direction === 'next' ? amount : -amount,
        behavior: 'smooth'
      });
    },
    []
  );

  useEffect(() => {
    if (isPaused) return;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport) return;

    const intervalId = window.setInterval(() => {
      const amount = getScrollAmount(track);
      viewport.scrollBy({ left: amount, behavior: 'smooth' });
    }, AUTO_SCROLL_DELAY);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleScroll('next');
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handleScroll('prev');
      }
    };

    viewport.addEventListener('keydown', handleKeyDown);
    return () => viewport.removeEventListener('keydown', handleKeyDown);
  }, [handleScroll]);

  const toggleDescription = useCallback((brandId: string) => {
    setOpenBrandId((current) => (current === brandId ? null : brandId));
  }, []);

  return (
    <section
      className={styles.carouselWrapper}
      aria-label="Featured brand partners"
      role="region"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <header className={styles.carouselHeader}>
        <h2>Trusted by global lifestyle brands</h2>
        <div className={styles.carouselControls}>
          <button
            type="button"
            className={styles.arrowButton}
            onClick={() => handleScroll('prev')}
            aria-label="Scroll brands backward"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15.75 5.25 9 12l6.75 6.75"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className={styles.arrowButton}
            onClick={() => handleScroll('next')}
            aria-label="Scroll brands forward"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8.25 5.25 15 12l-6.75 6.75"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>
      <div
        className={styles.carouselViewport}
        ref={viewportRef}
        role="listbox"
        aria-label="Brand logos"
        tabIndex={0}
      >
        <div className={styles.carouselTrack} ref={trackRef}>
          {brandsLoop.map((brand, index) => {
            const duplicated = index >= brands.length;
            const elementId = duplicated ? `${brand.id}-clone-${index}` : brand.id;
            const isOpen = openBrandId === brand.id;
            return (
              <button
                key={elementId}
                type="button"
                className={styles.brandCard}
                style={{ background: brand.background }}
                data-card
                data-open={isOpen}
                aria-label={`${brand.name}. Tap to ${isOpen ? 'hide' : 'show'} description.`}
                aria-pressed={isOpen}
                onClick={() => toggleDescription(brand.id)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
              >
                <Image
                  src={brand.logoUrl}
                  alt={`${brand.name} logo`}
                  width={220}
                  height={110}
                  className={styles.brandImage}
                  loading="lazy"
                />
                <div className={styles.brandOverlay} aria-hidden={!isOpen}>
                  {brand.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
