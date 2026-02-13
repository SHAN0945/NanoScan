"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type DemoResult = {
  id: string;
  inputUrl: string;
  outputUrl: string;
  label: string;
  defectId: string;
  confidence: number;
};

const IDS = Array.from({ length: 20 }, (_, i) =>
  `img${String(i + 1).padStart(2, "0")}`
);

export default function DemoDashboard() {
  const router = useRouter();

  const [selectedId, setSelectedId] = useState("img01");
  const [data, setData] = useState<DemoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const loadResult = async (id: string) => {
    setSelectedId(id);
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(`/api/demo-result?id=${id}`, { cache: "no-store" });
      const json = await res.json();

      if (!res.ok) {
        setData(null);
        setErr(json?.error || "Failed to fetch result");
        return;
      }

      setData(json);
    } catch {
      setData(null);
      setErr("Server not reachable / API error");
    } finally {
      setLoading(false);
    }
  };

  // Load first sample once
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
            Select a sample PCB image to view saved AI output (demo mode).
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => router.push("/sample")}
            style={styles.navBtn}
          >
            Go to Upload Page
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={styles.logoutBtn}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <h2 style={styles.sectionTitle}>Sample Inputs (20)</h2>
          <p style={styles.sectionSubtitle}>
            Click an image to view stored output.
          </p>

          <div style={styles.grid}>
            {IDS.map((id) => (
              <button
                key={id}
                onClick={() => loadResult(id)}
                style={{
                  ...styles.thumbBtn,
                  borderColor: selectedId === id ? "#22d3ee" : "#2b3648",
                }}
              >
                <div style={styles.thumbImageWrap}>
                  <Image
                    src={`/demo/inputs/${id}.jpg`}
                    alt={id}
                    fill
                    sizes="120px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={styles.thumbLabel}>{id}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Panel */}
        <main style={styles.main}>
          {loading && (
            <div style={styles.infoBox}>
              Loading result for <b>{selectedId}</b>...
            </div>
          )}

          {err && <div style={styles.errorBox}>{err}</div>}

          {data && (
            <>
              {/* Summary */}
              <div style={styles.cardsRow}>
                <div style={styles.card}>
                  <div style={styles.cardLabel}>Image ID</div>
                  <div style={styles.cardValueCyan}>{data.id}</div>
                </div>

                <div style={styles.card}>
                  <div style={styles.cardLabel}>Detected Defect</div>
                  <div style={styles.cardValueGreen}>{data.label}</div>
                  <div style={styles.cardSmall}>
                    Defect ID: {data.defectId}
                  </div>
                </div>

                <div style={styles.card}>
                  <div style={styles.cardLabel}>Confidence</div>
                  <div style={styles.cardValueYellow}>
                    {Math.round(data.confidence * 100)}%
                  </div>
                  <div style={styles.cardSmall}>Saved model output</div>
                </div>
              </div>

              {/* Images */}
              <div style={styles.imagesRow}>
                <div style={styles.imageCard}>
                  <h3 style={styles.imageTitle}>Input Image</h3>
                  <div style={styles.bigImageWrap}>
                    <Image
                      src={data.inputUrl}
                      alt="Input"
                      fill
                      sizes="600px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>

                <div style={styles.imageCard}>
                  <h3 style={styles.imageTitle}>Model Output</h3>
                  <div style={styles.bigImageWrap}>
                    <Image
                      src={data.outputUrl}
                      alt="Output"
                      fill
                      sizes="600px"
                      style={{ objectFit: "contain" }}
                    />
                  </div>

                  <div style={styles.meta}>
                    <div><b>Label:</b> {data.label}</div>
                    <div><b>Defect ID:</b> {data.defectId}</div>
                    <div>
                      <b>Confidence:</b>{" "}
                      {Math.round(data.confidence * 100)}%
                    </div>
                  </div>
                </div>
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
    background: "#070b14",
    color: "#e5e7eb",
    fontFamily: "system-ui, sans-serif",
  },
  topbar: {
    padding: "18px 22px",
    borderBottom: "1px solid #1f2937",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: 800, color: "#67e8f9", margin: 0 },
  subtitle: { fontSize: 13, color: "#9ca3af", marginTop: 6 },
  navBtn: {
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid #0ea5e9",
    background: "#0ea5e9",
    color: "#051923",
    fontWeight: 800,
    cursor: "pointer",
  },
  logoutBtn: {
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid #7f1d1d",
    background: "#450a0a",
    color: "#fecaca",
    fontWeight: 700,
    cursor: "pointer",
  },
  body: { display: "grid", gridTemplateColumns: "320px 1fr" },
  sidebar: { padding: 14, borderRight: "1px solid #1f2937" },
  sectionTitle: { fontSize: 14, fontWeight: 700 },
  sectionSubtitle: { fontSize: 12, color: "#94a3b8" },
  grid: {
    marginTop: 10,
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 10,
  },
  thumbBtn: {
    border: "1px solid #2b3648",
    borderRadius: 12,
    padding: 8,
    cursor: "pointer",
    background: "#0b1220",
  },
  thumbImageWrap: {
    position: "relative",
    aspectRatio: "1 / 1",
    borderRadius: 8,
    overflow: "hidden",
  },
  thumbLabel: { marginTop: 6, fontSize: 12, textAlign: "center" },
  main: { padding: 18 },
  infoBox: {
    border: "1px solid #1f2937",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  errorBox: {
    border: "1px solid #7f1d1d",
    background: "#2b0b0b",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
  },
  card: {
    border: "1px solid #1f2937",
    padding: 14,
    borderRadius: 12,
  },
  cardLabel: { fontSize: 12, color: "#94a3b8" },
  cardSmall: { fontSize: 12, color: "#9ca3af" },
  cardValueCyan: { fontSize: 18, fontWeight: 800, color: "#67e8f9" },
  cardValueGreen: { fontSize: 18, fontWeight: 800, color: "#86efac" },
  cardValueYellow: { fontSize: 18, fontWeight: 800, color: "#fde047" },
  imagesRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 14,
  },
  imageCard: {
    border: "1px solid #1f2937",
    padding: 14,
    borderRadius: 12,
  },
  imageTitle: { fontSize: 13, fontWeight: 700, marginBottom: 8 },
  bigImageWrap: {
    position: "relative",
    aspectRatio: "16 / 9",
    border: "1px solid #1f2937",
    borderRadius: 10,
    overflow: "hidden",
    background: "#000",
  },
  meta: { marginTop: 10, fontSize: 13, lineHeight: 1.5 },
};
