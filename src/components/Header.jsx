import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FiMoon } from "react-icons/fi";
import { MdOutlineWbSunny } from "react-icons/md";
function Header({ isDark, setIsDark }) {
  const handleChangeTheme = () => {
    if (isDark) {
      setIsDark(false);
      localStorage.setItem("theme", "light");
    } else {
      setIsDark(true);
      localStorage.setItem("theme", "dark");
    }
  };
  return (
    <header className="sm:py-5 py-3 sm:px-6 px-3 backdrop-blur-md w-full z-40 fixed flex items-center justify-between inset-x-0">
      <div className="flex items-center space-x-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-6 h-6 ${isDark ? "text-white" : "text-black"}`}
        >
          <path d="M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <path d="M6 8h12"></path>
          <path d="M18.3 17.7a2.5 2.5 0 0 1-3.16 3.83 2.53 2.53 0 0 1-1.14-2V12"></path>
          <path d="M6.6 15.6A2 2 0 1 0 10 17v-5"></path>
        </svg>
        <h2 className={`font-bold ${isDark ? "text-white" : ""}`}>PicFinder</h2>
      </div>

      <div className="flex items-center">
        <Link target="_blank" to="https://github.com/ayan-ansa">
          <div
            className={`${isDark?"hover:bg-slate-800":"hover:bg-slate-200"} duration-150 transition ease-in rounded px-2 py-1`}
          >
            <FaGithub
              className={`w-6 h-6 ${
                isDark ? "text-white" : "text-black"
              }`}
            />
          </div>
        </Link>
        <div onClick={handleChangeTheme}>
          {!isDark ? (
            <button className="hover:bg-slate-200 duration-150 transition ease-in rounded px-2 py-1">
              <FiMoon className="h-6 w-6" />
            </button>
          ) : (
            <button className={`${isDark?"hover:bg-slate-800":"hover:bg-slate-200"} duration-150 group transition ease-in rounded px-2 py-1`}>
              <MdOutlineWbSunny
                className={`w-6 h-6 ${
                  isDark ? "text-white" : "text-black"
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
