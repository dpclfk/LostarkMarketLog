import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useState } from "react";
import Loading from "./Component/loading";
import GlobalNavigationBar from "./Component/global-navigation-bar";

const FindAllItems = lazy(() => import("./Component/main/find-all-items"));
const FindOneItem = lazy(() => import("./Component/main/find-one-item"));
const Login = lazy(() => import("./Component/auth/login"));
const Register = lazy(() => import("./Component/auth/register"));
const MainView = lazy(() => import("./Component/main/main-view"));
const NotFound = lazy(() => import("./Component/not-found"));

function App() {
  const [searchItem, setSearchItem] = useState<string>("");

  return (
    <>
      <div>
        <GlobalNavigationBar />
        <Suspense fallback={<Loading />}>
          <div className="bg-[#ffebc5] pt-[5.5rem]">
            <Routes>
              <Route
                path="/"
                element={
                  <MainView rightView={true} setSearchItem={setSearchItem} />
                }
              >
                <Route
                  path="/"
                  element={<FindAllItems searchItem={searchItem} />}
                />
                <Route path="items/:id" element={<FindOneItem />} />
              </Route>
              <Route path="/auth" element={<MainView bgWhiteDel={true} />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>
              <Route path="/admin" element={<MainView />}></Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </div>
    </>
  );
}

export default App;
