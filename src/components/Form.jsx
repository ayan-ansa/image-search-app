function Form({
  query,
  setApiData,
  setQuery,
  setPage,
  fetchSearchData,
}) {
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
    <form onSubmit={handleSubmit} className="flex justify-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-2 py-1 text-black rounded-l border border-gray-300 outline-none"
        placeholder="Search images..."
      />
      <button type="submit" className="px-4 bg-[#0d1a2d] rounded-r py-[5px] text-white">
        Search
      </button>
    </form>
  );
}

export default Form;
