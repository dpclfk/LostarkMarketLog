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
    refetchOnWindowFocus: false, // 탭 전환 시 재요청 방지
    refetchOnMount: false, // 컴포넌트 마운트 시 재요청 방지
  });
};
