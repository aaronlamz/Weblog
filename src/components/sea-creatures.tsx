'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

type CreatureType = 'fish' | 'jelly' | 'ray' | 'angelfish' | 'clownfish' | 'shark' | 'seahorse'

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
    const count = Math.min(35, Math.floor((W() * H()) / 35000))
    const types: CreatureType[] = ['fish', 'jelly', 'ray', 'angelfish', 'clownfish', 'shark', 'seahorse']
    const creatures: Creature[] = []
    const ripples: Ripple[] = []
    let pointerX = W() * 0.5
    let pointerY = H() * 0.5
    let netActiveUntil = 0
    let isNearFish = false

    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      let size: number
      let speed: number
      let baseHue: number
      
      switch (type) {
        case 'jelly':
          size = rand(10, 18)
          speed = rand(0.15, 0.4)
          baseHue = theme === 'dark' ? rand(280, 320) : rand(290, 310) // purple/pink
          break
        case 'ray':
          size = rand(16, 26)
          speed = rand(0.3, 0.6)
          baseHue = theme === 'dark' ? rand(200, 220) : rand(210, 230) // blue
          break
        case 'angelfish':
          size = rand(14, 22)
          speed = rand(0.25, 0.5)
          baseHue = theme === 'dark' ? rand(45, 65) : rand(50, 70) // yellow/orange
          break
        case 'clownfish':
          size = rand(10, 16)
          speed = rand(0.3, 0.6)
          baseHue = theme === 'dark' ? rand(15, 35) : rand(20, 40) // orange/red
          break
        case 'shark':
          size = rand(20, 32)
          speed = rand(0.4, 0.8)
          baseHue = theme === 'dark' ? rand(200, 220) : rand(210, 230) // blue-gray
          break
        case 'seahorse':
          size = rand(8, 14)
          speed = rand(0.1, 0.3)
          baseHue = theme === 'dark' ? rand(120, 160) : rand(130, 170) // green/teal
          break
        default: // fish
          size = rand(12, 20)
          speed = rand(0.2, 0.7)
          baseHue = theme === 'dark' ? rand(185, 205) : rand(195, 215) // cyan/blue
      }
      
      const dir = rand(-Math.PI, Math.PI)
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
      const wobble = Math.sin(c.wobbleT * 0.8) * (c.size * 0.12)
      const bodyWobble = Math.sin(c.wobbleT * 0.6) * 0.02
      
      ctx.save()
      ctx.translate(c.x, c.y)
      ctx.rotate(angle)
      
      const bodyL = c.size * 1.8
      const bodyH = c.size * 0.6
      const headW = bodyH * 0.9
      
      // Main body - more fish-like oval shape
      ctx.fillStyle = color(theme === 'dark' ? 0.45 : 0.35, c.hue)
      ctx.shadowColor = color(theme === 'dark' ? 0.35 : 0.25, c.hue)
      ctx.shadowBlur = theme === 'dark' ? 12 : 8
      
      ctx.beginPath()
      // Head (front)
      ctx.ellipse(bodyL * 0.25, 0, headW, bodyH, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Body (middle section) - slightly tapered
      ctx.beginPath()
      ctx.ellipse(-bodyL * 0.1, 0, bodyL * 0.6, bodyH * (0.85 + bodyWobble), 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Tail fin - more realistic V-shape
      ctx.shadowBlur = theme === 'dark' ? 8 : 5
      ctx.fillStyle = color(theme === 'dark' ? 0.4 : 0.3, c.hue)
      ctx.beginPath()
      ctx.moveTo(-bodyL * 0.7, 0)
      ctx.lineTo(-bodyL * 0.95, -bodyH * 0.8 + wobble)
      ctx.lineTo(-bodyL * 0.85, 0)
      ctx.lineTo(-bodyL * 0.95, bodyH * 0.8 + wobble)
      ctx.closePath()
      ctx.fill()
      
      // Dorsal fin (top)
      ctx.fillStyle = color(theme === 'dark' ? 0.35 : 0.25, c.hue + 10)
      ctx.shadowBlur = theme === 'dark' ? 6 : 4
      ctx.beginPath()
      ctx.moveTo(bodyL * 0.1, -bodyH * 0.6)
      ctx.quadraticCurveTo(bodyL * 0.05, -bodyH * 1.1, -bodyL * 0.2, -bodyH * 0.8)
      ctx.quadraticCurveTo(-bodyL * 0.1, -bodyH * 0.6, bodyL * 0.1, -bodyH * 0.6)
      ctx.fill()
      
      // Pectoral fin (side)
      ctx.fillStyle = color(theme === 'dark' ? 0.3 : 0.2, c.hue + 5)
      ctx.shadowBlur = theme === 'dark' ? 4 : 3
      ctx.beginPath()
      ctx.moveTo(bodyL * 0.15, bodyH * 0.3)
      ctx.quadraticCurveTo(bodyL * 0.25, bodyH * 0.7, bodyL * 0.05, bodyH * 0.8)
      ctx.quadraticCurveTo(bodyL * 0.1, bodyH * 0.5, bodyL * 0.15, bodyH * 0.3)
      ctx.fill()
      
      // Simple eye
      ctx.shadowBlur = 0
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)'
      ctx.beginPath()
      ctx.arc(bodyL * 0.3, -bodyH * 0.15, c.size * 0.08, 0, Math.PI * 2)
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

    function drawAngelfish(c: Creature) {
      const angle = Math.atan2(c.vy, c.vx)
      const wobble = Math.sin(c.wobbleT * 0.7) * (c.size * 0.1)
      
      ctx.save()
      ctx.translate(c.x, c.y)
      ctx.rotate(angle)
      
      const bodyH = c.size * 0.8
      const bodyW = c.size * 1.2
      
      // Triangular body shape
      ctx.fillStyle = color(theme === 'dark' ? 0.45 : 0.35, c.hue)
      ctx.shadowColor = color(theme === 'dark' ? 0.35 : 0.25, c.hue)
      ctx.shadowBlur = theme === 'dark' ? 10 : 6
      
      ctx.beginPath()
      ctx.moveTo(bodyW * 0.3, 0) // nose
      ctx.lineTo(-bodyW * 0.2, -bodyH * 1.2) // top fin
      ctx.lineTo(-bodyW * 0.5, 0) // back
      ctx.lineTo(-bodyW * 0.2, bodyH * 1.2) // bottom fin
      ctx.closePath()
      ctx.fill()
      
      // Stripes
      ctx.fillStyle = color(theme === 'dark' ? 0.25 : 0.15, c.hue + 20)
      for (let i = 0; i < 3; i++) {
        const x = bodyW * (0.2 - i * 0.15)
        ctx.fillRect(x - 2, -bodyH * 0.8, 4, bodyH * 1.6)
      }
      
      // Eye
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)'
      ctx.beginPath()
      ctx.arc(bodyW * 0.2, -bodyH * 0.1, c.size * 0.06, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }

    function drawClownfish(c: Creature) {
      const angle = Math.atan2(c.vy, c.vx)
      const wobble = Math.sin(c.wobbleT * 0.9) * (c.size * 0.1)
      
      ctx.save()
      ctx.translate(c.x, c.y)
      ctx.rotate(angle)
      
      const bodyL = c.size * 1.6
      const bodyH = c.size * 0.7
      
      // Main body - rounded
      ctx.fillStyle = color(theme === 'dark' ? 0.5 : 0.4, c.hue)
      ctx.shadowColor = color(theme === 'dark' ? 0.4 : 0.3, c.hue)
      ctx.shadowBlur = theme === 'dark' ? 8 : 5
      
      ctx.beginPath()
      ctx.ellipse(0, 0, bodyL * 0.7, bodyH, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // White stripes
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)'
      for (let i = 0; i < 3; i++) {
        const x = bodyL * (0.3 - i * 0.3)
        ctx.fillRect(x - 3, -bodyH * 0.8, 6, bodyH * 1.6)
      }
      
      // Fins
      ctx.fillStyle = color(theme === 'dark' ? 0.4 : 0.3, c.hue)
      
      // Tail
      ctx.beginPath()
      ctx.moveTo(-bodyL * 0.7, 0)
      ctx.lineTo(-bodyL * 0.9, -bodyH * 0.5 + wobble)
      ctx.lineTo(-bodyL * 0.9, bodyH * 0.5 + wobble)
      ctx.closePath()
      ctx.fill()
      
      // Dorsal fin
      ctx.beginPath()
      ctx.moveTo(bodyL * 0.2, -bodyH * 0.5)
      ctx.quadraticCurveTo(0, -bodyH * 0.9, -bodyL * 0.3, -bodyH * 0.6)
      ctx.quadraticCurveTo(-bodyL * 0.1, -bodyH * 0.5, bodyL * 0.2, -bodyH * 0.5)
      ctx.fill()
      
      // Eye
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)'
      ctx.beginPath()
      ctx.arc(bodyL * 0.4, -bodyH * 0.2, c.size * 0.08, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }

    function drawShark(c: Creature) {
      const angle = Math.atan2(c.vy, c.vx)
      const wobble = Math.sin(c.wobbleT * 0.5) * (c.size * 0.08)
      
      ctx.save()
      ctx.translate(c.x, c.y)
      ctx.rotate(angle)
      
      const bodyL = c.size * 2.5
      const bodyH = c.size * 0.8
      
      // Streamlined body
      ctx.fillStyle = color(theme === 'dark' ? 0.4 : 0.3, c.hue)
      ctx.shadowColor = color(theme === 'dark' ? 0.3 : 0.2, c.hue)
      ctx.shadowBlur = theme === 'dark' ? 12 : 8
      
      ctx.beginPath()
      ctx.moveTo(bodyL * 0.4, 0) // nose
      ctx.quadraticCurveTo(bodyL * 0.2, -bodyH * 0.4, -bodyL * 0.2, -bodyH * 0.5)
      ctx.quadraticCurveTo(-bodyL * 0.6, -bodyH * 0.3, -bodyL * 0.6, 0)
      ctx.quadraticCurveTo(-bodyL * 0.6, bodyH * 0.3, -bodyL * 0.2, bodyH * 0.5)
      ctx.quadraticCurveTo(bodyL * 0.2, bodyH * 0.4, bodyL * 0.4, 0)
      ctx.fill()
      
      // Dorsal fin
      ctx.fillStyle = color(theme === 'dark' ? 0.35 : 0.25, c.hue)
      ctx.beginPath()
      ctx.moveTo(bodyL * 0.1, -bodyH * 0.3)
      ctx.lineTo(bodyL * 0.05, -bodyH * 0.8)
      ctx.lineTo(-bodyL * 0.1, -bodyH * 0.4)
      ctx.closePath()
      ctx.fill()
      
      // Tail
      ctx.beginPath()
      ctx.moveTo(-bodyL * 0.6, 0)
      ctx.lineTo(-bodyL * 0.9, -bodyH * 0.6 + wobble)
      ctx.lineTo(-bodyL * 0.8, 0)
      ctx.lineTo(-bodyL * 0.9, bodyH * 0.4 + wobble)
      ctx.closePath()
      ctx.fill()
      
      // Eye
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.8)'
      ctx.beginPath()
      ctx.arc(bodyL * 0.25, -bodyH * 0.15, c.size * 0.06, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }

    function drawSeahorse(c: Creature) {
      const angle = Math.atan2(c.vy, c.vx)
      const bobble = Math.sin(c.wobbleT * 0.4) * (c.size * 0.2)
      
      ctx.save()
      ctx.translate(c.x, c.y)
      ctx.rotate(angle + Math.PI / 2) // Seahorses swim vertically
      
      const bodyH = c.size * 2
      const bodyW = c.size * 0.6
      
      // Curved body
      ctx.strokeStyle = color(theme === 'dark' ? 0.5 : 0.4, c.hue)
      ctx.fillStyle = color(theme === 'dark' ? 0.4 : 0.3, c.hue)
      ctx.lineWidth = bodyW
      ctx.lineCap = 'round'
      
      ctx.beginPath()
      ctx.moveTo(0, -bodyH * 0.4) // head
      ctx.quadraticCurveTo(bodyW * 0.5, -bodyH * 0.2, bodyW * 0.3, 0)
      ctx.quadraticCurveTo(bodyW * 0.6, bodyH * 0.3, 0, bodyH * 0.4)
      ctx.stroke()
      
      // Head
      ctx.fillStyle = color(theme === 'dark' ? 0.45 : 0.35, c.hue)
      ctx.beginPath()
      ctx.arc(0, -bodyH * 0.4, bodyW * 0.8, 0, Math.PI * 2)
      ctx.fill()
      
      // Snout
      ctx.beginPath()
      ctx.ellipse(-bodyW * 0.3, -bodyH * 0.5, bodyW * 0.3, bodyW * 0.6, -Math.PI / 6, 0, Math.PI * 2)
      ctx.fill()
      
      // Dorsal fin
      ctx.fillStyle = color(theme === 'dark' ? 0.3 : 0.2, c.hue + 10)
      ctx.beginPath()
      ctx.moveTo(bodyW * 0.4, -bodyH * 0.1)
      ctx.quadraticCurveTo(bodyW * 1.2, 0, bodyW * 0.6, bodyH * 0.2)
      ctx.quadraticCurveTo(bodyW * 0.3, bodyH * 0.1, bodyW * 0.4, -bodyH * 0.1)
      ctx.fill()
      
      // Eye
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)'
      ctx.beginPath()
      ctx.arc(-bodyW * 0.2, -bodyH * 0.35, c.size * 0.05, 0, Math.PI * 2)
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
      
      // Check if hovering near a creature
      const near = creatures.some(c => {
        const dx = c.x - pointerX
        const dy = c.y - pointerY
        return (dx * dx + dy * dy) <= (Math.max(20, c.size * 1.5) ** 2)
      })
      
      // Update cursor style based on proximity to fish
      if (near !== isNearFish) {
        isNearFish = near
        
        if (near) {
          // Force cursor change with !important
          canvas.style.setProperty('cursor', 'grab', 'important')
          document.body.style.setProperty('cursor', 'grab', 'important')
          
          console.log('Setting cursor to grab, canvas cursor:', canvas.style.cursor)
        } else {
          canvas.style.setProperty('cursor', 'default', 'important')
          document.body.style.setProperty('cursor', 'default', 'important')
        }
      }
      
      // If hovering very near a creature, softly activate net for a brief moment
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
          case 'angelfish':
            drawAngelfish(c)
            break
          case 'clownfish':
            drawClownfish(c)
            break
          case 'shark':
            drawShark(c)
            break
          case 'seahorse':
            drawSeahorse(c)
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
      canvas.style.cursor = 'default' // Reset cursor
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-2]"
      aria-hidden
      style={{ cursor: 'default' }}
    />
  )
}


