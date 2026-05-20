"use client";

import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import Card from "./ui/card";

const hlsLevels = [
  { bitrate: 360, bandwidth: 800000 },
  { bitrate: 480, bandwidth: 1400000 },
  { bitrate: 720, bandwidth: 2800000 },
  { bitrate: 1080, bandwidth: 5000000 },
];

const HLS_SOURCE = "/videos/hls/master.m3u8";

const getClosestLevel = (fuzzyDecision: number) => {
  if (!fuzzyDecision) return 0;
  const availableBitrates = hlsLevels.map((l) => l.bitrate);
  const closestBitrate = availableBitrates.reduce((prev, curr) =>
    Math.abs(curr - fuzzyDecision) < Math.abs(prev - fuzzyDecision)
      ? curr
      : prev,
  );
  return availableBitrates.indexOf(closestBitrate);
};

type VideoPlayerProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  selectedBitrate: number;
  onRebuffer: () => void;
  onBitrateChange: (newBitrate: number) => void;
  onPlay: () => void;
};

const VideoPlayer = ({
  videoRef,
  selectedBitrate,
  onRebuffer,
  onBitrateChange,
  onPlay,
}: VideoPlayerProps) => {
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      console.log("Initializing player...");
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(HLS_SOURCE);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Manifest parsed. Ready to play.");
        video.play().catch((e) => console.error("Autoplay failed", e));
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        const newBitrate = hlsLevels[data.level].bitrate;
        console.log(`HLS level switched to: ${newBitrate}p`);
        onBitrateChange(newBitrate);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) hls.destroy();
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_SOURCE;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((e) => console.error("Autoplay failed", e));
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoRef, onBitrateChange, onRebuffer, onPlay]);

  useEffect(() => {
    if (!hlsRef.current) return;
    const hls = hlsRef.current;
    const newLevelIndex = getClosestLevel(selectedBitrate);

    if (hls.nextLevel !== newLevelIndex) {
      console.log(
        `Engine decided on ${selectedBitrate}. Setting HLS nextLevel to: ${newLevelIndex} (${hlsLevels[newLevelIndex].bitrate}p)`,
      );
      hls.nextLevel = newLevelIndex;
    }
  }, [selectedBitrate]);

  return (
    <Card className="w-full aspect-video">
      <video
        ref={videoRef}
        width="100%"
        controls
        autoPlay
        muted
        onWaiting={onRebuffer}
        onPlaying={onPlay}
        className="rounded-lg w-full h-full"
      >
        Your browser does not support the video tag.
      </video>
    </Card>
  );
};

export default VideoPlayer;
