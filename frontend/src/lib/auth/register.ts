import { useMutation } from "@tanstack/react-query";
import serverbase from "../server";

interface RegisterBody {
  email: string;
  password: string;
  nickname: string;
}

const registerReq = async ({
  email,
  password,
  nickname,
}: RegisterBody): Promise<string> => {
  const response = await serverbase.post("/auth/register", {
    email,
    password,
    nickname,
  });

  return response.data;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerReq,
    onSuccess: () => {
      alert("회원가입에 성공하였습니다.");
    },
    onError: (error: any) => {
      // 커스텀 에러메시지 경로
      const errorMessage =
        error.response?.data?.message || "회원가입에 실패했습니다.";
      alert(errorMessage);
    },
  });
};
