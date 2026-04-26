// ─── Opzioni statiche del configuratore ───────────────────────────────────────
// Modificare qui per aggiungere nuovi tipi di attività, settori o soluzioni

export const BUSINESS_TYPES = [
  { id: "professionista", label: "Professionista / Piccola impresa" },
  { id: "mediaAzienda", label: "Media azienda (50–249 dipendenti)" },
  { id: "grandeAzienda", label: "Grande azienda (250+ dipendenti)" },
];

export const CATEGORIES = [
  {
    id: "ristorazione",
    label: "Ristorazione e bevande",
    mainTypes: [
      "Ristorante / Pizzeria",
      "Bar / Lounge / Cocktail Bar",
      "Catering & Banqueting",
      "Pasticceria / Panetteria",
      "Macelleria / Gastronomia",
      "Vinoteca / Enoteca",
      "Food Truck",
      "Dark Kitchen",
      "Altro...",
    ],
  },
  {
    id: "cinematografia",
    label: "Cinematografia e intrattenimento",
    mainTypes: [
      "Produzione cinematografica",
      "Cinema / Multisala",
      "Agenzia fotografica",
      "Studio di registrazione",
      "Agenzia eventi & concerti",
      "Escape room / Intrattenimento",
      "Podcast & Streaming",
      "Altro...",
    ],
  },
  {
    id: "salute",
    label: "Salute e benessere",
    mainTypes: [
      "Studio medico / Clinica",
      "Studio dentistico",
      "Centro estetico / SPA",
      "Personal trainer / Palestra",
      "Nutrizionista / Dietista",
      "Psicologo / Terapista",
      "Centro veterinario",
      "Farmacia / Parafarmacia",
      "Altro...",
    ],
  },
  {
    id: "educazione",
    label: "Educazione",
    mainTypes: [
      "Scuola privata / Istituto",
      "Corso online / E-learning",
      "Accademia / Scuola d'arte",
      "Centro linguistico",
      "Tutoring & Ripetizioni",
      "Formazione aziendale",
      "Altro...",
    ],
  },
  {
    id: "tecnologia",
    label: "Tecnologia",
    mainTypes: [
      "Fintech",
      "Cybersecurity",
      "Gaming",
      "Automazione industriale",
      "Intelligenza Artificiale",
      "SaaS / Software house",
      "Hardware & IoT",
      "Altro...",
    ],
  },
  {
    id: "moda",
    label: "Moda e retail",
    mainTypes: [
      "Abbigliamento & Accessori",
      "Gioielleria",
      "Profumeria / Cosmetica",
      "Arredamento & Design",
      "Elettronica & Hi-Tech",
      "Libreria / Cartoleria",
      "Negozio sportivo",
      "Marketplace",
      "Altro...",
    ],
  },
  {
    id: "professioni",
    label: "Professioni e servizi",
    mainTypes: [
      "Studio legale",
      "Studio commercialista / Fiscale",
      "Agenzia immobiliare",
      "Agenzia assicurativa",
      "Agenzia di comunicazione / Marketing",
      "Studio di architettura / Design",
      "Consulenza aziendale",
      "Traduzione & Interpretariato",
      "Altro...",
    ],
  },
  {
    id: "turismo",
    label: "Turismo e hospitality",
    mainTypes: [
      "Hotel / B&B / Agriturismo",
      "Agenzia viaggi",
      "Tour operator",
      "Noleggio veicoli",
      "Guida turistica",
      "Parco avventura / Attività outdoor",
      "Altro...",
    ],
  },
  {
    id: "sport",
    label: "Sport e fitness",
    mainTypes: [
      "Palestra / Centro fitness",
      "Sport acquatici",
      "Sport invernali",
      "Squadra / Associazione sportiva",
      "Centro yoga / Pilates",
      "Arti marziali",
      "Altro...",
    ],
  },
  {
    id: "arte",
    label: "Arte e cultura",
    mainTypes: [
      "Galleria d'arte",
      "Museo / Fondazione",
      "Teatro / Compagnia teatrale",
      "Libreria indipendente",
      "Associazione culturale",
      "Altro...",
    ],
  },
];

export const SOLUTIONS = [
  { id: "website", label: "Sito Web / Vetrina / Blog" },
  { id: "ecommerce", label: "E-commerce / Vendita online" },
  { id: "webApp", label: "Applicazione Web interattiva" },
  { id: "mobileApp", label: "Applicazione Mobile" },
];
