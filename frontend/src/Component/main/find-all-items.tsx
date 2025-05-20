import { useMemo, type JSX } from "react";
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

  const search = useMemo(() => {
    if (!data) return [];
    if (searchItem.length > 0) {
      const search = data.filter((item) => item.name.includes(searchItem));
      return search;
    } else return data;
  }, [searchItem, data]);

  // 로딩 중일 때 처리
  if (isLoading) return <p>데이터를 가져오는 중입니다.</p>;

  // 오류가 발생했을 때 처리
  if (isError) return <p>에러가 발생하였습니다.</p>;

  // 데이터가 없을 때 처리
  if (!data) return <p>해당 데이터가 없습니다.</p>;

  return (
    <>
      <div className="text-lg font-semibold grid grid-cols-3 h-[3rem] items-center border-b ">
        <p>아이템 명</p>
        <p>최신 가격</p>
        <p>기준 시간</p>
      </div>
      {search.map((item) => (
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
