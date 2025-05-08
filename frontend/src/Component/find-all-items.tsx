import type { JSX } from "react";
import { useGetAllItems } from "../lib/get-all-items";
import { useNavigate } from "react-router-dom";

const FindAllItems = (): JSX.Element => {
  const { data, isLoading, isError } = useGetAllItems();
  const navigate = useNavigate();

  // 로딩 중일 때 처리
  if (isLoading) return <p>데이터를 가져오는 중입니다.</p>;

  // 오류가 발생했을 때 처리
  if (isError) return <p>에러가 발생하였습니다.</p>;

  // 데이터가 없을 때 처리
  if (!data) return <p>해당 데이터가 없습니다.</p>;

  return (
    <>
      {data!.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            navigate(`items/${item.id}`);
          }}
        >
          <p>Name: {item.name}</p>
          <p>Price: {item.price}</p>
        </div>
      ))}
    </>
  );
};

export default FindAllItems;
