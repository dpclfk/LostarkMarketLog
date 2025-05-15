import { useMutation } from "@tanstack/react-query";
import serverbase from "../server";

export const useLogout = () => {
  return useMutation({
    mutationFn: async (): Promise<string> => {
      const response = await serverbase.delete(`auth/logout`);
      return response.data;
    },
    onSuccess: () => {
      sessionStorage.removeItem("access_token");
    },
  });
};
