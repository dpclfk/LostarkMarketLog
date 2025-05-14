import { Outlet } from "react-router-dom";
import RightView from "./right-view";

interface MainProps {
  rightView?: boolean;
}

const Main = ({ rightView }: MainProps) => {
  return (
    <>
      <div className="flex w-[90%] justify-between gap-[1rem] pt-6">
        <div className="min-h-screen flex-1 border rounded-sm pt-4 px-4 bg-white">
          <Outlet />
        </div>
        {rightView ? <RightView /> : <></>}
      </div>
    </>
  );
};

export default Main;
