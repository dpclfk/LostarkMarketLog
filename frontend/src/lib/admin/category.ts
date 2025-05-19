import { useQuery } from "@tanstack/react-query";
import serverbase from "../server";

interface SubCategoryItem {
  Code: number;
  CodeName: string;
}

interface CategoryItem {
  Subs: SubCategoryItem[];
  Code: number;
  CodeName: string;
}

export interface CategoryCode {
  market_category: CategoryItem[];
  auction_category: CategoryItem[];
}

export const useGetCategoryCode = () => {
  return useQuery<CategoryCode>({
    queryKey: ["categoryCode"],
    queryFn: async (): Promise<CategoryCode> => {
      const response = await serverbase.get(`item/category`, {
        headers: {
          Authorization: sessionStorage.getItem("access_token"),
        },
      });
      return response.data;
    },
    staleTime: 60 * 60 * 1000, // 1시간 동안 캐시 유지
  });
};
