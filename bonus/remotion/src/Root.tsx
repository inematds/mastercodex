import { Composition } from "remotion"
import { HeroLaunch, heroLaunchSchema } from "./compositions/HeroLaunch"
import { ProductDemo, productDemoSchema } from "./compositions/ProductDemo"

export function Root() {
  return (
    <>
      {/* Vídeo de lançamento — vertical (Reels/Shorts/TikTok), 30s @ 30fps */}
      <Composition
        id="HeroLaunch"
        component={HeroLaunch}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
        schema={heroLaunchSchema}
        defaultProps={{
          productName: "InboxAI",
          headline: "O CRM que conversa por você",
          subheadline: "WhatsApp + IA + Pipeline em 1 clique",
          accentColor: "#6366f1",
        }}
      />

      {/* Demo de produto — horizontal (LinkedIn/YouTube), 45s @ 30fps */}
      <Composition
        id="ProductDemo"
        component={ProductDemo}
        durationInFrames={45 * 30}
        fps={30}
        width={1920}
        height={1080}
        schema={productDemoSchema}
        defaultProps={{
          productName: "InboxAI",
          feature: "Qualificação automática de lead",
          steps: [
            "Cliente manda mensagem no WhatsApp",
            "Agente IA classifica intenção em 2s",
            "Lead vai pro pipeline correto automaticamente",
            "Você só intervém quando vira negociação",
          ],
          accentColor: "#6366f1",
        }}
      />
    </>
  )
}
