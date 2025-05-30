import { useQuery } from "@tanstack/react-query";
import serverbase from "../server";

export interface getAllItems {
  name: string;
  price: number;
  comment?: string;
  date: Date;
  icon: string;
  id: number;
  grade: string;
}

export const useGetAllItems = () => {
  return useQuery<getAllItems[]>({
    queryKey: ["getAllItems"],
    queryFn: async (): Promise<getAllItems[]> => {
      const response = await serverbase.get(`item`);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
    refetchOnWindowFocus: false, // 탭 전환 시 재요청 방지
    refetchOnMount: false, // 컴포넌트 마운트 시 재요청 방지
  });
};
