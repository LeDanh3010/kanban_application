import { createBrowserRouter, redirect, useLoaderData, useNavigate, useSubmit, useRouteLoaderData, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import rootLoader from "../loaders/rootLoader";
import MainLayout from "../layouts/MainLayout";
import App from "../App";
import BoardsHome from "../pages/BoardsHome";
import LoginPage, { loginAction } from "../pages/LoginPage";
import AdminPage from "../pages/AdminPage";
import ActivityPage from "../pages/ActivityPage";
import CardsPage from "../pages/CardsPage";import BoardView from "../pages/BoardView";
import { authProvider } from "../utils/auth";
import { getBoards, getBoard, createBoard, updateBoardLists } from "../utils/data";

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
    loader: async () => {
      if (authProvider.isAuthenticated) return redirect("/");
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

  const handleCreateBoard = async (boardData) => {
     await createBoard(boardData);
     navigate(0); 
  };

  return (
    <BoardsHome
      boards={boards}
      user={user}
      onLogout={() => submit(null, { action: "/logout", method: "post" })}
      onGoToAdmin={user.role === "admin" ? () => navigate("/admin") : null}
      onOpenBoard={(id) => navigate(`/board/${id}`)}
      onCreateBoard={handleCreateBoard}
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

  const handleUpdateLists = async (updater) => {
    const newLists = typeof updater === 'function' ? updater(board.lists) : updater;
    const nextBoard = { ...board, lists: newLists };
    setBoard(nextBoard);
    await updateBoardLists(board.id, newLists);
  };

  return (
    <BoardView
      board={board}
      boards={boards}
      activeBoardId={board.id}
      onBack={() => navigate("/")}
      onUpdateLists={handleUpdateLists}
      onSwitchBoard={(id) => navigate(`/board/${id}`)}
      onLogout={() => submit(null, { action: "/logout", method: "post" })}
    />
  );
}
