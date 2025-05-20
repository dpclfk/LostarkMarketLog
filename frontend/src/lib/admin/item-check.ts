import { useMutation } from "@tanstack/react-query";
import serverbase from "../server";

export interface ItemCheck {
  name: string;
  icon: string;
  itemCode?: number;
  grade: string;
}

interface checkBody {
  name: string;
  categoryCode: number;
  auctions: boolean;
}

const itemCheck = async ({
  name,
  categoryCode,
  auctions,
}: checkBody): Promise<ItemCheck[]> => {
  const response = await serverbase.post(
    "/item/check",
    {
      name: name,
      category: categoryCode,
      auctions: auctions,
    },
    {
      headers: {
        Authorization: sessionStorage.getItem("access_token"),
      },
    }
  );
  return response.data;
};

export const useItemCheck = () => {
  return useMutation({
    mutationFn: itemCheck,
    onSuccess: () => {},
    onError: (error: any) => {
      if (
        error.response?.data?.message === "category must not be less than 10000"
      ) {
        alert("카테고리를 입력해주세요.");
      } else {
        // 커스텀 에러메시지 경로
        const errorMessage =
          error.response?.data?.message || "아이템이 없습니다.";
        alert(errorMessage);
      }
    },
  });
};
