import type { JSX } from "react";
import { useNavigate } from "react-router-dom";

const GlobalNavigationBar = (): JSX.Element => {
  const navigate = useNavigate();

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
          <button
            className="text-white text-2xl font-medium border px-3 py-2 rounded border-current cursor-pointer"
            onClick={() => {
              navigate("/auth");
            }}
          >
            로그인
          </button>
        </div>
      </div>
    </>
  );
};

export default GlobalNavigationBar;
