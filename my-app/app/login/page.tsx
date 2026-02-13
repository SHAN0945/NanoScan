"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If user is already logged in, send them to demo
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div style={{ padding: 24 }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b1220",
        color: "white",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          border: "1px solid #1e293b",
          borderRadius: 16,
          padding: 24,
          background: "#0f172a",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          NanoScan
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: 20 }}>
          Sign in to access the demo dashboard.
        </p>

        {!session ? (
          <>
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #334155",
                background: "white",
                color: "#0b1220",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Continue with Google
            </button>

            <p style={{ marginTop: 14, fontSize: 12, color: "#64748b" }}>
              Only authenticated users can view precomputed AI outputs.
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                padding: 12,
                borderRadius: 12,
                background: "#0b1220",
                border: "1px solid #1e293b",
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 13, color: "#94a3b8" }}>Signed in as</div>
              <div style={{ fontWeight: 700 }}>{session.user?.email}</div>
            </div>

            <button
              onClick={() => router.push("/demo")}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #334155",
                background: "#22c55e",
                color: "#052e14",
                fontWeight: 800,
                cursor: "pointer",
                marginBottom: 10,
              }}
            >
              Go to Demo Dashboard
            </button>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #334155",
                background: "transparent",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
