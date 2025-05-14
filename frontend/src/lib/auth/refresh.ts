import { useMutation } from "@tanstack/react-query";
import serverbase from "../server";
import type { access_token } from "./login";

export const useRefresh = () => {
  return useMutation({
    mutationFn: async (): Promise<access_token> => {
      const response = await serverbase.get(`auth/refresh`);
      return response.data;
    },
    onSuccess: (data: access_token) => {
      sessionStorage.setItem("access_token", `Bearer ${data.access_token}`);
    },
  });
};
