import { NextResponse } from "next/server";

/** Simulates realistic network latency so loading states are visible in the UI. */
export async function simulateLatency(minMs = 350, maxMs = 750) {
  const delay = Math.floor(Math.random() * (maxMs - minMs)) + minMs;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export function ok<T>(data: T, init?: number) {
  return NextResponse.json({ data }, { status: init ?? 200 });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: { message } }, { status });
}
