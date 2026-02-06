import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import BoardView from "./pages/BoardView.jsx";
import BoardsHome from "./pages/BoardsHome.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import { initialBoards } from "./data/boards.js";

const App = () => {
  const [user, setUser] = useState(null); 
  const [boards, setBoards] = useState(initialBoards);
  const navigate = useNavigate();

  const updateBoardsLists = (boardId, updater) => {
    setBoards((current) =>
      current.map((board) =>
        board.id === boardId
          ? { ...board, lists: updater(board.lists) }
          : board,
      ),
    );
  };

  const handleLogin = (userInfo) => {
    setUser(userInfo);
    if (userInfo.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  const handleCreateBoard = ({ title, cover, accent }) => {
    const next = {
      id: `b${Date.now()}`,
      title,
      cover,
      accent,
      lists: [],
    };
    setBoards((current) => [next, ...current]);
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      
      <Route 
        path="/admin" 
        element={
          user?.role === "admin" ? (
            <AdminPage onLogout={handleLogout} onNavigateHome={() => navigate("/")} />
          ) : (
            <Navigate to={user ? "/" : "/login"} />
          )
        } 
      />

      <Route 
        path="/" 
        element={
          user ? (
            <BoardsHome
              boards={boards}
              user={user}
              onLogout={handleLogout}
              onGoToAdmin={user.role === "admin" ? () => navigate("/admin") : null}
              onOpenBoard={(id) => navigate(`/board/${id}`)}
              onCreateBoard={handleCreateBoard}
            />
          ) : (
            <Navigate to="/login" />
          )
        } 
      />

      <Route 
        path="/board/:boardId" 
        element={
          user ? (
            <BoardWrapper 
                boards={boards} 
                onUpdateLists={updateBoardsLists} 
                onNavigate={(path) => navigate(path)}
            />
          ) : (
             <Navigate to="/login" />
          )
        } 
      />
    </Routes>
  );
};

const BoardWrapper = ({ boards, onUpdateLists, onNavigate }) => {
    const { boardId } = useParams();
    const board = boards.find(b => b.id === boardId);

    if (!board) {
        return <Navigate to="/" />;
    }

    return (
        <BoardView
            board={board}
            boards={boards}
            activeBoardId={boardId}
            onBack={() => onNavigate("/")}
            onUpdateLists={(updater) => onUpdateLists(boardId, updater)}
            onSwitchBoard={(id) => onNavigate(`/board/${id}`)}
        />
    );
};

export default App;
