import { Route, Routes } from "react-router-dom";
import FindOneItem from "./Component/find-one-item";
import FindAllItems from "./Component/find-all-items";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<FindAllItems />} />
        <Route path="items/:id" element={<FindOneItem />} />
      </Routes>
    </>
  );
}

export default App;
