"use client";

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Generate particles only on client to avoid hydration mismatch
  const [particles, setParticles] = useState<any[]>([]);
  useEffect(() => {
    setParticles([...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 10
    })));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = "/login";
      } else {
        alert(data.error || "Signup failed");
      }
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <>
      <style jsx global>{`
        html, body {
          margin: 0; padding: 0; width: 100%; height: 100%;
          background: #050210; overflow: hidden; font-family: 'Inter', sans-serif;
        }

        .scene-container {
          position: fixed; inset: 0; z-index: 0;
          background: radial-gradient(circle at center, #0d0628 0%, #050210 100%);
        }

        /* 3D Geometric Floor/Grid */
        .cyber-grid {
          position: absolute; inset: 0;
          background-image: 
            linear-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.15) 1px, transparent 1px);
          background-size: 60px 60px;
          transform: perspective(500px) rotateX(60deg) translateY(20%) scale(2);
          mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
          animation: gridMove 15s linear infinite;
        }

        @keyframes gridMove {
          from { background-position: 0 0; }
          to { background-position: 0 60px; }
        }

        /* Ambient purple light flares - sharp, not smoky */
        .light-flare {
          position: absolute; width: 1px; height: 40vh;
          background: linear-gradient(to bottom, transparent, #8b5cf6, transparent);
          opacity: 0.2;
          filter: blur(1px);
        }
      `}</style>

      <div style={styles.viewport}>
        <div className="scene-container">
          <div className="cyber-grid" />
          
          {/* Static Flares for depth */}
          <div className="light-flare" style={{left: '15%', top: '10%'}} />
          <div className="light-flare" style={{right: '20%', bottom: '10%'}} />
        </div>
        
        {/* Floating Neural Nodes (Connective Points) */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            animate={{ 
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
            style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              background: '#a78bfa',
              borderRadius: '50%',
              boxShadow: '0 0 10px #8b5cf6',
              zIndex: 1
            }}
          />
        ))}

        <main style={styles.main}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.terminalCard}
          >
            {/* Top scanning bar pulse */}
            <div style={styles.scanBar} />

            <header style={styles.header}>
              <div style={styles.logoGroup}>
                <div style={styles.logoIcon}>N</div>
                <div>
                  <div style={styles.brandName}>NANOSCAN</div>
                  <div style={styles.brandTag}>NODE_INITIALIZER_v2</div>
                </div>
              </div>
              <div style={styles.secureBadge}>
                <div style={styles.dot} />
                SECURE
              </div>
            </header>

            <div style={styles.body}>
              <h2 style={styles.h2}>Register <span style={{color: '#8b5cf6'}}>Access</span></h2>
              <p style={styles.p}>Initialize your credentials to join the hybrid detection network.</p>

              <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.inputStack}>
                  <label style={styles.label}>OPERATOR_NAME</label>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} style={styles.input} placeholder="Tushar Dudeja" required />
                </div>
                
                <div style={styles.inputStack}>
                  <label style={styles.label}>NETWORK_EMAIL_ID</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} style={styles.input} placeholder="admin@nanoscan.ai" required />
                </div>

                <div style={styles.row}>
                  <div style={styles.inputStack}>
                    <label style={styles.label}>SECRET_KEY</label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange} style={styles.input} placeholder="••••••••" required />
                  </div>
                  <div style={styles.inputStack}>
                    <label style={styles.label}>CONFIRM_KEY</label>
                    <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} style={styles.input} placeholder="••••••••" required />
                  </div>
                </div>

                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.02, backgroundColor: "#7c3aed" }}
                  whileTap={{ scale: 0.98 }}
                  style={styles.btn}
                >
                  INITIALIZE DEPLOYMENT
                </motion.button>
              </form>
            </div>

            <footer style={styles.footer}>
              <p style={styles.footerText}>
                Active Node? <Link href="/login" style={styles.link}>Authenticate</Link>
              </p>
            </footer>
          </motion.div>
        </main>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  viewport: { width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" },
  main: { zIndex: 10, width: "100%", maxWidth: "440px", padding: "20px" },
  terminalCard: {
    background: "rgba(10, 5, 25, 0.9)", 
    borderRadius: "16px", border: "1px solid rgba(139, 92, 246, 0.3)",
    boxShadow: "0 0 50px rgba(0,0,0,0.6)", position: "relative", overflow: "hidden"
  },
  scanBar: { position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #8b5cf6, transparent)", animation: "pulse 3s infinite" },
  header: { padding: "20px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(139, 92, 246, 0.1)" },
  logoGroup: { display: "flex", alignItems: "center", gap: "10px" },
  logoIcon: { width: "24px", height: "24px", background: "#8b5cf6", borderRadius: "4px", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "12px" },
  brandName: { color: "white", fontSize: "12px", fontWeight: "800", letterSpacing: "1px" },
  brandTag: { color: "#475569", fontSize: "8px", fontWeight: "700" },
  secureBadge: { display: "flex", alignItems: "center", gap: "6px", color: "#8b5cf6", fontSize: "9px", fontWeight: "900" },
  dot: { width: "5px", height: "5px", background: "#10b981", borderRadius: "50%", boxShadow: "0 0 8px #10b981" },
  body: { padding: "35px" },
  h2: { color: "white", fontSize: "30px", margin: "0 0 8px 0", fontWeight: "700" },
  p: { color: "#94a3b8", fontSize: "13px", margin: "0 0 25px 0" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  inputStack: { display: "flex", flexDirection: "column", gap: "6px", flex: 1 },
  label: { color: "#6366f1", fontSize: "9px", fontWeight: "800", letterSpacing: "0.5px" },
  input: { background: "#050210", border: "1px solid rgba(139, 92, 246, 0.2)", borderRadius: "8px", padding: "12px", color: "white", outline: "none", fontSize: "14px" },
  row: { display: "flex", gap: "12px" },
  btn: { background: "#8b5cf6", color: "white", border: "none", borderRadius: "8px", padding: "14px", fontWeight: "700", cursor: "pointer", marginTop: "10px" },
  footer: { padding: "15px", textAlign: "center", background: "rgba(0,0,0,0.2)" },
  footerText: { color: "#475569", fontSize: "12px", margin: 0 },
  link: { color: "#8b5cf6", textDecoration: "none", fontWeight: "700" }
};