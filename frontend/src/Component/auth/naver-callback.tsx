import { useEffect, useMemo, type JSX } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useNaverAuth } from "../../lib/auth/naver-auth";
import { useQueryClient } from "@tanstack/react-query";

const NaverCallback = (): JSX.Element => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code: string | null = useMemo(() => searchParams.get("code"), []);
  const state: string | null = useMemo(() => searchParams.get("state"), []);
  const queryClient = useQueryClient();

  const { mutate } = useNaverAuth();

  useEffect(() => {
    if (code && state) {
      mutate(
        { code, state },
        {
          onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ["getProfile"] });
            navigate("/", { replace: true });
          },
          onError: () => {
            navigate("/auth/login", { replace: true });
            alert("로그인에 실패하셨습니다. 다시 시도해주세요.");
          },
        }
      );
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div className="bg-[#ffebc5] h-screen flex justify-center items-center">
      <p className="text-4xl text-gray-500">잠시만 기다려 주세요</p>
    </div>
  );
};

export default NaverCallback;
