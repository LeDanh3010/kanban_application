import { useState } from "react";
import BoardMeta from "./components/BoardMeta.jsx";
import ListColumn from "./components/ListColumn.jsx";
import NewList from "./components/NewList.jsx";
import Topbar from "./components/Topbar.jsx";
import BottomTabs from "./components/BottomTabs.jsx";

const accentCycle = ["sun", "sky", "moss", "clay", "rose"];

const initialLists = [
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
];

const App = () => {
  const [lists, setLists] = useState(initialLists);
  const [newListTitle, setNewListTitle] = useState("");
  const [activeComposer, setActiveComposer] = useState(null);
  const [draftCard, setDraftCard] = useState("");
  const [openMenuListId, setOpenMenuListId] = useState(null);

  const cardCount = lists.reduce((total, list) => total + list.cards.length, 0);

  const handleAddList = () => {
    const title = newListTitle.trim();
    if (!title) return;

    const accent = accentCycle[lists.length % accentCycle.length];
    const next = {
      id: `l${Date.now()}`,
      title,
      accent,
      cards: [],
    };

    setLists((current) => [...current, next]);
    setNewListTitle("");
  };

  const handleAddCard = (listId) => {
    const title = draftCard.trim();
    if (!title) return;

    setLists((current) =>
      current.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: [
                ...list.cards,
                {
                  id: `c${Date.now()}`,
                  title,
                  note: "New card ready for detail",
                  tags: ["New"],
                  due: "No date",
                },
              ],
            }
          : list
      )
    );

    setDraftCard("");
    setActiveComposer(null);
  };

  return (
    <div className="flex h-screen flex-col">
      <Topbar />

      {/* <BoardMeta listCount={lists.length} cardCount={cardCount} /> */}

      <main className="mt-2 flex gap-3 px-3 pb-23">
        {lists.map((list, listIndex) => (
          <ListColumn
            key={list.id}
            list={list}
            listIndex={listIndex}
            activeComposer={activeComposer}
            onOpenComposer={setActiveComposer}
            draftCard={draftCard}
            onDraftChange={setDraftCard}
            onAddCard={handleAddCard}
            onCloseComposer={() => {
              setActiveComposer(null);
              setDraftCard("");
            }}
            isMenuOpen={openMenuListId === list.id}
            onToggleMenu={() =>
              setOpenMenuListId((current) =>
                current === list.id ? null : list.id
              )
            }
            onCloseMenu={() => setOpenMenuListId(null)}
          />
        ))}

        <NewList
          title={newListTitle}
          onTitleChange={setNewListTitle}
          onAddList={handleAddList}
        />
      </main>

      <BottomTabs />
    </div>
  );
};

export default App;
