import { Config } from "@remotion/cli/config"

// Codec H.264 é compatível com 99% das plataformas (YT, IG, LinkedIn, TikTok)
Config.setVideoImageFormat("jpeg")
Config.setCodec("h264")

// Concorrência de render — usa metade dos cores disponíveis (não trava o sistema)
Config.setConcurrency(null) // null = automático

// Pasta de saída
Config.setOutputLocation("out")

// Qualidade — 80 é ótimo equilíbrio (qualidade vs tamanho)
Config.setJpegQuality(80)
