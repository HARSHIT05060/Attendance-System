import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="text-2xl font-bold text-blue-600">
                    <Link to="/">MyWebsite</Link>
                </div>
                <ul className="flex space-x-6 text-gray-700 font-medium">
                    <li>
                        <Link to="/usermanage" className="hover:text-blue-500">User Management</Link>
                    </li>
                    <li>
                        <Link to="/leaveapplication" className="hover:text-blue-500">LeaveApplication</Link>
                    </li>
                    <li>
                        <Link to="/leavestatusPage" className="hover:text-blue-500">LeaveStatusPage</Link>
                    </li>
                    <li>
                        <Link to="/employee" className="hover:text-blue-500">Employee</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
