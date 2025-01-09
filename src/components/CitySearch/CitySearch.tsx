import { MouseEvent, ChangeEvent, RefObject } from "react";

interface CitySearchProps {
  ref: RefObject<HTMLInputElement | null>;
  city: string;
  isLoading: boolean;
  onSearchClick: (e: MouseEvent<HTMLButtonElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
}

export const CitySearch = ({
  ref,
  city,
  isLoading,
  onSearchClick,
  onChange,
  onFocus,
}: CitySearchProps) => (
  <div className="flex items-center justify-between w-full max-w-lg mx-auto p-4">
    <input
      ref={ref}
      className="block w-full rounded-md bg-gray-700 py-1.5 pl-10 pr-3 text-base text-white outline-none placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-400 sm:text-sm"
      type="text"
      placeholder="Enter city"
      value={city}
      onChange={onChange}
      onFocus={onFocus}
    />
    <button
      onClick={onSearchClick}
      disabled={isLoading || city.length === 0}
      className="ml-4 bg-purple-400 text-white p-2 rounded-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
    >
      {isLoading ? "Loading..." : "Search"}
    </button>
  </div>
);
