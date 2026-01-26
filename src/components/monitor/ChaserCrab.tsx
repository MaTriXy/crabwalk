import { useState, useEffect, useRef } from 'react'
import { useReactFlow } from '@xyflow/react'
import { CrabIdleAnimation, CrabJumpAnimation, CrabAttackAnimation } from '~/components/ani'

type CrabState = 'idle' | 'running' | 'attacking'

interface Position {
  x: number
  y: number
}

interface ChaserCrabProps {
  nodeIds: string[]
}

const CRAB_SIZE = 20
const CRAB_SPEED = 3 // pixels per frame
const ATTACK_DISTANCE = 30 // how close before attacking
const ATTACK_CHANCE = 0.4 // 40% chance to attack when close

export function ChaserCrab({ nodeIds }: ChaserCrabProps) {
  const { getNodes, getViewport } = useReactFlow()

  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [target, setTarget] = useState<Position | null>(null)
  const [crabState, setCrabState] = useState<CrabState>('idle')
  const [facingLeft, setFacingLeft] = useState(false)

  const prevNodeIdsRef = useRef<Set<string>>(new Set())
  const animationFrameRef = useRef<number>(undefined)
  const attackTimeoutRef = useRef<NodeJS.Timeout>(undefined)

  // Detect new nodes and set them as targets
  useEffect(() => {
    const currentIds = new Set(nodeIds)
    const prevIds = prevNodeIdsRef.current

    // Find newly added nodes (excluding the central crab node)
    for (const id of currentIds) {
      if (!prevIds.has(id) && !id.includes('crab-origin')) {
        // New node found! Get its position
        const nodes = getNodes()
        const newNode = nodes.find((n) => n.id === id)
        if (newNode) {
          const nodeCenter = {
            x: newNode.position.x + 100, // Approximate center
            y: newNode.position.y + 40,
          }
          setTarget(nodeCenter)
          setCrabState('running')

          // Clear any existing attack timeout
          if (attackTimeoutRef.current) {
            clearTimeout(attackTimeoutRef.current)
          }
        }
        break // Only chase one new node at a time
      }
    }

    prevNodeIdsRef.current = currentIds
  }, [nodeIds, getNodes])

  // Animation loop for movement
  useEffect(() => {
    if (!target || crabState === 'attacking') return

    const animate = () => {
      setPosition((current) => {
        const dx = target.x - current.x
        const dy = target.y - current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Check if we're close enough
        if (distance < ATTACK_DISTANCE) {
          // Randomly decide to attack or go idle
          if (Math.random() < ATTACK_CHANCE) {
            setCrabState('attacking')
            // Return to idle after attack animation (4 frames at 10fps = 400ms)
            attackTimeoutRef.current = setTimeout(() => {
              setCrabState('idle')
              setTarget(null)
            }, 400)
          } else {
            setCrabState('idle')
            setTarget(null)
          }
          return current
        }

        // Move towards target
        const vx = (dx / distance) * CRAB_SPEED
        const vy = (dy / distance) * CRAB_SPEED

        // Update facing direction
        if (Math.abs(vx) > 0.1) {
          setFacingLeft(vx < 0)
        }

        return {
          x: current.x + vx,
          y: current.y + vy,
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [target, crabState])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (attackTimeoutRef.current) {
        clearTimeout(attackTimeoutRef.current)
      }
    }
  }, [])

  // Get viewport for proper positioning
  const viewport = getViewport()

  // Transform crab position to screen coordinates
  const screenX = position.x * viewport.zoom + viewport.x
  const screenY = position.y * viewport.zoom + viewport.y

  return (
    <div
      className="absolute pointer-events-none z-50 transition-transform"
      style={{
        left: screenX - CRAB_SIZE / 2,
        top: screenY - CRAB_SIZE / 2,
        width: CRAB_SIZE,
        height: CRAB_SIZE,
        transform: `scaleX(${facingLeft ? -1 : 1})`,
      }}
    >
      {crabState === 'idle' && <CrabIdleAnimation className="w-full h-full" />}
      {crabState === 'running' && <CrabJumpAnimation className="w-full h-full" />}
      {crabState === 'attacking' && <CrabAttackAnimation className="w-full h-full" />}
    </div>
  )
}
