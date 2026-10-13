import { NextResponse, type NextRequest } from "next/server";
import { purgeOldClicks, runLinkHealthCheck } from "@/lib/jobs";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Called daily by Vercel Cron (see vercel.json). Vercel sends "Authorization: Bearer $CRON_SECRET".
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ ok: false }, { status: 401 });
  const [health, purged] = await Promise.all([runLinkHealthCheck(), purgeOldClicks()]);
  return NextResponse.json({ ok: true, ...health, purgedClicks: purged });
}
