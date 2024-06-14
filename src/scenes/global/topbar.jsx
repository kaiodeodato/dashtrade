import { useTheme, Tooltip  } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { Link,useNavigate, useLocation  } from "react-router-dom";
import { MyContext } from "../../../UserContext.js"
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import HomeIcon from '@mui/icons-material/Home';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import SearchIcon from "@mui/icons-material/Search";
import ListAltIcon from '@mui/icons-material/ListAlt';

const Topbar = () => {
    const { clientSelect, setClientSelect, clientSearch, setClientSearch,  trickSearch, setTrickSearch } = useContext(MyContext);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext)
    const navigate = useNavigate();
    const location = useLocation();

    const handleCleanSelect = () => {
        setClientSearch('')
        setClientSelect('')
    };

    const handleSearchButton = () => {
        setTrickSearch(true)
        navigate("/list")
    };


    return (
    <div className="flex justify-between items-center rounded-md px-3" style={{ backgroundColor: colors.primary[600] }}>
            
        <div className="text-2xl font-bold">
            <Link to={"/"}>
                <span className="hover:text-indigo-600 transition duration-300 text-slate-300 p-2" >
                    TradeBoard
                </span>
            </Link>
        </div>

        <div className="flex justify-center items-center">

            {location.pathname === '/list' && (
                <div className="flex justify-center items-center  gap-2">
                    <div 
                        className="p-2 rounded-full hover:text-indigo-600 transition duration-300 cursor-pointer" 
                        style={{ backgroundColor: colors.primary[200] }} 
                        onClick={handleSearchButton}
                        >
                            <SearchIcon/>
                    </div>
                    <InputBase 
                        className="p-1 rounded-md" 
                        placeholder="Search" 
                        style={{ backgroundColor: colors.primary[100] }}  
                        value={clientSearch}
                        
                        onChange={(e) => {
                            setClientSearch(e.target.value);
                        }}/>
                </div>
            )}  

            {location.pathname === '/' && (
                <div className="flex justify-center items-center p-2 gap-2">
                    <button 
                        type="button" 
                        className="py-2 px-5 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-200 rounded-lg border border-gray-200 hover:bg-gray-500 focus:z-10 focus:ring-4 focus:ring-gray-100" 
                        onClick={handleCleanSelect}>
                        Clean
                    </button>
                    <form className="flex justify-center items-center ">
                        <select id="countries" className="bg-gray-700 border text-sm rounded-lg focus:ring-blue-500block w-full p-2.5 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 dark:focus:border-blue-500" 
                        value={clientSelect}
                        onChange={(e) => {
                            setClientSearch("");
                            setClientSelect(e.target.value);
                        }}>
                            <option defaultValue>All Clients</option>
                            <option value="Jennifer Brown">Jennifer Brown</option>
                            <option value="John Williams">John Williams</option>
                            <option value="Emily Davis">Emily Davis</option>
                            <option value="Michael Johnson">Michael Johnson</option>
                            <option value="Robert Miller">Robert Miller</option>
                            <option value="James Woodlake">James Woodlake</option>
                            <option value="David Anderson">David Anderson</option>
                            <option value="Jessica Wilson">Jessica Wilson</option>
                        </select>
                    </form>
                </div>
            )}

            <div className="flex justify-center items-center gap-2 p-2">
                <Link  to={"/"}>
                    <Tooltip title="Home" placement="bottom">
                        <div className="p-2 rounded-full hover:text-indigo-600 transition duration-300" style={{ backgroundColor: colors.primary[200] }}>
                            <HomeIcon />
                        </div>
                    </Tooltip>
                </Link>
                <Link to={"/list"}>
                    <Tooltip title="List" placement="bottom">
                        <div className="p-2 rounded-full hover:text-indigo-600 transition duration-300" style={{ backgroundColor: colors.primary[200] }}>
                            <ListAltIcon/>
                        </div>
                    </Tooltip>
                </Link>
                <Link to={"/form"}>
                    <Tooltip title="Form" placement="bottom">
                        <div className="p-2 rounded-full hover:text-indigo-600 transition duration-300" style={{ backgroundColor: colors.primary[200] }}>
                            <NoteAddIcon/>
                        </div>
                    </Tooltip>
                </Link>
                <Tooltip title={theme.palette.mode === "dark" ? "light" : "dark"} placement="bottom">
                <div onClick={colorMode.toggleColorMode} className="p-2 rounded-full hover:text-indigo-600 transition duration-300 cursor-pointer" style={{ backgroundColor: colors.primary[200] }}>
                    { theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon/>
                    ) : (
                        <LightModeOutlinedIcon/>
                    ) }
                </div >
                </Tooltip>
            </div>

        </div>
    </div>
)
};

export default Topbar;