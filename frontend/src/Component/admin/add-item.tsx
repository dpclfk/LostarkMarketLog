import { useEffect, useState } from "react";
import Select, { type SingleValue } from "react-select";
import { useGetCategoryCode } from "../../lib/admin/category";
import { useItemCheck, type ItemCheck } from "../../lib/admin/item-check";
import { backgroundColor } from "../../lib/grade-color/background-color";
import classNames from "classnames";
import { textColor } from "../../lib/grade-color/text-color";
import { useItemCreate } from "../../lib/admin/item-create";

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
  const [categoryCode, setCategoryCode] = useState<number>(1);
  // 선택된 옵션에 따른 옥션인지 아닌지 값을 넣음
  const [auctions, setAuctions] = useState<boolean>(false);
  // react-select에 현재 선택된 옵션 객체를 저장
  const [currentSelectedOption, setCurrentSelectedOption] =
    useState<Category>();
  const [itemCreate, setItemCreate] = useState<boolean>(false);
  const [checkList, setCheckList] = useState<ItemCheck[]>();

  const { data, isLoading, isError } = useGetCategoryCode();
  const { mutate } = useItemCheck();
  const { mutate: ItemCreate } = useItemCreate();

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
  if (isLoading) return <p>데이터를 가져오는 중입니다.</p>;

  // 오류가 발생했을 때 처리
  if (isError) return <p>에러가 발생하였습니다.</p>;

  const itemCheck = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { name, categoryCode, auctions },
      {
        onSuccess: (data: ItemCheck[]) => {
          setItemCreate(true);
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
        },
      }
    );
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
    <div className="flex justify-center pt-8">
      {itemCreate ? (
        <div className="w-[70%] min-w-[640px] px-12">
          <p className="flex justify-center text-3xl pb-4">
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
                <p className={classNames("truncate", textColor(item.grade))}>
                  {item.name}
                </p>
              </div>
              <button className="px-4 hover:bg-gray-100 border border-gray-400 h-[80%] cursor-pointer">
                추가하기
              </button>
            </div>
          ))}
        </div>
      ) : (
        <form
          onSubmit={itemCheck}
          className="bg-white p-8 rounded shadow-md w-[600px] space-y-4"
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
      )}
    </div>
  );
};

export default AddItem;
