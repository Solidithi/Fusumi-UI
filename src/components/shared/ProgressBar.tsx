"use client";
import { useEffect, useState } from "react";

interface ProgressBarProps {
  index: number;
  total: number;
  duration?: number;
  overrideClassName?: boolean;
  barClassName?: string;
  colorClassName?: string;
}
const ProgressBar = ({
  index,
  total,
  duration = 2000,
  overrideClassName = false,
  barClassName,
  colorClassName,
}: ProgressBarProps) => {
  const [progress, setProgress] = useState(0);
  const [nowProgress, setNowProgress] = useState(0);

  useEffect(() => {
    const targetProgress = (index / total) * 100;
    const step = targetProgress / (duration / 10); // Adjust for smooth animation

    let currentProgress = progress;
    const interval = setInterval(() => {
      currentProgress += step;
      setProgress(Math.min(currentProgress, targetProgress));
      if (currentProgress >= targetProgress) clearInterval(interval);
    }, 10);

    return () => clearInterval(interval);
  }, [index, total, duration]);

  return (
    <div className="flex justify-center">
      <div
        className={
          overrideClassName && barClassName
            ? barClassName
            : `w-1/2 m-6
       glass-enhanced rounded-lg h-1 relative overflow-hidden  ${barClassName}`
        }
      >
        <div
          className={
            overrideClassName && colorClassName
              ? colorClassName
              : `bg-gradient-to-r from-[#2a849a] to-[#325b65]
           h-full transition-all ease-out duration-700 ${colorClassName}`
          }
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
