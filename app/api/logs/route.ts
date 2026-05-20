import { readLogs } from "../_lib/fuzzy-server";

export const runtime = "nodejs";

export async function GET() {
  const logs = await readLogs();
  return Response.json(logs);
}
