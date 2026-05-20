"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Header from "./components/header";
import Controls from "./components/controls";
import Footer from "./components/footer";
import AnalyticsDashboard from "./components/analyticsDashboard";
import VideoPlayer from "./components/videoPlayer";
import Dashboard from "./components/dashboard";
import FloatingStats from "./components/floatingStats";
import NetworkBackground from "./components/ui/networkBackground";

type Mode = "random" | "real" | "manual";
type NetworkEvent = "rebuffer" | "switch" | null;

type NetworkDataPoint = {
  time: string;
  bandwidth: number;
  buffer: number;
  delay: number;
  event: NetworkEvent;
};

type ManualInputs = {
  bandwidth: number;
  buffer: number;
  delay: number;
};

type AnalyticsState = {
  playbackTime: number;
  rebufferCount: number;
  totalBitrateSum: number;
  totalBitrateSamples: number;
};

type NetworkResponse = {
  fuzzyBitrateDecision?: number;
  source?: string;
};

type NetworkConditions = {
  bandwidth: number;
  buffer: number;
  delay: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/network-status" || "";

const defaultAnalytics: AnalyticsState = {
  playbackTime: 0,
  rebufferCount: 0,
  totalBitrateSum: 0,
  totalBitrateSamples: 0,
};

const calculateQoE = (
  avgBitrate: number,
  rebufferCount: number,
  playbackTime: number,
) => {
  let bitrateScore = 0;

  if (avgBitrate > 1000) bitrateScore = 3;
  else if (avgBitrate > 700) bitrateScore = 2.5;
  else if (avgBitrate > 450) bitrateScore = 1.5;
  else if (avgBitrate > 300) bitrateScore = 1;

  const rebuffersPerMinute =
    playbackTime > 0 ? rebufferCount / (playbackTime / 60) : 0;
  let rebufferScore = 2 - rebuffersPerMinute * 0.5;
  rebufferScore = Math.max(0, rebufferScore);

  return bitrateScore + rebufferScore;
};

export default function Page() {
  const [mode, setMode] = useState<Mode>("random");
  const [engineSelection, setEngineSelection] = useState<"fuzzy" | "baseline">("fuzzy");
  const [networkData, setNetworkData] = useState<NetworkDataPoint[]>([]);
  const [fuzzyDecision, setFuzzyDecision] = useState(360);
  const [currentPlayingBitrate, setCurrentPlayingBitrate] = useState(360);
  const [lastEvent, setLastEvent] = useState<NetworkEvent>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualInputs, setManualInputs] = useState<ManualInputs>({
    bandwidth: 5,
    buffer: 5,
    delay: 50,
  });
  const [analytics, setAnalytics] = useState<AnalyticsState>(defaultAnalytics);

  const isRebuffering = useRef(false);
  const simStateRef = useRef({ bandwidth: 5, delay: 100 });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const avgBitrate =
    analytics.totalBitrateSamples > 0
      ? analytics.totalBitrateSum / analytics.totalBitrateSamples
      : 0;

  const qoeScore = calculateQoE(
    avgBitrate,
    analytics.rebufferCount,
    analytics.playbackTime,
  );

  const getBufferHealth = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return 0;

    const currentTime = video.currentTime;
    let bufferEnd = 0;

    for (let index = 0; index < video.buffered.length; index += 1) {
      if (
        video.buffered.start(index) <= currentTime &&
        currentTime < video.buffered.end(index)
      ) {
        bufferEnd = video.buffered.end(index);
        break;
      }
    }

    const bufferHealthInSeconds = bufferEnd - currentTime;
    return Number(Math.max(0, bufferHealthInSeconds).toFixed(2));
  }, []);

  useEffect(() => {
    const postDataAndGetDecision = async () => {
      setIsLoading(true);

      try {
        let bandwidth: number;
        let buffer: number;
        let delay: number;

        if (mode === "random") {
          const bwChange = Math.random() * 4 - 2;
          let newBw = simStateRef.current.bandwidth + bwChange;
          newBw = Math.max(1, Math.min(10, newBw));

          const delayChange = Math.random() * 100 - 50;
          let newDelay = simStateRef.current.delay + delayChange;
          newDelay = Math.max(10, Math.min(400, newDelay));

          bandwidth = newBw;
          buffer = getBufferHealth();
          delay = newDelay;
          simStateRef.current = { bandwidth: newBw, delay: newDelay };
        } else if (mode === "real") {
          const connection =
            typeof navigator !== "undefined" && "connection" in navigator
              ? (
                  navigator as Navigator & {
                    connection?: { downlink: number; rtt: number };
                  }
                ).connection
              : undefined;

          bandwidth = connection?.downlink ?? 1.0;
          buffer = getBufferHealth();
          delay = connection?.rtt ?? 50;
        } else {
          bandwidth = manualInputs.bandwidth;
          buffer = manualInputs.buffer;
          delay = manualInputs.delay;
        }

        const newDataPoint: NetworkDataPoint = {
          time: new Date().toLocaleTimeString(),
          bandwidth: Number(bandwidth.toFixed(2)),
          buffer: Number(buffer.toFixed(2)),
          delay: Number(delay.toFixed(2)),
          event: lastEvent,
        };

        setLastEvent(null);
        setNetworkData((prevData) => [...prevData.slice(-20), newDataPoint]);

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bandwidth,
            buffer,
            delay,
            engine: engineSelection,
          } satisfies NetworkConditions & { engine?: string }),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = (await response.json()) as NetworkResponse;
        if (typeof data.fuzzyBitrateDecision === "number") {
          setFuzzyDecision(data.fuzzyBitrateDecision);
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        console.error("Error posting network data:", message);
      } finally {
        setIsLoading(false);
      }
    };

    void postDataAndGetDecision();
    const intervalId = window.setInterval(postDataAndGetDecision, 3000);

    return () => window.clearInterval(intervalId);
  }, [getBufferHealth, lastEvent, manualInputs, mode]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setAnalytics((prev) => ({
          ...prev,
          playbackTime: prev.playbackTime + 1,
        }));
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const handleRebuffer = useCallback(() => {
    if (!isRebuffering.current) {
      isRebuffering.current = true;
      setLastEvent("rebuffer");
      setAnalytics((prev) => ({
        ...prev,
        rebufferCount: prev.rebufferCount + 1,
      }));
    }
  }, []);

  const handlePlay = useCallback(() => {
    if (isRebuffering.current) {
      isRebuffering.current = false;
    }
  }, []);

  const handleBitrateChange = useCallback((newBitrate: number) => {
    setCurrentPlayingBitrate(newBitrate);
    setLastEvent("switch");
    setAnalytics((prev) => ({
      ...prev,
      totalBitrateSum: prev.totalBitrateSum + newBitrate,
      totalBitrateSamples: prev.totalBitrateSamples + 1,
    }));
  }, []);

  return (
    <>
      <NetworkBackground />
      <FloatingStats
        fuzzyDecision={fuzzyDecision}
        currentPlayingBitrate={currentPlayingBitrate}
      />

      <div className="relative z-10 min-h-screen p-2 sm:p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <Header isLoading={isLoading} />

          <Controls
            mode={mode}
            setMode={setMode}
            manualInputs={manualInputs}
            setManualInputs={setManualInputs}
            engineSelection={engineSelection}
            setEngineSelection={setEngineSelection}
          />

          <AnalyticsDashboard
            analytics={{ ...analytics, avgBitrate, qoeScore }}
          />

          <main className="mt-6 md:mt-8 grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <VideoPlayer
                videoRef={videoRef}
                selectedBitrate={fuzzyDecision}
                onRebuffer={handleRebuffer}
                onBitrateChange={handleBitrateChange}
                onPlay={handlePlay}
              />
            </div>
            <div className="lg:col-span-2">
              <Dashboard data={networkData} />
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
