// ./utils/notesApi.ts

// Imports
import { jwtApi } from "./api";

// Get User Notes API
export const getUserNotes = async () => {
  const response = await jwtApi.get("/note/");
  return response.data;
};

// Create New Note
export const createNewNote = async (
  title: any,
  description: any,
  noteType: any
) => {
  const response = await jwtApi.post("/note/create", {
    title,
    description,
    noteType,
  });
  return response.data;
};

// Delete Note
export const deleteNote = async (noteId: any) => {
  const response = await jwtApi.delete(`/note/${noteId}`);
  return response.data;
};

// Get specific note
export const getSingleNote = async (noteId: any) => {
  const response = await jwtApi.get(`/note/${noteId}`);
  return response.data;
};
