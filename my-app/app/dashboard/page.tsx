"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type DemoResult = {
  id: string;
  inputUrl: string;
  // You can keep outputUrl if you still use it elsewhere, but dashboard will use 3 outputs below
  outputUrl?: string;
  label: string;
  defectId: string;
  confidence: number;
};

type RepairAdvice = {
  repairable: boolean;
  worthRepairing: boolean;
  estimatedCostINR: number;
  estimatedTimeHours: number;
  riskLevel: "low" | "medium" | "high";
  recommendation: string;
  notes: string[];
};

const IDS = Array.from({ length: 20 }, (_, i) => `img${String(i + 1).padStart(2, "0")}`);

function imgIdToSampleNumber(id: string) {
  // img01 -> 1, img02 -> 2 ...
  const n = Number(id.replace("img", ""));
  return Number.isFinite(n) ? n : 1;
}

export default function DemoDashboard() {
  const router = useRouter();

  const [selectedId, setSelectedId] = useState("img01");
  const [data, setData] = useState<DemoResult | null>(null);

  // Gemini
  const [advice, setAdvice] = useState<RepairAdvice | null>(null);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [adviceErr, setAdviceErr] = useState<string | null>(null);

  // Page errors
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Compute 3 output image URLs based on selected id
  const outputUrls = useMemo(() => {
    const sampleNo = imgIdToSampleNumber(selectedId); // 1..20
    return {
      bbox: `/demo/outputs/sample${sampleNo}_bbox.png`,
      zoomed: `/demo/outputs/sample${sampleNo}_zoomed.png`,
      gradcam: `/demo/outputs/sample${sampleNo}_gradcam.png`,
    };
  }, [selectedId]);

  const fetchAdvice = async (payload: { defectId: string; label: string; confidence: number }) => {
    setAdviceLoading(true);
    setAdviceErr(null);
    setAdvice(null);

    try {
      const aRes = await fetch("/api/repair-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      const aJson = await aRes.json();

      if (!aRes.ok) {
        setAdvice(null);
        setAdviceErr(
          aJson?.detail ? `${aJson.error}: ${aJson.detail}` : aJson?.error || "Gemini call failed"
        );
        return;
      }

      setAdvice(aJson);
    } catch {
      setAdvice(null);
      setAdviceErr("Gemini server not reachable / API error");
    } finally {
      setAdviceLoading(false);
    }
  };

  const loadResult = async (id: string) => {
    setSelectedId(id);
    setLoading(true);
    setErr(null);

    // Reset Gemini UI each time
    setAdvice(null);
    setAdviceErr(null);

    try {
      const res = await fetch(`/api/demo-result?id=${id}`, { cache: "no-store" });
      const json = await res.json();

      if (!res.ok) {
        setData(null);
        setErr(json?.error || "Failed to fetch result");
        return;
      }

      setData(json);

      await fetchAdvice({
        defectId: json.defectId,
        label: json.label,
        confidence: json.confidence,
      });
    } catch {
      setData(null);
      setErr("Server not reachable / API error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResult("img01");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.page}>
      {/* Top Bar */}
      <div style={styles.topbar}>
        <div>
          <h1 style={styles.title}>NanoScan Demo Dashboard</h1>
          <p style={styles.subtitle}>
            Select a sample PCB image to view <b>saved outputs</b> + <b>repair advice (Gemini)</b>.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => router.push("/sample")} style={styles.navBtn}>
            Upload Page
          </button>

          <button onClick={() => signOut({ callbackUrl: "/login" })} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.body}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Sample Inputs (20)</h2>
              <p style={styles.sectionSubtitle}>Click an image to view outputs.</p>
            </div>

            <div style={styles.pill}>
              <span style={{ opacity: 0.8 }}>Mode:</span> Hardcoded Results
            </div>
          </div>

          <div style={styles.grid}>
            {IDS.map((id) => (
              <button
                key={id}
                onClick={() => loadResult(id)}
                style={{
                  ...styles.thumbBtn,
                  outline:
                    selectedId === id ? "2px solid rgba(34, 211, 238, 0.9)" : "1px solid #243042",
                }}
              >
                <div style={styles.thumbImageWrap}>
                  <Image
                    src={`/demo/inputs/${id}.png`}
                    alt={id}
                    fill
                    sizes="140px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={styles.thumbLabelRow}>
                  <span style={styles.thumbLabel}>{id}</span>
                  {selectedId === id && <span style={styles.activeDot} />}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main style={styles.main}>
          {loading && (
            <div style={styles.infoBox}>
              Loading result for <b>{selectedId}</b>...
            </div>
          )}

          {err && <div style={styles.errorBox}>{err}</div>}

          {data && (
            <>
              {/* Summary Cards */}
              <div style={styles.cardsRow}>
                <div style={styles.card}>
                  <div style={styles.cardLabel}>Image ID</div>
                  <div style={styles.cardValueCyan}>{data.id}</div>
                  <div style={styles.cardSmall}>Selected sample</div>
                </div>

                <div style={styles.card}>
                  <div style={styles.cardLabel}>Detected Defect</div>
                  <div style={styles.cardValueGreen}>{data.label}</div>
                  <div style={styles.cardSmall}>Defect ID: {data.defectId}</div>
                </div>

                <div style={styles.card}>
                  <div style={styles.cardLabel}>Confidence</div>
                  <div style={styles.cardValueYellow}>{Math.round(data.confidence * 100)}%</div>
                  <div style={styles.cardSmall}>Saved model output</div>
                </div>
              </div>

              {/* Images: Input + 3 Outputs */}
              <div style={styles.imageGrid}>
                <div style={styles.imageCardBig}>
                  <div style={styles.imageHeader}>
                    <h3 style={styles.imageTitle}>Input</h3>
                    <span style={styles.imageTag}>Original</span>
                  </div>

                  <div style={styles.bigImageWrap}>
                    <Image
                      src={data.inputUrl}
                      alt="Input"
                      fill
                      sizes="900px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>

                <div style={styles.imageCard}>
                  <div style={styles.imageHeader}>
                    <h3 style={styles.imageTitle}>BBox</h3>
                    <span style={styles.imageTag}>Detection</span>
                  </div>
                  <div style={styles.bigImageWrapSmall}>
                    <Image
                      src={outputUrls.bbox}
                      alt="BBox Output"
                      fill
                      sizes="500px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>

                <div style={styles.imageCard}>
                  <div style={styles.imageHeader}>
                    <h3 style={styles.imageTitle}>Zoomed</h3>
                    <span style={styles.imageTag}>Close-up</span>
                  </div>
                  <div style={styles.bigImageWrapSmall}>
                    <Image
                      src={outputUrls.zoomed}
                      alt="Zoomed Output"
                      fill
                      sizes="500px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>

                <div style={styles.imageCard}>
                  <div style={styles.imageHeader}>
                    <h3 style={styles.imageTitle}>Grad-CAM</h3>
                    <span style={styles.imageTag}>Explainability</span>
                  </div>
                  <div style={styles.bigImageWrapSmall}>
                    <Image
                      src={outputUrls.gradcam}
                      alt="GradCAM Output"
                      fill
                      sizes="500px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div style={styles.metaCard}>
                <div style={styles.metaRow}>
                  <div><b>Label:</b> {data.label}</div>
                  <div><b>Defect ID:</b> {data.defectId}</div>
                  <div><b>Confidence:</b> {Math.round(data.confidence * 100)}%</div>
                </div>
                <div style={styles.metaHint}>
                  Outputs shown are <b>pre-generated</b> and stored for demo.
                </div>
              </div>

              {/* Repair Advice */}
              <div style={{ marginTop: 16 }}>
                <div style={styles.sectionHeaderRow}>
                  <h3 style={styles.sectionHeader}>Repair Advice (Gemini)</h3>

                  <button
                    style={styles.retryBtn}
                    onClick={() => {
                      if (!data) return;
                      fetchAdvice({
                        defectId: data.defectId,
                        label: data.label,
                        confidence: data.confidence,
                      });
                    }}
                    disabled={adviceLoading}
                  >
                    {adviceLoading ? "Retrying..." : "Retry Gemini"}
                  </button>
                </div>

                {adviceLoading && (
                  <div style={styles.infoBox}>Generating repair advice using Gemini...</div>
                )}

                {adviceErr && (
                  <div style={styles.errorBox}>
                    <b>Gemini call failed:</b> {adviceErr}
                    <div style={{ marginTop: 6, fontSize: 12, color: "#fecaca" }}>
                      Tip: Check your <code>GEMINI_API_KEY</code> and <code>/api/repair-advice</code> logs.
                    </div>
                  </div>
                )}

                {advice && (
                  <div style={styles.adviceGrid}>
                    <div style={styles.card}>
                      <div style={styles.cardLabel}>Repairable</div>
                      <div style={styles.cardValueGreen}>{advice.repairable ? "Yes" : "No"}</div>
                      <div style={styles.cardSmall}>Risk: {advice.riskLevel}</div>
                    </div>

                    <div style={styles.card}>
                      <div style={styles.cardLabel}>Worth Repairing</div>
                      <div style={styles.cardValueYellow}>{advice.worthRepairing ? "Yes" : "No"}</div>
                      <div style={styles.cardSmall}>Decision support</div>
                    </div>

                    <div style={styles.card}>
                      <div style={styles.cardLabel}>Estimated Cost</div>
                      <div style={styles.cardValueCyan}>₹{advice.estimatedCostINR}</div>
                      <div style={styles.cardSmall}>~{advice.estimatedTimeHours} hrs</div>
                    </div>

                    <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
                      <div style={styles.cardLabel}>Recommendation</div>
                      <div style={{ marginTop: 10, fontWeight: 800, fontSize: 14 }}>
                        {advice.recommendation}
                      </div>
                      <ul style={styles.notesList}>
                        {advice.notes.map((n, i) => (
                          <li key={i}>{n}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Styles ---------------- */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(1200px 600px at 30% -10%, #0b2240 0%, #070b14 55%)",
    color: "#e5e7eb",
    fontFamily: "system-ui, sans-serif",
  },
  topbar: {
    padding: "18px 22px",
    borderBottom: "1px solid rgba(148,163,184,0.18)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backdropFilter: "blur(6px)",
  },
  title: { fontSize: 22, fontWeight: 900, color: "#67e8f9", margin: 0, letterSpacing: 0.2 },
  subtitle: { fontSize: 13, color: "#9ca3af", marginTop: 6, lineHeight: 1.4 },

  navBtn: {
    padding: "9px 14px",
    borderRadius: 12,
    border: "1px solid rgba(14,165,233,0.7)",
    background: "linear-gradient(180deg, rgba(14,165,233,1), rgba(2,132,199,1))",
    color: "#04131d",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 8px 22px rgba(14,165,233,0.18)",
  },
  logoutBtn: {
    padding: "9px 14px",
    borderRadius: 12,
    border: "1px solid rgba(239,68,68,0.35)",
    background: "linear-gradient(180deg, rgba(69,10,10,1), rgba(34,6,6,1))",
    color: "#fecaca",
    fontWeight: 800,
    cursor: "pointer",
  },

  body: { display: "grid", gridTemplateColumns: "340px 1fr" },

  sidebar: {
    padding: 14,
    borderRight: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(6,10,18,0.55)",
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  pill: {
    fontSize: 12,
    padding: "7px 10px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.2)",
    background: "rgba(11,18,32,0.8)",
    color: "#e5e7eb",
    whiteSpace: "nowrap",
  },

  sectionTitle: { fontSize: 14, fontWeight: 800, margin: 0, color: "#e2e8f0" },
  sectionSubtitle: { fontSize: 12, color: "#94a3b8", marginTop: 6 },

  grid: {
    marginTop: 10,
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 10,
  },
  thumbBtn: {
    borderRadius: 14,
    padding: 8,
    cursor: "pointer",
    background: "linear-gradient(180deg, rgba(11,18,32,0.95), rgba(6,10,18,0.8))",
    boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
    transition: "transform 120ms ease",
  },
  thumbImageWrap: {
    position: "relative",
    aspectRatio: "1 / 1",
    borderRadius: 10,
    overflow: "hidden",
    border: "1px solid rgba(148,163,184,0.18)",
    background: "#000",
  },
  thumbLabelRow: {
    marginTop: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  thumbLabel: { fontSize: 12, textAlign: "center", color: "#cbd5e1", fontWeight: 700 },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    background: "#22d3ee",
    boxShadow: "0 0 0 4px rgba(34,211,238,0.15)",
  },

  main: { padding: 18 },

  infoBox: {
    border: "1px solid rgba(148,163,184,0.18)",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    background: "rgba(11,18,32,0.75)",
  },
  errorBox: {
    border: "1px solid rgba(239,68,68,0.35)",
    background: "rgba(43,11,11,0.85)",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    color: "#fecaca",
  },

  cardsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginTop: 12,
  },
  card: {
    border: "1px solid rgba(148,163,184,0.18)",
    padding: 14,
    borderRadius: 16,
    background: "linear-gradient(180deg, rgba(11,18,32,0.9), rgba(6,10,18,0.75))",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  },
  cardLabel: { fontSize: 12, color: "#94a3b8", fontWeight: 700 },
  cardSmall: { fontSize: 12, color: "#9ca3af", marginTop: 8 },

  cardValueCyan: { fontSize: 18, fontWeight: 900, color: "#67e8f9", marginTop: 8 },
  cardValueGreen: { fontSize: 18, fontWeight: 900, color: "#86efac", marginTop: 8 },
  cardValueYellow: { fontSize: 18, fontWeight: 900, color: "#fde047", marginTop: 8 },

  imageGrid: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr 1fr",
    gap: 12,
    marginTop: 14,
  },
  imageCardBig: {
    gridRow: "1 / span 2",
    border: "1px solid rgba(148,163,184,0.18)",
    padding: 14,
    borderRadius: 16,
    background: "linear-gradient(180deg, rgba(11,18,32,0.9), rgba(6,10,18,0.75))",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  },
  imageCard: {
    border: "1px solid rgba(148,163,184,0.18)",
    padding: 14,
    borderRadius: 16,
    background: "linear-gradient(180deg, rgba(11,18,32,0.9), rgba(6,10,18,0.75))",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  },
  imageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  imageTitle: { fontSize: 13, fontWeight: 900, margin: 0, color: "#e2e8f0" },
  imageTag: {
    fontSize: 11,
    padding: "5px 10px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.18)",
    color: "#cbd5e1",
    background: "rgba(2,6,23,0.35)",
  },

  bigImageWrap: {
    position: "relative",
    aspectRatio: "16 / 10",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: 12,
    overflow: "hidden",
    background: "#000",
  },
  bigImageWrapSmall: {
    position: "relative",
    aspectRatio: "16 / 10",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: 12,
    overflow: "hidden",
    background: "#000",
  },

  metaCard: {
    marginTop: 12,
    border: "1px solid rgba(148,163,184,0.18)",
    padding: 14,
    borderRadius: 16,
    background: "rgba(11,18,32,0.7)",
  },
  metaRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    fontSize: 13,
    color: "#e5e7eb",
  },
  metaHint: {
    marginTop: 8,
    fontSize: 12,
    color: "#94a3b8",
  },

  sectionHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  sectionHeader: { fontSize: 14, fontWeight: 900, margin: 0, color: "#cbd5e1" },
  retryBtn: {
    padding: "9px 12px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(11,18,32,0.8)",
    color: "#e5e7eb",
    fontWeight: 900,
    cursor: "pointer",
  },

  adviceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
  },

  notesList: {
    marginTop: 10,
    color: "#9ca3af",
    lineHeight: 1.6,
    paddingLeft: 18,
    fontSize: 13,
  },
};
