import api from "./api";

export async function registerUser(username,password,role){
    const {data} = await api.post("/auth/register",{username,password,role});
    return data;
}

export async function deleteUser(userId){
    await api.delete(`/users/${userId}`);
}

export async function updateUser(userId, updates) {
    const {data} = await api.put(`/users/${userId}`, updates);
    return data;
}

export async function changePassword(newPassword){
    const {data} = await api.put("/auth/change-password",{newPassword});
    return data;
}

export async function getBoards() {
    const { data } = await api.get("/boards");
    return data;
}

export async function getBoard(id) {
    const { data } = await api.get(`/boards/${id}`);
    return data;
}

export async function createBoard({ title, accent, coverUrl }) {
    const { data } = await api.post("/boards", { title, accent, coverUrl });
    return data;
}

export async function updateBoardTitle(boardId, title) {
    const { data } = await api.put(`/boards/${boardId}`, { title });
    return data;
}

export async function updateBoardLists(boardId, newLists) {
    // Reorder: gửi orderedIds
    const orderedIds = newLists.map(l => l.id);
    await api.put(`/boards/${boardId}/lists/reorder`, { orderedIds });
}

export async function createList(boardId, title) {
    const { data } = await api.post(`/boards/${boardId}/lists`, { title });
    return data;
}

export async function updateList(listId, updates) {
    const { data } = await api.put(`/lists/${listId}`, updates);
    return data;
}

export async function deleteList(listId) {
    await api.delete(`/lists/${listId}`);
}

export async function copyList(listId) {
    const { data } = await api.post(`/lists/${listId}/copy`);
    return data;
}

export async function createCard(listId, title) {
    const { data } = await api.post(`/lists/${listId}/cards`, { title });
    return data;
}

export async function updateCard(cardId, updates) {
    const { data } = await api.put(`/cards/${cardId}`, updates);
    return data;
}

export async function deleteCard(cardId) {
    await api.delete(`/cards/${cardId}`);
}

export async function reorderCards(cards) {
    await api.put("/cards/reorder", { cards });
}

export async function archiveBoard(boardId) {
    await api.delete(`/boards/${boardId}`);
}

export async function getCard(cardId) {
    const { data } = await api.get(`/cards/${cardId}`);
    return data;
}

export async function searchCards(query) {
    const { data } = await api.get(`/cards/search?q=${encodeURIComponent(query)}`);
    return data;
}

export async function addComment(cardId, content) {
    const { data } = await api.post(`/cards/${cardId}/comments`, { content });
    return data;
}

export async function shareBoard(boardId, userId, role) {
    const { data } = await api.post(`/boards/${boardId}/share`, { userId, role });
    return data;
}

export async function updateBoardMember(boardId, memberId, role) {
    const { data } = await api.put(`/boards/${boardId}/members/${memberId}`, { role });
    return data;
}

export async function removeBoardMember(boardId, memberId) {
    const { data } = await api.delete(`/boards/${boardId}/members/${memberId}`);
    return data;
}

export async function getUsers() {
    const { data } = await api.get("/users");
    return data;
}

export async function searchUsers(q) {
    const { data } = await api.get(`/users/search?q=${encodeURIComponent(q)}`);
    return data;
}
