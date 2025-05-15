import { type JSX } from "react";
import { type getProfile } from "../lib/users/profile";
import { useLogout } from "../lib/auth/logout";
import { useQueryClient } from "@tanstack/react-query";

const IsLoggedIn = ({ data }: { data: getProfile }): JSX.Element => {
  const { mutate } = useLogout();
  const queryClient = useQueryClient();

  return (
    <>
      <div className="flex">
        <p className="text-white text-2xl font-medium px-3 py-2">
          {data.nickname}
        </p>
        <button
          className="text-white text-2xl font-medium border px-3 py-2 rounded border-current cursor-pointer"
          onClick={() => {
            mutate(undefined, {
              onSuccess: async () => {
                await queryClient.refetchQueries({ queryKey: ["getProfile"] });
              },
            });
          }}
        >
          로그아웃
        </button>
      </div>
    </>
  );
};

export default IsLoggedIn;
