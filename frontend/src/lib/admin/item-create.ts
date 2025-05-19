import { useMutation } from "@tanstack/react-query";
import serverbase from "../server";

interface ItemCreateBody {
  name: string;
  category: number;
  auctions: boolean;
  icon: string;
  itemCode?: number;
  grade: string;
}

const itemCreate = async ({
  name,
  category,
  auctions,
  icon,
  itemCode,
  grade,
}: ItemCreateBody): Promise<ItemCreateBody[]> => {
  const response = await serverbase.post(
    "/item",
    {
      name,
      category,
      auctions,
      icon,
      itemCode,
      grade,
    },
    {
      headers: {
        Authorization: sessionStorage.getItem("access_token"),
      },
    }
  );
  return response.data;
};

export const useItemCreate = () => {
  return useMutation({
    mutationFn: itemCreate,
    onSuccess: () => {
      alert("추가 완료");
    },
    onError: (error: any) => {
      if (error.response?.data?.message === "Unauthorized") {
        alert("권한이 없습니다.");
      } else {
        // 커스텀 에러메시지 경로
        const errorMessage =
          error.response?.data?.message || "아이템이 없습니다.";
        alert(errorMessage);
      }
    },
  });
};
