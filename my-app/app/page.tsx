"use client";

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';

export default function LandingPage() {
  const [particles, setParticles] = useState<any[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setParticles([...Array(25)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: 15 + Math.random() * 20,
    })));

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <style jsx global>{`
        html, body {
          margin: 0; padding: 0; width: 100vw; height: 100vh;
          background: #03000a; overflow: hidden; font-family: 'Inter', sans-serif;
        }

        .scene-container {
          position: fixed; inset: 0; z-index: 0;
          background: radial-gradient(circle at 50% 50%, #0d0628 0%, #03000a 100%);
        }

        .cyber-grid {
          position: absolute; inset: 0;
          background-image: 
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          transform: perspective(1000px) rotateX(60deg) translateY(0%) scale(2);
          mask-image: radial-gradient(circle at center, black, transparent 80%);
          animation: gridPan 20s linear infinite;
        }

        @keyframes gridPan {
          from { background-position: 0 0; }
          to { background-position: 0 50px; }
        }

        .mouse-glow {
          position: fixed; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none; z-index: 1;
          transform: translate(-50%, -50%);
        }
      `}</style>

      <div style={styles.container}>
        <div className="scene-container">
          <div className="cyber-grid" />
          <div className="mouse-glow" style={{ left: mousePos.x, top: mousePos.y }} />
        </div>

        {particles.map((p) => (
          <motion.div
            key={p.id}
            animate={{ y: [0, -120, 0], x: [0, 30, 0], opacity: [0, 0.4, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              background: '#8b5cf6', borderRadius: '50%',
              boxShadow: '0 0 15px #8b5cf6', zIndex: 1
            }}
          />
        ))}

        <motion.nav 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={styles.nav}
        >
          <div style={styles.logo}>
            N<span style={{color: '#8b5cf6'}}>A</span>NO<span style={styles.logoThin}>SCAN</span>
          </div>
          <div style={styles.navLinks}>
            <Link href="/login" style={styles.loginLink}>Terminal Login</Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/signup" style={styles.navBtn}>Initialize Account</Link>
            </motion.div>
          </div>
        </motion.nav>

        <main style={styles.hero}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={styles.badge}>
              <span style={styles.pulseDot} />
              SYSTEM STATUS: OPTIMIZED
            </div>
            
            <h1 style={styles.title}>
              The Future of <br />
              <span style={styles.gradientText}>Visual Inspection</span>
            </h1>
            
            <p style={styles.description}>
              Harnessing a <span style={styles.highlight}>Hybrid CNN-XGBoost</span> architecture to identify PCB defects 
              with surgical precision.
            </p>
            
            {/* ALIGNED BUTTON GROUP */}
            <div style={styles.ctaGroup}>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link href="/signup" style={styles.btnMain}>
                  Get Started Free
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link href="/sample" style={styles.btnGhost}>
                  Explore Neural Network
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </main>

        <div style={styles.footerInfo}>
          <div style={styles.dataPoint}>ACCURACY: 99.2%</div>
          <div style={styles.dataPoint}>LATENCY: 14MS</div>
          <div style={styles.dataPoint}>MODEL: HYBRID_V2</div>
        </div>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column',
    position: 'relative', overflow: 'hidden', color: '#fff'
  },
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1.5rem 4rem', zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.05)'
  },
  logo: { fontSize: '1.2rem', fontWeight: 900, letterSpacing: '4px' },
  logoThin: { fontWeight: 200, opacity: 0.6 },
  navLinks: { display: 'flex', alignItems: 'center', gap: '3rem' },
  loginLink: { color: '#94a3b8', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' },
  navBtn: { background: '#fff', color: '#000', padding: '0.6rem 1.2rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none' },
  hero: {
    flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
    alignItems: 'center', textAlign: 'center', zIndex: 10, padding: '0 20px'
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px',
    background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '100px', color: '#a78bfa', fontSize: '0.65rem', fontWeight: 900,
    letterSpacing: '2px', marginBottom: '2rem'
  },
  pulseDot: { width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' },
  title: { fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', fontWeight: 900, lineHeight: 1, letterSpacing: '-3px', margin: '0 0 1.5rem 0' },
  gradientText: {
    background: 'linear-gradient(to bottom, #fff 30%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  description: { fontSize: '1.1rem', color: '#94a3b8', maxWidth: '550px', lineHeight: 1.6, marginBottom: '3rem' },
  highlight: { color: '#fff', fontWeight: 600 },
  
  // FIX: Explicit flex-row with center alignment
  ctaGroup: { 
    display: 'flex', 
    flexDirection: 'row', 
    gap: '1rem', 
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%'
  },
  
  btnMain: {
    background: '#8b5cf6', color: '#fff', padding: '1rem 2.5rem', borderRadius: '8px',
    fontWeight: 800, textDecoration: 'none', fontSize: '1rem', display: 'inline-block',
    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)', minWidth: '200px'
  },
  btnGhost: {
    background: 'rgba(255,255,255,0.03)', color: '#fff', padding: '1rem 2.5rem', borderRadius: '8px',
    fontWeight: 800, textDecoration: 'none', fontSize: '1rem', border: '1px solid rgba(255,255,255,0.1)',
    display: 'inline-block', minWidth: '200px'
  },
  
  footerInfo: {
    position: 'absolute', bottom: '40px', left: '0', right: '0', display: 'flex',
    justifyContent: 'center', gap: '40px', opacity: 0.4, zIndex: 5
  },
  dataPoint: { fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px' }
};