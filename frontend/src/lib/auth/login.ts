import { useMutation } from "@tanstack/react-query";
import serverbase from "../server";

export interface access_token {
  access_token: string;
}

interface LoginBody {
  email: string;
  password: string;
}

const loginReq = async ({
  email,
  password,
}: LoginBody): Promise<access_token> => {
  const response = await serverbase.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginReq,
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
