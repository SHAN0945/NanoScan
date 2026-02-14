"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Matches your SignupPage particle logic exactly
    setParticles([...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 10
    })));

    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

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

        /* 3D Moving Grid - Twin of SignupPage */
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

        .light-flare {
          position: absolute; width: 1px; height: 40vh;
          background: linear-gradient(to bottom, transparent, #8b5cf6, transparent);
          opacity: 0.2;
          filter: blur(1px);
        }
      `}</style>

      <div style={styles.viewport}>
        {/* SHARED THEME LAYERS */}
        <div className="scene-container">
          <div className="cyber-grid" />
          <div className="light-flare" style={{left: '15%', top: '10%'}} />
          <div className="light-flare" style={{right: '20%', bottom: '10%'}} />
        </div>

        {/* Floating Neural Nodes */}
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={styles.terminalCard}
          >
            {/* Top Scanning Highlight */}
            <div style={styles.scanBar} />

            <header style={styles.header}>
              <div style={styles.logoGroup}>
                <div style={styles.logoIcon}>N</div>
                <div>
                  <div style={styles.brandName}>NANOSCAN</div>
                  <div style={styles.brandTag}>AUTH_GATEWAY_v2</div>
                </div>
              </div>
              <div style={styles.secureBadge}>
                <div style={styles.dot} />
                ENCRYPTED
              </div>
            </header>

            <div style={styles.body}>
              <h2 style={styles.h2}>Identify <span style={{color: '#8b5cf6'}}>Operator</span></h2>
              <p style={styles.p}>Please provide your security credentials to access the detection terminal.</p>

              {!session ? (
                <div style={styles.authContainer}>
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,1)", color: "#000" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => signIn("google")}
                    style={styles.googleBtn}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: 12 }}>
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity="0.6"/>
                    </svg>
                    Continue with Google
                  </motion.button>
                  
                  <div style={styles.orRow}>
                    <div style={styles.line} />
                    <span style={styles.orText}>SECURE_OAUTH</span>
                    <div style={styles.line} />
                  </div>
                </div>
              ) : (
                <div style={styles.userSection}>
                  <div style={styles.userCard}>
                    <div style={styles.avatar}>{session.user?.name?.[0]}</div>
                    <div>
                      <div style={styles.uName}>{session.user?.name}</div>
                      <div style={styles.uEmail}>{session.user?.email}</div>
                    </div>
                  </div>
                  <button onClick={() => router.push("/dashboard")} style={styles.primaryBtn}>RESTORE SESSION</button>
                  <button onClick={() => signOut()} style={styles.signOutBtn}>TERMINATE ACCESS</button>
                </div>
              )}
            </div>

            <footer style={styles.footer}>
              <p style={styles.footerText}>
                New Operator? <a href="/signup" style={styles.link}>Request Access</a>
              </p>
            </footer>
          </motion.div>
        </main>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  viewport: { width: "100vw", height: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" },
  main: { zIndex: 10, width: "100%", maxWidth: "440px", padding: "20px" },
  terminalCard: {
    background: "rgba(10, 5, 25, 0.95)", 
    backdropFilter: "blur(20px)",
    borderRadius: "16px", border: "1px solid rgba(139, 92, 246, 0.3)",
    boxShadow: "0 0 60px rgba(0,0,0,0.8)", position: "relative", overflow: "hidden"
  },
  scanBar: { position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #8b5cf6, transparent)" },
  header: { padding: "20px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(139, 92, 246, 0.1)" },
  logoGroup: { display: "flex", alignItems: "center", gap: "10px" },
  logoIcon: { width: "24px", height: "24px", background: "#8b5cf6", borderRadius: "4px", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "12px" },
  brandName: { color: "white", fontSize: "12px", fontWeight: "800", letterSpacing: "1px" },
  brandTag: { color: "#475569", fontSize: "8px", fontWeight: "700" },
  secureBadge: { display: "flex", alignItems: "center", gap: "6px", color: "#8b5cf6", fontSize: "9px", fontWeight: "900" },
  dot: { width: "5px", height: "5px", background: "#10b981", borderRadius: "50%", boxShadow: "0 0 8px #10b981" },
  body: { padding: "40px 35px" },
  h2: { color: "white", fontSize: "30px", margin: "0 0 8px 0", fontWeight: "700", letterSpacing: "-1px" },
  p: { color: "#94a3b8", fontSize: "13px", margin: "0 0 32px 0", lineHeight: "1.5" },
  authContainer: { display: "flex", flexDirection: "column", gap: "20px" },
  googleBtn: {
    width: "100%", height: "54px", background: "rgba(255,255,255,0.08)", color: "#fff",
    borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", fontWeight: "700", fontSize: "14px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease"
  },
  orRow: { display: "flex", alignItems: "center", gap: "12px", marginTop: "10px" },
  line: { flex: 1, height: "1px", background: "rgba(255,255,255,0.05)" },
  orText: { color: "#475569", fontSize: "9px", fontWeight: "800", letterSpacing: "1px" },
  userSection: { display: "flex", flexDirection: "column", gap: "16px" },
  userCard: { display: "flex", gap: "12px", padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" },
  avatar: { width: "40px", height: "40px", background: "#8b5cf6", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff" },
  uName: { fontSize: "14px", color: "#fff", fontWeight: 600 },
  uEmail: { fontSize: "12px", color: "#64748b" },
  primaryBtn: { height: "54px", background: "#8b5cf6", color: "#fff", borderRadius: "8px", border: "none", fontWeight: "700", cursor: "pointer", fontSize: "14px" },
  signOutBtn: { background: "none", border: "none", color: "#475569", fontSize: "12px", cursor: "pointer", marginTop: "8px" },
  footer: { padding: "20px", textAlign: "center", background: "rgba(0,0,0,0.2)" },
  footerText: { color: "#475569", fontSize: "12px", margin: 0 },
  link: { color: "#8b5cf6", textDecoration: "none", fontWeight: "700" }
};