import { useMutation } from "@tanstack/react-query";
import serverbase from "../server";

interface addAdmin {
  nickname: string;
}

const addAdmin = async ({ nickname }: addAdmin): Promise<string> => {
  const response = await serverbase.patch(
    "/auth/admin",
    { nickname },
    {
      headers: {
        Authorization: sessionStorage.getItem("access_token"),
      },
    }
  );
  return response.data;
};

export const useAddAdmin = () => {
  return useMutation({
    mutationFn: addAdmin,
    onSuccess: () => {
      alert("권한 추가 완료");
    },
    onError: (error: any) => {
      // 커스텀 에러메시지 경로
      const errorMessage =
        error.response?.data?.message || "권한 부여에 실패하였습니다.";
      alert(errorMessage);
    },
  });
};
