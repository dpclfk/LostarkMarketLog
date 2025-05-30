import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import { useGetAllItems } from "../../lib/item/get-all-items";
import classNames from "classnames";
import { textColor } from "../../lib/grade-color/text-color";
import { backgroundColor } from "../../lib/grade-color/background-color";
import { useRemoveItem } from "../../lib/admin/remove-item";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const RemoveItem = (): JSX.Element => {
  const { data, isLoading, isError } = useGetAllItems();
  const { mutate } = useRemoveItem();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const [isSmallWidth, setIsSmallWidth] = useState(false); // 너비가 860px 이하인지 여부 상태

  // div의 너비를 측정하고 상태를 업데이트하는 함수
  const checkWidth = useCallback(() => {
    if (ref.current) {
      const currentWidth = ref.current.offsetWidth; // div의 실제 너비
      setIsSmallWidth(currentWidth <= 860);
    }
  }, []);

  useEffect(() => {
    // 컴포넌트 마운트 시 초기 너비 측정
    checkWidth();

    // 윈도우 리사이즈 이벤트 리스너 추가
    // 리액트는 크기 감지 하지않음
    window.addEventListener("resize", checkWidth);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", checkWidth);
    };
  }, [checkWidth, data]);

  const divClasses = classNames("flex justify-center ", {
    "pl-[60px]": isSmallWidth,
  });

  // 로딩 중일 때 처리
  if (isLoading) return <p>데이터를 가져오는 중입니다.</p>;

  // 오류가 발생했을 때 처리
  if (isError) return <p>에러가 발생하였습니다.</p>;

  // 데이터가 없을 때 처리
  if (!data) return <p>해당 데이터가 없습니다.</p>;

  const backBtn = () => {
    navigate("/admin");
  };

  const deleteBtn = (id: number) => {
    mutate(
      { id },
      {
        onSuccess: async () => {
          await queryClient.refetchQueries({ queryKey: ["getAllItems"] });
        },
      }
    );
  };

  return (
    <>
      <button
        className="text-2xl absolute px-4 py-2 hover:bg-gray-100 border border-gray-200"
        onClick={() => backBtn()}
      >
        뒤로가기
      </button>
      <div ref={ref} className={divClasses}>
        <div className="w-[70%]">
          <p className="flex justify-center text-3xl py-4">
            삭제 버튼을 눌러 아이템을 삭제하실 수 있습니다.
          </p>
          <div className="text-lg font-semibold grid grid-cols-2 h-[3rem] items-center border-b px-2">
            <p>아이템 명</p>
            <p className="justify-self-end w-[96px] text-center">삭제하기</p>
          </div>
          {data.map((item) => (
            <div
              className="text-lg font-medium grid grid-cols-2 h-[4rem] items-center border-b px-2"
              key={item.id}
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
              <div className="justify-self-end">
                <button
                  className=" bg-red-300 text-white py-2 rounded-md hover:bg-red-400 transition cursor-pointer w-[96px] text-center"
                  onClick={() => deleteBtn(item.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RemoveItem;
