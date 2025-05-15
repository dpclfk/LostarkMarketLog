import { useQuery } from "@tanstack/react-query";
import serverbase from "../server";

export interface getProfile {
  id: number;
  nickname: string;
}

export const useGetProfile = () => {
  // const access_token = sessionStorage.getItem("access_token");
  return useQuery<getProfile>({
    queryKey: ["getProfile"],
    queryFn: async (): Promise<getProfile> => {
      if (!sessionStorage.getItem("access_token")) {
        throw new Error("Not Logged In");
      }
      const response = await serverbase.get(`users/profile`, {
        headers: {
          Authorization: sessionStorage.getItem("access_token"),
        },
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
    retry: false, // 재시도 안하게
    refetchOnWindowFocus: false, // 탭 전환 시 재요청 방지
    refetchOnMount: false, // 컴포넌트 마운트 시 재요청 방지
  });
};
