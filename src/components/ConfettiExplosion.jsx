import { useEffect, useRef } from 'react'

const COLORS = ['#FF6B35', '#ff8c42', '#22c55e', '#3b82f6', '#eab308', '#ffffff', '#f472b6']
const PARTICLE_COUNT = 60
const DURATION = 2500

export default function ConfettiExplosion({ trigger }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    if (!trigger) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: canvas.width / 2, y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16, vy: (Math.random() - 1) * 14 - 4,
      w: Math.random() * 8 + 4, h: Math.random() * 6 + 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.25 + Math.random() * 0.15,
    }))

    const start = performance.now()
    const animate = (now) => {
      const elapsed = now - start
      if (elapsed > DURATION) { ctx.clearRect(0, 0, canvas.width, canvas.height); return }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const fade = elapsed > DURATION * 0.6 ? 1 - (elapsed - DURATION * 0.6) / (DURATION * 0.4) : 1
      particles.forEach((p) => {
        p.x += p.vx; p.vy += p.gravity; p.y += p.vy; p.vx *= 0.98; p.rotation += p.rotSpeed
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = fade; ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore()
      })
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [trigger])

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }} />
}
