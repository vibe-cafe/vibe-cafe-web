'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'dot' | 'symbol';
  symbol?: string;
  alpha: number;
}

const SYMBOLS = ['{}', '<>', '//', '[]', '()', '=>', ';;'];

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Resize handler
    const handleResize = () => {
      if (!canvas || !ctx) return;

      // Get the actual size of the canvas container
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      // Set canvas size to match container
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      console.log('Canvas resized:', canvas.width, canvas.height);
      
      initParticles();
    };

    // Initialize particles
    const initParticles = () => {
      if (!canvas) return;

      particles = [];
      const particleCount = Math.min(Math.floor(canvas.width * 0.05), 50); // More particles
      
      console.log('Initializing particles:', particleCount);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1, // Faster speed
          vy: (Math.random() - 0.5) * 1, // Faster speed
          size: Math.random() * 3 + 2, // Larger size
          type: Math.random() > 0.7 ? 'symbol' : 'dot', // More symbols
          symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          alpha: Math.random() * 0.5 + 0.3, // More visible
        });
      }
    };

    // Draw a single particle
    const drawParticle = (particle: Particle) => {
      if (!ctx) return;

      ctx.save();
      ctx.globalAlpha = particle.alpha;
      
      if (particle.type === 'symbol') {
        ctx.font = '16px monospace'; // Larger font
        ctx.fillStyle = '#4fd1c5'; // Solid color for better visibility
        const metrics = ctx.measureText(particle.symbol || '');
        ctx.fillText(
          particle.symbol || '',
          particle.x - metrics.width / 2,
          particle.y
        );
      } else {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = '#e2e8f0'; // Solid color for better visibility
        ctx.fill();
      }
      
      ctx.restore();
    };

    // Draw connections between particles
    const drawConnections = () => {
      if (!ctx) return;

      particles.forEach((particle, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particle.x - particles[j].x;
          const dy = particle.y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) { // Larger connection distance
            const opacity = (1 - distance / 150) * 0.2; // More visible
            ctx.beginPath();
            ctx.strokeStyle = `rgba(226, 232, 240, ${opacity})`;
            ctx.lineWidth = 1; // Thicker lines
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
    };

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particle positions
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges with some randomness
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
          particle.vx += (Math.random() - 0.5) * 0.2; // Add some randomness
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
          particle.vy += (Math.random() - 0.5) * 0.2; // Add some randomness
        }

        // Keep particles within bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      });

      drawConnections();
      particles.forEach(drawParticle);

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initial setup with a slight delay to ensure proper sizing
    setTimeout(() => {
      handleResize();
      animate();
      console.log('Animation started');
    }, 100);

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          opacity: 0.8, // More visible
          mixBlendMode: 'lighten',
        }}
      />
    </div>
  );
} 