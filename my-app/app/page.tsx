'use client';
import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.logo}>
          Nano<span style={styles.logoAccent}>Scan</span>
        </div>
        <div style={styles.navLinks}>
          <Link href="/login" style={styles.loginLink}>Sign In</Link>
          <Link href="/signup" style={styles.btnPrimary}>Get Started</Link>
        </div>
      </nav>

      <header style={styles.hero}>
        <span style={styles.badge}>Revolutionizing Quality Control</span>
        <h1 style={styles.title}>
          Precision Inspection <br /> 
          <span style={styles.gradientText}>at the Nano Scale</span>
        </h1>
        <p style={styles.description}>
          Detect microscopic PCB defects instantly using our hybrid CNN and XGBoost architecture. 
          Automate your workflow with 99.2% accuracy.
        </p>
        <div style={styles.ctaGroup}>
          <Link href="/signup" style={styles.btnPrimaryLarge}>Start Scanning Now</Link>
          <Link href="/sample" style={styles.btnSecondary}>View Live Demo</Link>
        </div>
      </header>
    </div>
  );
}

// Inline CSS Styles for Next.js App Router
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#020617', // slate-950
    color: '#e2e8f0',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'white',
    letterSpacing: '-0.05em',
  },
  logoAccent: {
    color: '#06b6d4', // cyan-500
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  loginLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  hero: {
    textAlign: 'center',
    padding: '8rem 2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    background: 'rgba(6, 182, 212, 0.1)',
    border: '1px solid rgba(6, 182, 212, 0.2)',
    color: '#22d3ee',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: 800,
    color: 'white',
    marginBottom: '1.5rem',
    lineHeight: 1.1,
  },
  gradientText: {
    color: '#22d3ee', // Fallback for gradient
    backgroundImage: 'linear-gradient(to right, #22d3ee, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  } as any,
  description: {
    fontSize: '1.25rem',
    color: '#94a3b8',
    marginBottom: '2.5rem',
    lineHeight: 1.6,
  },
  ctaGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  btnPrimary: {
    backgroundColor: '#0891b2',
    color: 'white',
    padding: '0.5rem 1.25rem',
    borderRadius: '0.5rem',
    fontWeight: 600,
    textDecoration: 'none',
  },
  btnPrimaryLarge: {
    backgroundColor: '#0891b2',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '0.75rem',
    fontWeight: 700,
    textDecoration: 'none',
    boxShadow: '0 10px 15px -3px rgba(8, 145, 178, 0.3)',
  },
  btnSecondary: {
    backgroundColor: '#1e293b',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '0.75rem',
    fontWeight: 700,
    textDecoration: 'none',
    border: '1px solid #334155',
  },
};