import React from "react";

export default function Skeleton({ className = "", count = 1 }) {
  const elements = Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className={`animate-pulse bg-white/5 rounded-lg border border-white/5 ${className}`}
    ></div>
  ));

  return <>{elements}</>;
}
