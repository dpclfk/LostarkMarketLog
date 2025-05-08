import { useQuery } from "@tanstack/react-query";
import serverbase from "./server";

export interface getAllItems {
  name: string;
  price: number;
  comment?: string;
  date: Date;
  icon: string;
  id: number;
}

export const useGetAllItems = () => {
  return useQuery<getAllItems[]>({
    queryKey: ["getAllItems"],
    queryFn: async (): Promise<getAllItems[]> => {
      const response = await serverbase.get(`item`);
      return response.data;
    },
    staleTime: 10 * 1000, // 10초 동안 캐시 유지
  });
};
