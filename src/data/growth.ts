import type {
  BestTimeSlot,
  CalendarItem,
  Competitor,
  ContentSeriesPiece,
  DailyEngagementTask,
  FollowerSnapshot,
  HashtagCluster,
  ProfileAuditItem,
  ViralFormat,
} from "@/types";

export const dummyCalendar: CalendarItem[] = [
  {
    id: "1",
    day: "2026-06-23",
    dayLabel: "Lun",
    type: "reel",
    title: "3 errores que matan tu alcance",
    hook: "Tu Reel no falla por el algoritmo — falla por esto.",
    status: "planned",
    time: "18:00",
  },
  {
    id: "2",
    day: "2026-06-24",
    dayLabel: "Mar",
    type: "carousel",
    title: "Sistema de contenido en 5 pasos",
    hook: "De 0 a 10k seguidores con este sistema.",
    status: "planned",
    time: "12:00",
  },
  {
    id: "3",
    day: "2026-06-25",
    dayLabel: "Mié",
    type: "story",
    title: "Detrás de cámaras + encuesta",
    hook: "¿Cuál es tu mayor bloqueo en Instagram?",
    status: "planned",
    time: "10:00",
  },
  {
    id: "4",
    day: "2026-06-26",
    dayLabel: "Jue",
    type: "reel",
    title: "POV: Entendiste el gancho",
    hook: "POV: Llevas 6 meses publicando y por fin aprendiste esto.",
    status: "planned",
    time: "19:00",
  },
  {
    id: "5",
    day: "2026-06-27",
    dayLabel: "Vie",
    type: "reel",
    title: "Resultados de cliente",
    hook: "Mi cliente pasó de 500 a 5k en 60 días. Así lo hizo.",
    status: "planned",
    time: "17:00",
  },
  {
    id: "6",
    day: "2026-06-28",
    dayLabel: "Sáb",
    type: "story",
    title: "Resumen semanal + CTA",
    hook: "Esta semana aprendiste [X]. ¿Listo para más?",
    status: "planned",
    time: "11:00",
  },
  {
    id: "7",
    day: "2026-06-29",
    dayLabel: "Dom",
    type: "carousel",
    title: "Planifica tu semana",
    hook: "Domingo = día de planificar. Aquí tu checklist.",
    status: "planned",
    time: "10:00",
  },
];

export const dummyHashtagClusters: HashtagCluster[] = [
  {
    tier: "large",
    hashtags: [
      { tag: "#instagramgrowth", posts: "2.1M", competition: "Alta" },
      { tag: "#contentcreator", posts: "48M", competition: "Muy alta" },
      { tag: "#reelstips", posts: "890K", competition: "Alta" },
    ],
  },
  {
    tier: "medium",
    hashtags: [
      { tag: "#coachmarketing", posts: "120K", competition: "Media" },
      { tag: "#instagramstrategy", posts: "85K", competition: "Media" },
      { tag: "#growyourinstagram", posts: "210K", competition: "Media" },
    ],
  },
  {
    tier: "small",
    hashtags: [
      { tag: "#coachingbusiness", posts: "45K", competition: "Baja" },
      { tag: "#reelhooks", posts: "12K", competition: "Baja" },
      { tag: "#instagramforcoaches", posts: "8K", competition: "Muy baja" },
    ],
  },
];

export const dummyProfileAudit: ProfileAuditItem[] = [
  {
    id: "1",
    category: "Bio",
    score: 6,
    status: "warning",
    tip: "Añade una transformación clara y un CTA. Ej: 'Ayudo a coaches a crecer en IG → DM CRECE'",
  },
  {
    id: "2",
    category: "Foto de perfil",
    score: 8,
    status: "good",
    tip: "Buena calidad. Asegúrate de que se vea bien en tamaño pequeño.",
  },
  {
    id: "3",
    category: "Highlights",
    score: 4,
    status: "bad",
    tip: "Crea highlights: Servicios, Testimonios, Tips, Sobre mí, Contacto.",
  },
  {
    id: "4",
    category: "CTA",
    score: 5,
    status: "warning",
    tip: "Falta un llamado a la acción claro en bio y en el enlace.",
  },
  {
    id: "5",
    category: "Keywords SEO",
    score: 3,
    status: "bad",
    tip: "Incluye palabras clave: coaching, Instagram, marketing, [tu nicho].",
  },
  {
    id: "6",
    category: "Consistencia visual",
    score: 7,
    status: "good",
    tip: "Buen feed. Mantén colores y estilo coherentes en Reels.",
  },
];

export const dummyBestTimes: BestTimeSlot[] = [
  { day: "Lunes", time: "18:00", score: 92, reason: "Mayor actividad de tu audiencia" },
  { day: "Martes", time: "12:00", score: 88, reason: "Pausa de almuerzo — alto scroll" },
  { day: "Miércoles", time: "19:00", score: 85, reason: "Post-trabajo engagement" },
  { day: "Jueves", time: "18:00", score: 90, reason: "Mejor día histórico de vistas" },
  { day: "Viernes", time: "17:00", score: 82, reason: "Buen rendimiento en Reels" },
  { day: "Sábado", time: "11:00", score: 75, reason: "Audiencia casual activa" },
  { day: "Domingo", time: "10:00", score: 70, reason: "Ideal para carruseles educativos" },
];

export const dummyViralFormats: ViralFormat[] = [
  {
    id: "1",
    name: "3 Errores",
    description: "Lista errores comunes y cómo solucionarlos",
    structure: ["Gancho con error #1", "Error #2 con ejemplo", "Error #3 + solución", "CTA"],
    example: "3 errores que matan tu alcance en Reels",
    avgViews: "15-50K",
  },
  {
    id: "2",
    name: "POV",
    description: "Point of view — situación relatable",
    structure: ["POV: [situación]", "Desarrollo del problema", "Twist o solución", "CTA"],
    example: "POV: Llevas 6 meses publicando y nadie te sigue",
    avgViews: "20-80K",
  },
  {
    id: "3",
    name: "Antes / Después",
    description: "Transformación visual o de resultados",
    structure: ["Estado antes", "Qué cambió", "Resultado después", "Cómo replicarlo"],
    example: "Mi perfil antes vs después de optimizar la bio",
    avgViews: "10-40K",
  },
  {
    id: "4",
    name: "Tutorial rápido",
    description: "How-to en menos de 60 segundos",
    structure: ["Promesa del resultado", "Paso 1", "Paso 2", "Paso 3", "Guarda esto"],
    example: "Cómo escribir un gancho en 30 segundos",
    avgViews: "25-60K",
  },
  {
    id: "5",
    name: "Mito vs Realidad",
    description: "Desmitifica creencias de tu nicho",
    structure: ["Mito común", "Por qué es falso", "La verdad", "Prueba", "CTA"],
    example: "Mito: necesitas publicar 3 veces al día",
    avgViews: "18-45K",
  },
  {
    id: "6",
    name: "Resultado de cliente",
    description: "Prueba social con caso real",
    structure: ["Resultado en gancho", "Situación inicial", "Qué hiciste", "Resultado final"],
    example: "Mi cliente pasó de 500 a 5k en 60 días",
    avgViews: "30-100K",
  },
];

export const dummyFollowerSnapshots: FollowerSnapshot[] = [
  { date: "2026-05-26", followers: 2100, gained: 0 },
  { date: "2026-06-02", followers: 2240, gained: 140, topPost: "3 errores Reels" },
  { date: "2026-06-09", followers: 2480, gained: 240, topPost: "Sistema contenido" },
  { date: "2026-06-16", followers: 2750, gained: 270, topPost: "POV gancho" },
  { date: "2026-06-23", followers: 3020, gained: 270, topPost: "Resultados cliente" },
];

export const dummyCompetitors: Competitor[] = [
  {
    id: "1",
    username: "@hormozi",
    followers: "4.1M",
    niche: "Business",
    topPosts: [
      { title: "Give away the secrets", views: "2.1M", format: "Talking head", hook: "I'll tell you the secret..." },
      { title: "Volume game", views: "1.8M", format: "Text overlay", hook: "Most people quit too early" },
    ],
    patterns: ["Ganchos directos", "Videos 30-60s", "Sin música distractora", "CTA en comentarios"],
  },
  {
    id: "2",
    username: "@jennakutcher",
    followers: "1.2M",
    niche: "Marketing",
    topPosts: [
      { title: "Email list > followers", views: "890K", format: "Carousel", hook: "Your follower count is a vanity metric" },
    ],
    patterns: ["Carruseles educativos", "Tono cercano", "Historias personales", "Soft CTAs"],
  },
  {
    id: "3",
    username: "@thechrisdo",
    followers: "520K",
    niche: "Design",
    topPosts: [
      { title: "Pricing psychology", views: "650K", format: "Reel", hook: "Stop charging hourly" },
    ],
    patterns: ["Contrarian takes", "Valor in primeros 3s", "Subtítulos siempre", "Preguntas en caption"],
  },
];

export const dummyContentSeries: ContentSeriesPiece[] = [
  { day: 1, type: "reel", title: "Intro al tema", hook: "Todo lo que sabes sobre [tema] está mal.", description: "Gancho fuerte + presenta la serie" },
  { day: 2, type: "carousel", title: "Error #1", hook: "Error #1 que comete el 90%.", description: "Profundiza en el primer punto" },
  { day: 3, type: "reel", title: "Error #2", hook: "Esto te cuesta 1000 seguidores al mes.", description: "Segundo punto con ejemplo" },
  { day: 4, type: "story", title: "Encuesta + Q&A", hook: "¿Cuál es tu mayor duda?", description: "Engagement y conexión" },
  { day: 5, type: "reel", title: "La solución", hook: "Así se arregla en 3 pasos.", description: "Framework accionable" },
  { day: 6, type: "carousel", title: "Caso de estudio", hook: "De 500 a 5k en 60 días.", description: "Prueba social" },
  { day: 7, type: "reel", title: "CTA final", hook: "¿Listo para empezar? Haz esto.", description: "Cierra la serie con CTA claro" },
];

export const dummyDailyEngagement: DailyEngagementTask[] = [
  {
    id: "1",
    username: "@hormozi",
    action: "Comentar en su último Reel",
    commentTemplate: "El punto sobre volumen es clave — la consistencia > perfección. ¿Cuánto tiempo tardaste en ver resultados?",
    completed: false,
  },
  {
    id: "2",
    username: "@jennakutcher",
    action: "Responder a su story",
    commentTemplate: "Esto resuena mucho. Estoy aplicando lo del email list y ya veo diferencia.",
    completed: false,
  },
  {
    id: "3",
    username: "@thechrisdo",
    action: "Comentar con insight",
    commentTemplate: "La psicología del pricing que mencionas cambió cómo presento mis servicios. Gran breakdown.",
    completed: true,
  },
  {
    id: "4",
    username: "@garyvee",
    action: "Comentar en post de valor",
    commentTemplate: "La parte sobre paciencia en el juego largo es lo que más creadores necesitan escuchar ahora.",
    completed: false,
  },
  {
    id: "5",
    username: "@codie.sanchez",
    action: "Dejar pregunta reflexiva",
    commentTemplate: "¿Qué opinas de aplicar esto en nichos de servicios en vez de producto?",
    completed: false,
  },
];

export function analyzeHook(hook: string, locale: string): {
  score: number;
  strengths: string[];
  weaknesses: string[];
  variants: string[];
} {
  const wordCount = hook.split(" ").length;
  let score = 5;
  if (wordCount <= 15) score += 1;
  if (hook.includes("?")) score += 1;
  if (/^\d|#\d|3 |5 |7 /.test(hook)) score += 1;
  if (hook.length > 120) score -= 1;
  if (hook.toLowerCase().includes("hola") || hook.toLowerCase().includes("hey")) score -= 2;
  score = Math.min(10, Math.max(1, score));

  if (locale === "es") {
    return {
      score,
      strengths: [
        wordCount <= 15 ? "Longitud óptima para retención" : "Buena estructura",
        "Genera curiosidad",
      ],
      weaknesses: [
        score < 7 ? "Falta un patrón interrupt más fuerte" : "",
        score < 8 ? "Podrías añadir una promesa específica" : "",
      ].filter(Boolean),
      variants: [
        `Para el 90% esto no funciona — pero si eres del 10%...`,
        `Dejé de hacer esto y mis vistas se triplicaron:`,
        `Nadie te dice esto sobre "${hook.slice(0, 30)}..."`,
        `POV: Acabas de descubrir por qué no creces`,
        `3 segundos para saber si tu gancho funciona 👇`,
      ],
    };
  }

  return {
    score,
    strengths: [
      wordCount <= 15 ? "Optimal length for retention" : "Good structure",
      "Creates curiosity",
    ],
    weaknesses: [
      score < 7 ? "Needs a stronger pattern interrupt" : "",
      score < 8 ? "Could add a specific promise" : "",
    ].filter(Boolean),
    variants: [
      `For 90% of people this won't work — but if you're in the 10%...`,
      `I stopped doing this and my views tripled:`,
      `Nobody tells you this about "${hook.slice(0, 30)}..."`,
      `POV: You just discovered why you're not growing`,
      `3 seconds to know if your hook works 👇`,
    ],
  };
}
