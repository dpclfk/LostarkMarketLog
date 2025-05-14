import { useMemo, type JSX } from "react";
import { useGetAllItems } from "../../lib/item/get-all-items";
import { useNavigate } from "react-router-dom";
import { addComma } from "../../lib/add-comma";
import classNames from "classnames";
import { backgroundColor } from "../../lib/grade-color/background-color";
import { textColor } from "../../lib/grade-color/text-color";

const RightView = (): JSX.Element => {
  const { data, isLoading, isError } = useGetAllItems();
  const navigate = useNavigate();

  const expensive = useMemo(() => {
    if (!data) return [];
    const sort = [...data].sort((a, b) => {
      return b.price - a.price;
    });
    return sort;
  }, [data]);

  // 로딩 중일 때 처리
  if (isLoading) return <p>데이터를 가져오는 중입니다.</p>;

  // 오류가 발생했을 때 처리
  if (isError) return <p>에러가 발생하였습니다.</p>;

  // 데이터가 없을 때 처리
  if (!data) return <p>해당 데이터가 없습니다.</p>;

  return (
    <>
      <div className="sticky self-start top-22 border rounded-sm py-2 bg-white">
        <p className="text-lg font-semibold px-4">가장 비싼 아이템</p>
        {expensive.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              navigate(`items/${item.id}`);
            }}
            className="cursor-pointer hover:bg-gray-100 flex gap-2 items-center py-1 px-4"
          >
            <img
              src={item.icon}
              className={classNames(
                "h-[2.5rem] border border-gray-500",
                backgroundColor(item.grade)
              )}
              alt=""
            />
            <div>
              <p
                className={classNames(
                  "text-basic font-medium",
                  textColor(item.grade)
                )}
              >
                {item.name}
              </p>
              <p className={classNames("text-basic font-medium")}>
                {addComma(item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RightView;
