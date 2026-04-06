import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchInput, setSearchInput] = useState("");

  return (
    <SearchContext.Provider
      value={{
        searchInput,
        setSearchInput,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
