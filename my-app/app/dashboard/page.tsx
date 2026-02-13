"use client";

import Image from "next/image";
import { useState } from "react";

type DemoResult = {
  id: string;
  inputUrl: string;
  outputUrl: string;
  label: string;
  defectId: string;
  confidence: number;
};

const IDS = Array.from({ length: 20 }, (_, i) => `img${String(i + 1).padStart(2, "0")}`);

export default function DemoDashboard() {
  const [selectedId, setSelectedId] = useState<string>("img01");
  const [data, setData] = useState<DemoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const loadResult = async (id: string) => {
    setSelectedId(id);
    setLoading(true);
    setErr(null);
    setData(null);

    try {
      const res = await fetch(`/api/demo-result?id=${id}`);
      const json = await res.json();

      if (!res.ok) {
        setErr(json?.error || "Failed to fetch result");
      } else {
        setData(json);
      }
    } catch (e: any) {
      setErr("Server not reachable / API error");
    } finally {
      setLoading(false);
    }
  };

  // auto-load first item once
  useState(() => {
    loadResult("img01");
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-cyan-300">NanoScan Demo Dashboard</h1>
          <p className="text-sm text-slate-400">
            Click any sample PCB image to view the saved AI output (demo mode).
          </p>
        </div>

        <div className="text-xs text-slate-400">
          Server: <span className="text-slate-200">Next.js API</span> • Mode:{" "}
          <span className="text-yellow-300">Hardcoded Results</span>
        </div>
      </div>

      <div className="grid grid-cols-12">
        {/* Left Panel */}
        <aside className="col-span-3 border-r border-slate-800 p-4">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-slate-200">Sample Inputs (20)</h2>
            <p className="text-xs text-slate-400">Select one image to run demo output.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {IDS.map((id) => (
              <button
                key={id}
                onClick={() => loadResult(id)}
                className={`rounded-lg border p-2 transition ${
                  selectedId === id
                    ? "border-cyan-400 bg-slate-900"
                    : "border-slate-700 hover:border-slate-500 hover:bg-slate-900/60"
                }`}
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-md">
                  <Image
                    src={`/demo/inputs/${id}.jpg`}
                    alt={id}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 15vw"
                  />
                </div>
                <div className="mt-2 text-center text-xs text-slate-300">{id}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Panel */}
        <main className="col-span-9 p-6 space-y-6">
          {/* Status */}
          {loading && (
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-slate-200">
              Loading result for <span className="text-cyan-300">{selectedId}</span>...
            </div>
          )}

          {err && (
            <div className="rounded-lg border border-red-700 bg-red-950 p-4 text-red-200">
              {err}
              <div className="mt-2 text-xs text-red-300">
                Tip: Check if your API route <code>/api/demo-result</code> exists and server is running.
              </div>
            </div>
          )}

          {/* Content */}
          {data && (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <div className="text-xs text-slate-400">Selected ID</div>
                  <div className="mt-1 text-lg font-semibold text-cyan-300">{data.id}</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <div className="text-xs text-slate-400">Detected Defect</div>
                  <div className="mt-1 text-lg font-semibold text-green-300">{data.label}</div>
                  <div className="text-xs text-slate-400 mt-1">Defect ID: {data.defectId}</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <div className="text-xs text-slate-400">Confidence</div>
                  <div className="mt-1 text-lg font-semibold text-yellow-300">
                    {Math.round(data.confidence * 100)}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Saved model output</div>
                </div>
              </div>

              {/* Images */}
              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <h3 className="text-sm font-semibold text-slate-200 mb-3">Input Image</h3>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-800">
                    <Image
                      src={data.inputUrl}
                      alt="Input"
                      fill
                      className="object-contain bg-black"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <h3 className="text-sm font-semibold text-slate-200 mb-3">Model Output (Saved)</h3>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-800">
                    <Image
                      src={data.outputUrl}
                      alt="Output"
                      fill
                      className="object-contain bg-black"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  <div className="mt-4 text-sm text-slate-300 space-y-1">
                    <div>
                      <span className="text-slate-400">Label:</span> {data.label}
                    </div>
                    <div>
                      <span className="text-slate-400">Defect ID:</span> {data.defectId}
                    </div>
                    <div>
                      <span className="text-slate-400">Confidence:</span>{" "}
                      {Math.round(data.confidence * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {!loading && !data && !err && (
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-300">
              Select an image from the left panel to view the saved output.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
