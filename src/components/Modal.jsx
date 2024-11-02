import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { FaHeart } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { IoIosShareAlt } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import {
  MdInfo,
  MdMoreHoriz,
  MdOutlineCalendarToday,
  MdOutlineCameraAlt,
  MdOutlineVerifiedUser,
} from "react-icons/md";
import { accessKey, BASE_URL } from "../pages/Home/Home";
import { timeAgo } from "../../../YoutubeClone/src/pages/HomePage/components/Feed/Card";
import { toast } from "react-toastify";

function Modal({
  setIsOpen,
  params,
  isDark,
  setParams,
  download,
  isLiked,
  setIsLiked,
  handleLike,
}) {
  const id = params.get("photos");
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState("");

  const fetchImageData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/photos/${id}?client_id=${accessKey}`
      );
      const data = await response.json();
      setImageData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchImageData();
  }, []);

  return createPortal(
    <>
      {loading ? (
        <div id="loader" className="min-h-[80vh] grid place-items-center">
          <div className="h-16 w-16 border-4 border-t-[#000] rounded-full border-[#bdbdbd] animate-spin"></div>
        </div>
      ) : (
        <div
          className={
            "absolute inset-0 z-50 md:px-16 md:py-8 py-12 justify-center h-screen bg-black/40"
          }
        >
          <button className="absolute md:top-5 md:right-5 top-3 right-3">
            <RxCross2
              className="text-2xl text-[#fff]"
              onClick={() => {
                setIsOpen(false);
                setParams({});
                setImageData("");
              }}
            />
          </button>
          <div
            className={`${
              isDark ? "bg-black text-white" : "bg-white"
            } w-full rounded shadow-md`}
          >
            <div className="flex sm:items-center sm:flex-row sm:gap-0 gap-2 flex-col justify-between px-5 py-3">
              <div className="flex items-center gap-2">
                <Link>
                  <img
                    src={imageData?.user?.profile_image?.small}
                    className="rounded-full border"
                    alt={imageData?.user?.name}
                  />
                </Link>
                <Link>
                  <h3 className="text-[15px]">{imageData?.user?.name}</h3>
                  <p className="text-xs text-gray-500">
                    {imageData?.user?.bio &&
                      (imageData?.user?.bio).slice(0, 25)}
                  </p>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="px-3 py-2 cursor-pointer  rounded border group hover:border-gray-500 transition duration-100 border-gray-300 shadow"
                  onClick={() => {
                    handleLike(imageData.id);
                    setIsLiked(!isLiked);
                    isLiked ? toast.error("Unliked") : toast.success("Liked");
                  }}
                >
                  <FaHeart
                    className={`${isDark ? "text-white" : "text-gray-500"} ${
                      isLiked ? "text-red-500" : ""
                    } group-hover:text-red-500`}
                  />
                </div>
                <div className="px-3 py-2 cursor-pointer rounded border group hover:border-gray-500 transition duration-100 border-gray-300 shadow">
                  <FiPlus
                    className={`{${
                      isDark ? "text-white group-hover:text-white" : "text-gray-500 group-hover:text-gray-900"
                    } `}
                  />
                </div>
                <Link
                  onClick={() => download(imageData.urls.small)}
                  className="ml-auto"
                >
                  <button className="px-3 py-2 rounded bg-green-500 shadow text-sm text-[#f1f1f1]">
                    Download free
                  </button>
                </Link>
              </div>
            </div>
            <div className="md:px-4 py-3">
              <div id="modal-image" className="flex justify-center w-full">
                <img
                  src={imageData?.urls?.small}
                  alt={imageData?.alt_description}
                  className="md:w-auto w-full"
                />
              </div>
            </div>
            <div className="px-5 py-3 flex flex-col gap-6">
              <div className="flex md:items-center items-start justify-between">
                <div
                  className="flex md:flex-row flex-col
                 gap-4 md:gap-28"
                >
                  <div>
                    <p className={`text-sm ${isDark?"text-white":"text-gray-500"}`}>Views</p>
                    <span className="text-[15px]">
                      {imageData && (imageData?.views).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <p className={`text-sm ${isDark?"text-white":"text-gray-500"}`}>Downloads</p>
                    <span className="text-[15px]">
                      {imageData && (imageData?.downloads).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center  gap-3">
                  <div
                    className="px-2 py-1 cursor-pointer flex items-center gap-1  rounded border group hover:border-gray-500 transition duration-100 border-gray-300 shadow"
                    onClick={() =>
                      navigator.share({ url: window.location.href })
                    }
                  >
                    <IoIosShareAlt className={`text-gray-500 text-xl ${isDark?"group-hover:text-white":"group-hover:text-gray-900"}`} />
                    <span className={`text-[15px] ${isDark?"group-hover:text-white":"group-hover:text-gray-900"} text-gray-500 `}>
                      Share
                    </span>
                  </div>
                  <div className="px-2 py-1 cursor-pointer flex items-center gap-1  rounded border group hover:border-gray-500 transition duration-100 border-gray-300 shadow">
                    <MdInfo className={`text-gray-500 text-lg ${isDark?"group-hover:text-white":"group-hover:text-gray-900"}`} />
                    <span className={`text-[15px] ${isDark?"group-hover:text-white":"group-hover:text-gray-900"} text-gray-500 `}>
                      Info
                    </span>
                  </div>
                  <div className="px-3 py-[5px] cursor-pointer rounded border group hover:border-gray-500 transition duration-100 border-gray-300 shadow">
                    <MdMoreHoriz className={`text-gray-500 text-lg ${isDark?"group-hover:text-white":"group-hover:text-gray-900"}`} />
                  </div>
                </div>
              </div>
              <div className="max-w-[600px]">
                <p className="text-sm">{imageData?.description}</p>
              </div>
              <div className={`flex flex-col gap-[5px] ${isDark?"text-white":"text-gray-500"}`}>
                <div className="flex items-center gap-2 ">
                  <MdOutlineCalendarToday />
                  <span className="text-sm">
                    Publish {timeAgo(imageData?.created_at)}
                  </span>
                </div>
                {imageData?.exif?.name && (
                  <div className="flex items-center gap-2">
                    <MdOutlineCameraAlt />
                    <span className="text-sm">{imageData?.exif?.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MdOutlineVerifiedUser />
                  <span className="text-sm">
                    Free to use under the Unsplash License
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {imageData &&
                  imageData?.tags?.map(({ title }, index) => (
                    <Link key={index}>
                      <p className={`text-sm capitalize ${isDark?"text-white bg-slate-900":"text-gray-500 bg-[#f1f1f1]"} hover:text-gray-700 px-[10px] py-1 hover:bg-gray-200 transition duration-100 rounded`}>
                        {title}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>,
    document.getElementById("portal")
  );
}

export default Modal;
