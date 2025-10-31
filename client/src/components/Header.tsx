const Header = () => {
  return (
    <header className="flex justify-between items-center bg-[#F9F9F9] shadow-[0_2px_16px_0_rgba(0,0,0,0.10)] px-8 lg:px-[124px] py-4">
      <img 
        src="https://api.builder.io/api/v1/image/assets/TEMP/5e6984916e0eb1fa6697584c82b665695af781b9?width=200" 
        alt="Highway Delite Logo" 
        className="w-[100px] h-[55px] flex-shrink-0 object-contain"
      />
      
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-[#EDEDED] rounded px-4 py-3 w-[340px]">
          <input
            type="text"
            placeholder="Search experiences"
            className="bg-transparent outline-none text-[#727272] text-sm w-full placeholder:text-[#727272]"
          />
        </div>
        <button className="flex items-center justify-center bg-[#FFD643] rounded-lg px-5 py-3">
          <span className="text-[#161616] text-sm font-medium">Search</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
