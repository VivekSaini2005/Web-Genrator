import React, { useMemo } from 'react';
import './Shimmer.css';

const PreviewShimmer = () => {
  // Generate random values for skeleton layout rendering to look asymmetrical and organic.
  const visuals = useMemo(() => {
    const randomOffset = () => `${(Math.random() * 0.5).toFixed(2)}s`;
    const randomWidth = (min, max) => `${Math.floor(Math.random() * (max - min) + min)}%`;
    const randomOpacity = () => 0.65 + Math.random() * 0.35; // 0.65 - 1.0

    return {
      navItems: Array.from({ length: 3 }).map(() => ({
        width: `${Math.floor(Math.random() * 20) + 60}px`,
        delay: randomOffset(),
        opacity: randomOpacity()
      })),
      heroTitle: { width: randomWidth(45, 60), delay: randomOffset(), opacity: randomOpacity() },
      heroSub1: { width: randomWidth(30, 40), delay: randomOffset(), opacity: randomOpacity() },
      heroSub2: { width: randomWidth(20, 30), delay: randomOffset(), opacity: randomOpacity() },
      button: { delay: randomOffset(), opacity: randomOpacity() },
      cards: Array.from({ length: 3 }).map(() => ({
        delay: randomOffset(),
        opacity: randomOpacity(),
        marginOffset: `${Math.floor(Math.random() * 12)}px` // Stagger heights slightly
      }))
    };
  }, []);

  return (
    <div className="preview-shimmer-container">
      {/* Navbar Skeleton */}
      <div className="preview-nav">
        <div 
          className="preview-logo shimmer-wrapper-light" 
          style={{ animationDelay: visuals.heroTitle.delay, opacity: visuals.heroTitle.opacity }} 
        />
        <div className="preview-nav-items">
          {visuals.navItems.map((item, i) => (
            <div 
              key={i} 
              className="preview-nav-item shimmer-wrapper-light" 
              style={{ width: item.width, animationDelay: item.delay, filter: `opacity(${item.opacity})` }} 
            />
          ))}
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="preview-hero">
        <div 
          className="preview-hero-title shimmer-wrapper-light" 
          style={{ width: visuals.heroTitle.width, animationDelay: visuals.heroTitle.delay, filter: `opacity(${visuals.heroTitle.opacity})` }} 
        />
        <div 
          className="preview-hero-subtitle shimmer-wrapper-light" 
          style={{ width: visuals.heroSub1.width, animationDelay: visuals.heroSub1.delay, filter: `opacity(${visuals.heroSub1.opacity})` }} 
        />
        <div 
          className="preview-hero-subtitle-2 shimmer-wrapper-light" 
          style={{ width: visuals.heroSub2.width, animationDelay: visuals.heroSub2.delay, filter: `opacity(${visuals.heroSub2.opacity})` }} 
        />
        {/* Button Placeholder */}
        <div 
          className="preview-hero-button shimmer-wrapper-light" 
          style={{ animationDelay: visuals.button.delay, filter: `opacity(${visuals.button.opacity})` }} 
        />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="preview-cards">
        {visuals.cards.map((card, i) => (
          <div 
            key={i} 
            className="preview-card shimmer-wrapper-light" 
            style={{ animationDelay: card.delay, filter: `opacity(${card.opacity})`, marginTop: i % 2 !== 0 ? card.marginOffset : '0px' }} 
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewShimmer;
