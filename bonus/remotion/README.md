# Pacote Remotion — Master Codex

Projeto Remotion funcional com 2 composições prontas:

1. **HeroLaunch** — vídeo de lançamento (30s, 1080x1920 vertical pra Reels/Shorts/TikTok)
2. **ProductDemo** — demo de funcionalidade (45s, 1920x1080 horizontal pra LinkedIn/YouTube)

## Pré-requisitos

- Node.js 20+
- ffmpeg instalado no sistema (Remotion precisa pra renderizar)
  ```bash
  # macOS
  brew install ffmpeg
  # Ubuntu/Debian
  sudo apt install ffmpeg
  ```

## Instalação

```bash
cd bonus/remotion
npm install
```

## Rodar o Studio (preview)

```bash
npm start
```

Abre em `http://localhost:3000`. Você vê as 2 composições na sidebar e edita props em tempo real.

## Renderizar

### HeroLaunch (vídeo de lançamento, vertical)

```bash
npm run render:hero -- --props='{"productName":"InboxAI","headline":"O CRM que conversa por você","subheadline":"WhatsApp + IA + Pipeline em 1 clique"}'
```

Saída: `out/hero-launch.mp4`

### ProductDemo (demo horizontal)

```bash
npm run render:demo -- --props='{"productName":"InboxAI","feature":"Qualificação automática de lead"}'
```

Saída: `out/product-demo.mp4`

### Render manual com Remotion CLI

```bash
npx remotion render src/index.ts HeroLaunch out/hero-launch.mp4 \
  --props='{"productName":"X","headline":"Y","subheadline":"Z"}'
```

## Customizar

Edite `src/compositions/HeroLaunch.tsx` ou `ProductDemo.tsx`. Props são tipadas — autocomplete funciona no editor.

Para trocar fonte, cores, durações: cada composição expõe constantes no topo do arquivo.

## Trocar logo / assets

Coloque PNG/SVG em `public/` (cria a pasta se não existir). Acesse via `staticFile("logo.png")`.

## Estrutura

```
remotion/
├── package.json
├── tsconfig.json
├── remotion.config.ts
└── src/
    ├── index.ts          # entry — registra as composições
    ├── Root.tsx          # define todas as composições do projeto
    └── compositions/
        ├── HeroLaunch.tsx
        └── ProductDemo.tsx
```

## Dicas

- Pra publicar nas redes, exporte 2x: vertical (Reels/Shorts) + horizontal (LinkedIn/YouTube). As 2 composições já cobrem isso.
- Áudio: adicione com `<Audio src={staticFile("trilha.mp3")} />`. Cuidado com licença.
- Legenda: use `<Sequence>` + texto animado por `interpolate(frame, ...)`. Tem exemplo no `ProductDemo`.

## Problemas comuns

- **"ffmpeg not found"** — instale ffmpeg no sistema (veja pré-requisitos).
- **Render lento** — primeira vez baixa Chromium headless (~150MB). Próximas são instantâneas.
- **Props inválidas** — Remotion valida com Zod via `defaultProps`. Se errar tipo, log diz.
