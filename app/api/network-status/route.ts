import {
  fetchFuzzyBitrateDecision,
  fetchBaselineBitrateDecision,
  type NetworkConditions,
  writeLog,
} from "../_lib/fuzzy-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<
      NetworkConditions & {
        engine?: string;
      }
    >;
    const bandwidth = Number(body.bandwidth);
    const buffer = Number(body.buffer);
    const delay = Number(body.delay);
    const requestedEngine =
      typeof body.engine === "string" ? body.engine : "fuzzy";

    if (!["fuzzy", "baseline"].includes(requestedEngine)) {
      return Response.json(
        { error: "Invalid engine selection" },
        { status: 400 },
      );
    }

    if (![bandwidth, buffer, delay].every(Number.isFinite)) {
      return Response.json(
        { error: "Invalid network conditions" },
        { status: 400 },
      );
    }

    const decision =
      requestedEngine === "baseline"
        ? await fetchBaselineBitrateDecision({ bandwidth, buffer, delay })
        : await fetchFuzzyBitrateDecision({ bandwidth, buffer, delay });

    await writeLog({
      timestamp: new Date().toISOString(),
      inputs: { bandwidth, buffer, delay },
      output: {
        bitrate: decision.bitrate,
        source: decision.source,
      },
    });

    return Response.json({
      fuzzyBitrateDecision: decision.bitrate,
      source: decision.source,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}
