import { useEffect, useState } from 'react';
import { Settings, X, User, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    const navigate = useNavigate();

    const handleAddUser = () => {
        navigate('/add-user');
    };
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const apiUrl = import.meta.env.MODE === 'development'
                    ? import.meta.env.VITE_API_URL_LOCAL
                    : import.meta.env.VITE_API_URL_PROD;

                if (!apiUrl) {
                    throw new Error('API URL is not defined');
                }

                const response = await fetch(`${apiUrl}/api/users`); // Replace `/api/users` if necessary
                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const RoleBadge = ({ role }) => {
        const getBgColor = () => {
            switch (role) {
                case 'Manager': return 'bg-indigo-100 text-indigo-800';
                case 'Admin': return 'bg-green-100 text-green-800';
                case 'Auditor': return 'bg-purple-100 text-purple-800';
                default: return 'bg-gray-100 text-gray-800';
            }
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBgColor()}`}>
                {role}
            </span>
        );
    };

    const UserAvatar = ({ name }) => {
        const getColor = (str) => {
            const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-red-500'];
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return colors[Math.abs(hash) % colors.length];
        };

        const initials = name
            .split(' ')
            .map(part => part[0])
            .join('')
            .substring(0, 2);

        return (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getColor(name)}`}>
                {initials}
            </div>
        );
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get current users for the page
    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    // Handle Next and Previous Buttons
    const handleNext = () => {
        if (currentPage < Math.ceil(users.length / usersPerPage)) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // Handle first and last page
    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(Math.ceil(users.length / usersPerPage));
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading users...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                    <h1 className="text-3xl font-bold flex items-center">
                        <User className="mr-4 w-10 h-10" />
                        User Management
                    </h1>
                    <div className="text-sm text-white/80 mt-2">
                        <span>Home &gt; User Management</span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between mb-6">
                        <div className="relative w-64">
                            <input
                                type="text"
                                placeholder="Search User"
                                className="w-full p-2 pl-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <button onClick={handleAddUser} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-300">
                            Add User
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                        <table className="w-full">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="w-12 py-3 px-4 text-left">
                                        <input type="checkbox" className="rounded text-indigo-600" />
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Role</th>
                                    <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b hover:bg-gray-100 transition duration-200">
                                        <td className="py-3 px-4">
                                            <input type="checkbox" className="rounded text-indigo-600" />
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar name={user.name} />
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                    {!user.loggedIn ? (
                                                        <div className="text-xs text-orange-500 font-medium flex items-center mt-1">
                                                            <XCircle className="w-3.5 h-3.5 mr-1" />
                                                            Not Logged in
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-green-500 font-medium flex items-center mt-1">
                                                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                                            Active
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-wrap gap-2">
                                                {user.roles.map((role, idx) => (
                                                    <RoleBadge key={idx} role={role} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`px-2 py-1 text-xs rounded-full ${user.loggedIn
                                                ? 'bg-green-200 text-green-800'
                                                : 'bg-red-200 text-red-800'
                                                }`}>
                                                {user.loggedIn ? 'active' : 'inactive'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center space-x-3">
                                                <button className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-300" title="Modify Roles">
                                                    <Settings className="w-5 h-5" />
                                                </button>
                                                <button className="flex items-center text-red-600 hover:text-red-800 transition duration-300" title="Remove User">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination (static for now) */}
                    <div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {currentUsers.length} of {users.length} total Users
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleFirstPage} className="px-3 py-1 border rounded-md bg-white hover:bg-gray-50 text-sm">First</button>
                                <button onClick={handlePrevious} className="px-2 py-1 border rounded-md bg-white hover:bg-gray-50 text-sm">&lt;</button>
                                <button className="px-3 py-1 border rounded-md bg-white hover:bg-gray-50 text-sm">{currentPage}</button>
                                <button onClick={handleNext} className="px-2 py-1 border rounded-md bg-white hover:bg-gray-50 text-sm">&gt;</button>
                                <button onClick={handleLastPage} className="px-3 py-1 border rounded-md bg-white hover:bg-gray-50 text-sm">Last</button>
                            </div>
                        </div>

                        {/* Render the users for the current page */}
                        <ul>
                            {currentUsers.map(user => (
                                <li key={user.id}>
                                    {user.name} - {user.email}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
