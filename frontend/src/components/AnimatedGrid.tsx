import { useMemo } from 'react'

interface AnimatedGridProps {
  count?: number
  className?: string
}

export default function AnimatedGrid({ count = 100, className = '' }: AnimatedGridProps) {
  const cells = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 8 + Math.random() * 32,
      delay: Math.random() * 10,
      duration: 4 + Math.random() * 6,
      peakOpacity: 0.06 + Math.random() * 0.14,
      driftX: (Math.random() - 0.5) * 10,
      driftY: (Math.random() - 0.5) * 10,
    }))
  }, [count])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="grid-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" />
          </filter>
        </defs>
        {cells.map((cell) => (
          <rect
            key={cell.id}
            x={`${cell.x}%`}
            y={`${cell.y}%`}
            width={cell.size}
            height={cell.size}
            rx="6"
            fill="#8B2635"
            opacity="0"
            filter="url(#grid-blur)"
          >
            <animate
              attributeName="opacity"
              values={`0;${cell.peakOpacity};${cell.peakOpacity};0`}
              dur={`${cell.duration}s`}
              begin={`${cell.delay}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1;0.25 0.1 0.25 1"
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0,0;${cell.driftX},${cell.driftY};0,0`}
              dur={`${cell.duration * 1.3}s`}
              begin={`${cell.delay}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1"
            />
          </rect>
        ))}
      </svg>
    </div>
  )
}
