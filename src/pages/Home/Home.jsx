import { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import { GoArrowDown } from "react-icons/go";
import { FaHeart, FaArrowUp } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "../../components/Form";

export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY;
function Home() {
  const [apiData, setApiData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [params, setParams] = useSearchParams();
  const [isShow, setIsShow] = useState(false);
  const scrollPosition = useRef(0);

  const fetchSearchData = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/search/photos?page=${page}&query=${query}&client_id=${ACCESS_KEY}`
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
        `${BASE_URL}/photos?page=${page}&client_id=${ACCESS_KEY}`
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
  }, [params]);

  const handleLike = (id) => {
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

  useEffect(() => {
    const handleScroll = () => {
      if (document.documentElement.scrollTop > 20) {
        setIsShow(true);
      } else {
        setIsShow(false);
      }
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 50
      ) {
        if (!loading && params.size == 0) {
          scrollPosition.current = window.scrollY;
          handleLoadMore();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, loading]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, scrollPosition.current);
    }
  }, [apiData, loading]);

  useEffect(() => {
    localStorage.getItem("theme") == "dark"
      ? setIsDark(true)
      : setIsDark(false);
  }, []);

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
      <div className={`${isDark ? "bg-black" : ""}`}>
        <Header
          setQuery={setQuery}
          query={query}
          fetchSearchData={fetchSearchData}
          setApiData={setApiData}
          setPage={setPage}
          isDark={isDark}
          setIsDark={setIsDark}
        />
        {loading && apiData.length == 0 ? (
          <div id="loader" className="min-h-[80vh] grid place-items-center">
            <div className="h-16 w-16 border-4 border-t-[#000] rounded-full border-[#bdbdbd] animate-spin"></div>
          </div>
        ) : (
          <div
            className={`max-w-7xl px-2 ${
              isOpen ? "fixed" : ""
            } pt-20 mx-auto min-h-[80vh]`}
          >
            <div className="max-w-4xl flex flex-col items-center font-inter mx-auto py-10 sm:py-20">
              <a
                href="https://www.linkedin.com/in/abdulla-ansari-80aa3925a/"
                target="_black"
                className={`rounded-2xl px-4 py-1.5 text-sm transition duration-100 ease-linear ${
                  isDark ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-black hover:bg-slate-300"
                } font-medium`}
              >
                Follow along on LinkedIn
              </a>
              <h1
                className={`font-bold ${
                  isDark ? "text-slate-200" : "text-[#0F172A]"
                } text-3xl sm:text-5xl md:text-6xl mt-3 lg:text-7xl tracking-tighter text-center`}
              >
                {" "}
                a Cool photo searcher from all over the world
              </h1>
            </div>
            <div>
              <Form
                query={query}
                setApiData={setApiData}
                setQuery={setQuery}
                setPage={setPage}
                fetchSearchData={fetchSearchData}
              />
              <div
                id="card-container"
                className="flex flex-col md:grid lg:grid-cols-3 grid-cols-2 gap-4 mt-8"
              >
                {apiData.map(
                  (
                    {
                      id,
                      urls,
                      alt_description,
                      asset_type,
                      color,
                      liked_by_user,
                    },
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
                              className={`text-gray-500 hover:text-red-500 ${
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
                          onClick={() => download(urls.small)}
                        >
                          <button
                            className={`px-3 py-[6px] rounded border border-gray-300 hover:border-gray-500 shadow text-sm ${
                              isDark ? "bg-white" : ""
                            }`}
                          >
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
            </div>
          </div>
        )}
        {isShow && (
          <button
            className={`fixed bottom-5 right-3 p-2 sm:p-2.5 rounded-full ${
              isDark ? "bg-slate-900" : "bg-slate-200"
            }`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <FaArrowUp
              className={`text-2xl ${isDark ? "text-white" : "text-black"}`}
            />
          </button>
        )}
      </div>
      {isOpen && (
        <Modal
          params={params}
          isLiked={isLiked}
          isDark={isDark}
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
