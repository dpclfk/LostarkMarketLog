import { useCallback, useEffect, useRef, useState } from "react";
import Select, { type SingleValue } from "react-select";
import { useGetCategoryCode } from "../../lib/admin/category";
import { useItemCheck, type ItemCheck } from "../../lib/admin/item-check";
import { backgroundColor } from "../../lib/grade-color/background-color";
import classNames from "classnames";
import { textColor } from "../../lib/grade-color/text-color";
import { useItemCreate } from "../../lib/admin/item-create";
import { useNavigate } from "react-router-dom";

interface Category {
  Code: number;
  CodeName: string;
  auctions: boolean;
}

interface categoryGroup {
  label: string;
  options: Category[];
}

const AddItem = () => {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<categoryGroup[]>();

  // 선택된 카테고리 코드값을 넣음
  const [categoryCode, setCategoryCode] = useState<number>(0);
  // 선택된 옵션에 따른 옥션인지 아닌지 값을 넣음
  const [auctions, setAuctions] = useState<boolean>(false);
  // react-select에 현재 선택된 옵션 객체를 저장
  const [currentSelectedOption, setCurrentSelectedOption] =
    useState<Category>();
  const [itemCreate, setItemCreate] = useState<boolean>(false);
  const [checkList, setCheckList] = useState<ItemCheck[]>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetCategoryCode();
  const { mutate } = useItemCheck();
  const { mutate: ItemCreate } = useItemCreate();

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

  const divClasses = classNames("flex pt-8 justify-center", {
    "pl-[60px]": isSmallWidth,
  });

  // 카테고리 정보를 select에 넣음
  useEffect(() => {
    if (data) {
      setCategory([
        {
          label: "마켓",
          options: data.market_category.map((item) => ({
            Code: item.Code,
            CodeName: item.CodeName,
            auctions: false,
          })),
        },
        {
          label: "경매장",
          options: data.auction_category.map((item) => ({
            Code: item.Code,
            CodeName: item.CodeName,
            auctions: true,
          })),
        },
      ]);
    }
  }, [data]);

  // 로딩 중일 때 처리
  if (isLoading)
    return (
      <div className="flex justify-center pt-12">
        <p className="text-2xl">데이터를 가져오는 중입니다.</p>
      </div>
    );

  // 오류가 발생했을 때 처리
  if (isError)
    return (
      <div className="flex justify-center pt-12">
        <p className="text-2xl">에러가 발생하였습니다.</p>
      </div>
    );

  // 아이템 체크 버튼
  const itemCheck = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { name, categoryCode, auctions },
      {
        onSuccess: (data: ItemCheck[]) => {
          setItemCreate(true);
          checkWidth();
          setCheckList(
            data.map((item) => ({
              name: item.name,
              icon: item.icon,
              itemCode: item.itemCode,
              grade: item.grade,
            }))
          );
        },
      }
    );
  };

  // 아이템 추가하는 버튼
  const itemCreatebtn = (item: ItemCheck) => {
    ItemCreate(
      {
        name: item.name,
        category: categoryCode,
        auctions: auctions,
        icon: item.icon,
        itemCode: item.itemCode,
        grade: item.grade,
      },
      {
        onSuccess: () => {
          setItemCreate(false);
          setName("");
          setCategoryCode(0);
          setAuctions(false);
          setCurrentSelectedOption(undefined);
        },
      }
    );
  };

  // 뒤로가기 버튼 adminRoot가 있으면 /admin으로 보내는 함수
  const backBtn = (adminRoot: boolean) => {
    if (adminRoot) {
      navigate("/admin");
    } else {
      setItemCreate(false);
      setName("");
      setCategoryCode(0);
      setAuctions(false);
      setCurrentSelectedOption(undefined);
      checkWidth();
    }
  };

  // react-select 값이 변경될 때 호출되는 함수
  const handleChange = (selectedOption: SingleValue<Category>): void => {
    if (selectedOption) {
      setCurrentSelectedOption(selectedOption);
      setCategoryCode(selectedOption.Code);
      setAuctions(selectedOption.auctions);
    }
  };

  return (
    <>
      {itemCreate ? (
        <>
          <button
            className="text-2xl absolute px-4 py-2 hover:bg-gray-100 border border-gray-200"
            onClick={() => backBtn(false)}
          >
            뒤로가기
          </button>
          <div ref={ref} className={divClasses}>
            <div className="w-[80%] px-16">
              <p className="flex justify-center text-3xl py-4">
                추가하기 버튼을 눌러 아이템을 추가하실 수 있습니다.
              </p>
              {checkList!.map((item, index) => (
                <div
                  className="text-lg font-medium h-[4rem] flex items-center justify-between border-t"
                  key={index}
                  onClick={() => {
                    itemCreatebtn(item);
                  }}
                >
                  <div className="flex items-center gap-4 font-semibold px-4">
                    <img
                      src={item.icon}
                      className={classNames(
                        "h-[3rem] border border-gray-500",
                        backgroundColor(item.grade)
                      )}
                      alt="icon"
                    />
                    <p
                      className={classNames("truncate", textColor(item.grade))}
                    >
                      {item.name}
                    </p>
                  </div>
                  <button className="px-4 hover:bg-gray-100 border border-gray-400 h-[80%] min-w-[6.25rem] cursor-pointer">
                    추가하기
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <button
            className="text-2xl absolute px-4 py-2 hover:bg-gray-100 border border-gray-200"
            onClick={() => {
              backBtn(true);
            }}
          >
            뒤로가기
          </button>
          <div ref={ref} className={divClasses}>
            <form
              onSubmit={itemCheck}
              className="bg-white p-8 rounded shadow-md w-[70%] max-w-[500px] space-y-4"
            >
              <p className="text-3xl font-bold text-center pb-2 text-[#655e53]">
                아이템 체크
              </p>

              <input
                type="text"
                placeholder="아이템 이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
                autoComplete="username"
              />

              <Select
                classNames={{
                  control: () => "pl-1 py-[2px]",
                }}
                id="category-select"
                getOptionValue={(option: Category) => String(option.Code)}
                getOptionLabel={(option: Category) => option.CodeName}
                options={category}
                value={currentSelectedOption}
                onChange={handleChange}
                placeholder="카테고리를 선택해주세요."
              />
              <button
                type="submit"
                className="w-full bg-[#655e53] text-white py-2 rounded-md hover:bg-[#504a43] transition cursor-pointer"
              >
                아이템 체크
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default AddItem;
