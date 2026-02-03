"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export function AudioPlayer({
  audioUrl,
  isPlaying,
  onPlay,
  onPause,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(audioUrl);
      audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
          setProgress(audio.currentTime / audio.duration);
          setElapsed(audio.currentTime);
        }
      });
      audio.addEventListener("ended", () => {
        setProgress(0);
        setElapsed(0);
        onPause();
      });
      audioRef.current = audio;
    }
    return audioRef.current;
  }, [audioUrl, onPause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      if (isPlaying) {
        const newAudio = getAudio();
        newAudio.play().catch(() => onPause());
      }
      return;
    }

    if (isPlaying) {
      audio.play().catch(() => onPause());
    } else {
      audio.pause();
    }
  }, [isPlaying, getAudio, onPause]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={(e) => {
          e.stopPropagation();
          if (isPlaying) {
            onPause();
          } else {
            onPlay();
          }
        }}
      >
        {isPlaying ? (
          <Pause className="h-3.5 w-3.5" />
        ) : (
          <Play className="h-3.5 w-3.5" />
        )}
      </Button>
      <div className="h-1.5 w-20 rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8">
        {formatTime(elapsed)}
      </span>
    </div>
  );
}
