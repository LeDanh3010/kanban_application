import { useState, useCallback } from "react";
import {
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export const useBoardDnD = ({ board, onUpdateLists }) => {
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

  return {
    sensors,
    activeDrag,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
};
