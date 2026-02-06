import { useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import ListColumn from "../components/board/ListColumn.jsx";
import NewList from "../components/board/NewList.jsx";
import Topbar from "../components/layout/Topbar.jsx";
import BottomTabs from "../components/layout/BottomTabs.jsx";
import CardDetailModal from "../components/card/CardDetailModal.jsx";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";

import { useBoardUi } from "../hooks/useBoardUi";
import { useBoardOperations } from "../hooks/useBoardOperations";
import { useBoardDnD } from "../hooks/useBoardDnD";

const BoardView = ({
  board,
  boards,
  activeBoardId,
  onBack,
  onUpdateLists,
  onSwitchBoard,
}) => {
  // 1. UI State Management
  const {
    newListTitle,
    setNewListTitle,
    activeComposer,
    setActiveComposer,
    draftCard,
    setDraftCard,
    openMenuListId,
    setOpenMenuListId,
    activeCard,
    setActiveCard,
    resetState,
  } = useBoardUi();

  // 2. Data Operations
  const { 
    addList, 
    updateListTitle, 
    addCard, 
    toggleCard,
    copyList,
    deleteList,
    clearList
  } = useBoardOperations({
    board,
    onUpdateLists,
  });

  // 3. Drag and Drop Logic
  const {
    sensors,
    activeDrag,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useBoardDnD({ board, onUpdateLists });

  // Reset UI state when board changes
  useEffect(() => {
    resetState();
  }, [board?.id, resetState]);

  // Derived state for Drag Overlay
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

  const dropAnimation = {
    duration: 220,
    easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.4" } },
    }),
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
                    
                    // UI Props
                    activeComposer={activeComposer}
                    onOpenComposer={setActiveComposer}
                    draftCard={draftCard}
                    onDraftChange={setDraftCard}
                    isMenuOpen={openMenuListId === list.id}
                    onToggleMenu={() =>
                      setOpenMenuListId((current) =>
                        current === list.id ? null : list.id,
                      )
                    }
                    onCloseMenu={() => setOpenMenuListId(null)}
                    
                    // Action Props
                    onCopyList={() => {
                        copyList(list.id);
                        setOpenMenuListId(null);
                    }}
                    onDeleteList={() => {
                        deleteList(list.id);
                        setOpenMenuListId(null);
                    }}
                    onClearList={() => {
                        clearList(list.id);
                        setOpenMenuListId(null);
                    }}
                    onEditTitleList={updateListTitle}
                    onAddCard={() => {
                        addCard(list.id, draftCard);
                        setDraftCard("");
                    }}
                    onCloseComposer={() => {
                      setActiveComposer(null);
                      setDraftCard("");
                    }}
                    onOpenCard={(card, listInfo) =>
                      setActiveCard({ card, list: listInfo })
                    }
                    onToggleCard={toggleCard}
                  />
                ))}

                <NewList
                  title={newListTitle}
                  onTitleChange={setNewListTitle}
                  onAddList={() => {
                      addList(newListTitle);
                      setNewListTitle("");
                  }}
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
