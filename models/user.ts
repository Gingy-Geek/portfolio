export interface About {
  description: string;
}

export interface Projects {
  type: "links" | "artwork" | "all";
  links: ProjectLink[];
  artWork: ProjectArtwork[];
}

export interface ProjectLink {
  id:string;
  icon: string | undefined;
  cover: string | undefined;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  link: string;
  year: string;
  tools: ProjectTools
}
export interface ProjectTools {
  frontend: string[];
  backend: string[];
  database: string[];
}


export interface ProjectArtwork {
  id:string;
  image: string;
  title: string;
  description: string;
  year: string;
}

export interface WorkExperience {
  id:string;
  start: string;
  end: string;
  title: string;
  workType: "Remote" | "Office" | "Hybrid"|null;
  description: string;
}

export interface Connect {
  id:string;
  icon:string | undefined;
  mediaName: string;
  nickName: string;
  link: string;
}

export interface Section<T> {
  id: string;
  label: string;
  visible: boolean;
  data: T;
}

export interface User {
  id: string;
  name: string;
  subTitle: string;
  avatar: string;
  sections: Section<any>[];
}


export const exampleUser: User = {
  id: "user-1",
  name: "Gingy",
  subTitle: "Systems Analyst",
  avatar: "/avatar.png",
  sections: [
    {
      id: "about",
      label: "About",
      visible: true,
      data: "Soy desarrolladora web enfocada en la creación de aplicaciones modernas e interactivas. Me interesa construir interfaces claras, eficientes y bien estructuradas, combinando diseño y lógica para desarrollar productos funcionales. Disfruto trabajar en proyectos donde puedo aplicar y seguir mejorando mis habilidades, aprendiendo nuevas tecnologías y cuidando siempre la experiencia del usuario."
    },
    {
      id: "projects",
      label: "Projects",
      visible: true,
      data: {
        type: "links",
        links: [
          {
            id: 1,
            icon: "/pokeIcon.png",
            slug: "poke-catch",
            title: "Poke Catch",
            subtitle: "¡Atrápalos a todos!",
            description: "Poke Catch es una aplicación web de colección de Pokémon. Los usuarios cuentan con una cantidad limitada de tiradas cada cierto tiempo, donde aparecen Pokémon de forma aleatoria. Cada Pokémon tiene un nivel de rareza que determina la probabilidad de captura. Los Pokémon obtenidos se registran automáticamente en una Pokédex personal con su información, junto con una Pokédex exclusiva para Pokémon shiny. Además, el proyecto incluye un leaderboard global donde se muestran todos los jugadores registrados, fomentando la competencia y la rejugabilidad.",
            year: "2024",
            link: "https://poke-catch-front.vercel.app",
            cover: "/imageWeb.png",
            tools: {
              frontend: ["React", "TypeScript", "Tailwind CSS", "Material UI"],
              backend: ["Node.js", "Firebase Auth"],
              database: ["MongoDB Atlas"],
            },
          },
          {
            id: 2,
            icon: "/placeholder.webp",
            slug: "portfolio-personal",
            title: "Portfolio personal ",
            subtitle: "Portfolio web interactivo",
            description: "Este proyecto es mi portfolio personal desarrollado como una aplicación web interactiva. La idea principal no es solo mostrar información estática, sino permitir la edición y gestión de mi contenido directamente desde la interfaz: agregar, modificar o eliminar proyectos, secciones y datos personales. Incluye soporte para múltiples idiomas, modo claro/oscuro y una estructura modular que me permite actualizar el portfolio de forma flexible. El objetivo es mostrar mis trabajos mientras demuestro mis habilidades en desarrollo frontend, lógica de aplicación y construcción de interfaces dinámicas.",
            year: "2025",
            link: "#",
            cover: "/portf.png",
            tools: {
              frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
              backend: [],
              database: [],
            },
          }
        ],
        artWork: [
          {
            id: 1,
            image: "/artwork/lago-atardecer-montañasFondo-1000x1000.jpg",
            title: "Lago al atardecer",
            description:
              "Un lago tranquilo rodeado de rocas durante el atardecer. El cielo se tiñe de tonos cálidos que se reflejan sobre el agua, creando una escena relajante y natural que transmite calma y amplitud.",
            year: "2024",
          },
          {
            id: 2,
            image: "/artwork/tigre-encerrado-1500x1000.jpg",
            title: "Tigre en cautiverio",
            description:
              "Un primer plano de un tigre en cautiverio. La imagen destaca los detalles del pelaje, los ojos y la expresión del animal, mostrando su tristeza y presencia.",
            year: "2023",
          },
          {
            id: 3,
            image: "/artwork/pasaje-natural-tunel-hojas-1500x1000.jpg",
            title: "Pasaje natural",
            description:
              "Un sendero cubierto por hojas y vegetación que forma un túnel natural. La luz se filtra entre los árboles e ilumina el camino, generando una escena agradable y envolvente.",
            year: "2025",
          },
          {
            id: 4,
            image: "/artwork/montaña-nevada1800x770.jpg",
            title: "Montañas nevadas",
            description:
              "Una vista amplia de la cima de una montaña cubierta de nieve. El paisaje resalta la inmensidad del entorno y la tranquilidad que transmiten los espacios abiertos.",
            year: "2023",
          },
          {
            id: 5,
            image: "/artwork/atardecer-playa-tablaSurfEnArena-1200x900.jpg",
            title: "Atardecer en la playa",
            description:
              "Una tabla de surf apoyada en la arena mientras el sol desciende sobre el mar. La luz calida del sol sobre cielo y el reflejo en el agua y en la arena acompañan una escena simple y agradable.",
            year: "2024",
          },
          {
            id: 6,
            image: "/artwork/silueta-mirando-cielo-estrellado-1600x900.jpg",
            title: "Bajo el cielo estrellado",
            description:
              "La silueta de una persona observando un cielo nocturno lleno de estrellas. La imagen muestra un momento tranquilo de observación y conexión con el paisaje nocturno.",
            year: "2025",
          },
        ]
      },
    },
    {
      id: "workExp",
      label: "Work Experience",
      visible: true,
      data: [
        {
          id:1,
          start: "2022",
          end: "2023",
          title: "Frontend Developer",
          workType: "Remote",
          description: "Desarrollo de interfaces web con React y Tailwind.",
        },
      ],
    },
    {
      id: "connect",
      label: "Connect",
      visible: true,
      data: [
        {
          id:1,
          icon: "github",
          mediaName: "GitHub",
          nickName: "Gingy",
          link: "https://github.com/Gingy-Geek",
        },
        {
          id:2,
          icon: "instagram",
          mediaName: "Instagram",
          nickName: "Nahir M. S.",
          link: "https://instagram.com/",
        },
        {
          id:3,
          icon: "gmail",
          mediaName: "Gmail",
          nickName: "arggingerg96@gmail.com",
          link: "mailto:arggingerg96@gmail.com",
        },
        {
          id:4,
          icon: "linkedin",
          mediaName: "LinkedIn",
          nickName: "Nahir M. S.",
          link: "https://linkedin.com",
        },
      ],
    },
  ],
};
