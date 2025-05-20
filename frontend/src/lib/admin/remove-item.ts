import { useMutation } from "@tanstack/react-query";
import serverbase from "../server";

interface removeItem {
  id: number;
}

const removeItem = async ({ id }: removeItem): Promise<string> => {
  const response = await serverbase.delete(`/item/${id}`, {
    headers: {
      Authorization: sessionStorage.getItem("access_token"),
    },
  });
  return response.data;
};

export const useRemoveItem = () => {
  return useMutation({
    mutationFn: removeItem,
    onSuccess: () => {
      alert("삭제 완료");
    },
    onError: (error: any) => {
      // 커스텀 에러메시지 경로
      const errorMessage =
        error.response?.data?.message || "아이템이 없습니다.";
      alert(errorMessage);
    },
  });
};
