import { api } from "./api";

export const getUserNotes = async () => {
  const response = await api.get("/notes/");
  return response.data;
};
