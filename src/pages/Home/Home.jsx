import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import { GoArrowDown } from "react-icons/go";
import { FaHeart } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";

export const accessKey = "78SKzuxgvXKTgJB7sAawVBwtJHv9xGoJttmXyTyG8-I";
export const BASE_URL = "https://api.unsplash.com";
function Home() {
  const [apiData, setApiData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const bottomRef = useRef(null);
  const [params, setParams] = useSearchParams();

  const fetchSearchData = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/search/photos?page=${page}&query=${query}&client_id=${accessKey}`
      );
      const data = await response.json();
      setApiData((prev) => [...prev, ...data.results]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const fetchApiData = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/photos?page=${page}&client_id=${accessKey}`
      );
      const data = await response.json();
      setApiData((prev) => [...prev, ...data]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const handleLoadMore = () => {
    setPage((prevPage) => {
      const newPage = prevPage + 1;
      if (query.length > 0) {
        fetchSearchData(newPage);
      } else {
        fetchApiData(newPage);
      }
      return newPage;
    });
  };

  useEffect(() => {
    setApiData([]);
    fetchApiData(page);
    if (params.size > 0) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [apiData]);

  const handleLike = (id) => {
    bottomRef.current = null;
    setIsLiked(!isLiked);
    setApiData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            liked_by_user: !item.liked_by_user,
          };
        }
        return item;
      })
    );
  };

  const download = (imageUrl) => {
    fetch(imageUrl, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.png");
          document.body.appendChild(link);
          link.click();
        });
        toast.success("Image Downloaded Successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Header
        setQuery={setQuery}
        query={query}
        fetchSearchData={fetchSearchData}
        setApiData={setApiData}
        setPage={setPage}
      />
      {loading ? (
        <div id="loader" className="min-h-[80vh] grid place-items-center">
          <div className="h-16 w-16 border-4 border-t-[#000] rounded-full border-[#bdbdbd] animate-spin"></div>
        </div>
      ) : (
        <div
          className={`max-w-7xl ${
            isOpen ? "fixed" : ""
          } py-24 mx-auto min-h-[80vh]`}
        >
          <div
            id="card-container"
            className="flex flex-col md:grid lg:grid-cols-3 grid-cols-2 gap-4 px-2 pb-16"
          >
            {apiData.map(
              (
                { id, urls, alt_description, asset_type, color, liked_by_user },
                idx
              ) => (
                <div
                  className="relative group sm:bg-[var(--dynamic-bg-color)]"
                  key={idx}
                  onClick={() => setIsOpen(true)}
                  style={{ "--dynamic-bg-color": color }}
                >
                  <Link to={`/?photos=${id}`}>
                    <img src={urls.small} alt={asset_type} />
                  </Link>
                  <div
                    className="flex items-center mt-1 justify-between"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center sm:hidden sm:group-hover:flex gap-2 sm:absolute top-3 right-3">
                      <div
                        className="px-3 py-[6px] md:py-2 border border-gray-300 hover:border-gray-500 bg-white cursor-pointer rounded transition duration-100 shadow"
                        onClick={() => {
                          handleLike(id);
                          liked_by_user
                            ? toast.error("Unliked")
                            : toast.success("Liked");
                        }}
                      >
                        <FaHeart
                          className={`text-gray-500 hover:text-gray-900 ${
                            liked_by_user && "text-red-500"
                          }`}
                        />
                      </div>
                      <div className="px-3 py-[6px] md:py-2 border border-gray-300 hover:border-gray-500 cursor-pointer bg-white rounded transition duration-100 shadow">
                        <FiPlus className="text-gray-500 hover:text-gray-900" />
                      </div>
                    </div>
                    <Link
                      className="sm:hidden"
                      onClick={() => {
                        download(urls.small);
                      }}
                    >
                      <button className="px-3 py-[6px] rounded border border-gray-300 hover:border-gray-500 shadow text-sm">
                        Download
                      </button>
                    </Link>
                  </div>

                  <span
                    className="absolute hidden group-hover:block text-xs border border-gray-200 px-2 py-1 bg-black top-1/3 left-1/2 text-[#ccc]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {alt_description?.slice(0, 31) + "..."}
                  </span>
                  <Link
                    onClick={(e) => {
                      e.stopPropagation();
                      download(urls.small);
                    }}
                    className="absolute hidden border border-gray-300 hover:border-gray-500 sm:hidden cursor-pointer sm:group-hover:block bottom-4 right-7 p-2 rounded bg-white"
                  >
                    <GoArrowDown className="text-xl text-gray-500 hover:text-gray-900" />
                  </Link>
                </div>
              )
            )}
          </div>
          {!loading && apiData.length > 0 && (
            <div
              className="flex justify-center hover:bg-gray-100 border cursor-pointer py-2 sm:py-3 border-gray-300"
              onClick={handleLoadMore}
              ref={bottomRef}
            >
              <h1 className="text-xl">Load More</h1>
            </div>
          )}
        </div>
      )}
      {isOpen && (
        <Modal
          isOpen={isOpen}
          params={params}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          handleLike={handleLike}
          download={download}
          setParams={setParams}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
}

export default Home;
