import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "NanoScan",
  description: "PCB Defect Detection Demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
