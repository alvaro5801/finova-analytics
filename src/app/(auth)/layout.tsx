import Link from "next/link";
import { Boxes } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f1535] px-4 py-10">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(73,163,241,0.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(236,64,122,0.35), transparent 40%), linear-gradient(195deg, #1a1f3d, #0f1535)",
        }}
      />
      <div className="relative z-10 w-full max-w-sm">
        <Link
          href="/dashboard"
          className="mb-6 flex items-center justify-center gap-2 text-white"
        >
          <span className="grad-info flex h-9 w-9 items-center justify-center rounded-xl">
            <Boxes size={18} />
          </span>
          <span className="text-sm font-semibold">Material Dashboard</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
