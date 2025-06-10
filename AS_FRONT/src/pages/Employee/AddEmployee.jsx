import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, ArrowLeft, User, Building, CreditCard, FileText, Phone, Calendar, Users } from 'lucide-react';

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

    const validateForm = () => {
        const errors = [];

        // Basic Details validation
        if (!formData.employeeCode.trim()) errors.push('Employee Code');
        if (!formData.name.trim()) errors.push('Full Name');
        if (!formData.mobile.trim()) errors.push('Mobile Number');
        if (!formData.gender) errors.push('Gender');
        if (!formData.branch) errors.push('Branch');
        if (!formData.department) errors.push('Department');
        if (!formData.designation.trim()) errors.push('Designation');

        // Bank Details validation
        if (!formData.bankName.trim()) errors.push('Bank Name');
        if (!formData.branchName.trim()) errors.push('Branch Name');
        if (!formData.accountNo.trim()) errors.push('Account Number');
        if (!formData.ifscCode.trim()) errors.push('IFSC Code');

        // Legal Documents validation
        if (!formData.aadharCard) errors.push('Aadhar Card');
        if (!formData.panCard) errors.push('PAN Card');

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        // Validate form
        const validationErrors = validateForm();

        if (validationErrors.length > 0) {
            const errorMessage = validationErrors.length === 1
                ? `Please fill in the required field: ${validationErrors[0]}`
                : `Please fill in the following required fields: ${validationErrors.join(', ')}`;

            setMessage({ type: 'error', text: errorMessage });
            setIsSubmitting(false);

            // Scroll to top to show the error message
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            // Create FormData for file uploads
            const formDataToSend = new FormData();

            // Append all text fields
            Object.keys(formData).forEach(key => {
                if (key === 'references') {
                    formDataToSend.append('references', JSON.stringify(formData.references));
                } else if (key === 'aadharCard' || key === 'drivingLicence' || key === 'panCard' || key === 'photo') {
                    // Skip file fields here, handle them separately
                    return;
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Handle file uploads
            const fileFields = ['aadharCard', 'drivingLicence', 'panCard', 'photo'];

            fileFields.forEach(field => {
                if (formData[field]) {
                    const base64String = formData[field];
                    const [metadata, base64Data] = base64String.split(',');
                    const mimeMatch = metadata.match(/data:(.*);base64/);
                    const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
                    const fileExtension = mimeType.split('/')[1]; // e.g. 'jpeg', 'png', 'pdf'

                    const byteCharacters = atob(base64Data);
                    const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: mimeType });

                    formDataToSend.append(field, blob, `${field}.${fileExtension}`);
                }
            });

            const API_BASE_URL =
                import.meta.env.MODE === 'development'
                    ? import.meta.env.VITE_API_URL_LOCAL
                    : import.meta.env.VITE_API_URL_PROD;

            const response = await fetch(`${API_BASE_URL}/api/employees`, {
                method: 'POST',
                body: formDataToSend,
                // Don't set Content-Type header when using FormData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            // Check if response has content and is JSON

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const responseText = await response.text();
                if (responseText) {
                    // eslint-disable-next-line no-unused-vars
                    const result = JSON.parse(responseText);
                }
            }

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

            // Scroll to top to show the success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error adding employee:', error);
            setMessage({
                type: 'error',
                text: error.message.includes('fetch')
                    ? 'Failed to connect to server. Please check your connection.'
                    : 'Failed to add employee. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const goBack = () => {
        window.history.back();
    };

    const sections = [
        {
            key: 'basicDetails',
            title: 'Basic Details',
            icon: User,
            color: 'blue'
        },
        {
            key: 'bankDetails',
            title: 'Bank Details',
            icon: CreditCard,
            color: 'green'
        },
        {
            key: 'legalDocuments',
            title: 'Legal Documents',
            icon: FileText,
            color: 'purple'
        },
        {
            key: 'contactInformation',
            title: 'Contact Information',
            icon: Phone,
            color: 'orange'
        },
        {
            key: 'personalInformation',
            title: 'Personal Information',
            icon: Calendar,
            color: 'indigo'
        },
        {
            key: 'reference',
            title: 'References',
            icon: Users,
            color: 'pink'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={goBack}
                                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Add New Employee</h1>
                                <p className="text-blue-100 text-sm mt-1">Fill in the employee details below</p>
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    {message.text && (
                        <div className={`mx-6 mt-6 p-4 rounded-xl border-l-4 ${message.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                            : 'bg-red-50 text-red-800 border-red-400'
                            }`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                                {message.text}
                            </div>
                        </div>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {sections.map((section) => (
                        <div key={section.key} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => toggleSection(section.key)}
                                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-${section.color}-100`}>
                                        <section.icon size={20} className={`text-${section.color}-600`} />
                                    </div>
                                    <span className="font-semibold text-gray-900 text-lg">{section.title}</span>
                                </div>
                                <div className={`p-1 rounded-full ${expandedSections[section.key] ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                    {expandedSections[section.key] ?
                                        <ChevronUp size={20} className="text-blue-600" /> :
                                        <ChevronDown size={20} className="text-gray-600" />
                                    }
                                </div>
                            </button>

                            {expandedSections[section.key] && (
                                <div className="border-t border-gray-100">
                                    {section.key === 'basicDetails' && (
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Employee Code *</label>
                                                <input
                                                    type="text"
                                                    name="employeeCode"
                                                    value={formData.employeeCode}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Enter employee code"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Enter full name"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Mobile Number *</label>
                                                <input
                                                    type="tel"
                                                    name="mobile"
                                                    value={formData.mobile}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Enter mobile number"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Enter email address"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Gender *</label>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    required
                                                >
                                                    <option value="">Select Gender</option>
                                                    {genderOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Branch *</label>
                                                <select
                                                    name="branch"
                                                    value={formData.branch}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    required
                                                >
                                                    <option value="">Select Branch</option>
                                                    {branchOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Department *</label>
                                                <select
                                                    name="department"
                                                    value={formData.department}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    required
                                                >
                                                    <option value="">Select Department</option>
                                                    {departmentOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Designation *</label>
                                                <input
                                                    type="text"
                                                    name="designation"
                                                    value={formData.designation}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Enter designation"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Employment Type</label>
                                                <select
                                                    name="employmentType"
                                                    value={formData.employmentType}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                >
                                                    <option value="">Select Employment Type</option>
                                                    {employmentTypeOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Salary Type</label>
                                                <select
                                                    name="salaryType"
                                                    value={formData.salaryType}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                >
                                                    <option value="">Select Salary Type</option>
                                                    {salaryTypeOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Salary</label>
                                                <input
                                                    type="number"
                                                    name="salary"
                                                    value={formData.salary}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Enter salary amount"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Address</label>
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                                    placeholder="Enter complete address"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {section.key === 'bankDetails' && (
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Bank Name *</label>
                                                <input
                                                    type="text"
                                                    name="bankName"
                                                    value={formData.bankName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                    placeholder="Enter bank name"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Branch Name *</label>
                                                <input
                                                    type="text"
                                                    name="branchName"
                                                    value={formData.branchName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                    placeholder="Enter branch name"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Account Number *</label>
                                                <input
                                                    type="text"
                                                    name="accountNo"
                                                    value={formData.accountNo}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                    placeholder="Enter account number"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">IFSC Code *</label>
                                                <input
                                                    type="text"
                                                    name="ifscCode"
                                                    value={formData.ifscCode}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                    placeholder="Enter IFSC code"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {section.key === 'legalDocuments' && (
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {['aadharCard', 'drivingLicence', 'panCard', 'photo'].map((docType) => (
                                                <div key={docType} className="space-y-2">
                                                    <label className="block text-sm font-semibold text-gray-700">
                                                        {docType === 'aadharCard' ? 'Aadhar Card *' :
                                                            docType === 'drivingLicence' ? 'Driving Licence' :
                                                                docType === 'panCard' ? 'PAN Card *' : 'Passport Size Photo'}
                                                    </label>
                                                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors bg-gray-50 hover:bg-purple-50">
                                                        {filePreviews[docType] ? (
                                                            <div className="space-y-2">
                                                                <img
                                                                    src={filePreviews[docType]}
                                                                    alt="Preview"
                                                                    className="max-h-24 mx-auto rounded-lg shadow-sm"
                                                                />
                                                                <p className="text-xs text-green-600 font-medium">✓ File uploaded successfully</p>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <FileText size={24} className="mx-auto text-gray-400" />
                                                                <p className="text-sm text-gray-500">Click to upload or drag & drop</p>
                                                                <p className="text-xs text-gray-400">PNG, JPG, PDF up to 10MB</p>
                                                            </div>
                                                        )}
                                                        <input
                                                            type="file"
                                                            name={docType}
                                                            onChange={handleInputChange}
                                                            accept="image/*"
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            required={docType === 'aadharCard' || docType === 'panCard'}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {section.key === 'contactInformation' && (
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Emergency Contact Number</label>
                                                <input
                                                    type="tel"
                                                    name="emergencyContactNo"
                                                    value={formData.emergencyContactNo}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                                    placeholder="Enter emergency contact"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Contact Person Name</label>
                                                <input
                                                    type="text"
                                                    name="contactPersonName"
                                                    value={formData.contactPersonName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                                    placeholder="Enter contact person name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Relation</label>
                                                <select
                                                    name="relation"
                                                    value={formData.relation}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                                >
                                                    <option value="">Select Relation</option>
                                                    {relationOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Emergency Address</label>
                                                <textarea
                                                    name="emergencyAddress"
                                                    value={formData.emergencyAddress}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                                                    placeholder="Enter emergency contact address"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {section.key === 'personalInformation' && (
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">Date of Joining</label>
                                                <input
                                                    type="date"
                                                    name="dateOfJoining"
                                                    value={formData.dateOfJoining}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {section.key === 'reference' && (
                                        <div className="p-6">
                                            <div className="space-y-4">
                                                {formData.references.map((reference, index) => (
                                                    <div key={index} className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="font-semibold text-gray-800">Reference {index + 1}</h4>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeReference(index)}
                                                                className="text-red-500 hover:text-red-700 transition-colors p-1 rounded"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>

                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-semibold text-gray-700">Name</label>
                                                                <input
                                                                    type="text"
                                                                    value={reference.name}
                                                                    onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                                                    placeholder="Enter reference name"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-semibold text-gray-700">Contact Number</label>
                                                                <input
                                                                    type="tel"
                                                                    value={reference.contactNumber}
                                                                    onChange={(e) => handleReferenceChange(index, 'contactNumber', e.target.value)}
                                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                                                    placeholder="Enter contact number"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={addReference}
                                                    className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-lg border border-pink-200"
                                                >
                                                    <Plus size={16} />
                                                    Add Reference
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Submit Button */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                <p>Please review all information before submitting.</p>
                                <p className="text-xs text-gray-500 mt-1">Fields marked with * are required</p>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Adding Employee...
                                    </div>
                                ) : (
                                    'Add Employee'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;