import { jwtApi } from "./api";

export const getUserNotes = async () => {
  const response = await jwtApi.get("/note/");
  return response.data;
};
