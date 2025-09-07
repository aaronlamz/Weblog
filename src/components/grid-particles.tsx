'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseVx: number
  baseVy: number
  size: number
  opacity: number
}

interface Ripple {
  x: number
  y: number
  start: number
}

export function GridParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvasMaybe = canvasRef.current
    if (!canvasMaybe) return
    const ctxMaybe = canvasMaybe.getContext('2d')
    if (!ctxMaybe) return
    // From here on, use non-null references
    const canvas = canvasMaybe as HTMLCanvasElement
    const ctx = ctxMaybe as CanvasRenderingContext2D

    let animationFrame = 0
    let isRunning = true

    const DPR = Math.min(2, (globalThis.devicePixelRatio || 1))

    function resize() {
      const { innerWidth, innerHeight } = window
      canvas.width = Math.floor(innerWidth * DPR)
      canvas.height = Math.floor(innerHeight * DPR)
      canvas.style.width = innerWidth + 'px'
      canvas.style.height = innerHeight + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    // Particles configuration
    const particleCount = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 25000))
    const particles: Particle[] = []
    const ripples: Ripple[] = []

    // Grid step to align particles roughly to grid intersections
    const step = 26

    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    // Initialize particles near grid intersections with slight jitter
    for (let i = 0; i < particleCount; i++) {
      const col = Math.floor(rand(0, window.innerWidth / step))
      const row = Math.floor(rand(0, window.innerHeight / step))
      const x = col * step + rand(-2, 2)
      const y = row * step + rand(-2, 2)
      // Slow drift mostly along diagonal to imply movement across grid
      const baseSpeed = rand(0.06, 0.18)
      const angle = rand(-Math.PI / 6, Math.PI / 6) + Math.PI / 4
      const vx = Math.cos(angle) * baseSpeed
      const vy = Math.sin(angle) * baseSpeed
      particles.push({
        x,
        y,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        size: rand(1.2, 2.2),
        opacity: rand(0.35, 0.75),
      })
    }

    function onPointerDown(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const now = performance.now()
      ripples.push({ x, y, start: now })

      const radius = 180
      const impulse = 3.2
      for (const p of particles) {
        const dx = p.x - x
        const dy = p.y - y
        const d2 = dx * dx + dy * dy
        if (d2 > radius * radius) continue
        const d = Math.sqrt(Math.max(1, d2))
        const nx = dx / d
        const ny = dy / d
        const falloff = (1 - d / radius)
        const strength = impulse * falloff * falloff
        p.vx += nx * strength
        p.vy += ny * strength
      }
    }

    window.addEventListener('pointerdown', onPointerDown, { passive: true })

    function colorForTheme(opacity: number) {
      if (theme === 'dark') {
        // Cyan/blue glow in dark
        return `rgba(56, 189, 248, ${opacity})`
      }
      // Softer blue/cyan in light
      return `rgba(37, 99, 235, ${opacity})`
    }

    function draw() {
      if (!isRunning) return

      const now = performance.now()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        // Gentle friction and spring back to base drift
        p.vx = p.vx * 0.985 + (p.baseVx - p.vx) * 0.01
        p.vy = p.vy * 0.985 + (p.baseVy - p.vy) * 0.01

        // Clamp speed to avoid runaway
        const speed = Math.hypot(p.vx, p.vy)
        const maxSpeed = 2.6
        if (speed > maxSpeed) {
          const s = maxSpeed / speed
          p.vx *= s
          p.vy *= s
        }

        // Integrate
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges to keep continuous flow
        const w = window.innerWidth
        const h = window.innerHeight
        if (p.x < -5) p.x = w + 5
        if (p.y < -5) p.y = h + 5
        if (p.x > w + 5) p.x = -5
        if (p.y > h + 5) p.y = -5

        // Flicker slightly to mimic different dots moving
        const flicker = 0.02 * Math.sin((p.x + p.y) * 0.05)
        const opacity = Math.max(0.15, Math.min(0.9, p.opacity + flicker))

        // Draw glow
        ctx.beginPath()
        ctx.fillStyle = colorForTheme(opacity)
        ctx.shadowColor = colorForTheme(opacity * 1.2)
        ctx.shadowBlur = theme === 'dark' ? 6 : 4
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // Draw expanding ripple rings
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        const elapsed = now - r.start
        const radius = elapsed * 0.25
        const alpha = Math.max(0, 1 - elapsed / 1200)
        if (alpha <= 0) {
          ripples.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.strokeStyle = theme === 'dark' ? `rgba(56, 189, 248, ${alpha * 0.25})` : `rgba(37, 99, 235, ${alpha * 0.25})`
        ctx.lineWidth = theme === 'dark' ? 1.2 : 1
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2)
        ctx.stroke()
      }

      animationFrame = requestAnimationFrame(draw)
    }

    animationFrame = requestAnimationFrame(draw)

    return () => {
      isRunning = false
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-2] pointer-events-none"
      aria-hidden
    />
  )
}


