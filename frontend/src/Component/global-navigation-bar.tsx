import { type JSX } from "react";
import { Link } from "react-router-dom";
import { useGetProfile } from "../lib/users/profile";
import IsLoggedOut from "./is-logged-out";
import IsLoggedIn from "./is-logged-in";

const GlobalNavigationBar = (): JSX.Element => {
  const { data, isError } = useGetProfile();

  return (
    <>
      <div className="h-[4.5rem] flex justify-center items-center fixed w-full bg-[#655e53] z-2">
        <div className="flex justify-between w-[90%] ">
          <Link
            to="/"
            reloadDocument
            className="text-white text-3xl font-semibold p-2 cursor-pointer"
          >
            로아 마켓로그
          </Link>
          {data && !isError ? (
            <IsLoggedIn data={data} />
          ) : (
            <IsLoggedOut isError={isError} />
          )}
        </div>
      </div>
    </>
  );
};

export default GlobalNavigationBar;
