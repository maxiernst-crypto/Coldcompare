import "../../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ColdCompare Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const THEME_SCRIPT = `try{var t=localStorage.getItem('cc_theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-bg-subtle">{children}</body>
    </html>
  );
}
