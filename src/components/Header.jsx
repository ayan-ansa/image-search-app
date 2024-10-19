function Header({ query, setApiData, setQuery, setPage, fetchSearchData }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    setPage((prev) => {
      const newPage = prev * 0;
      if (query.length > 0) {
        setApiData([]);
        fetchSearchData(newPage);
      }
      return newPage;
    });
  };

  return (
    <header className="h-16 bg-white px-3 shadow-md w-full z-40 fixed flex items-center inset-x-0">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-xl w-full flex justify-between"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-2 py-1 text-black flex-1 border border-gray-300 outline-none"
          placeholder="Search images..."
        />
        <button type="submit" className="px-4 bg-[#0d1a2d] py-[5px] text-white">
          Search
        </button>
      </form>
    </header>
  );
}

export default Header;
