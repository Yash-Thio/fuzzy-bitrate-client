import { fetchPythonHealth } from "../../_lib/fuzzy-server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const startTime = Date.now();
    const health = await fetchPythonHealth();
    const latency = Date.now() - startTime;

    return Response.json({
      status: health.status,
      latency: `${latency} ms`,
      message: health.message,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unreachable or unhealthy engine";

    return Response.json(
      {
        status: "DOWN",
        message: "Fuzzy engine is unreachable or unhealthy.",
        error: message,
        details: "Fallback to 360p is active.",
      },
      { status: 503 },
    );
  }
}
