import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"
import { z } from "zod"

export const productDemoSchema = z.object({
  productName: z.string(),
  feature: z.string(),
  steps: z.array(z.string()).min(2).max(6),
  accentColor: z.string(),
})

type ProductDemoProps = z.infer<typeof productDemoSchema>

const INTRO_DURATION = 90 // 3s @ 30fps
const STEP_DURATION = 90 // 3s por step
const OUTRO_DURATION = 90

export function ProductDemo({ productName, feature, steps, accentColor }: ProductDemoProps) {
  return (
    <AbsoluteFill style={{ background: "#0f172a", fontFamily: "Inter, -apple-system, sans-serif" }}>
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <Intro productName={productName} feature={feature} accentColor={accentColor} />
      </Sequence>

      {steps.map((step, i) => (
        <Sequence
          key={i}
          from={INTRO_DURATION + i * STEP_DURATION}
          durationInFrames={STEP_DURATION}
        >
          <StepSlide stepNumber={i + 1} text={step} accentColor={accentColor} />
        </Sequence>
      ))}

      <Sequence from={INTRO_DURATION + steps.length * STEP_DURATION} durationInFrames={OUTRO_DURATION}>
        <Outro productName={productName} accentColor={accentColor} />
      </Sequence>
    </AbsoluteFill>
  )
}

interface IntroProps {
  productName: string
  feature: string
  accentColor: string
}

function Intro({ productName, feature, accentColor }: IntroProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleScale = spring({ frame, fps, config: { damping: 14 } })
  const featureOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" })

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 32 }}>
      <div
        style={{
          transform: `scale(${titleScale})`,
          fontSize: 100,
          fontWeight: 800,
          color: "white",
          letterSpacing: -4,
        }}
      >
        {productName}
      </div>
      <div
        style={{
          opacity: featureOpacity,
          fontSize: 56,
          color: accentColor,
          fontWeight: 600,
          maxWidth: 1400,
          textAlign: "center",
        }}
      >
        {feature}
      </div>
    </AbsoluteFill>
  )
}

interface StepProps {
  stepNumber: number
  text: string
  accentColor: string
}

function StepSlide({ stepNumber, text, accentColor }: StepProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const numberScale = spring({ frame, fps, config: { damping: 12 } })
  const textOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" })
  const textX = interpolate(frame, [20, 50], [60, 0], { extrapolateRight: "clamp" })

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 120, gap: 60 }}>
      <div
        style={{
          transform: `scale(${numberScale})`,
          width: 200,
          height: 200,
          borderRadius: 100,
          background: accentColor,
          color: "white",
          fontSize: 110,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {stepNumber}
      </div>
      <div
        style={{
          opacity: textOpacity,
          transform: `translateX(${textX}px)`,
          fontSize: 64,
          color: "white",
          fontWeight: 600,
          textAlign: "center",
          maxWidth: 1500,
          lineHeight: 1.2,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  )
}

interface OutroProps {
  productName: string
  accentColor: string
}

function Outro({ productName, accentColor }: OutroProps) {
  const frame = useCurrentFrame()
  const ctaOpacity = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: "clamp" })
  const pulse = 1 + 0.05 * Math.sin(frame / 6)

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 50 }}>
      <div style={{ fontSize: 60, color: "#cbd5e1", fontWeight: 500 }}>
        Quer ver na prática?
      </div>
      <div
        style={{
          opacity: ctaOpacity,
          transform: `scale(${pulse})`,
          background: accentColor,
          color: "white",
          fontSize: 56,
          fontWeight: 800,
          padding: "32px 80px",
          borderRadius: 999,
          boxShadow: `0 30px 80px ${accentColor}77`,
        }}
      >
        {productName}.com.br
      </div>
    </AbsoluteFill>
  )
}
