import React, { useState, useEffect } from 'react';
import { User, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/users';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);

    const [formData, setFormData] = useState({
        employeeId: '',
        username: '',
        password: '',
        role: 'HR',
        permissions: {
            canApproveLeave: false,
            canEditSalary: false,
            canManagePayroll: false,
            canManageUsers: false
        },
        status: 'active',
        twoFactorEnabled: false
    });

    const loadUsers = async () => {
        try {
            const res = await window.fetch(API_URL);
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error('Error loading users:', err);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name in formData.permissions) {
            setFormData(prev => ({
                ...prev,
                permissions: { ...prev.permissions, [name]: checked }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const method = editingUser ? 'PUT' : 'POST';
            const url = editingUser 
                ? `${API_URL}/${editingUser._id}` 
                : `${API_URL}/create`;

            const res = await window.fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setEditingUser(null);
                setFormData({
                    employeeId: '',
                    username: '',
                    password: '',
                    role: 'HR',
                    permissions: {
                        canApproveLeave: false,
                        canEditSalary: false,
                        canManagePayroll: false,
                        canManageUsers: false
                    },
                    status: 'active',
                    twoFactorEnabled: false
                });
                loadUsers();
            }
        } catch (err) {
            console.error('Error submitting user:', err);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData(user);
    };

    const handleDelete = async (id) => {
        try {
            const res = await window.fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                loadUsers();
            }
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    const handleCancel = () => {
        setEditingUser(null);
        setFormData({
            employeeId: '',
            username: '',
            password: '',
            role: 'HR',
            permissions: {
                canApproveLeave: false,
                canEditSalary: false,
                canManagePayroll: false,
                canManageUsers: false
            },
            status: 'active',
            twoFactorEnabled: false
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                    <h1 className="text-3xl font-bold flex items-center">
                        <User className="mr-4 w-10 h-10" />
                        User Management
                    </h1>
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-3 gap-6 p-6">
                    {/* User Form */}
                    <div className="md:col-span-1 bg-gray-100 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            {editingUser ? 'Edit User' : 'Create User'}
                        </h2>
                        <div className="space-y-4">
                            <input 
                                name="employeeId" 
                                placeholder="Employee ID" 
                                value={formData.employeeId} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            <input 
                                name="username" 
                                placeholder="Username" 
                                value={formData.username} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="Password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            
                            <select 
                                name="role" 
                                value={formData.role} 
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                <option value="HR">HR</option>
                                <option value="Manager">Manager</option>
                                <option value="Admin">Admin</option>
                            </select>

                            {/* Permissions Checkboxes */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Permissions</label>
                                {Object.keys(formData.permissions).map((key) => (
                                    <div key={key} className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            name={key} 
                                            checked={formData.permissions[key]} 
                                            onChange={handleChange} 
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded mr-2"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <select 
                                name="status" 
                                value={formData.status} 
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    name="twoFactorEnabled" 
                                    checked={formData.twoFactorEnabled} 
                                    onChange={handleChange} 
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded mr-2"
                                />
                                <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                            </div>

                            <div className="flex space-x-2">
                                <button 
                                    onClick={handleSubmit}
                                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                                >
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                                {editingUser && (
                                    <button 
                                        onClick={handleCancel}
                                        className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition duration-300"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User List */}
                    <div className="md:col-span-2 overflow-x-auto">
                        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                                    <th className="p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                                    <th className="p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className="border-b hover:bg-gray-100 transition duration-200">
                                        <td className="p-3 text-sm text-gray-700">{user.employeeId}</td>
                                        <td className="p-3 text-sm text-gray-700">{user.username}</td>
                                        <td className="p-3 text-sm text-gray-700">{user.role}</td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                user.status === 'active' 
                                                    ? 'bg-green-200 text-green-800' 
                                                    : 'bg-red-200 text-red-800'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-700">
                                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex flex-col items-center space-y-1">
                                                {Object.entries(user.permissions)
                                                    .filter(([, value]) => value)
                                                    .map(([key]) => (
                                                        <span 
                                                            key={key} 
                                                            className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                                                        >
                                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                        </span>
                                                    ))
                                                }
                                            </div>
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button 
                                                    onClick={() => handleEdit(user)}
                                                    className="text-indigo-600 hover:text-indigo-800 transition duration-300"
                                                    title="Edit User"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(user._id)}
                                                    className="text-red-600 hover:text-red-800 transition duration-300"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;