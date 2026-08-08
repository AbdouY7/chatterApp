import instance from "./axios";

export const searchUsers = (query) =>
  instance.get(`/users/search?query=${encodeURIComponent(query)}`);
