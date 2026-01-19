import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  defaultDropAnimationSideEffects,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
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
  const [activeDrag, setActiveDrag] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10, delay: 0, tolerance: 5 },
    }),
  );

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
    setDraftCard("");
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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === "column" && overType === "column") {
      if (active.id === over.id) return;
      onUpdateLists((current) => {
        const fromIndex = current.findIndex(
          (list) => `column-${list.id}` === active.id,
        );
        const toIndex = current.findIndex(
          (list) => `column-${list.id}` === over.id,
        );
        if (fromIndex === -1 || toIndex === -1) return current;
        return arrayMove(current, fromIndex, toIndex);
      });
      return;
    }

    if (activeType === "card") {
      const sourceListId = active.data.current?.listId;
      const activeCardId = active.data.current?.cardId;
      if (!sourceListId || !activeCardId) return;

      let targetListId = null;
      let targetIndex = null;

      if (overType === "card") {
        targetListId = over.data.current?.listId;
        targetIndex = over.data.current?.cardId;
      } else if (overType === "list") {
        targetListId = over.data.current?.listId;
      }

      if (!targetListId) return;

      onUpdateLists((current) => {
        const sourceListIndex = current.findIndex(
          (list) => list.id === sourceListId,
        );
        const targetListIndex = current.findIndex(
          (list) => list.id === targetListId,
        );
        if (sourceListIndex === -1 || targetListIndex === -1) return current;

        const sourceList = current[sourceListIndex];
        const targetList = current[targetListIndex];
        const sourceCardIndex = sourceList.cards.findIndex(
          (card) => card.id === activeCardId,
        );
        if (sourceCardIndex === -1) return current;

        const nextTargetIndex =
          typeof targetIndex === "string"
            ? targetList.cards.findIndex((card) => card.id === targetIndex)
            : targetList.cards.length;
        const resolvedTargetIndex =
          nextTargetIndex === -1 ? targetList.cards.length : nextTargetIndex;

        if (sourceListId === targetListId) {
          if (sourceCardIndex === resolvedTargetIndex) return current;
          const nextCards = arrayMove(
            sourceList.cards,
            sourceCardIndex,
            resolvedTargetIndex,
          );
          const next = [...current];
          next[sourceListIndex] = { ...sourceList, cards: nextCards };
          return next;
        }

        const nextSourceCards = [...sourceList.cards];
        const [movedCard] = nextSourceCards.splice(sourceCardIndex, 1);
        const nextTargetCards = [...targetList.cards];
        nextTargetCards.splice(resolvedTargetIndex, 0, movedCard);

        const next = [...current];
        next[sourceListIndex] = { ...sourceList, cards: nextSourceCards };
        next[targetListIndex] = { ...targetList, cards: nextTargetCards };
        return next;
      });
    }
    setActiveDrag(null);
  };
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveDrag({
      id: active.id,
      type: active.data.current?.type,
      listId: active.data.current?.listId,
      cardId: active.data.current?.cardId,
    });
  };

  const handleDragCancel = () => {
    setActiveDrag(null);
  };

  const dropAnimation = {
    duration: 220,
    easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.4" } },
    }),
  };

  const activeList =
    activeDrag?.type === "column"
      ? board.lists.find((list) => `column-${list.id}` === activeDrag.id)
      : null;
  const activeCardData =
    activeDrag?.type === "card"
      ? board.lists
          .find((list) => list.id === activeDrag.listId)
          ?.cards.find((card) => `card-${card.id}` === activeDrag.id)
      : null;
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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={board.lists.map((list) => `column-${list.id}`)}
            strategy={horizontalListSortingStrategy}
          >
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
          </SortableContext>
          <DragOverlay dropAnimation={dropAnimation}>
            {activeList ? (
              <div className="w-[280px] rounded-xl border border-white/10 bg-slate-900/70 p-4 text-slate-100 shadow-[0_18px_36px_rgba(4,6,12,0.6)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">{activeList.title}</h2>
                  <span className="text-xs text-slate-400">
                    {activeList.cards.length} cards
                  </span>
                </div>
              </div>
            ) : null}
            {activeCardData ? (
              <div className="w-[260px] rounded-lg border border-white/10 bg-slate-900/70 p-3 text-slate-100 shadow-[0_16px_30px_rgba(4,6,12,0.6)]">
                <p className="text-sm font-semibold">{activeCardData.title}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

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
