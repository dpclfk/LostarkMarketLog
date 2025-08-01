import { Outlet, useLocation, type Location } from "react-router-dom";
import RightView from "./right-view";
import classNames from "classnames";
import Search from "./search";
import { useState, type JSX } from "react";

interface MainProps {
  rightView?: boolean;
  bgWhiteDel?: boolean;
  setSearchItem?: React.Dispatch<React.SetStateAction<string>>;
}

const MainView = ({
  rightView,
  bgWhiteDel,
  setSearchItem,
}: MainProps): JSX.Element => {
  const location: Location = useLocation();
  const searchView: boolean = location.pathname === "/";
  const [search, setSearch] = useState<string>("");

  return (
    <>
      <div className="flex justify-center">
        <div className="flex w-[90%] justify-between gap-[1rem] pt-6">
          <div className="flex-1 space-y-4 min-w-[640px]">
            {searchView ? (
              <Search
                search={search}
                setSearch={setSearch}
                setSearchItem={setSearchItem}
              />
            ) : (
              <></>
            )}
            <div
              className={classNames("min-h-screen rounded-sm pt-4 px-4", {
                "bg-white border": !bgWhiteDel,
              })}
            >
              <Outlet />
            </div>
          </div>
          {rightView ? <RightView /> : <></>}
        </div>
      </div>
    </>
  );
};

export default MainView;
