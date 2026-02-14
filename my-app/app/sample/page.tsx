"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type HFOutputs = {
  bboxUrl: string | null;
  zoomUrl: string | null;
  gradcamUrl: string | null;
  label?: string | null;
  defectId?: string | null;
  confidence?: number | null;
};

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [outputs, setOutputs] = useState<HFOutputs>({
    bboxUrl: null,
    zoomUrl: null,
    gradcamUrl: null,
    label: null,
    defectId: null,
    confidence: null,
  });

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const fileMeta = useMemo(() => {
    if (!file) return null;
    return {
      name: file.name,
      sizeKb: Math.round(file.size / 1024),
      type: file.type || "unknown",
    };
  }, [file]);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setErr(null);
    setOutputs({
      bboxUrl: null,
      zoomUrl: null,
      gradcamUrl: null,
      label: null,
      defectId: null,
      confidence: null,
    });
  };

  const runDemo = async () => {
    if (!file) {
      setErr("Please upload an image first.");
      return;
    }

    setLoading(true);
    setErr(null);
    setOutputs({
      bboxUrl: null,
      zoomUrl: null,
      gradcamUrl: null,
      label: null,
      defectId: null,
      confidence: null,
    });

    try {
      // ✅ send file to YOUR server (Next.js API route)
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/pcb/predict", {
        method: "POST",
        body: fd,
        cache: "no-store",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setErr(json?.error || `Failed (HTTP ${res.status})`);
        return;
      }

      setOutputs({
        bboxUrl: json?.bboxUrl ?? null,
        zoomUrl: json?.zoomUrl ?? null,
        gradcamUrl: json?.gradcamUrl ?? null,
        label: json?.label ?? null,
        defectId: json?.defectId ?? null,
        confidence:
          typeof json?.confidence === "number" ? json.confidence : null,
      });
    } catch {
      setErr("Server not reachable / API error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Top Bar */}
      <div style={styles.topbar}>
        <div>
          <h1 style={styles.title}>NanoScan Upload Demo</h1>
          <p style={styles.subtitle}>
            Upload a PCB image to preview it and view AI outputs (BBOX, Zoomed, Grad-CAM).
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => router.push("/dashboard")} style={styles.navBtn}>
            Back to Dashboard
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
        {/* Left Panel */}
        <aside style={styles.sidebar}>
          <h2 style={styles.sectionTitle}>Upload Input Image</h2>
          <p style={styles.sectionSubtitle}>JPG / PNG / WEBP supported</p>

          <label style={styles.uploadBox}>
            <input
              type="file"
              accept="image/*"
              onChange={onPickFile}
              style={{ display: "none" }}
            />
            <div style={{ fontWeight: 800 }}>Click to upload</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
              Choose a PCB image
            </div>
          </label>

          {fileMeta && (
            <div style={styles.fileCard}>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Selected file</div>
              <div style={{ fontWeight: 800, marginTop: 4 }}>{fileMeta.name}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>
                {fileMeta.type} • {fileMeta.sizeKb} KB
              </div>
            </div>
          )}

          <button
            onClick={runDemo}
            disabled={!file || loading}
            style={{
              ...styles.primaryBtn,
              opacity: file ? 1 : 0.5,
              cursor: file ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Running…" : "Run Model"}
          </button>

          {err && <div style={styles.errorBox}>{err}</div>}
        </aside>

        {/* Right Panel */}
        <main style={styles.main}>
          <div style={styles.imagesRow}>
            {/* Preview */}
            <div style={styles.imageCard}>
              <h3 style={styles.imageTitle}>Uploaded Input (Preview)</h3>
              <div style={styles.bigImageWrap}>
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    sizes="600px"
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <div style={styles.placeholder}>Upload an image to preview</div>
                )}
              </div>
            </div>

            {/* BBOX */}
            <div style={styles.imageCard}>
              <h3 style={styles.imageTitle}>BBOX Output</h3>
              <div style={styles.bigImageWrap}>
                {outputs.bboxUrl ? (
                  <Image
                    src={outputs.bboxUrl}
                    alt="BBOX"
                    fill
                    sizes="600px"
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <div style={styles.placeholder}>
                    Click <b>Run Model</b> to show BBOX output
                  </div>
                )}
              </div>
            </div>

            {/* Zoomed */}
            <div style={styles.imageCard}>
              <h3 style={styles.imageTitle}>Zoomed Output</h3>
              <div style={styles.bigImageWrap}>
                {outputs.zoomUrl ? (
                  <Image
                    src={outputs.zoomUrl}
                    alt="Zoomed"
                    fill
                    sizes="600px"
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <div style={styles.placeholder}>
                    Click <b>Run Model</b> to show Zoomed output
                  </div>
                )}
              </div>
            </div>

            {/* Grad-CAM */}
            <div style={styles.imageCard}>
              <h3 style={styles.imageTitle}>Grad-CAM Output</h3>
              <div style={styles.bigImageWrap}>
                {outputs.gradcamUrl ? (
                  <Image
                    src={outputs.gradcamUrl}
                    alt="Grad-CAM"
                    fill
                    sizes="600px"
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <div style={styles.placeholder}>
                    Click <b>Run Model</b> to show Grad-CAM output
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#070b14", color: "#e5e7eb", fontFamily: "system-ui, sans-serif" },
  topbar: { padding: "18px 22px", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" },
  title: { margin: 0, fontSize: 22, fontWeight: 800, color: "#67e8f9" },
  subtitle: { marginTop: 6, fontSize: 13, color: "#9ca3af" },
  navBtn: { padding: "8px 14px", borderRadius: 10, border: "1px solid #0ea5e9", background: "#0ea5e9", color: "#051923", fontWeight: 800, cursor: "pointer" },
  logoutBtn: { padding: "8px 14px", borderRadius: 10, border: "1px solid #7f1d1d", background: "#450a0a", color: "#fecaca", fontWeight: 700, cursor: "pointer" },
  body: { display: "grid", gridTemplateColumns: "320px 1fr" },
  sidebar: { padding: 14, borderRight: "1px solid #1f2937" },
  sectionTitle: { fontSize: 14, fontWeight: 700 },
  sectionSubtitle: { fontSize: 12, color: "#94a3b8", marginTop: 6 },
  uploadBox: { marginTop: 12, border: "1px dashed #334155", borderRadius: 12, padding: 14, background: "#0b1220", cursor: "pointer", textAlign: "center" },
  fileCard: { marginTop: 12, border: "1px solid #1f2937", background: "#0b1220", padding: 12, borderRadius: 12 },
  primaryBtn: { marginTop: 12, width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #0ea5e9", background: "#0ea5e9", color: "#051923", fontWeight: 800 },
  errorBox: { marginTop: 10, border: "1px solid #7f1d1d", background: "#2b0b0b", padding: 12, borderRadius: 12, color: "#fecaca", fontWeight: 600 },
  main: { padding: 18 },
  imagesRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  imageCard: { border: "1px solid #1f2937", padding: 14, borderRadius: 12, background: "#0b1220" },
  imageTitle: { fontSize: 13, fontWeight: 700, marginBottom: 8 },
  bigImageWrap: { position: "relative", aspectRatio: "16 / 9", border: "1px solid #1f2937", borderRadius: 10, overflow: "hidden", background: "#000" },
  placeholder: { height: "100%", display: "grid", placeItems: "center", color: "#94a3b8", fontSize: 13, textAlign: "center", padding: 16 },
};
