import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

const Header = ({ onSearch, searchQuery = '', onClearSearch }: HeaderProps) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center bg-[#F9F9F9] shadow-[0_2px_16px_0_rgba(0,0,0,0.10)] px-4 sm:px-6 md:px-8 lg:px-[124px] py-4 gap-4">
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/5e6984916e0eb1fa6697584c82b665695af781b9?width=200"
        alt="Highway Delite Logo"
        className="w-20 h-11 sm:w-[100px] sm:h-[55px] shrink-0 object-contain cursor-pointer"
        onClick={() => navigate('/')}
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto sm:justify-end md:justify-start">
        <div className="flex items-center bg-[#EDEDED] rounded px-4 py-3 w-full sm:w-auto sm:min-w-[240px] md:w-[340px]">
          <input
            type="text"
            placeholder="Search experiences"
            value={searchQuery}
            onChange={(e) => {
              if (onSearch) {
                onSearch(e.target.value);
              }
            }}
            onKeyPress={handleKeyPress}
            className="bg-transparent outline-none text-[#727272] text-sm w-full placeholder:text-[#727272]"
          />
          {searchQuery && onClearSearch && (
            <button 
              onClick={onClearSearch}
              className="ml-2 text-gray-500 hover:text-gray-700"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <button 
          onClick={handleSearch}
          className="flex items-center justify-center bg-[#FFD643] rounded-lg px-5 py-3 whitespace-nowrap hover:bg-yellow-400 transition-colors sm:w-auto"
        >
          <span className="text-[#161616] text-sm font-medium">Search</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
