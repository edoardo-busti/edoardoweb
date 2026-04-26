// data/solutionsContent.js

export const solutionsSection = {
  subtitle: "Migliora la tua attività",
  title: "Scegli la soluzione giusta",
  description:
    "La scelta di una soluzione digitale richiede cura e strategia. Creo siti che parlano al posto tuo: eleganti, professionali e pensati per convertire i visitatori in clienti.",
};

/**
 * Ogni servizio ha:
 *  - title       → testo della card (h3, indicizzato)
 *  - description → testo descrittivo (indicizzato)
 *  - iconName    → stringa identificativa dell'icona (gestita lato client)
 *  - mockup      → path immagine + alt text per il mockup corrispondente
 */
export const solutionsServices = [
  {
    title: "Sito web vetrina",
    description:
      "Che tu sia un lavoratore autonomo, un artigiano, un ristoratore o un'azienda che opera in qualsiasi settore, avere un sito web non è più un optional. Oggi, prima di chiamarti o affidarti un lavoro, le persone ti cercano su Google. Se non ti trovano, la scelta ricade sul concorrente. Un sito vetrina professionale ti mette davanti agli occhi giusti, nel momento in cui serve.",
    iconName: "monitor",
    mockup: {
      src: "/assets/images/solutions/business-mockup.webp",
      alt: "Mockup sito vetrina professionale",
      label: "Per aziende e professionisti che desiderano più visibilità",
    },
    features: [
      {
        icon: "/assets/images/solutions-features/impaginazione-strategica.webp",
        label: "Impaginazione strategica",
      },
      {
        icon: "/assets/images/solutions-features/presentazione-attività.webp",
        label: "Presentazione dell'attività",
      },
      {
        icon: "/assets/images/solutions-features/funzionalità-personalizzate.webp",
        label: "Funzionalità personalizzate",
      },
      {
        icon: "/assets/images/solutions-features/ottimizzazione-seo.webp",
        label: "Ottimizzazione SEO",
      },
      {
        icon: "/assets/images/solutions-features/mappe-moduli.webp",
        label: "Mappe e moduli di contatto",
      },
      {
        icon: "/assets/images/solutions-features/supporto-multilingua.webp",
        label: "Supporto multilingua",
      },
    ],
  },
  {
    title: "Sito E-commerce",
    description:
      "Un e-commerce è più di una vetrina, è il tuo miglior venditore. Lavora 24/7, non chiede ferie e raggiunge clienti ovunque. Lo costruisco con un'interfaccia curata e calibrata sul tuo brand, performante sotto ogni aspetto, dall'indicizzazione ai pagamenti, dove acquistare è intuitivo e tornare è naturale, per trasformare visitatori in clienti abituali.",
    iconName: "shopping-cart",
    mockup: {
      src: "/assets/images/solutions/e-commerce-mockup.webp",
      alt: "Mockup piattaforma e-commerce",
      label:
        "Per negozi e imprese che vogliono ampliare i propri orizzonti di vendita",
    },
    features: [
      {
        icon: "/assets/images/solutions-features/registrazione-login.webp",
        label: "Registrazione e login",
      },
      {
        icon: "/assets/images/solutions-features/navigazione-facile.webp",
        label: "Navigazione facile e intuitiva",
      },
      {
        icon: "/assets/images/solutions-features/inventario-smart.webp",
        label: "Inventario smart e wishlist",
      },
      {
        icon: "/assets/images/solutions-features/shopping-cart.webp",
        label: "Checkout rapido e sicuro",
      },
      {
        icon: "/assets/images/solutions-features/pagamenti-digitali.webp",
        label: "Diversi metodi di pagamento",
      },
      {
        icon: "/assets/images/solutions-features/pannello-di-controllo.webp",
        label: "Pannello di controllo",
      },
    ],
  },
  {
    title: "Applicazioni Web e Mobile",
    description:
      "Hai un'idea che non rientra in nessuno schema definito, o un progetto complesso che altri non sanno come affrontare? È esattamente il mio lavoro. Sviluppo applicazioni web e mobile su misura, in qualsiasi settore e per qualsiasi esigenza: gestionali aziendali, piattaforme social, portali medici, app per il fitness, sistemi di prenotazione, forum, strumenti interni e molto altro. Ogni progetto nasce da zero, costruito attorno alle tue necessità. Se puoi immaginarlo, si può costruire.",
    iconName: "layers",
    mockup: {
      src: "/assets/images/solutions/platform-mockup.webp",
      alt: "Mockup applicazione web complessa",
      label: "Per sistemi gestionali complessi e piattaforme innovative",
    },
    features: [
      {
        icon: "/assets/images/solutions-features/custom-app.webp",
        label: "Sviluppo su misura",
      },
      {
        icon: "/assets/images/solutions-features/sistemi-autenticazione.webp",
        label: "Autenticazione e sicurezza",
      },
      {
        icon: "/assets/images/solutions-features/dashboard-gestionali.webp",
        label: "Dashboard e gestionali",
      },
      {
        icon: "/assets/images/solutions-features/canali-gruppi-social.webp",
        label: "Community e forum",
      },
      {
        icon: "/assets/images/solutions-features/condivisione-interazioni.webp",
        label: "Piattaforme social e contenuti",
      },
      {
        icon: "/assets/images/solutions-features/API-e-integrazioni.webp",
        label: "API e integrazioni esterne",
      },
    ],
  },
];
