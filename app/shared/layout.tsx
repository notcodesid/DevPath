import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevPath - Shared Learning Path",
  description: "View a shared learning path on DevPath",
};

export default function SharedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#151718]">
      {children}
    </div>
  );
} 