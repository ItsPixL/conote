// ./utils/notesApi.ts

// Imports
import { jwtApi } from "./api";

// Get User Notes API
export const getUserNotes = async () => {
  const response = await jwtApi.get("/note/");
  return response.data;
};
