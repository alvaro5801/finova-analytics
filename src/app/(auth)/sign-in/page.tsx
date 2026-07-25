"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail } from "lucide-react";
import { useSignInMutation } from "@/store/api/dashboardApi";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signIn, { isLoading }] = useSignInMutation();
  const [email, setEmail] = useState("demo@material.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const result = await signIn({ email, password }).unwrap();
      dispatch(setUser(result.user));
      router.push("/dashboard");
    } catch (err) {
      const message =
        err && typeof err === "object" && "data" in err
          ? ((err as { data?: { error?: { message?: string } } }).data?.error?.message ??
            "Something went wrong.")
          : "Something went wrong.";
      setError(message);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl bg-white p-7 shadow-2xl"
    >
      <h1 className="text-xl font-semibold text-slate-700">Sign in</h1>
      <p className="mt-1 text-sm text-slate-400">
        Enter your email and password to access the dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
          <Mail size={16} className="text-slate-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
          />
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
          <Lock size={16} className="text-slate-400" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
          />
        </label>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-500"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="grad-info icon-shadow mt-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-70"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-semibold text-blue-500 hover:text-blue-600">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
