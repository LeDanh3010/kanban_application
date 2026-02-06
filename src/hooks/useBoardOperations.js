import { useCallback } from "react";
import { accentCycle } from "../data/boards.js";

export const useBoardOperations = ({ board, onUpdateLists }) => {
  const addList = useCallback((title) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const accent = accentCycle[board.lists.length % accentCycle.length];
    const next = {
      id: `l${Date.now()}`,
      title: trimmed,
      accent,
      cards: [],
    };

    onUpdateLists((current) => [...current, next]);
  }, [board.lists.length, onUpdateLists]);

  const updateListTitle = useCallback((listId, nextTitle) => {
    onUpdateLists((current) =>
      current.map((list) =>
        list.id === listId ? { ...list, title: nextTitle } : list,
      ),
    );
  }, [onUpdateLists]);

  const addCard = useCallback((listId, title) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    onUpdateLists((current) =>
      current.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: [
                ...list.cards,
                {
                  id: `c${Date.now()}`,
                  title: trimmed,
                  completed: false,
                },
              ],
            }
          : list,
      ),
    );
  }, [onUpdateLists]);

  const toggleCard = useCallback((listId, cardId) => {
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
  }, [onUpdateLists]);

  const copyList = useCallback((listId) => {
    onUpdateLists((current) => {
       const listIndex = current.findIndex(l => l.id === listId);
       if(listIndex === -1) return current;
       
       const original = current[listIndex];
       const next = {
           ...original,
           id: `l${Date.now()}`,
           title: `${original.title} (Copy)`,
           cards: original.cards.map(c => ({...c, id: `c${Date.now()}_${Math.random().toString(36).substr(2, 5)}`}))
       };
       
       const nextLists = [...current];
       nextLists.splice(listIndex + 1, 0, next);
       return nextLists;
    });
  }, [onUpdateLists]);

  const deleteList = useCallback((listId) => {
      onUpdateLists(current => current.filter(l => l.id !== listId));
  }, [onUpdateLists]);

  const clearList = useCallback((listId) => {
      onUpdateLists(current => current.map(l => l.id === listId ? { ...l, cards: [] } : l));
  }, [onUpdateLists]);

  return {
    addList,
    updateListTitle,
    addCard,
    toggleCard,
    copyList,
    deleteList,
    clearList
  };
};
