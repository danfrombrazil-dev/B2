import { useState, useEffect } from 'react'

const containerStyle = {
  width: '100%',
  height: '14px',
  background: '#1e1e1e',
  borderRadius: '7px',
  overflow: 'hidden',
  position: 'relative',
}

const shimmer = `
@keyframes b2-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`

export default function ProgressBar({ percent = 0, color = '#FF6B35', animate = true }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setWidth(percent), 80)
      return () => clearTimeout(timer)
    }
    setWidth(percent)
  }, [percent, animate])

  const barStyle = {
    height: '100%',
    width: `${Math.min(width, 100)}%`,
    background: percent >= 100
      ? 'linear-gradient(90deg, #22c55e, #4ade80)'
      : `linear-gradient(90deg, ${color}, #ff8c42)`,
    borderRadius: '7px',
    transition: animate ? 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
    position: 'relative',
    overflow: 'hidden',
  }

  const shimmerStyle = {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    animation: 'b2-shimmer 2s infinite',
  }

  return (
    <>
      <style>{shimmer}</style>
      <div style={containerStyle}>
        <div style={barStyle}>
          {width > 10 && <div style={shimmerStyle} />}
        </div>
      </div>
    </>
  )
}
