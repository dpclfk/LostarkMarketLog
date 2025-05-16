import { Route, Routes } from "react-router-dom";
import FindOneItem from "./Component/main/find-one-item";
import FindAllItems from "./Component/main/find-all-items";
import GlobalNavigationBar from "./Component/global-navigation-bar";
import Login from "./Component/auth/login";
import Register from "./Component/auth/register";
import Main from "./Component/main/main";
import { useState } from "react";

function App() {
  const [searchItem, setSearchItem] = useState<string>("");

  return (
    <>
      <div>
        <GlobalNavigationBar />
        <div className="bg-[#ffebc5] pt-[5.5rem]">
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  rightView={true}
                  bgWhite={true}
                  setSearchItem={setSearchItem}
                />
              }
            >
              <Route
                path="/"
                element={<FindAllItems searchItem={searchItem} />}
              />
              <Route path="items/:id" element={<FindOneItem />} />
            </Route>
            <Route path="/auth" element={<Main />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
