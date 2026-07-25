"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { useSignUpMutation } from "@/store/api/dashboardApi";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signUp, { isLoading }] = useSignUpMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const result = await signUp({ name, email, password }).unwrap();
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
      <h1 className="text-xl font-semibold text-slate-700">Sign up</h1>
      <p className="mt-1 text-sm text-slate-400">
        Create an account to start using the dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
          <User size={16} className="text-slate-400" />
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
          />
        </label>
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
            placeholder="Password (min. 6 characters)"
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
          className="grad-primary icon-shadow mt-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-70"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          Sign up
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-blue-500 hover:text-blue-600">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
