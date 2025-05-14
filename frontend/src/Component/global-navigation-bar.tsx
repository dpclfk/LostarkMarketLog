import { useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProfile } from "../lib/users/profile";
import { useRefresh } from "../lib/auth/refresh";
import { useQueryClient } from "@tanstack/react-query";

const GlobalNavigationBar = (): JSX.Element => {
  const navigate = useNavigate();
  const { mutate } = useRefresh();
  const { data, isError } = useGetProfile();
  const queryClient = useQueryClient();

  // 오류가 발생했을 때(엑세스토큰 유효기간 만료) 리프레시 토큰을 통해 엑세스토큰 재발급
  useEffect(() => {
    if (isError) {
      mutate(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getProfile"] });
        },
      });
    }
  }, [isError]);

  return (
    <>
      <div className="h-[4.5rem] flex justify-center items-center fixed w-full bg-[#655e53] z-2">
        <div className="flex justify-between w-[90%] ">
          <div
            className="text-white text-3xl font-semibold p-2 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            로아 마켓로그
          </div>
          {data ? (
            <p className="text-white text-2xl font-medium px-3 py-2">
              {data.nickname}
            </p>
          ) : (
            <button
              className="text-white text-2xl font-medium border px-3 py-2 rounded border-current cursor-pointer"
              onClick={() => {
                navigate("/auth/login");
              }}
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default GlobalNavigationBar;
