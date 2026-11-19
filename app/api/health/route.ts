import { NextResponse } from "next/server";
import { withOluso } from "@oluso/nextjs";
import { oluso } from "@/instrumentation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const GET = withOluso(oluso, async () => {
  const startTime = Date.now();
  let dbStatus = "unknown";

  try {
    const { error } = await supabase.from("articles").select("id").limit(1);
    dbStatus = error ? "degraded" : "healthy";
  } catch {
    dbStatus = "unreachable";
  }

  const responseTimeMs = Date.now() - startTime;

  return NextResponse.json(
    {
      status: "healthy",
      service: "onyeakuko-api",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      checks: {
        database: dbStatus,
      },
      responseTimeMs,
    },
    { status: 200 }
  );
});
