// Toutes les informations du portfolio sont ici : modifie ce fichier pour mettre à jour le site.

export const profile = {
  name: "Ranine Walid",
  role: "Développeuse Web Full-Stack",
  roles: ["Développeuse Web Full-Stack", "Passionnée de React & Next.js", "Créatrice d'interfaces métier"],
  location: "Djibouti",
  photo: "/photo.jpg",
  photo2: "/photo2.jpg",
  email: "raninewalid6@gmail.com",
  phone: "+253 77 36 29 58",
  phoneLink: "+25377362958",
  whatsapp: "https://wa.me/25377362958",
  github: "https://github.com/raninewalid6-glitch",
  linkedin: "",
  cv: "",
  about: [
    "Je conçois et développe des applications web complètes, de l'interface jusqu'à l'API, avec un soin particulier pour l'expérience utilisateur et la lisibilité du code.",
    "J'aime transformer des processus métier — gestion d'appels, suivi de colis, cotisations — en outils simples, rapides et agréables à utiliser au quotidien.",
  ],
  stats: [
    { value: "5+", label: "projets réalisés" },
    { value: "3", label: "applications métier" },
    { value: "100%", label: "responsive" },
  ],
};

export const skills = [
  {
    title: "Front-end",
    items: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS", "HTML / CSS"],
  },
  {
    title: "Back-end",
    items: ["Node.js", "Express", "API REST", "NextAuth", "Prisma", "PHP"],
  },
  {
    title: "Outils",
    items: ["Git & GitHub", "Vite", "Vercel", "Render", "Postman", "Figma"],
  },
];

export const projects = [
  {
    title: "Appel Sortant",
    description:
      "Plateforme de gestion des appels sortants pour un centre de relation client : espaces Superviseur, Agent commercial et Téléconseiller, suivi des colis retour et des retards e-suuq, tableaux de bord et export Excel.",
    tags: ["Next.js 14", "NextAuth", "Tailwind", "TanStack Table", "Recharts", "Zod"],
    github: "https://github.com/raninewalid6-glitch/appel_sortant",
    demo: "",
    featured: true,
  },
  {
    title: "Bibliothèque en ligne",
    description:
      "Site statique de bibliothèque : consultation du catalogue de livres, affichage de leur disponibilité et réservation en ligne.",
    tags: ["HTML", "CSS", "JavaScript", "Site statique"],
    github: "",
    demo: "",
  },
  {
    title: "Hiil Foundation — Cotisations",
    description:
      "Application de gestion des cotisations des membres d'une fondation : enregistrement des paiements, suivi des membres et back-end dédié.",
    tags: ["React 19", "Vite", "Tailwind 4", "Node.js"],
    github: "https://github.com/Abdourahmanmed/Hiil_Foundation",
    demo: "",
    team: "Projet en binôme",
  },
  {
    title: "Cotisation Demo",
    description:
      "Version de démonstration de l'application de cotisations, déployée sur Vercel, pour présenter le parcours utilisateur.",
    tags: ["React 19", "Vite", "Tailwind 4", "Vercel"],
    github: "https://github.com/Abdourahmanmed/cotisation_demo",
    demo: "",
    team: "Projet en binôme",
  },
  {
    title: "AR Car",
    description:
      "Application automobile avec front-end React et API Express, déployée sur Vercel et Render.",
    tags: ["React 19", "Vite", "Tailwind 4", "Express"],
    github: "https://github.com/raninewalid6-glitch/automobile",
    demo: "",
  },
  {
    title: "Appel Entrant",
    description:
      "Interface de traitement des appels entrants, complémentaire de la plateforme Appel Sortant.",
    tags: ["React", "Vite"],
    github: "",
    demo: "",
  },
];
