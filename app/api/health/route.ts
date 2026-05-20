export const runtime = "nodejs";

export async function GET() {
  return Response.json({ status: "UP", message: "Node.js server is running." });
}
