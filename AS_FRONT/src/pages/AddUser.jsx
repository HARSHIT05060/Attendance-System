import { useState } from 'react';

export default function AddUser() {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle adding the user logic here, like making a POST request to the API
        console.log('Adding user:', { userName, userEmail });
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        id="userName"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter user name"
                    />
                </div>
                <div>
                    <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="userEmail"
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter user email"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md"
                    >
                        Add User
                    </button>
                </div>
            </form>
        </div>
    );
}
