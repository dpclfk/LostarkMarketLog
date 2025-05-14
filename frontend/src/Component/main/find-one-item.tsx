import { type JSX } from "react";
import { useParams } from "react-router-dom";
import { useGetItem } from "../../lib/item/get-item";
import classNames from "classnames";
import { backgroundColor } from "../../lib/grade-color/background-color";
import { textColor } from "../../lib/grade-color/text-color";
import { addComma } from "../../lib/add-comma";

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
      <div className="flex justify-center items-center gap-4 h-[4rem] pb-2">
        <img
          src={data.icon}
          alt="icon"
          className={classNames(
            "h-[3rem] border border-gray-500",
            backgroundColor(data.grade)
          )}
        />
        <p
          className={classNames("text-lg font-semibold", textColor(data.grade))}
        >
          {data.name}
        </p>
      </div>
      <div className="text-lg font-semibold grid grid-cols-3 h-[3rem] items-center">
        <p>기준 시간</p>
        <div className="grid grid-cols-2">
          <p>가격</p>
          <p>변동추이</p>
        </div>
        <p>비고</p>
      </div>
      <div className="text-base font-medium">
        {data.item.map((item, index) => {
          const prePrice = data.item[index + 1]
            ? data.item[index + 1].price
            : item.price; // 이전가격
          const priceChange = item.price - prePrice;
          return (
            <div
              key={`one${index}`}
              className={classNames(
                "flex justify-center gap-2 text-lg py-1 h-[2.5rem] items-center grid grid-cols-3",
                {
                  "bg-gray-200": index % 2 === 0, // 짝수일 때
                  "bg-gray-100": index % 2 !== 0, // 홀수일 때
                }
              )}
            >
              <p>{new Date(item.date).toLocaleString("ko-KR")}</p>
              <div className="grid grid-cols-2">
                <p>{addComma(item.price)} 골드</p>
                <p
                  className={classNames({
                    "text-green-500": priceChange > 0, // 가격 상승
                    "text-red-500": priceChange < 0, // 가격 하락
                    "text-gray-500": priceChange === 0, // 가격 변화 없음
                  })}
                >
                  {priceChange > 0
                    ? `+${addComma(priceChange)} 골드`
                    : `${addComma(priceChange)} 골드`}
                </p>
              </div>
              <p>{item.comment}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FindOneItem;
