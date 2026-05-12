// frontend/data/books.ts

export type Chapter = {
  id: string
  title: string
  content: string
  duration: number
  isFree: boolean
}

export type Book = {
  id: string
  title: string
  author: string
  summary: string
  category: string
  duration: number
  coverImage: string
  isNew?: boolean

  intro: {
    title: string
    content: string
    duration: number
  }

  chapters: Chapter[]

  keyIdeas: string[]
}

export const books = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Productivité",
    duration: 15,
    isNew: true,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",

    summary:
      "Découvrez comment de petits changements quotidiens peuvent transformer votre vie.",

    keyIdeas: [
      "Les petites habitudes font la différence",
      "L'environnement influence ton comportement",
      "Répétition = identité"
    ],

    intro: {
      title: "Introduction",
      duration: 3,
      content:
        "Les habitudes sont le composé de l'amélioration personnelle."
    },

    chapters: [
      {
        id: "1-2",
        title: "Pourquoi les habitudes comptent",
        duration: 5,
        content: "Chaque action est un vote pour la personne que tu veux devenir.",
        isFree: false
      },
      {
        id: "1-3",
        title: "Les 4 lois du changement",
        duration: 4,
        content: "Rendre évident, attractif, facile et satisfaisant.",
        isFree: false
      },
      {
        id: "1-4",
        title: "Conclusion",
        duration: 3,
        content: "L'amélioration de 1% chaque jour.",
        isFree: false
      }
    ]
  },

  {
    id: "2",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Finance",
    duration: 12,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81bsw6fnUiL.jpg",

    summary:
      "Les leçons sur l'argent que les riches enseignent à leurs enfants.",

    keyIdeas: [
      "Les riches font travailler l'argent",
      "Comprendre les actifs et passifs",
      "L'éducation financière est clé"
    ],

    intro: {
      title: "Introduction",
      duration: 3,
      content:
        "Les riches ne travaillent pas pour l'argent, ils font travailler l'argent."
    },

    chapters: [
      {
        id: "2-2",
        title: "Actifs vs Passifs",
        duration: 4,
        content: "Un actif met de l'argent dans ta poche.",
        isFree: false
      },
      {
        id: "2-3",
        title: "Conclusion",
        duration: 4,
        content: "L'éducation financière est la clé.",
        isFree: false
      }
    ]
  },

  {
    id: "3",
    title: "Zero to One",
    author: "Peter Thiel",
    category: "Entrepreneuriat",
    duration: 14,
    isNew: true,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/71m-MxdJ2WL.jpg",

    summary:
      "Comment construire des entreprises qui créent de nouvelles choses.",

    keyIdeas: [
      "Créer quelque chose de nouveau",
      "Les monopoles sont bons",
      "La technologie est clé"
    ],

    intro: {
      title: "Introduction",
      duration: 4,
      content:
        "Aller de 0 à 1 signifie créer quelque chose de totalement nouveau."
    },

    chapters: [
      {
        id: "3-2",
        title: "Monopole vs Compétition",
        duration: 5,
        content: "Les entreprises qui réussissent sont des monopoles.",
        isFree: false
      },
      {
        id: "3-3",
        title: "Secrets",
        duration: 4,
        content: "Trouver des vérités que personne d'autre ne voit.",
        isFree: false
      }
    ]
  },
  
  {
    id: "4",
    title: "Le Mythe de l'Entrepreneuriat Revisité",
    author: "Michael Gerber",
    category: "Entrepreneuriat",
    duration: 45,
    isNew: true,
    coverImage: "https://cdn.kobo.com/book-images/47ca6a4d-d8fd-4fec-9e30-ad2b7b1adf6c/1200/1200/False/the-e-myth-revisited.jpg",
    summary: "Découvrez pourquoi 80% des petites entreprises échouent et comment transformer la vôtre en une machine performante grâce à la révolution du 'clé en main'.",
    keyIdeas: [
      "Le technicien, l'entrepreneur et le manager : les 3 personnalités du chef d'entreprise",
      "Une entreprise qui dépend de vous n'est pas une entreprise, c'est un emploi",
      "La franchise de format commercial : vendre l'entreprise, pas le produit",
      "Travaillez SUR votre entreprise, pas seulement DEDANS"
    ],
    intro: {
      title: "Introduction — Le mythe de l'entrepreneuriat",
      duration: 8,
      content: "Le problème des petites entreprises. La plupart des petites entreprises aux États-Unis échouent. 80 % disparaissent dans leurs cinq premières années. Le problème des propriétaires d'entreprises en difficulté n'est pas leur méconnaissance de la finance, du marketing ou de la gestion. Le problème, c'est qu'ils consacrent leur temps et leur énergie à défendre leurs convictions, au lieu d'apprendre et de s'adapter. Les quatre idées fondamentales : le mythe de l'entrepreneur, la révolution du clé en main, le processus de développement commercial, et l'application systématique par tout propriétaire. Votre entreprise est le reflet de qui vous êtes."
    },
    chapters: [
      {
        id: "4-1",
        title: "Le mythe de l'entrepreneuriat et les 3 personnalités",
        duration: 12,
        content: "La crise entrepreneuriale : la plupart des personnes qui créent une entreprise ont commencé par travailler pour quelqu'un d'autre. L'hypothèse fatale : comprendre le travail technique impliqué dans une entreprise ne signifie pas comprendre l'entreprise elle-même. Un cuisinier ouvre un restaurant mais son plus grand atout devient son plus grand handicap. Les trois personnalités : l'entrepreneur (visionnaire qui vit dans le futur), le manager (pragmatique qui vit dans le passé), le technicien (exécutant qui vit dans le présent). La majorité des créateurs d'entreprise sont composés de 10 % d'entrepreneurs, 20 % de managers et 70 % de techniciens. Celui qui est aux commandes est le technicien.",
        isFree: false
      },
      {
        id: "4-2",
        title: "L'enfance, l'adolescence et la zone de confort",
        duration: 14,
        content: "La phase du technicien : vous travaillez 10 à 16 heures par jour. L'entreprise et le propriétaire ne font qu'un. Une entreprise qui dépend de vous n'est pas une entreprise, c'est un emploi. L'adolescence : vous embauchez votre premier employé mais vous gérez par abdication plutôt que par délégation. La zone de confort est une limite au-delà de laquelle le propriétaire perd le contrôle. Pour survivre, vous devez tout donner jusqu'à l'épuisement.",
        isFree: false
      },
      {
        id: "4-3",
        title: "La maturité et la révolution clé en main",
        duration: 14,
        content: "La maturité se caractérise par la perspective entrepreneuriale : percevoir l'entreprise comme un système de parties intégrées. La révolution du clé en main : Ray Kroc et McDonald's en 1952. La valeur d'une entreprise ne réside pas dans ce qu'elle vend, mais dans la manière dont elle vend. Vendre l'entreprise plutôt que le produit. Le prototype de franchise offre un taux de réussite de 95 %. Le système permet de concilier les trois facettes de votre personnalité.",
        isFree: false
      },
      {
        id: "4-4",
        title: "Travailler sur votre entreprise et le processus de développement",
        duration: 11,
        content: "Le but principal de votre entreprise est de servir votre vie, et non l'inverse. Les six règles du jeu de la franchise : offrir une valeur constante, être exploité par des personnes au niveau de compétences le plus bas possible, être un lieu d'ordre impeccable, documenter tout le travail, fournir un service uniforme, utiliser une tenue uniforme. Le processus de développement commercial repose sur trois piliers : l'innovation (faire avancer les choses), la quantification (mesurer l'impact), l'orchestration (systématiser les solutions).",
        isFree: false
      },
      {
        id: "4-5",
        title: "Les 7 étapes de votre programme de développement",
        duration: 12,
        content: "Étape 1 : Votre objectif principal — comment voulez-vous vivre ? Étape 2 : Votre objectif stratégique — combien avez-vous besoin pour vivre indépendamment ? Étape 3 : Votre stratégie organisationnelle — organisez-vous autour des postes. Étape 4 : Votre stratégie de gestion — créez un système de gestion. Étape 5 : Votre stratégie RH — créez un environnement où l'action prime. Étape 6 : Votre stratégie marketing — ce qui compte, c'est ce que votre client veut. Étape 7 : Votre stratégie systémique — tout est interdépendant. Conclusion : votre petite entreprise est votre propre monde. Arrêtez d'y penser, il est temps d'agir.",
        isFree: false
      }
    ]
  }
]

export const getBookById = (id: string) => {
  return books.find((b) => b.id === id)
}

export const featuredBook = books[0]

export const newBooks = books.filter((b) => b.isNew)

export const trendingBooks = [books[0], books[2]]

export const categories = [
  "Tous",
  "Productivité",
  "Finance",
  "Entrepreneuriat",
  "Leadership"
]

export const getBooksByCategory = (category: string) => {
  if (category === "Tous") return books
  return books.filter((b) => b.category === category)
}