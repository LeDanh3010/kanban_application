import { createBrowserRouter, redirect, useLoaderData, useNavigate, useSubmit, useRouteLoaderData, Navigate, useRevalidator } from "react-router-dom";
import { useEffect, useState } from "react";
import rootLoader from "../loaders/rootLoader";
import MainLayout from "../layouts/MainLayout";
import App from "../App";
import BoardsHome from "../pages/BoardsHome";
import LoginPage, { loginAction } from "../pages/LoginPage";
import AdminPage from "../pages/AdminPage";
import ActivityPage from "../pages/ActivityPage";
import CardsPage from "../pages/CardsPage";
import BoardView from "../pages/BoardView";
import FirstLoginPage, { firstLoginAction } from "../pages/FirstLoginPage";
import { authProvider } from "../utils/auth";
import { getBoards, getBoard, createBoard, archiveBoard, updateBoardLists, updateBoardTitle } from "../utils/data";

export const router = createBrowserRouter([
  {
    element:<App />,
    children:[
      {
        path: "/",
        element: <MainLayout/>,
        loader: rootLoader,
        id: "root",
        shouldRevalidate: () => false,
        children: [
      {
        index: true,
        element: <BoardsHomeWrapper />,
        loader: async () => {
          const boards = await getBoards();
          return { boards };
        },
      },
      {
        path: "admin",
        element: <AdminPageWrapper />,
      },
      {
        path: "activity",
        element: <ActivityPageWrapper />,
      },
      {
        path: "cards",
        element: <CardsPageWrapper />,
      },
      {
        path: "board/:boardId",
        element: <BoardViewWrapper />,
        loader: async ({ params }) => {
          const [board, boards] = await Promise.all([
            getBoard(params.boardId),
            getBoards()
          ]);
          
          if (!board) throw new Response("Not Found", { status: 404 });
          return { board, boards };
        },
      },
    ],
      }
    ]
    
  },
  {
    path: "/login",
    element: <LoginPage />,
    action: loginAction,
    shouldRevalidate: () => false,
    loader: async () => {
      if (authProvider.isAuthenticated) {
         if (authProvider.user?.firstLogin) return redirect("/first-login");
         return redirect("/");
      }
      return null;
    },
  },
  {
    path: "/first-login",
    element: <FirstLoginPage />,
    action: firstLoginAction,
    shouldRevalidate: () => false,
    loader: async () => {
      const user = await authProvider.checkAuth();
      if (!user) return redirect("/login");
      if (!user.firstLogin) return redirect("/");
      return null;
    },
  },
  {
    path: "/logout",
    action: async () => {
      await authProvider.signout();
      return redirect("/login");
    },
  },
]);

function BoardsHomeWrapper() {
  const { boards } = useLoaderData();
  const { user } = useRouteLoaderData("root");
  const navigate = useNavigate();
  const submit = useSubmit();
  const revalidator = useRevalidator();

  const handleCreateBoard = async (boardData) => {
    try {
      await createBoard(boardData);
      revalidator.revalidate();
    } catch (err) {
      console.error("Failed to create board:", err);
    }
  };

  const handleArchiveBoard = async (boardId) => {
    try {
      await archiveBoard(boardId);
      revalidator.revalidate();
    } catch (err) {
      console.error("Failed to archive board:", err);
    }
  };

  return (
    <BoardsHome
      boards={boards}
      user={user}
      onLogout={() => submit(null, { action: "/logout", method: "post" })}
      onGoToAdmin={user.role === "admin" ? () => navigate("/admin") : null}
      onOpenBoard={(id) => navigate(`/board/${id}`)}
      onCreateBoard={handleCreateBoard}
      onArchiveBoard={handleArchiveBoard}
    />
  );
}

function AdminPageWrapper() {
  const { user } = useRouteLoaderData("root");
  const navigate = useNavigate();
  const submit = useSubmit();

  if (user.role !== "admin") return <Navigate to="/" />;

  return <AdminPage onLogout={() => submit(null, { action: "/logout", method: "post" })} onNavigateHome={() => navigate("/")} />;
}

function ActivityPageWrapper() {
  const { user } = useRouteLoaderData("root");
  const navigate = useNavigate();
  return <ActivityPage user={user} onBack={() => navigate(-1)} />;
}

function CardsPageWrapper() {
  const { user } = useRouteLoaderData("root");
  return <CardsPage user={user} />;
}

function BoardViewWrapper() {
  const { board: initialBoard, boards } = useLoaderData();
  const { user } = useRouteLoaderData("root");
  const navigate = useNavigate();
  const submit = useSubmit();

  const [board, setBoard] = useState(initialBoard);

  useEffect(() => {
    setBoard(initialBoard);
  }, [initialBoard]);

  const handleUpdateLists = (updater) => {
    const newLists = typeof updater === 'function' ? updater(board.lists) : updater;
    const nextBoard = { ...board, lists: newLists };
    setBoard(nextBoard);
  };

  const handleUpdateBoardTitle = async (newTitle) => {
    const trimmed = newTitle.trim();
    if (!trimmed || trimmed === board.title) return;
    const nextBoard = { ...board, title: trimmed };
    setBoard(nextBoard);
    await updateBoardTitle(board.id, trimmed);
  };

  return (
    <BoardView
      board={board}
      boards={boards}
      activeBoardId={board.id}
      user={user}
      onBack={() => navigate("/")}
      onUpdateLists={handleUpdateLists}
      onUpdateBoardTitle={handleUpdateBoardTitle}
      onSwitchBoard={(id) => navigate(`/board/${id}`)}
      onLogout={() => submit(null, { action: "/logout", method: "post" })}
    />
  );
}
