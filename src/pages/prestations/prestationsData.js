// src/data/prestationsData.js
export const prestations = [
  {
    id: 1,
    title: "Révision comptable annuelle",
    description:
      "Révision complète de votre comptabilité avec établissement du bilan et compte de résultat",
    category: "comptabilite",
    price_type: "forfait",
    price: 1500.0,
    duration: "2-3 jours",
  },
  {
    id: 2,
    title: "Business plan",
    description:
      "Élaboration d'un business plan complet avec prévisionnel financier sur 3 ans",
    category: "conseil",
    price_type: "forfait",
    price: 2500.0,
    duration: "1 semaine",
  },
  {
    id: 3,
    title: "Formation comptabilité",
    description:
      "Formation personnalisée sur les bases de la comptabilité et la gestion financière",
    category: "conseil",
    price_type: "horaire",
    price: 120.0,
    duration: "sur mesure",
  },
  {
    id: 4,
    title: "Audit fiscal",
    description:
      "Audit complet de votre situation fiscale avec recommandations d'optimisation",
    category: "fiscal",
    price_type: "sur_devis",
  },
  {
    id: 5,
    title: "Déclaration de TVA",
    description:
      "Établissement et télétransmission de vos déclarations de TVA mensuelles ou trimestrielles",
    category: "fiscal",
    price: 80.0,
    duration: "1 heure",
  },
  {
    id: 6,
    title: "Assemblée générale",
    description:
      "Préparation et rédaction du PV d'assemblée générale ordinaire ou extraordinaire",
    category: "juridique",
    price: 450.0,
    price_type: "1-2 jorus",
  },
  {
    id: 7,
    title: "Modification statutaire",
    description:
      "Modification des statuts de votre société (changement d'adresse, capital, etc.)",
    category: "juridique",
    price: 350.0,
    duration: "3-5 jours",
  },
  {
    id: 8,
    title: "Bulletins de paie",
    description: "Établissement des bulletins de paie et déclarations sociales",
    category: "social",
    price: 35.0,
    duration: "Par salarié",
  },
];
