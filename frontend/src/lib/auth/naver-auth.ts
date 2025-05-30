import { useMutation } from "@tanstack/react-query";
import serverbase from "../server";
import type { access_token } from "./login";

interface NaverOAuth {
  code: string;
  state: string;
}

const naverAuth = async ({
  code,
  state,
}: NaverOAuth): Promise<access_token> => {
  const response = await serverbase.get(
    `/auth/naver-oauth?code=${code}&state=${state}`
  );

  return response.data;
};

export const useNaverAuth = () => {
  return useMutation({
    mutationFn: naverAuth,
    onSuccess: (data: access_token) => {
      sessionStorage.setItem("access_token", `Bearer ${data.access_token}`);
    },
    onError: (error: any) => {
      // 커스텀 에러메시지 경로
      const errorMessage =
        error.response?.data?.message || "로그인에 실패했습니다.";
      alert(errorMessage);
    },
  });
};
