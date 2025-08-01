import classNames from "classnames";
import type { JSX } from "react";

interface IProps {
  pageMove: (move: number) => void;
  totalPages: number;
  startPage: number;
  currentPage: number;
  endPage: number;
}

const Pagination = ({
  pageMove,
  totalPages,
  startPage,
  currentPage,
  endPage,
}: IProps): JSX.Element => {
  console.log(totalPages, startPage);
  return (
    <div className="flex justify-center">
      <div className="w-[50%]">
        <div className="flex justify-center items-center h-[2rem]">
          {currentPage === 1 ? (
            <div className="max-w-[10%] flex-1 h-full flex items-center justify-center text-white select-none">
              &lt; &lt;
            </div>
          ) : (
            <div
              className="max-w-[10%] flex-1 cursor-pointer hover:bg-gray-200 h-full flex items-center justify-center"
              onClick={() => pageMove(1)}
            >
              &lt; &lt;
            </div>
          )}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
            <div
              key={i}
              className={classNames(
                "max-w-[10%] flex-1 cursor-pointer hover:bg-gray-200 h-full flex items-center justify-center",
                {
                  "bg-gray-300 hover:bg-gray-400":
                    startPage + i === currentPage,
                }
              )}
              onClick={() => pageMove(startPage + i)}
            >
              <p>{startPage + i}</p>
            </div>
          ))}
          {endPage === currentPage || endPage < 11 ? (
            <div className="max-w-[10%] flex-1 h-full flex items-center justify-center text-white select-none">
              &gt; &gt;
            </div>
          ) : (
            <div
              className="max-w-[10%] flex-1 cursor-pointer hover:bg-gray-200 h-full flex items-center justify-center"
              onClick={() => pageMove(totalPages)}
            >
              &gt; &gt;
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pagination;
