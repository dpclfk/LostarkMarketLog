import { useMutation } from "@tanstack/react-query";
import serverbase from "../server";

const admin = async (): Promise<string> => {
  const response = await serverbase.get("/auth/admin", {
    headers: {
      Authorization: sessionStorage.getItem("access_token"),
    },
  });
  return response.data;
};

export const useAdmin = () => {
  return useMutation({
    mutationFn: admin,
    onSuccess: () => {},
    onError: () => {},
  });
};
