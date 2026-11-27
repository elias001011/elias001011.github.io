import type { LanguageId } from "../content";

const pt = {
  tagline: "Música, sem ruído.",
  intro: "Player de código aberto para Android, Linux e Windows.",
  download: "Baixar o Zenify", code: "Código-fonte", views: "Explorar o Zenify", desktop: "Ver no desktop",
  screens: {
    player: ["Player", "A cor da capa acompanha a faixa.", "Player em janela compacta com capa, faixa e controles"],
    lyrics: ["Letras", "A letra avança com a música.", "Letras sincronizadas com a linha atual em destaque"],
    queue: ["Fila", "Reordene as próximas faixas.", "Fila de reprodução ao lado da capa no desktop"],
    home: ["Moods e Mix", "Escolha um clima ou descubra um mix pessoal.", "Página inicial com playlists sugeridas e favoritos"],
    recap: ["Time Machine", "Revisite o que você ouviu no mês.", "Retrospectiva com artistas e faixas mais ouvidos"],
    sync: ["Local Sync", "Sua biblioteca passa de um aparelho a outro pelo Wi-Fi.", "Configurações da sincronização local e aparelhos pareados"],
  },
};
export const zenifyCopy: Record<LanguageId, typeof pt> = {
  pt,
  en: {
    tagline: "Music without the noise.", intro: "An open-source player for Android, Linux and Windows.",
    download: "Download Zenify", code: "Source code", views: "Explore Zenify", desktop: "See desktop view",
    screens: {
      player: ["Player", "Album colours set the tone for each track.", "Compact player with artwork, track and playback controls"],
      lyrics: ["Lyrics", "Lyrics move with the music.", "Synced lyrics with the current line highlighted"],
      queue: ["Queue", "Reorder what plays next.", "Desktop queue beside the album artwork"],
      home: ["Moods and Mix", "Pick a mood or discover a personal mix.", "Home screen with suggested playlists and favourites"],
      recap: ["Time Machine", "Revisit your listening month by month.", "Listening recap with top artists and tracks"],
      sync: ["Local Sync", "Move your library between devices over Wi-Fi.", "Local Sync settings with paired devices"],
    },
  },
  es: {
    tagline: "Música sin ruido.", intro: "Reproductor de código abierto para Android, Linux y Windows.",
    download: "Descargar Zenify", code: "Código fuente", views: "Explorar Zenify", desktop: "Ver en escritorio",
    screens: {
      player: ["Reproductor", "Los colores de la portada acompañan la pista.", "Reproductor compacto con portada, pista y controles"],
      lyrics: ["Letras", "La letra avanza con la música.", "Letras sincronizadas con la línea actual resaltada"],
      queue: ["Cola", "Cambia el orden de las próximas pistas.", "Cola de reproducción junto a la portada"],
      home: ["Moods y Mix", "Elige un estado de ánimo o descubre un mix personal.", "Inicio con listas sugeridas y favoritos"],
      recap: ["Time Machine", "Vuelve a escuchar lo que marcó tu mes.", "Resumen mensual con artistas y pistas destacados"],
      sync: ["Local Sync", "Lleva tu biblioteca de un dispositivo a otro por Wi-Fi.", "Ajustes de sincronización local con dispositivos emparejados"],
    },
  },
};
