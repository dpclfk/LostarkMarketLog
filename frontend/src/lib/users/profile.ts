import { useQuery } from "@tanstack/react-query";
import serverbase from "../server";

export interface getProfile {
  id: number;
  nickname: string;
}

export const useGetProfile = () => {
  return useQuery<getProfile>({
    queryKey: ["getProfile"],
    queryFn: async (): Promise<getProfile> => {
      const response = await serverbase.get(`users/profile`, {
        headers: {
          Authorization: sessionStorage.getItem("access_token"),
        },
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
    retry: false, // 재시도 안하게
  });
};
