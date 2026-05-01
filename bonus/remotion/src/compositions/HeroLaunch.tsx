import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { z } from "zod"

export const heroLaunchSchema = z.object({
  productName: z.string(),
  headline: z.string(),
  subheadline: z.string(),
  accentColor: z.string(),
})

type HeroLaunchProps = z.infer<typeof heroLaunchSchema>

export function HeroLaunch({ productName, headline, subheadline, accentColor }: HeroLaunchProps) {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // Logo: surge com mola entre frame 0-30
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  })

  // Headline: fade-in entre frame 30-60
  const headlineOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const headlineY = interpolate(frame, [30, 60], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // Subheadline: fade-in entre frame 70-100
  const subOpacity = interpolate(frame, [70, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // CTA: pulsa após frame 150
  const ctaScale = 1 + 0.04 * Math.sin((frame - 150) / 8)

  // Outro do vídeo: fade-out últimos 30 frames
  const outroOpacity = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #0f172a 0%, ${accentColor}22 100%)`,
        opacity: outroOpacity,
        fontFamily: "Inter, -apple-system, sans-serif",
      }}
    >
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80 }}>
        {/* Logo / Nome do produto */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            background: accentColor,
            color: "white",
            fontSize: 64,
            fontWeight: 800,
            padding: "32px 56px",
            borderRadius: 32,
            marginBottom: 80,
            letterSpacing: -2,
          }}
        >
          {productName}
        </div>

        {/* Headline */}
        <h1
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            color: "white",
            fontSize: 88,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.05,
            letterSpacing: -3,
            margin: 0,
            maxWidth: 900,
          }}
        >
          {headline}
        </h1>

        {/* Subheadline */}
        <p
          style={{
            opacity: subOpacity,
            color: "#cbd5e1",
            fontSize: 44,
            textAlign: "center",
            lineHeight: 1.3,
            marginTop: 40,
            maxWidth: 800,
            fontWeight: 500,
          }}
        >
          {subheadline}
        </p>

        {/* CTA pulsante */}
        {frame >= 150 && (
          <div
            style={{
              transform: `scale(${ctaScale})`,
              background: "white",
              color: "#0f172a",
              fontSize: 40,
              fontWeight: 700,
              padding: "24px 64px",
              borderRadius: 999,
              marginTop: 100,
              boxShadow: `0 20px 60px ${accentColor}66`,
            }}
          >
            Conhecer agora →
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
