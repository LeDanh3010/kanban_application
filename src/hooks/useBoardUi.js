import { useState, useCallback } from "react";

export const useBoardUi = () => {
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

  return {
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
  };
};
