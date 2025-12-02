// ./utils/notesApi.ts

// Imports
import { jwtApi } from "./api";

// Get User Notes API
export const getUserNotes = async () => {
  const response = await jwtApi.get("/note/");
  return response.data;
};

// Create New Note
export const createNewNote = async (title: any, description: any) => {
  const response = await jwtApi.post("/create", title, description);
  return response.data;
};
