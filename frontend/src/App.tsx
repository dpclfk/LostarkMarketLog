import { Route, Routes } from "react-router-dom";
import FindOneItem from "./Component/find-one-item";
import FindAllItems from "./Component/find-all-items";
import RightView from "./Component/right-view";
import GlobalNavigationBar from "./Component/global-navigation-bar";

function App() {
  return (
    <>
      <div>
        <GlobalNavigationBar></GlobalNavigationBar>
        <div className="flex justify-center bg-[#ffebc5] pt-[5.5rem]">
          <div className="flex w-[90%] justify-between gap-[1rem] pt-6">
            <div className="min-h-screen flex-1 border rounded-sm pt-4 px-4 bg-white">
              <Routes>
                <Route path="/" element={<FindAllItems />} />
                <Route path="items/:id" element={<FindOneItem />} />
                <Route path="auth" element={<div>123</div>} />
              </Routes>
            </div>
            <Routes>
              <Route path="/" element={<RightView />} />
              <Route path="items/:id" element={<RightView />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
