import { Bell, ChevronDown,User } from 'lucide-react';
const Navbar = () => {
    return (
        <div className="fixed flex items-center justify-end w-full h-16 px-4 bg-white border-b border-gray-200">
            {/* <div className="flex items-center">
                <div className="flex items-center mr-4">
                    <img src="/api/placeholder/32/32" alt="Logo" className="w-8 h-8" />
                    <div className="ml-2">
                        <span className="text-gray-500 text-xs">petpooja</span>
                        <h2 className="font-bold text-gray-800">PAYROLL</h2>
                    </div>
                </div>

                <div className="relative ml-4 flex items-center">
                    <span className="mr-2 text-gray-600 hidden md:inline">Payroll Sales Demo (Marketplace)</span>
                    <span className="mr-2 text-gray-600 md:hidden">Sales Demo</span>
                    <ChevronDown size={16} className="text-gray-500" />
                </div>
            </div> */}

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
