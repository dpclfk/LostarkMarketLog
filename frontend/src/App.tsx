import { Route, Routes } from "react-router-dom";
import FindOneItem from "./Component/main/find-one-item";
import FindAllItems from "./Component/main/find-all-items";
import GlobalNavigationBar from "./Component/global-navigation-bar";
import Login from "./Component/auth/login";
import Register from "./Component/auth/register";
import Main from "./Component/main/main";

function App() {
  return (
    <>
      <div>
        <GlobalNavigationBar></GlobalNavigationBar>
        <div className="flex justify-center bg-[#ffebc5] pt-[5.5rem]">
          <Routes>
            <Route path="/" element={<Main rightView={true} />}>
              <Route path="/" element={<FindAllItems />} />
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
