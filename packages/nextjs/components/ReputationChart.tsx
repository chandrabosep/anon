"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ReputationChartProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ReputationChart({
  score,
  maxScore = 5,
  size = 200,
  strokeWidth = 12,
  className,
}: ReputationChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set actual size in memory (scaled to account for extra pixel density)
    const scale = window.devicePixelRatio;
    canvas.style.width = size + "px";
    canvas.style.height = size / 2 + "px";
    canvas.width = size * scale;
    canvas.height = (size / 2) * scale;

    // Normalize coordinate system to use css pixels
    ctx.scale(scale, scale);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - strokeWidth) / 2;

    // Clear canvas
    ctx.clearRect(0, 0, size, size / 2);

    // Draw background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    // Draw score arc
    const progress = score / maxScore;
    const endAngle = Math.PI - Math.PI * progress;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, endAngle);

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, size, 0);
    gradient.addColorStop(0, "#60A5FA"); // blue-400
    gradient.addColorStop(1, "#34D399"); // emerald-400

    ctx.strokeStyle = gradient;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.stroke();
  }, [score, maxScore, size, strokeWidth]);

  return (
    <div className={cn("relative", className)}>
      <canvas ref={canvasRef} className="w-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold">{score.toFixed(1)}</span>
        <span className="text-sm text-gray-400">out of {maxScore}</span>
      </div>
    </div>
  );
}
