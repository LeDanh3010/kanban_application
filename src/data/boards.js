export const accentCycle = ["sun", "sky", "moss", "clay", "rose"];

export const accentStyles = {
  sun: "bg-amber-400",
  sky: "bg-sky-400",
  moss: "bg-emerald-400",
  clay: "bg-orange-300",
  rose: "bg-rose-400",
};

export const initialBoards = [
  {
    id: "b1",
    title: "Product Launch",
    accent: "sun",
    cover: "/backgrounds/b1.jpg",
    lists: [
      {
        id: "l1",
        title: "Inbox",
        accent: "sun",
        cards: [
          {
            id: "c1",
            title: "Sketch onboarding flow",
            note: "Landing to first board",
            tags: ["Design"],
            due: "Fri",
          },
          {
            id: "c2",
            title: "Collect user quotes",
            note: "Short interviews",
            tags: ["Research"],
            due: "Mon",
          },
        ],
      },
      {
        id: "l2",
        title: "Design",
        accent: "sky",
        cards: [
          {
            id: "c3",
            title: "Refine board layout",
            note: "Spacing and hierarchy",
            tags: ["Design"],
            due: "Tue",
          },
          {
            id: "c4",
            title: "Draft empty states",
            note: "Make them helpful",
            tags: ["Copy"],
            due: "Wed",
          },
        ],
      },
      {
        id: "l3",
        title: "Build",
        accent: "moss",
        cards: [
          {
            id: "c5",
            title: "Wire up card composer",
            note: "Simple add flow",
            tags: ["Build"],
            due: "Thu",
          },
          {
            id: "c6",
            title: "QA board scroll",
            note: "Mobile and desktop",
            tags: ["QA"],
            due: "Fri",
          },
        ],
      },
      {
        id: "l4",
        title: "Launch",
        accent: "rose",
        cards: [
          {
            id: "c7",
            title: "Write release notes",
            note: "Short and visual",
            tags: ["Marketing"],
            due: "Next week",
          },
        ],
      },
    ],
  },
  {
    id: "b2",
    title: "Marketing Calendar",
    accent: "sky",
    cover: "/backgrounds/b2.jpg",
    lists: [
      {
        id: "l5",
        title: "Ideas",
        accent: "clay",
        cards: [
          {
            id: "c8",
            title: "Newsletter topics",
            note: "3 topics for next week",
            tags: ["Marketing"],
            due: "Mon",
          },
        ],
      },
      {
        id: "l6",
        title: "Production",
        accent: "moss",
        cards: [],
      },
    ],
  },
  {
    id: "b3",
    title: "Personal Tasks",
    accent: "rose",
    cover: "/backgrounds/b3.jpg",
    lists: [],
  },
];

export const boardCovers = [
  "/backgrounds/b1.jpg",
  "/backgrounds/b2.jpg",
  "/backgrounds/b3.jpg",
  "/backgrounds/b4.jpg",
  "/backgrounds/b5.jpg",
];

export const getCardCount = (lists) =>
  lists.reduce((total, list) => total + list.cards.length, 0);
