import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, Users, AlertCircle, Loader2, RotateCcw, Filter } from 'lucide-react';


const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PROD;
// API service layer with enhanced error handling
const payrollService = {
  async fetchMonthlyPayroll(year, month) {
    try {
      // Convert month to string with leading zero if needed (e.g., "01", "02")
      const monthStr = month.toString().padStart(2, '0');
      const yearStr = year.toString();

      const response = await fetch(`${API_BASE_URL}/api/payroll/monthly/all?year=${yearStr}&month=${monthStr}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.text();
          if (errorData.startsWith('{')) {
            const jsonError = JSON.parse(errorData);
            errorMessage = jsonError.message || jsonError.error || errorMessage;
          }
        } catch (error) {
          console.error('Failed to parse error response:', error);
          // If 
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response received:', responseText.substring(0, 200));
        throw new Error('Server returned non-JSON response. Please check your API endpoint.');
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Payroll fetch error:', error);

      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please check if your API server is running on http://localhost:5000');
      } else if (error.message.includes('Unexpected token')) {
        throw new Error('Server returned invalid JSON. The API might be returning an HTML error page.');
      } else if (error.name === 'TypeError') {
        throw new Error('Network error. Please check your internet connection and API server.');
      }

      throw new Error(error.message || 'Failed to fetch payroll data');
    }
  }
};

// Constants for better maintainability
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;

// Custom hook for payroll data management
const usePayrollData = () => {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayrollData = useCallback(async (selectedYear, selectedMonth) => {
    setLoading(true);
    setError(null);

    try {
      const data = await payrollService.fetchMonthlyPayroll(selectedYear, selectedMonth);

      let processedData = [];
      if (Array.isArray(data)) {
        processedData = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        processedData = data.data;
      } else if (data && data.payroll && Array.isArray(data.payroll)) {
        processedData = data.payroll;
      } else if (data && typeof data === 'object') {
        processedData = [data];
      }
      setPayrollData(processedData);

    } catch (err) {
      setError(err.message);
      setPayrollData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayrollData(year, month);
  }, [year, month, fetchPayrollData]);

  return {
    year,
    month,
    payrollData,
    loading,
    error,
    setYear,
    setMonth,
    refetch: () => fetchPayrollData(year, month)
  };
};

// Utility function to format currency in Indian Rupees
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount || 0);
};

// FIXED: Enhanced utility function to safely get salary value from different possible field names
const getSalaryValue = (record) => {
  const possibleFields = [
    'payableSalary',
    'salary',
    'amount',
    'totalSalary',
    'netSalary',
    'grossSalary',
    'finalSalary',
    'payableAmount',
    'netAmount',
    'totalAmount'
  ];

  for (const field of possibleFields) {
    if (record[field] !== undefined && record[field] !== null && record[field] !== '') {
      // Handle both string and number values
      let value;
      if (typeof record[field] === 'string') {
        // Remove any currency symbols, commas, and whitespace
        const cleanedValue = record[field].replace(/[₹$,\s]/g, '');
        value = parseFloat(cleanedValue);
      } else {
        value = parseFloat(record[field]);
      }

      if (!isNaN(value) && isFinite(value)) {
        return value;
      }
    }
  }

  console.warn('No valid salary field found in record:', record);
  return 0;
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded mb-4"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex space-x-4 mb-3">
        <div className="h-4 bg-gray-200 rounded flex-1"></div>
        <div className="h-4 bg-gray-200 rounded flex-1"></div>
        <div className="h-4 bg-gray-200 rounded flex-1"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    ))}
  </div>
);

// Error display component
const ErrorMessage = ({ error, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
    <div className="flex-1">
      <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
      <p className="text-sm text-red-600 mt-1">{error}</p>
      <button
        onClick={onRetry}
        className="mt-2 text-sm text-red-600 hover:text-red-800 underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
      >
        Try again
      </button>
    </div>
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="text-center py-12">
    <Users className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-4 text-lg font-medium text-gray-900">No payroll data found</h3>
    <p className="mt-2 text-sm text-gray-500">
      No payroll records exist for the selected month and year.
    </p>
  </div>
);


// Main component
const MonthlyPayroll = () => {
  const {
    year,
    month,
    payrollData,
    loading,
    error,
    setYear,
    setMonth,
    refetch
  } = usePayrollData();

  // Year options for better UX
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = CURRENT_YEAR - 5; i <= CURRENT_YEAR + 1; i++) {
      years.push(i);
    }
    return years;
  }, []);

  // Event handlers with validation
  const handleYearChange = useCallback((e) => {
    const newYear = parseInt(e.target.value, 10);
    if (!isNaN(newYear) && newYear >= 2000 && newYear <= 2100) {
      setYear(newYear);
    }
  }, [setYear]);

  const handleMonthChange = useCallback((e) => {
    const newMonth = parseInt(e.target.value, 10);
    if (!isNaN(newMonth) && newMonth >= 1 && newMonth <= 12) {
      setMonth(newMonth);
    }
  }, [setMonth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Monthly Payroll</h1>
              <p className="text-sm text-gray-600">
                {MONTHS[month - 1]} {year} • {payrollData.length} employees
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                id="year-select"
                value={year}
                onChange={handleYearChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-label="Select year"
              >
                {yearOptions.map((yearOption) => (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <select
                id="month-select"
                value={month}
                onChange={handleMonthChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-label="Select month"
              >
                {MONTHS.map((monthName, index) => (
                  <option key={index + 1} value={index + 1}>
                    {monthName}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-2 flex items-end">
              <button
                onClick={refetch}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                aria-label="Refresh payroll data"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                <span>{loading ? 'Loading...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {error ? (
            <div className="p-6">
              <ErrorMessage error={error} onRetry={refetch} />
            </div>
          ) : loading ? (
            <div className="p-6">
              <LoadingSkeleton />
            </div>
          ) : payrollData.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-hidden">
              {/* Table for larger screens */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Period
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Working Days
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Paid Days
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payable Salary
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payrollData.map((record, index) => {
                        const salaryValue = getSalaryValue(record);
                        const isZeroSalary = salaryValue === 0;

                        return (
                          <tr
                            key={record._id || index}
                            className={`hover:bg-gray-50 transition-colors ${isZeroSalary ? 'bg-red-50' : ''}`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {record.employeeName || 'Naa/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {record.employeeCode || 'N/A'}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {MONTHS[(parseInt(record.month) || month) - 1]} {record.year || year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.totalWorkingDays || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={record.totalPaidDays === 0 ? 'text-red-600 font-medium' : ''}>
                                {record.totalPaidDays || 0}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <div>
                                <div className={`font-medium ${isZeroSalary ? 'text-red-600' : 'text-gray-900'}`}>
                                  {formatCurrency(salaryValue)}
                                </div>
                                {isZeroSalary && (
                                  <div className="text-xs text-red-500 flex items-center justify-end mt-1">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Zero salary detected
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card layout for smaller screens */}
              <div className="lg:hidden p-4 space-y-4">
                {payrollData.map((record, index) => {
                  const salaryValue = getSalaryValue(record);
                  const isZeroSalary = salaryValue === 0;

                  return (
                    <div
                      key={record._id || index}
                      className={`rounded-lg p-4 border border-gray-200 ${isZeroSalary ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {record.employeeName || 'N/aaA'}
                          </h3>
                          <p className="text-xs text-gray-500">ID: {record.employeeCode || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${isZeroSalary ? 'text-red-600' : 'text-gray-900'}`}>
                            {formatCurrency(salaryValue)}
                          </p>
                          {isZeroSalary && (
                            <div className="text-xs text-red-500 flex items-center justify-end mt-1">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Zero salary
                            </div>
                          )}
                          <div className="text-xs text-gray-500">
                            {MONTHS[(parseInt(record.month) || month) - 1]} {record.year || year}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Working Days:</span>
                          <span className="ml-1 font-medium">{record.totalWorkingDays || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Paid Days:</span>
                          <span className={`ml-1 font-medium ${record.totalPaidDays === 0 ? 'text-red-600' : ''}`}>
                            {record.totalPaidDays || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyPayroll;