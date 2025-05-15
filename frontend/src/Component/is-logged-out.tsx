import { useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useRefresh } from "../lib/auth/refresh";
import { useQueryClient } from "@tanstack/react-query";

interface IProps {
  isError: boolean;
}

const IsLoggedOut = (isError: IProps): JSX.Element => {
  const navigate = useNavigate();
  const { mutate } = useRefresh();
  const queryClient = useQueryClient();

  // 오류가 발생했을 때(엑세스토큰 유효기간 만료) 리프레시 토큰을 통해 엑세스토큰 재발급
  useEffect(() => {
    if (isError.isError) {
      mutate(undefined, {
        onSuccess: () => {
          queryClient.refetchQueries({ queryKey: ["getProfile"] });
        },
      });
    }
  }, [isError.isError]);

  return (
    <button
      className="text-white text-2xl font-medium border px-3 py-2 rounded border-current cursor-pointer"
      onClick={() => {
        navigate("/auth/login");
      }}
    >
      로그인
    </button>
  );
};

export default IsLoggedOut;
