import { useQuery } from "@tanstack/react-query";
import serverbase from "./server";

export interface getItem {
  item: [
    {
      name: string;

      price: number;

      comment?: string;

      date: Date;
    }
  ];
  icon: string;
}

export const useGetItem = (id: number) => {
  return useQuery<getItem>({
    queryKey: ["getItem", id],
    queryFn: async (): Promise<getItem> => {
      const response = await serverbase.get(`item/${id}`);
      return response.data;
    },
    staleTime: 10 * 1000, // 10초 동안 캐시 유지
  });
};
