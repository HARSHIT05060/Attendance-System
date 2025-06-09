import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, ArrowLeft } from 'lucide-react';

const AddEmployee = () => {
    const [formData, setFormData] = useState({
        // Basic Details
        employeeCode: '',
        name: '',
        mobile: '',
        email: '',
        gender: '',
        branch: '',
        department: '',
        designation: '',
        employmentType: '',
        salaryType: '',
        salary: '',
        address: '',

        // Bank Details
        bankName: '',
        branchName: '',
        accountNo: '',
        ifscCode: '',

        // Legal Documents
        aadharCard: null,
        drivingLicence: null,
        panCard: null,
        photo: null,

        // Contact Information
        emergencyContactNo: '',
        contactPersonName: '',
        relation: '',
        emergencyAddress: '',

        // Personal Information
        dateOfBirth: '',
        dateOfJoining: '',

        // References
        references: [{ name: '', contactNumber: '' }]
    });

    const [expandedSections, setExpandedSections] = useState({
        basicDetails: true,
        bankDetails: false,
        legalDocuments: false,
        contactInformation: false,
        personalInformation: false,
        reference: false
    });

    const [filePreviews, setFilePreviews] = useState({
        aadharCard: null,
        drivingLicence: null,
        panCard: null,
        photo: null
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Dropdown options
    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
    ];

    const branchOptions = [
        { value: 'mumbai', label: 'Mumbai' },
        { value: 'delhi', label: 'Delhi' },
        { value: 'bangalore', label: 'Bangalore' },
        { value: 'chennai', label: 'Chennai' }
    ];

    const departmentOptions = [
        { value: 'hr', label: 'Human Resources' },
        { value: 'engineering', label: 'Engineering' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'sales', label: 'Sales' },
        { value: 'finance', label: 'Finance' }
    ];

    const employmentTypeOptions = [
        { value: 'fulltime', label: 'Full Time' },
        { value: 'parttime', label: 'Part Time' },
        { value: 'contract', label: 'Contract' },
        { value: 'intern', label: 'Intern' }
    ];

    const salaryTypeOptions = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'hourly', label: 'Hourly' }
    ];

    const relationOptions = [
        { value: 'father', label: 'Father' },
        { value: 'mother', label: 'Mother' },
        { value: 'spouse', label: 'Spouse' },
        { value: 'sibling', label: 'Sibling' },
        { value: 'friend', label: 'Friend' },
        { value: 'other', label: 'Other' }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({ ...prev, [name]: reader.result }));
                    setFilePreviews(prev => ({ ...prev, [name]: reader.result }));
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleReferenceChange = (index, field, value) => {
        const updatedReferences = [...formData.references];
        updatedReferences[index][field] = value;
        setFormData(prev => ({ ...prev, references: updatedReferences }));
    };

    const addReference = () => {
        setFormData(prev => ({
            ...prev,
            references: [...prev.references, { name: '', contactNumber: '' }]
        }));
    };

    const removeReference = (index) => {
        if (formData.references.length > 1) {
            const updatedReferences = formData.references.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, references: updatedReferences }));
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const API_BASE_URL =
                import.meta.env.MODE === 'development'
                    ? import.meta.env.VITE_API_URL_LOCAL
                    : import.meta.env.VITE_API_URL_PROD; // Update this to your actual API URL

            const response = await fetch(`${API_BASE_URL}/api/employees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Employee added successfully!' });
                // Reset form
                setFormData({
                    employeeCode: '',
                    name: '',
                    mobile: '',
                    email: '',
                    gender: '',
                    branch: '',
                    department: '',
                    designation: '',
                    employmentType: '',
                    salaryType: '',
                    salary: '',
                    address: '',
                    bankName: '',
                    branchName: '',
                    accountNo: '',
                    ifscCode: '',
                    aadharCard: null,
                    drivingLicence: null,
                    panCard: null,
                    photo: null,
                    emergencyContactNo: '',
                    contactPersonName: '',
                    relation: '',
                    emergencyAddress: '',
                    dateOfBirth: '',
                    dateOfJoining: '',
                    references: [{ name: '', contactNumber: '' }]
                });
                setFilePreviews({
                    aadharCard: null,
                    drivingLicence: null,
                    panCard: null,
                    photo: null
                });
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.message || 'Failed to add employee' });
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const goBack = () => {
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={goBack}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                Back
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-900">Add New Employee</h1>
                        </div>
                    </div>

                    {/* Message */}
                    {message.text && (
                        <div className={`mx-6 mt-4 p-4 rounded-md ${message.type === 'success'
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                            {message.text}
                        </div>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Basic Details Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSection('basicDetails')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
                        >
                            <span className="font-medium text-gray-900">Basic Details</span>
                            {expandedSections.basicDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {expandedSections.basicDetails && (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee Code *</label>
                                    <input
                                        type="text"
                                        name="employeeCode"
                                        value={formData.employeeCode}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        {genderOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                                    <select
                                        name="branch"
                                        value={formData.branch}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Branch</option>
                                        {branchOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departmentOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter Designation"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                                    <select
                                        name="employmentType"
                                        value={formData.employmentType}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Employment Type</option>
                                        {employmentTypeOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Type</label>
                                    <select
                                        name="salaryType"
                                        value={formData.salaryType}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Salary Type</option>
                                        {salaryTypeOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                                    <input
                                        type="number"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bank Details Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSection('bankDetails')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
                        >
                            <span className="font-medium text-gray-900">Bank Details</span>
                            {expandedSections.bankDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {expandedSections.bankDetails && (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                    <input
                                        type="text"
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                                    <input
                                        type="text"
                                        name="branchName"
                                        value={formData.branchName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account No</label>
                                    <input
                                        type="text"
                                        name="accountNo"
                                        value={formData.accountNo}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                                    <input
                                        type="text"
                                        name="ifscCode"
                                        value={formData.ifscCode}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Legal Documents Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSection('legalDocuments')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
                        >
                            <span className="font-medium text-gray-900">Legal Documents</span>
                            {expandedSections.legalDocuments ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {expandedSections.legalDocuments && (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['aadharCard', 'drivingLicence', 'panCard', 'photo'].map((docType) => (
                                    <div key={docType}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {docType === 'aadharCard' ? 'Aadhar Card' :
                                                docType === 'drivingLicence' ? 'Driving Licence' :
                                                    docType === 'panCard' ? 'PAN Card' : 'Passport Size Photo'}
                                        </label>
                                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                            {filePreviews[docType] ? (
                                                <div>
                                                    <img
                                                        src={filePreviews[docType]}
                                                        alt="Preview"
                                                        className="max-h-20 mx-auto mb-2"
                                                    />
                                                    <p className="text-xs text-gray-500">File uploaded</p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">Click to upload</p>
                                            )}
                                            <input
                                                type="file"
                                                name={docType}
                                                onChange={handleInputChange}
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSection('contactInformation')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
                        >
                            <span className="font-medium text-gray-900">Contact Information</span>
                            {expandedSections.contactInformation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {expandedSections.contactInformation && (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact No</label>
                                    <input
                                        type="tel"
                                        name="emergencyContactNo"
                                        value={formData.emergencyContactNo}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person Name</label>
                                    <input
                                        type="text"
                                        name="contactPersonName"
                                        value={formData.contactPersonName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
                                    <select
                                        name="relation"
                                        value={formData.relation}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Relation</option>
                                        {relationOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Address</label>
                                    <textarea
                                        name="emergencyAddress"
                                        value={formData.emergencyAddress}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Personal Information Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSection('personalInformation')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
                        >
                            <span className="font-medium text-gray-900">Personal Information</span>
                            {expandedSections.personalInformation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {expandedSections.personalInformation && (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                                    <input
                                        type="date"
                                        name="dateOfJoining"
                                        value={formData.dateOfJoining}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reference Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSection('reference')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
                        >
                            <span className="font-medium text-gray-900">Reference</span>
                            {expandedSections.reference ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {expandedSections.reference && (
                            <div className="p-6">
                                {formData.references.map((reference, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                value={reference.name}
                                                onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                                <input
                                                    type="tel"
                                                    value={reference.contactNumber}
                                                    onChange={(e) => handleReferenceChange(index, 'contactNumber', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            {formData.references.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeReference(index)}
                                                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addReference}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                >
                                    <Plus size={16} />
                                    Add More Reference
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors${isSubmitting ? ' opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Details'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;