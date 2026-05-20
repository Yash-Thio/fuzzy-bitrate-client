import {
  fetchFuzzyBitrateDecision,
  type NetworkConditions,
  writeLog,
} from "../_lib/fuzzy-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<NetworkConditions>;
    const bandwidth = Number(body.bandwidth);
    const buffer = Number(body.buffer);
    const delay = Number(body.delay);

    if (![bandwidth, buffer, delay].every(Number.isFinite)) {
      return Response.json(
        { error: "Invalid network conditions" },
        { status: 400 },
      );
    }

    const decision = await fetchFuzzyBitrateDecision({
      bandwidth,
      buffer,
      delay,
    });

    await writeLog({
      timestamp: new Date().toISOString(),
      inputs: { bandwidth, buffer, delay },
      output: {
        bitrate: decision.bitrate,
        source: decision.source,
      },
    });

    return Response.json({ fuzzyBitrateDecision: decision.bitrate });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}
