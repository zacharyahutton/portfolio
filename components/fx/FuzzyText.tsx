"use client";

import React, { useEffect, useRef } from "react";

interface FuzzyTextProps {
  children: React.ReactNode;
  fontSize?: number | string;
  fontWeight?: string | number;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
  /** Horizontal fuzz displacement range in px — lower = subtler glitch */
  fuzzRange?: number;
  className?: string;
}

/**
 * React Bits FuzzyText — canvas VHS-style horizontal fuzz.
 * Adapted for TypeScript / Next.js client components.
 */
export default function FuzzyText({
  children,
  fontSize = "clamp(2rem, 10vw, 10rem)",
  fontWeight = 900,
  fontFamily = "inherit",
  color = "#fff",
  enableHover = true,
  baseIntensity = 0.08,
  hoverIntensity = 0.22,
  fuzzRange = 14,
  className = "",
}: FuzzyTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const init = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Static fallback label via CSS text — canvas still draws once without fuzz loop intensity
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const computedFontFamily =
        fontFamily === "inherit"
          ? window.getComputedStyle(canvas).fontFamily || "sans-serif"
          : fontFamily;

      const fontSizeStr = typeof fontSize === "number" ? `${fontSize}px` : fontSize;
      const fontString = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;

      try {
        await document.fonts.load(fontString);
      } catch {
        await document.fonts.ready;
      }
      if (isCancelled) return;

      let numericFontSize: number;
      if (typeof fontSize === "number") {
        numericFontSize = fontSize;
      } else {
        const temp = document.createElement("span");
        temp.style.fontSize = fontSize;
        temp.style.fontFamily = computedFontFamily;
        temp.style.fontWeight = String(fontWeight);
        temp.style.position = "absolute";
        temp.style.visibility = "hidden";
        temp.textContent = "M";
        document.body.appendChild(temp);
        numericFontSize = parseFloat(window.getComputedStyle(temp).fontSize);
        document.body.removeChild(temp);
      }

      const text = String(React.Children.toArray(children).join(""));

      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.font = `${fontWeight} ${numericFontSize}px ${computedFontFamily}`;
      offCtx.textBaseline = "alphabetic";
      const metrics = offCtx.measureText(text);

      const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
      const actualRight = metrics.actualBoundingBoxRight ?? metrics.width;
      const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize * 0.8;
      const actualDescent = metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;

      const textBoundingWidth = Math.ceil(actualLeft + actualRight);
      const tightHeight = Math.ceil(actualAscent + actualDescent);

      const extraWidthBuffer = 10;
      const offscreenWidth = textBoundingWidth + extraWidthBuffer;
      const offscreenHeight = tightHeight;

      const range = fuzzRange;
      offscreen.width = Math.max(1, offscreenWidth);
      offscreen.height = Math.max(1, offscreenHeight + 2 * range);

      const x = (extraWidthBuffer - actualLeft) / 2;
      const y = range + actualAscent;

      offCtx.font = `${fontWeight} ${numericFontSize}px ${computedFontFamily}`;
      offCtx.fillStyle = color;
      offCtx.textBaseline = "alphabetic";
      offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
      offCtx.fillText(text, x, y);

      const horizontalMargin = 50;
      const verticalMargin = 0;
      canvas.width = offscreenWidth + horizontalMargin * 2;
      canvas.height = offscreenHeight + verticalMargin * 2;
      canvas.style.width = `${canvas.width}px`;
      canvas.style.height = `${canvas.height}px`;
      ctx.translate(horizontalMargin, verticalMargin);

      const interactiveLeft = horizontalMargin + x;
      const interactiveTop = verticalMargin + y - actualAscent;
      const interactiveRight = interactiveLeft + textBoundingWidth;
      const interactiveBottom = interactiveTop + tightHeight;

      let isHovering = false;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const intensity = () =>
        reduce ? 0 : isHovering ? hoverIntensity : baseIntensity;

      const run = () => {
        if (isCancelled) return;
        ctx.clearRect(
          -range - horizontalMargin,
          -range - verticalMargin,
          offscreenWidth + 2 * horizontalMargin + 2 * range,
          offscreenHeight + 2 * verticalMargin + 2 * range,
        );
        const fuzz = intensity();
        for (let j = 0; j < offscreenHeight; j++) {
          const dx = Math.floor(fuzz * (Math.random() - 0.5) * range);
          ctx.drawImage(
            offscreen,
            0,
            range + j,
            offscreenWidth,
            1,
            dx,
            j,
            offscreenWidth,
            1,
          );
        }
        animationFrameId = requestAnimationFrame(run);
      };

      run();

      const isInsideTextArea = (xPos: number, yPos: number) =>
        xPos >= interactiveLeft &&
        xPos <= interactiveRight &&
        yPos >= interactiveTop &&
        yPos <= interactiveBottom;

      const handleMove = (e: MouseEvent | TouchEvent) => {
        if (!enableHover) return;
        let clientX: number;
        let clientY: number;
        if ("touches" in e && e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else if ("clientX" in e) {
          clientX = e.clientX;
          clientY = e.clientY;
        } else {
          return;
        }
        const rect = canvas.getBoundingClientRect();
        const xPos = clientX - rect.left;
        const yPos = clientY - rect.top;
        isHovering = isInsideTextArea(xPos, yPos);
      };

      const handleLeave = () => {
        isHovering = false;
      };

      if (enableHover) {
        canvas.addEventListener("mousemove", handleMove);
        canvas.addEventListener("mouseleave", handleLeave);
        canvas.addEventListener("touchstart", handleMove, { passive: true });
        canvas.addEventListener("touchmove", handleMove, { passive: true });
        canvas.addEventListener("touchend", handleLeave);
      }

      const cleanupInteractive = () => {
        if (!enableHover) return;
        canvas.removeEventListener("mousemove", handleMove);
        canvas.removeEventListener("mouseleave", handleLeave);
        canvas.removeEventListener("touchstart", handleMove);
        canvas.removeEventListener("touchmove", handleMove);
        canvas.removeEventListener("touchend", handleLeave);
      };

      (canvas as HTMLCanvasElement & { __fuzzyCleanup?: () => void }).__fuzzyCleanup =
        cleanupInteractive;
    };

    void init();

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(animationFrameId);
      const c = canvas as HTMLCanvasElement & { __fuzzyCleanup?: () => void };
      c.__fuzzyCleanup?.();
    };
  }, [
    children,
    fontSize,
    fontWeight,
    fontFamily,
    color,
    enableHover,
    baseIntensity,
    hoverIntensity,
    fuzzRange,
  ]);

  return <canvas ref={canvasRef} className={className} aria-label={String(children)} />;
}
