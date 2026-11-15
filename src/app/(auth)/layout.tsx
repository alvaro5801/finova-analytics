import Link from "next/link";
import { FinovaLogo } from "@/components/brand/FinovaLogo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(38rem 26rem at 18% 12%, rgb(91 184 157 / 0.1), transparent 60%), radial-gradient(30rem 22rem at 88% 92%, rgb(136 191 230 / 0.07), transparent 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(236 234 228 / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(236 234 228 / 0.04) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <Link href="/dashboard" className="mb-8 flex justify-center">
          <FinovaLogo />
        </Link>
        {children}
        <p className="mt-6 text-center text-xs text-muted">
          Ambiente de demonstração · qualquer e-mail válido e senha com 6+ caracteres
        </p>
      </div>
    </div>
  );
}
