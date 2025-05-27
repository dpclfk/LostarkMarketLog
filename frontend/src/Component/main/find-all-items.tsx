import { useMemo, useState, type JSX } from "react";
import { useGetAllItems } from "../../lib/item/get-all-items";
import { useNavigate } from "react-router-dom";
import goldIcon from "../../assets/imgs/gold.png";
import classNames from "classnames";
import { textColor } from "../../lib/grade-color/text-color";
import { backgroundColor } from "../../lib/grade-color/background-color";
import { addComma } from "../../lib/add-comma";

interface IProps {
  searchItem: string;
}

const FindAllItems = ({ searchItem }: IProps): JSX.Element => {
  const { data, isLoading, isError } = useGetAllItems();
  const navigate = useNavigate();
  const [nameSort, setNameSort] = useState<number>(0);
  const [priceSort, setPriceSort] = useState<number>(0);

  const sortArrow = (sort: number) => {
    if (sort === 1) return "↓ (내림차순)";
    if (sort === 2) return "↑ (오름차순)";
    return "↓ (클릭시 정렬)";
  };

  const itemsList = useMemo(() => {
    if (!data) return [];

    // 1. 검색
    let result = [...data];
    if (searchItem.length > 0) {
      result = result.filter((item) => item.name.includes(searchItem));
    }

    // 2. 정렬
    result.sort((a, b) => {
      if (nameSort === 1) {
        return b.name.localeCompare(a.name, "ko");
      }
      if (nameSort === 2) {
        return a.name.localeCompare(b.name, "ko");
      }
      if (priceSort === 1) {
        return b.price - a.price;
      }
      if (priceSort === 2) {
        return a.price - b.price;
      }
      return 0;
    });

    return result;
  }, [data, searchItem, nameSort, priceSort]);

  // 로딩 중일 때 처리
  if (isLoading) return <p>데이터를 가져오는 중입니다.</p>;

  // 오류가 발생했을 때 처리
  if (isError) return <p>에러가 발생하였습니다.</p>;

  // 데이터가 없을 때 처리
  if (!data) return <p>해당 데이터가 없습니다.</p>;

  const sortClick = (num: 1 | 2) => {
    if (num === 1) {
      setNameSort((prev) => (prev === 2 ? 0 : prev + 1));
      setPriceSort(0);
    } else if (num === 2) {
      setPriceSort((prev) => (prev === 2 ? 0 : prev + 1));
      setNameSort(0);
    }
  };

  return (
    <>
      <div className="text-lg font-semibold grid grid-cols-3 h-[3rem] items-center border-b ">
        <div className="flex">
          <p
            className={classNames("cursor-pointer hover:bg-gray-100 px-2", {
              "text-black": nameSort !== 0,
              "text-gray-500": nameSort === 0,
            })}
            onClick={() => sortClick(1)}
          >
            아이템 명 {sortArrow(nameSort)}
          </p>
        </div>
        <div className="flex">
          <p
            className={classNames("cursor-pointer hover:bg-gray-100 px-2", {
              "text-black": priceSort !== 0,
              "text-gray-500": priceSort === 0,
            })}
            onClick={() => sortClick(2)}
          >
            최신 가격 {sortArrow(priceSort)}
          </p>
        </div>
        <div className="flex">
          <p className={"text-gray-500 px-2"}>기준 시간</p>
        </div>
      </div>
      {itemsList.map((item) => (
        <div
          className="text-lg font-medium grid grid-cols-3 h-[4rem] items-center hover:bg-gray-100 border-b cursor-pointer"
          key={item.id}
          onClick={() => {
            navigate(`items/${item.id}`);
          }}
        >
          <div className="flex items-center gap-4 font-semibold">
            <img
              src={item.icon}
              className={classNames(
                "h-[3rem] border border-gray-500",
                backgroundColor(item.grade)
              )}
              alt="icon"
            />
            <p className={classNames("truncate", textColor(item.grade))}>
              {item.name}
            </p>
          </div>
          <div className="flex">
            <img src={goldIcon} className="h-[2rem] pr-[0.5rem]"></img>
            <p>{addComma(item.price)} 골드</p>
          </div>
          <p className="text-gray-700">
            {new Date(item.date).toLocaleString("ko-KR")}
          </p>
        </div>
      ))}
    </>
  );
};

export default FindAllItems;
