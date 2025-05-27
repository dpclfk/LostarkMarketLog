import { type JSX } from "react";

interface SearchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSearchItem?: React.Dispatch<React.SetStateAction<string>>;
}

const Search = ({
  search,
  setSearch,
  setSearchItem,
}: SearchProps): JSX.Element => {
  const searchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (setSearchItem) {
      setSearchItem(search);
    }
  };

  return (
    <>
      <div className="h-[150px] bg-white border rounded-sm px-4 py-4 space-y-4">
        <p className="text-xl font-semibold">아이템 검색</p>
        <form onSubmit={searchSubmit}>
          <div className="flex items-center gap-4">
            <input
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="search"
            />
            <button
              type="submit"
              className="font-medium border px-3 py-2 rounded border-gray-500"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Search;
