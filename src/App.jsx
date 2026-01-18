import { useState } from "react";
import BoardView from "./pages/BoardView.jsx";
import BoardsHome from "./pages/BoardsHome.jsx";
import { initialBoards } from "./data/boards.js";

const App = () => {
  const [boards, setBoards] = useState(initialBoards);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const activeBoard =
    boards.find((board) => board.id === activeBoardId) ?? null;

  const updateActiveBoardLists = (updater) => {
    if (!activeBoardId) return;
    setBoards((current) =>
      current.map((board) =>
        board.id === activeBoardId
          ? { ...board, lists: updater(board.lists) }
          : board,
      ),
    );
  };

  if (!activeBoard) {
    return (
      <BoardsHome
        boards={boards}
        onOpenBoard={(id) => setActiveBoardId(id)}
        onCreateBoard={({ title, cover, accent }) => {
          const next = {
            id: `b${Date.now()}`,
            title,
            cover,
            accent,
            lists: [],
          };
          setBoards((current) => [next, ...current]);
        }}
      />
    );
  }

  return (
    <BoardView
      board={activeBoard}
      boards={boards}
      activeBoardId={activeBoardId}
      onBack={() => setActiveBoardId(null)}
      onUpdateLists={updateActiveBoardLists}
      onSwitchBoard={(id) => setActiveBoardId(id)}
    />
  );
};

export default App;
