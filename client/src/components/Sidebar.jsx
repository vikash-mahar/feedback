import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { GrLogout } from "react-icons/gr";;
import axiosInstance from "../utils/axios.helper";
import { unSetUser } from "../store/authSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Logo from "./Logo"

function Sidebar() {
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);
    const location = useLocation();
    const isWatchPage = location.pathname.includes("/watchpage");
    const navigate = useNavigate();
    const dispatch = useDispatch();



    const handleLogout = async () => {
        try {
            await axiosInstance.post("/users/logout", {});
            dispatch(unSetUser());
            localStorage.removeItem("accessToken");
            toast.success("Logged out successfully...");
            navigate("/");
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    return (
        <div
            className={` text-white bg-[#0f0e0e] mr-1 justify-start h-full flex flex-col border-1 border-gray-700 border-y-0 border-l-0 transition-all duration-100 ease-in-out  ${
                isWatchPage ? "w-16" : "w-58"
            }`}>
            <Link to="/" className="pr-2 pl-4 py-2 ">
                <Logo />
            </Link>

    <ul className="flex w-full justify-center">
    {!authStatus && (
                <div >
                    
                    <Link to="/login">
                        <Button className="cursor-pointer  hover:bg-gray-800 mr-1 rounded transition-all duration-150 px-4 py-2  ease-in-out active:translate-x-[5px] active:translate-y-[5px] sm:w-auto">
                            Log in
                        </Button>
                    </Link>
                    <Link to="/signup">
                        <Button className="cursor-pointer bg-[#848484] mr-1 rounded  hover:bg-[#cfcfcf] px-4 py-2 text-center transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] sm:w-auto">
                            Sign up
                        </Button>
                    </Link>
                </div>
            )}
    </ul>



    
            
            <ul className="px-2 py-2 flex h-full items-end">
                {authStatus && (
                    <li
                        onClick={handleLogout}
                        className={`py-2 ml-1 hover:bg-gray-800 transition-all duration-100 cursor-pointer flex items-center rounded-lg ${
                            isWatchPage ? "justify-center " : " px-5"
                        }`}
                    >
                        <span className={`${isWatchPage ? "ml-1" : "mr-2"}`}>
                            <GrLogout className="w-6 h-6" />
                        </span>
                        {!isWatchPage && "Logout"}
                    </li>
                )}
                
                
            </ul>
        </div>
    );
}

export default Sidebar;