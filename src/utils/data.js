import { initialBoards } from "../data/boards";

let boards = initialBoards;

// Async function to simulate fetching boards from API
export async function getBoards() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return boards;
}

// Async function to simulate getting a single board
export async function getBoard(id) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return boards.find((board) => board.id === id);
}

// Async function to create a board
export async function createBoard({ title, cover, accent }) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newBoard = {
    id: `b${Date.now()}`,
    title,
    cover,
    accent,
    lists: [],
  };
  boards = [newBoard, ...boards];
  return newBoard;
}

// Async function to update lists in a board
export async function updateBoardLists(boardId, newLists) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  boards = boards.map((b) =>
    b.id === boardId ? { ...b, lists: newLists } : b
  );
  return boards.find((b) => b.id === boardId);
}
