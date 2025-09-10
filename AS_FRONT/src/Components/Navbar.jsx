import { Bell, ChevronDown, User } from 'lucide-react';
import logo from '../assets/smart attendance.png';
const Navbar = () => {
    return (
        <div className="fixed flex items-center justify-between w-full h-16 px-4 bg-white border-b border-gray-200">
            {/* Left side - Logo */}
            <div className="flex items-center">
                <img src={logo} alt="Logo" className="w-8 h-8" />
                <div className="ml-2">
                    <span className="text-gray-500 text-xs">Smart</span>
                    <h2 className="font-bold text-gray-800">Attendance</h2>
                </div>
            </div>

            {/* Right side - Notifications + User */}
            <div className="flex items-center">
                <button className="p-2 mx-1 text-gray-500 hover:text-gray-700">
                    <Bell size={20} />
                </button>

                <div className="flex items-center ml-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700">
                        <User size={16} />
                    </div>
                    <span className="ml-2 mr-1 text-gray-700 hidden sm:inline">Demo</span>
                    <ChevronDown size={16} className="text-gray-500" />
                </div>
            </div>
        </div>

    );
};

export default Navbar;
