import React, { useEffect, useState } from 'react';
import { CircuitBoard } from 'lucide-react';

interface ProjectMediaProps {
  src: string;
  alt: string;
  color: string;
  className?: string;
  imageClassName?: string;
  eager?: boolean;
}

export function ProjectMedia({
  src,
  alt,
  color,
  className = '',
  imageClassName = '',
  eager = false,
}: ProjectMediaProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    <div
      className={`relative overflow-hidden bg-[#101010] ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 35% 25%, ${color}35, transparent 48%)`,
      }}
    >
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className={`w-full h-full object-cover ${imageClassName}`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
          <CircuitBoard aria-hidden="true" className="w-12 h-12" style={{ color }} />
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400">
            Project documentation
          </span>
        </div>
      )}
    </div>
  );
}
