import { promises as fs } from "fs";
import path from "path";

export type NetworkConditions = {
  bandwidth: number;
  buffer: number;
  delay: number;
};

export type NetworkLogEntry = {
  timestamp: string;
  inputs: NetworkConditions;
  output: {
    bitrate: number;
    source: string;
  };
};

type FuzzyDecision = {
  bitrate: number;
  source: string;
};

const MAX_LOGS = 100;
const LOG_FILE = path.join(process.cwd(), "api_logs.json");

export const FUZZY_ENGINE_API =
  process.env.FUZZY_ENGINE_API ??
  "https://fuzzy-bitrate.onrender.com/get-bitrate";

export const FUZZY_HEALTH_API =
  process.env.FUZZY_HEALTH_API ?? "https://fuzzy-bitrate.onrender.com/health";

export async function readLogs(): Promise<NetworkLogEntry[]> {
  try {
    const fileContents = await fs.readFile(LOG_FILE, "utf8");
    const parsed = JSON.parse(fileContents) as unknown;
    return Array.isArray(parsed) ? (parsed as NetworkLogEntry[]) : [];
  } catch {
    return [];
  }
}

export async function writeLog(logEntry: NetworkLogEntry): Promise<void> {
  try {
    const logs = await readLogs();
    const nextLogs = [logEntry, ...logs].slice(0, MAX_LOGS);
    await fs.writeFile(LOG_FILE, JSON.stringify(nextLogs, null, 2), "utf8");
  } catch {
    // Logging is best-effort; route responses should still succeed.
  }
}

export async function fetchFuzzyBitrateDecision(
  conditions: NetworkConditions,
): Promise<FuzzyDecision> {
  try {
    const response = await fetch(FUZZY_ENGINE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bandwidth: conditions.bandwidth,
        buffer: conditions.buffer,
        delay: conditions.delay,
      }),
    });

    if (!response.ok) {
      throw new Error(`Upstream responded with ${response.status}`);
    }

    const data = (await response.json()) as { bitrate?: number };

    return {
      bitrate: typeof data.bitrate === "number" ? data.bitrate : 360,
      source: "fuzzy_engine",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "unknown error";
    return {
      bitrate: 360,
      source: `fallback (${message})`,
    };
  }
}

export async function fetchPythonHealth() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(FUZZY_HEALTH_API, {
      signal: controller.signal,
    });
    const data = (await response.json()) as { status?: string };

    if (response.ok && data.status === "healthy") {
      return {
        status: "UP",
        message: "Fuzzy engine is healthy.",
      };
    }

    throw new Error("Unhealthy response from Python engine");
  } finally {
    clearTimeout(timeoutId);
  }
}
