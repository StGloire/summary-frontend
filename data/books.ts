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

    // 🎧 GRATUIT
    intro: {
      title: "Introduction",
      duration: 3,
      content:
        "Les habitudes sont le composé de l'amélioration personnelle."
    },

    // 🔒 PREMIUM
    chapters: [
      {
        id: "1-2",
        title: "Pourquoi les habitudes comptent",
        duration: 5,
        content:
          "Chaque action est un vote pour la personne que tu veux devenir."
      },
      {
        id: "1-3",
        title: "Les 4 lois du changement",
        duration: 4,
        content:
          "Rendre évident, attractif, facile et satisfaisant."
      },
      {
        id: "1-4",
        title: "Conclusion",
        duration: 3,
        content: "L'amélioration de 1% chaque jour."
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
        content: "Un actif met de l'argent dans ta poche."
      },
      {
        id: "2-3",
        title: "Conclusion",
        duration: 4,
        content: "L'éducation financière est la clé."
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
        content: "Les entreprises qui réussissent sont des monopoles."
      },
      {
        id: "3-3",
        title: "Secrets",
        duration: 4,
        content:
          "Trouver des vérités que personne d'autre ne voit."
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
