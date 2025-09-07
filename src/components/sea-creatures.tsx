'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

type CreatureType = 'fish' | 'jelly' | 'ray'

interface Creature {
  type: CreatureType
  x: number
  y: number
  vx: number
  vy: number
  baseSpeed: number
  size: number
  hue: number
  wobbleT: number
}

interface Ripple {
  x: number
  y: number
  start: number
}

export function SeaCreatures() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvasMaybe = canvasRef.current
    if (!canvasMaybe) return
    const ctxMaybe = canvasMaybe.getContext('2d')
    if (!ctxMaybe) return
    const canvas = canvasMaybe as HTMLCanvasElement
    const ctx = ctxMaybe as CanvasRenderingContext2D

    let raf = 0
    let running = true
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

    const W = () => window.innerWidth
    const H = () => window.innerHeight

    // Populate creatures
    const count = Math.min(30, Math.floor((W() * H()) / 40000))
    const types: CreatureType[] = ['fish', 'jelly', 'ray']
    const creatures: Creature[] = []
    const ripples: Ripple[] = []
    let pointerX = W() * 0.5
    let pointerY = H() * 0.5
    let netActiveUntil = 0

    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const size = type === 'jelly' ? rand(10, 18) : type === 'ray' ? rand(16, 26) : rand(12, 20)
      const speed = rand(0.2, 0.7)
      const dir = rand(-Math.PI, Math.PI)
      const baseHue = theme === 'dark' ? rand(185, 205) : rand(205, 220) // cyan/blue ranges
      creatures.push({
        type,
        x: rand(0, W()),
        y: rand(0, H()),
        vx: Math.cos(dir) * speed,
        vy: Math.sin(dir) * speed,
        baseSpeed: speed,
        size,
        hue: baseHue,
        wobbleT: rand(0, 1000),
      })
    }

    function color(opacity: number, hueShift = 0) {
      const h = hueShift
        ? (hueShift + 360) % 360
        : theme === 'dark' ? 195 : 215
      const s = theme === 'dark' ? 90 : 85
      const l = theme === 'dark' ? 60 : 45
      return `hsla(${h}, ${s}%, ${l}%, ${opacity})`
    }

    function drawFish(c: Creature) {
      const angle = Math.atan2(c.vy, c.vx)
      const wobble = Math.sin(c.wobbleT) * (c.size * 0.15)
      const x = c.x
      const y = c.y
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      // body (capsule)
      ctx.fillStyle = color(theme === 'dark' ? 0.45 : 0.35, c.hue)
      ctx.shadowColor = color(theme === 'dark' ? 0.35 : 0.25, c.hue)
      ctx.shadowBlur = theme === 'dark' ? 12 : 8
      const bodyL = c.size * 2.2
      const bodyR = c.size * 0.7
      ctx.beginPath()
      ctx.moveTo(-bodyL * 0.3, -bodyR)
      ctx.quadraticCurveTo(bodyL * 0.5, -bodyR, bodyL * 0.5, 0)
      ctx.quadraticCurveTo(bodyL * 0.5, bodyR, -bodyL * 0.3, bodyR)
      ctx.arc(-bodyL * 0.3, 0, bodyR, Math.PI / 2, -Math.PI / 2, true)
      ctx.closePath()
      ctx.fill()
      // tail (triangle with wobble)
      ctx.beginPath()
      ctx.moveTo(-bodyL * 0.35, 0)
      ctx.lineTo(-bodyL * 0.55, wobble)
      ctx.lineTo(-bodyL * 0.55, -wobble)
      ctx.closePath()
      ctx.fillStyle = color(theme === 'dark' ? 0.35 : 0.25, c.hue)
      ctx.fill()
      ctx.restore()
    }

    function drawJelly(c: Creature) {
      const x = c.x
      const y = c.y
      ctx.save()
      ctx.translate(x, y)
      // bell
      const r = c.size
      ctx.beginPath()
      const grad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r)
      grad.addColorStop(0, color(0.5, c.hue + 20))
      grad.addColorStop(1, color(0.0, c.hue + 20))
      ctx.fillStyle = grad
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.fill()
      // simple tentacles
      ctx.strokeStyle = color(theme === 'dark' ? 0.35 : 0.25, c.hue + 20)
      ctx.lineWidth = 1
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath()
        ctx.moveTo(i * 2, r * 0.2)
        ctx.quadraticCurveTo(i * 3, r * 0.8, i * 2, r * 1.4)
        ctx.stroke()
      }
      ctx.restore()
    }

    function drawRay(c: Creature) {
      const angle = Math.atan2(c.vy, c.vx)
      const x = c.x
      const y = c.y
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.moveTo(-c.size * 1.4, 0)
      ctx.quadraticCurveTo(0, -c.size * 0.8, c.size * 1.8, 0)
      ctx.quadraticCurveTo(0, c.size * 0.8, -c.size * 1.4, 0)
      ctx.closePath()
      ctx.fillStyle = color(theme === 'dark' ? 0.35 : 0.25, c.hue - 10)
      ctx.shadowColor = color(theme === 'dark' ? 0.25 : 0.2, c.hue - 10)
      ctx.shadowBlur = theme === 'dark' ? 10 : 6
      ctx.fill()
      ctx.restore()
    }

    function onPointerDown(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      ripples.push({ x, y, start: performance.now() })

      // Repel nearby creatures
      const radius = 220
      const impulse = 2.6
      for (const c of creatures) {
        const dx = c.x - x
        const dy = c.y - y
        const d2 = dx * dx + dy * dy
        if (d2 > radius * radius) continue
        const d = Math.sqrt(Math.max(1, d2))
        const nx = dx / d
        const ny = dy / d
        const falloff = 1 - d / radius
        const k = impulse * falloff * falloff
        c.vx += nx * k
        c.vy += ny * k
      }

      // If we clicked near a creature, trigger net state
      const hit = creatures.some(c => {
        const dx = c.x - x
        const dy = c.y - y
        return (dx * dx + dy * dy) <= (Math.max(16, c.size * 1.5) ** 2)
      })
      if (hit) {
        netActiveUntil = performance.now() + 900
        pointerX = x
        pointerY = y
      }
    }

    window.addEventListener('pointerdown', onPointerDown, { passive: true })

    function onPointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect()
      pointerX = e.clientX - rect.left
      pointerY = e.clientY - rect.top
      // If hovering very near a creature, softly activate net for a brief moment
      const near = creatures.some(c => {
        const dx = c.x - pointerX
        const dy = c.y - pointerY
        return (dx * dx + dy * dy) <= (Math.max(14, c.size * 1.2) ** 2)
      })
      if (near) {
        netActiveUntil = Math.max(netActiveUntil, performance.now() + 500)
      }
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    function tick() {
      if (!running) return
      const now = performance.now()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // update & draw creatures
      for (const c of creatures) {
        // gentle cohesion to keep speed around baseSpeed
        const speed = Math.hypot(c.vx, c.vy) || 0.0001
        const target = c.baseSpeed
        c.vx += (c.vx / speed) * (target - speed) * 0.01
        c.vy += (c.vy / speed) * (target - speed) * 0.01

        // mild wandering
        const wander = 0.004
        c.vx += (Math.random() - 0.5) * wander
        c.vy += (Math.random() - 0.5) * wander

        // integrate
        c.x += c.vx
        c.y += c.vy
        c.wobbleT += 0.15 + c.baseSpeed * 0.05

        // wrap around
        const w = W()
        const h = H()
        if (c.x < -30) c.x = w + 30
        if (c.y < -30) c.y = h + 30
        if (c.x > w + 30) c.x = -30
        if (c.y > h + 30) c.y = -30

        // draw
        switch (c.type) {
          case 'fish':
            drawFish(c)
            break
          case 'jelly':
            drawJelly(c)
            break
          case 'ray':
            drawRay(c)
            break
        }
      }

      // ripples
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

      // net effect: when active, connect nearby creatures around pointer to resemble a net
      if (now < netActiveUntil) {
        const caughtRadius = 180
        const linkDistance = 140
        const caught = creatures.filter(c => {
          const dx = c.x - pointerX
          const dy = c.y - pointerY
          return (dx * dx + dy * dy) <= caughtRadius * caughtRadius
        })

        // draw radial lines from pointer to caught
        for (const c of caught) {
          const dx = c.x - pointerX
          const dy = c.y - pointerY
          const d = Math.hypot(dx, dy)
          const a = Math.max(0.08, 1 - d / caughtRadius) * 0.35
          ctx.beginPath()
          ctx.strokeStyle = theme === 'dark' ? `rgba(56, 189, 248, ${a})` : `rgba(37, 99, 235, ${a})`
          ctx.lineWidth = 0.8
          ctx.moveTo(pointerX, pointerY)
          ctx.lineTo(c.x, c.y)
          ctx.stroke()
        }

        // draw links between caught creatures
        for (let i = 0; i < caught.length; i++) {
          for (let j = i + 1; j < caught.length; j++) {
            const ci = caught[i]
            const cj = caught[j]
            const dx = ci.x - cj.x
            const dy = ci.y - cj.y
            const d = Math.hypot(dx, dy)
            if (d > linkDistance) continue
            const a = Math.max(0.04, 1 - d / linkDistance) * 0.25
            ctx.beginPath()
            ctx.strokeStyle = theme === 'dark' ? `rgba(56, 189, 248, ${a})` : `rgba(37, 99, 235, ${a})`
            ctx.lineWidth = 0.7
            ctx.moveTo(ci.x, ci.y)
            ctx.lineTo(cj.x, cj.y)
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
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


