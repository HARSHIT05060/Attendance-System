import React, { useState } from 'react';
import axios from 'axios';


const LeaveApplication = () => {
    const [formData, setFormData] = useState({
        employee_id: '',
        employee_name: '',
        leave_type: 'Sick',
        start_date: '',
        end_date: '',
        reason: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const API_BASE_URL =
                import.meta.env.MODE === 'development'
                    ? import.meta.env.VITE_API_URL_LOCAL
                    : import.meta.env.VITE_API_URL_PROD;

            const response = await axios.post(`${API_BASE_URL}/api/leaves`, formData);

            setNotification({
                show: true,
                type: 'success',
                message: response.data.message || 'Leave request submitted successfully!'
            });

            setFormData({
                employee_id: '',
                employee_name: '',
                leave_type: 'Sick',
                start_date: '',
                end_date: '',
                reason: ''
            });
        } catch (error) {
            setNotification({
                show: true,
                type: 'error',
                message: error.response?.data?.message || 'Failed to submit leave request'
            });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                setNotification({ show: false, type: '', message: '' });
            }, 5000);
        }
    };


    return (
        <div className="max-w-2xl mx-auto px-4 py-8 w-full">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-blue-600 py-4 px-6">
                    <h2 className="text-xl font-bold text-white">Apply for Leave</h2>
                </div>

                {notification.show && (
                    <div className={`px-6 py-3 mt-4 text-sm font-medium rounded-md ${notification.type === 'success'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}>
                        {notification.message}
                    </div>
                )}

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Employee ID
                            </label>
                            <input
                                type="text"
                                name="employee_id"
                                value={formData.employee_id}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your ID"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Employee Name
                            </label>
                            <input
                                type="text"
                                name="employee_name"
                                value={formData.employee_name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Leave Type
                        </label>
                        <select
                            name="leave_type"
                            value={formData.leave_type}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Sick">Sick Leave</option>
                            <option value="Casual">Casual Leave</option>
                            <option value="Emergency">Emergency Leave</option>
                            <option value="Annual">Annual Leave</option>
                            <option value="Maternity">Maternity/Paternity Leave</option>
                            <option value="Other">Other</option>
                        </select>

                        {formData.leave_type === "Other" && (
                            <div className="mb-4">
                                <label htmlFor="other_reason" className="block text-sm font-medium text-gray-700 mb-1">
                                    Specify Other Reason
                                </label>
                                <input
                                    type="text"
                                    name="other_reason"
                                    value={formData.other_reason || ""}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter reason for leave"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Reason for Leave
                        </label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Please provide details about your leave request"
                        />
                    </div>

                    <div className="flex items-center justify-end pt-4">
                        <button
                            type="button"
                            className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            onClick={() => {
                                setFormData({
                                    employee_id: '',
                                    employee_name: '',
                                    leave_type: 'Sick',
                                    start_date: '',
                                    end_date: '',
                                    reason: ''
                                });
                            }}
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveApplication;