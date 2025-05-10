import { Outlet } from "react-router-dom";
import { useDispatch} from "react-redux";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    return (
        <div className="h-screen w-screen bg-black text-white flex flex-col bg-opacity-95">
            
            <div className="w-full h-full flex overflow-auto">
            <div>
                    <Sidebar />
                </div>
                <main className="overflow-y-auto h-full w-full scrollbar-hide" id="scrollableDiv">
                    <Outlet />
                </main>
            </div>
            <div id="popup-models" className="bg-pink-400 relative"></div>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </div>
    );
}

export default App;