import { useEffect, useMemo, type JSX } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetItem } from "../../lib/item/get-item";
import classNames from "classnames";
import { backgroundColor } from "../../lib/grade-color/background-color";
import { textColor } from "../../lib/grade-color/text-color";
import { addComma } from "../../lib/add-comma";
import Pagination from "./pagination";

const FindOneItem = (): JSX.Element => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { id } = useParams();

  const currentPage: number = Math.max(
    parseInt(searchParams.get("page") || "1", 10),
    1
  ); // 뒤에 10은 진법임

  const { data, isLoading, isError } = useGetItem(+id!);

  const totalPages: number = useMemo(() => {
    if (data) {
      return Math.ceil(data.item.length / 10);
    } else return 0;
  }, [data]);

  const startPage: number = useMemo(() => {
    let startPage = currentPage - 4 < 1 ? 1 : currentPage - 4;
    if (currentPage + 5 > totalPages) {
      startPage = totalPages - 9 < 1 ? 1 : totalPages - 9;
    }
    return startPage;
  }, [currentPage, totalPages]);

  const endPage: number = useMemo(() => {
    let endPage = currentPage + 5;
    if (currentPage + 5 < 10 && totalPages > 10) {
      endPage = 10;
    }
    if (currentPage + 5 > totalPages) {
      endPage = totalPages;
    }
    return endPage;
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (totalPages < 1) return;
    if (currentPage > totalPages) {
      searchParams.set("page", String(totalPages));
      setSearchParams(searchParams, { replace: true });
    } else if (currentPage < 1 || Number.isNaN(currentPage)) {
      searchParams.set("page", "1");
      setSearchParams(searchParams, { replace: true });
    }
  }, [currentPage, totalPages, searchParams]);

  useEffect(() => {
    if (isError) {
      alert("에러가 발생하였습니다. 첫 페이지로 이동합니다.");
      navigate("/", { replace: true });
    }
  }, [isError, navigate]);

  // 아래 페이지 눌렀을때 몇페이지 갈지
  const pageMove = (move: number) => {
    searchParams.set("page", `${move}`);
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

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
            index >= (currentPage - 1) * 10 &&
            index < currentPage * 10 && (
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
            )
          );
        })}
      </div>
      <Pagination
        pageMove={pageMove}
        totalPages={totalPages}
        startPage={startPage}
        currentPage={currentPage}
        endPage={endPage}
      />
    </>
  );
};

export default FindOneItem;
