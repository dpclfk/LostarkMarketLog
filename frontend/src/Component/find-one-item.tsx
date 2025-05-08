import type { JSX } from "react";
import { useParams } from "react-router-dom";
import { useGetItem } from "../lib/get-item";

const FindOneItem = (): JSX.Element => {
  const { id } = useParams();

  const { data, isLoading, isError } = useGetItem(+id!);

  // 로딩 중일 때 처리
  if (isLoading) return <p>데이터를 가져오는 중입니다.</p>;

  // 오류가 발생했을 때 처리
  if (isError) return <p>에러가 발생하였습니다.</p>;

  // 데이터가 없을 때 처리
  if (!data) return <p>해당 데이터가 없습니다.</p>;

  return (
    <>
      <img src={data.icon} />
    </>
  );
};

export default FindOneItem;
