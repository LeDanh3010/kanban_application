import { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import ListColumn from "../components/board/ListColumn.jsx";
import NewList from "../components/board/NewList.jsx";
import Topbar from "../components/layout/Topbar.jsx";
import BottomTabs from "../components/layout/BottomTabs.jsx";
import CardDetailModal from "../components/card/CardDetailModal.jsx";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";

import { accentCycle } from "../data/boards.js";
import { createList as createListAPI, updateList as updateListAPI, deleteList as deleteListAPI, copyList as copyListAPI, createCard as createCardAPI, updateCard as updateCardAPI, deleteCard as deleteCardAPI, reorderCards as reorderCardsAPI } from "../utils/data";


const BoardView = ({
  board,
  boards,
  activeBoardId,
  user,
  onBack,
  onUpdateLists,
  onUpdateBoardTitle,
  onSwitchBoard,
  onLogout,
}) => {
  // 1. UI State Management
  const [newListTitle, setNewListTitle] = useState("");
  const [activeComposer, setActiveComposer] = useState(null);
  const [draftCard, setDraftCard] = useState("");
  const [openMenuListId, setOpenMenuListId] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  const resetState = useCallback(() => {
    setNewListTitle("");
    setActiveComposer(null);
    setDraftCard("");
    setOpenMenuListId(null);
    setActiveCard(null);
  }, []);

  // 2. Data Operations
  const addList = useCallback(async (title) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    try{
      const newList = await createListAPI(board.id,trimmed);
      onUpdateLists((current) => [...current, { ...newList, cards: [] }]);
    }catch(e){
       console.error("Failed to create list:", e);
    }
    
  }, [board.id,onUpdateLists]);

  const updateListTitle = useCallback(async (listId, nextTitle) => {
    onUpdateLists((current) =>
      current.map((list) =>
        list.id === listId ? { ...list, title: nextTitle } : list,
      ),
    );
    try{
      await updateListAPI(listId, { title: nextTitle });
    }catch(e){
      console.error("Failed to update list title:", e);
    }
  }, [onUpdateLists]);

  const addCard = useCallback(async (listId, title) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    try {
     const newCard = await createCardAPI(listId, trimmed);
     onUpdateLists((current) => current.map((list) =>
       list.id === listId
         ? { ...list, cards: [...list.cards, newCard] }
         : list
     ));
   } catch (err) {
     console.error("Failed to create card:", err);
   }
  }, [onUpdateLists]);

  const toggleCard = useCallback(async (listId, cardId) => {
    const card = board.lists.find(l => l.id === listId)?.cards.find(c => c.id === cardId);
    if (!card) return;
    onUpdateLists((current) =>
      current.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.map((c) =>
                c.id === cardId
                  ? { ...c, completed: !c.completed }
                  : c,
              ),
            }
          : list,
      ),
    );
    try {
      await updateCardAPI(cardId, { completed: !card.completed });
    } catch (err) {
      console.error("Failed to toggle card:", err);
    }
  }, [onUpdateLists, board.lists]);

  const copyList = useCallback(async (listId) => {
   try {
     const newList = await copyListAPI(listId);
     onUpdateLists(current => {
       const idx = current.findIndex(l => l.id === listId);
       const next = [...current];
       next.splice(idx + 1, 0, newList);
       return next;
     });
   } catch (err) {
     console.error("Failed to copy list:", err);
   }
 }, [onUpdateLists]);

  const deleteList = useCallback(async (listId) => {
    const backup = board.lists;
    onUpdateLists(current => current.filter(l => l.id !== listId));
    try {
      await deleteListAPI(listId);
    } catch (err) {
      console.error("Failed to delete list:", err);
      onUpdateLists(backup); 
    }
  }, [onUpdateLists, board.lists]);

  const clearList = useCallback(async (listId) => {
   const list = board.lists.find(l => l.id === listId);
   if (!list) return;
   onUpdateLists(current => current.map(l =>
     l.id === listId ? { ...l, cards: [] } : l
   ));
   try {
     await Promise.all(list.cards.map(c => deleteCardAPI(c.id)));
   } catch (err) {
     console.error("Failed to clear list:", err);
   }
 }, [board.lists, onUpdateLists]);

  const renameCard = useCallback(async (listId, cardId, newTitle) => {
    onUpdateLists((current) =>
      current.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.map((card) =>
                card.id === cardId ? { ...card, title: newTitle } : card
              ),
            }
          : list
      )
    );
    try {
      await updateCardAPI(cardId, { title: newTitle });
    } catch (err) {
      console.error("Failed to rename card:", err);
    }
  }, [onUpdateLists]);

  const archiveCard = useCallback(async (listId, cardId) => {
    onUpdateLists((current) =>
      current.map((list) =>
        list.id === listId
          ? { ...list, cards: list.cards.filter((card) => card.id !== cardId) }
          : list
      )
    );
    try {
      await deleteCardAPI(cardId);
    } catch (err) {
      console.error("Failed to archive card:", err);
    }
  }, [onUpdateLists]);


  // 3. Drag and Drop Logic
  const [activeDrag, setActiveDrag] = useState(null);
  
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    setActiveDrag({
      id: active.id,
      type: active.data.current?.type,
      listId: active.data.current?.listId,
      cardId: active.data.current?.cardId,
    });
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!over) {
        setActiveDrag(null);
        return;
    }

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Handling Column Dragging
    if (activeType === "column") {
        const activeListId = active.data.current?.listId;
        const overListId = over.data.current?.listId;

        if (activeListId && overListId && activeListId !== overListId) {
             onUpdateLists((current) => {
                const fromIndex = current.findIndex((list) => list.id === activeListId);
                const toIndex = current.findIndex((list) => list.id === overListId);
                
                if (fromIndex !== -1 && toIndex !== -1) {
                    return arrayMove(current, fromIndex, toIndex);
                }
                return current;
             });
        }
        setActiveDrag(null);
        return; 
    }

    // Handling Card Dragging
    if (activeType === "card") {
       const sourceListId = active.data.current?.listId;
       const activeCardId = active.data.current?.cardId;
       
       if (sourceListId && activeCardId) {
            let targetListId = null;
            let targetIndex = null;

            if (overType === "card") {
                targetListId = over.data.current?.listId;
                targetIndex = over.data.current?.cardId;
            } else if (overType === "list") {
                targetListId = over.data.current?.listId;
            } else if (overType === "column") {
                // If dragging a card over a column, treat it as dropping on that list
                targetListId = over.data.current?.listId;
            }

            if (targetListId) {
                onUpdateLists((current) => {
                    const sourceListIndex = current.findIndex(list => list.id === sourceListId);
                    const targetListIndex = current.findIndex(list => list.id === targetListId);
                    
                    if (sourceListIndex === -1 || targetListIndex === -1) return current;

                    const sourceList = current[sourceListIndex];
                    const targetList = current[targetListIndex];
                    const sourceCardIndex = sourceList.cards.findIndex(card => card.id === activeCardId);
                    
                    if (sourceCardIndex === -1) return current;

                    const nextTargetIndex = typeof targetIndex === "string" 
                        ? targetList.cards.findIndex(card => card.id === targetIndex)
                        : targetList.cards.length;
                        
                    const resolvedTargetIndex = nextTargetIndex === -1 ? targetList.cards.length : nextTargetIndex;

                    if (sourceListId === targetListId) {
                        if (sourceCardIndex === resolvedTargetIndex) return current;
                        
                        const nextCards = arrayMove(sourceList.cards, sourceCardIndex, resolvedTargetIndex);
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
       }
    }
    
    setActiveDrag(null);
  }, [onUpdateLists]);

  const handleDragCancel = useCallback(() => {
    setActiveDrag(null);
  }, []);

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

  const backdropStyle = board.coverUrl
    ? { backgroundImage: `url(${board.coverUrl})` }
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
        <Topbar board={board} title={board.title} onBack={onBack} onLogout={onLogout} onTitleChange={onUpdateBoardTitle} page="viewBoard" user={user}/>

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
                    onRenameCard={renameCard}
                    onArchiveCard={archiveCard}
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
