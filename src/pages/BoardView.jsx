import { useEffect, useState } from "react";
import ListColumn from "../components/ListColumn.jsx";
import NewList from "../components/NewList.jsx";
import Topbar from "../components/Topbar.jsx";
import BottomTabs from "../components/BottomTabs.jsx";
import CardDetailModal from "../components/cards/CardDetailModal.jsx";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import { accentCycle } from "../data/boards.js";

const BoardView = ({
  board,
  boards,
  activeBoardId,
  onBack,
  onUpdateLists,
  onSwitchBoard,
}) => {
  const [newListTitle, setNewListTitle] = useState("");
  const [activeComposer, setActiveComposer] = useState(null);
  const [draftCard, setDraftCard] = useState("");
  const [openMenuListId, setOpenMenuListId] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    setNewListTitle("");
    setActiveComposer(null);
    setDraftCard("");
    setOpenMenuListId(null);
    setActiveCard(null);
  }, [board?.id]);

  const handleAddList = () => {
    const title = newListTitle.trim();
    if (!title) return;

    const accent = accentCycle[board.lists.length % accentCycle.length];
    const next = {
      id: `l${Date.now()}`,
      title,
      accent,
      cards: [],
    };

    onUpdateLists((current) => [...current, next]);
    setNewListTitle("");
  };

  const handleTitleEdit = (listId, next) => {
    onUpdateLists((current) =>
      current.map((list) =>
        list.id === listId ? { ...list, title: next } : list,
      ),
    );
  };

  const handleAddCard = (listId) => {
    const title = draftCard.trim();
    if (!title) return;

    onUpdateLists((current) =>
      current.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: [
                ...list.cards,
                {
                  id: `c${Date.now()}`,
                  title,
                  completed: false,
                },
              ],
            }
          : list,
      ),
    );
  };

  const handleToggleCard = (listId, cardId) => {
    onUpdateLists((current) =>
      current.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.map((card) =>
                card.id === cardId
                  ? { ...card, completed: !card.completed }
                  : card,
              ),
            }
          : list,
      ),
    );
  };
  const backdropStyle = board.cover
    ? { backgroundImage: `url(${board.cover})` }
    : {
        backgroundImage:
          "linear-gradient(140deg, rgba(15,23,42,0.95), rgba(2,6,23,0.95))",
      };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden text-slate-100">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ ...backdropStyle, filter: "saturate(1.08) contrast(1.05)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/45 via-slate-950/25 to-slate-900/45" />
      <div className="absolute inset-0 noise-overlay opacity-[0.07]" />
      <div className="relative z-10 flex h-screen flex-col">
        <Topbar title={board.title} onBack={onBack} />

        <OverlayScrollbarsComponent
          className="h-full flex"
          options={{
            overflow: { y: "hidden", x: "scroll" },
          }}
          defer
        >
          <main className="mt-2 h-full flex gap-3 px-3 pb-24">
            {board.lists.map((list, listIndex) => (
              <ListColumn
                key={list.id}
                list={list}
                listIndex={listIndex}
                activeComposer={activeComposer}
                onOpenComposer={setActiveComposer}
                onEditTitleList={handleTitleEdit}
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
                    current === list.id ? null : list.id,
                  )
                }
                onCloseMenu={() => setOpenMenuListId(null)}
                onOpenCard={(card, listInfo) =>
                  setActiveCard({ card, list: listInfo })
                }
                onToggleCard={handleToggleCard}
              />
            ))}

            <NewList
              title={newListTitle}
              onTitleChange={setNewListTitle}
              onAddList={handleAddList}
            />
          </main>
        </OverlayScrollbarsComponent>

        <BottomTabs
          boards={boards}
          activeBoardId={activeBoardId}
          onSwitchBoard={onSwitchBoard}
        />
      </div>
      {activeCard ? (
        <CardDetailModal
          card={activeCard.card}
          listTitle={activeCard.list?.title ?? "List"}
          onClose={() => setActiveCard(null)}
        />
      ) : null}
    </div>
  );
};

export default BoardView;
