import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    Users,
    Clock,
    Calendar,
    CheckSquare,
    DollarSign,
    Briefcase,
    BarChart2,
    FileText,
    User,
    Settings,
    Phone,
    ChevronRight
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [expandedSubmenu, setExpandedSubmenu] = useState(null);
    const navigate = useNavigate();


    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, hasSubmenu: false, path: '/home' },

        {
            id: 'employees',
            label: 'Employees',
            icon: Users,
            hasSubmenu: true,
            path: '/employee',
            submenu: [
                { label: 'Employees', path: '/employee' },
                { label: 'Add Employee', path: '/employee/add' },
            ]
        },

        {
            id: 'shift',
            label: 'Shift Management',
            icon: Clock,
            hasSubmenu: true,
            path: "/shift-management",
            submenu: [
                { label: 'Schedules', path: '/shift-management' },
                { label: 'Time Off', path: '/shift/time-off' },
                { label: 'Rotation', path: '/shift/rotation' }
            ]
        },

        {
            id: 'leaves',
            label: 'Leaves & Holidays',
            icon: Calendar,
            hasSubmenu: true,
            path: '/leaveapplication',
            submenu: [
                { label: 'Leave Application', path: '/leaveapplication' },
                { label: 'Leave Requests', path: '/leavestatusPage' },
                { label: 'Holiday Calendar', path: '/holidaycalender' },
                { label: 'Policy', path: '/leaves/policy' }
            ]
        },

        { id: 'approval', label: 'Approval Requests', icon: CheckSquare, hasSubmenu: false },

        {
            id: 'payroll',
            label: 'Payroll',
            icon: DollarSign,
            hasSubmenu: true,
            path: '/bulk-attendance',
            tag: 'New',
            submenu: [
                { label: 'Bulk Attendance', path: '/bulk-attendance' },
                { label: 'Monthly Payroll', path: '/monthly-payroll' },
                { label: 'Hourly Payroll', path: '/Hourly-payroll' },
                { label: 'Finalize Payroll', path: '/Finalize-payroll' },
            ]
        },

        { id: 'loans', label: 'Loans & Advances', icon: Briefcase, hasSubmenu: false },

        {
            id: 'reports',
            label: 'Reports',
            icon: BarChart2,
            hasSubmenu: true,
            submenu: [
                { label: 'Attendance', path: '/reports/attendance' },
                { label: 'Performance', path: '/reports/performance' },
                { label: 'Financial', path: '/reports/financial' }
            ]
        },

        { id: 'dynamic', label: 'Dynamic Reports', icon: FileText, hasSubmenu: false },

        {
            id: 'user',
            label: 'User Management',
            icon: User,
            hasSubmenu: true,
            path: '/usermanage',
            submenu: [
                { label: 'Roles', path: '/usermanage' },
                { label: 'Permissions', path: '/user/permissions' },
                { label: 'Activity Log', path: '/user/activity-log' }
            ]
        },

        {
            id: 'configuration',
            label: 'Configuration',
            icon: Settings,
            hasSubmenu: true,
            submenu: [
                { label: 'Company Profile', path: '/configuration/profile' },
                { label: 'Notifications', path: '/configuration/notifications' },
                { label: 'Integrations', path: '/configuration/integrations' }
            ]
        }
    ];
    const getActiveItemId = () => {
        for (const item of menuItems) {
            if (item.path && currentPath === item.path) return item.id;
            if (item.submenu) {
                for (const sub of item.submenu) {
                    if (currentPath === sub.path) return item.id;
                }
            }
        }
        return 'dashboard'; // default fallback
    };

    const activeItem = getActiveItemId();

    const handleMenuClick = (item) => {

        if (item.hasSubmenu) {
            setExpandedSubmenu(expandedSubmenu === item.id ? null : item.id);
            // Navigate to main path if it exists
            if (item.path) {
                navigate(item.path);
            }
        } else if (item.path) {
            // Navigate to path for items without submenu
            setExpandedSubmenu(null);
            navigate(item.path);
        } else {
            setExpandedSubmenu(null);
        }
    };

    const getSubmenuHeight = (itemId) => {
        const submenu = menuItems.find(item => item.id === itemId)?.submenu;
        if (!submenu) return 0;
        return submenu.length * 36 + 16; // 36px per item + padding
    };

    return (
        <>
            <style>
                {`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #f1f5f9;
                        border-radius: 10px;
                        margin: 8px 0;
                    }
                    
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: linear-gradient(45deg, #3b82f6, #6366f1);
                        border-radius: 10px;
                        transition: all 0.3s ease;
                    }
                    
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(45deg, #2563eb, #4f46e5);
                        width: 8px;
                    }

                    /* Firefox */
                    .custom-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: #3b82f6 #f1f5f9;
                    }
                    
                    .scrollbar-fade-top {
                        background: linear-gradient(180deg, rgba(248, 250, 252, 0.9) 0%, transparent 100%);
                        pointer-events: none;
                    }
                    
                    .scrollbar-fade-bottom {
                        background: linear-gradient(0deg, rgba(248, 250, 252, 0.9) 0%, transparent 100%);
                        pointer-events: none;
                    }
                `}
            </style>

            <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-white border-r border-gray-200 shadow-lg transition-all duration-300 w-64 z-40">
                {/* Scrollable Navigation Container */}
                <div className="h-[calc(100%-140px)] relative">
                    {/* Top fade overlay */}
                    <div className="absolute top-0 left-0 right-0 h-4 z-10 scrollbar-fade-top"></div>

                    {/* Scrollable content */}
                    <div className="h-full overflow-y-auto custom-scrollbar py-4 px-3 pb-6">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeItem === item.id;
                            const isExpanded = expandedSubmenu === item.id;

                            return (
                                <div key={item.id} className="mb-1">
                                    <div
                                        className={`
                                            relative cursor-pointer rounded-xl transition-all duration-300 group
                                            ${isActive
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                                                : 'text-gray-700 hover:bg-gray-100 hover:shadow-md hover:transform hover:scale-[1.01]'
                                            }
                                        `}
                                        onClick={() => handleMenuClick(item)}
                                    >
                                        <div className="py-3 px-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`
                                                    p-2 rounded-lg transition-all duration-300
                                                    ${isActive
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                                                    }
                                                `}>
                                                    <Icon size={16} />
                                                </div>
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {item.tag && (
                                                    <span className={`
                                                        text-xs px-2 py-1 rounded-full font-medium transition-all duration-300
                                                        ${isActive
                                                            ? 'bg-white/20 text-white'
                                                            : 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700'
                                                        }
                                                    `}>
                                                        {item.tag}
                                                    </span>
                                                )}
                                                {item.hasSubmenu && (
                                                    <ChevronRight
                                                        size={16}
                                                        className={`
                                                            transform transition-all duration-300 ease-in-out
                                                            ${isExpanded ? 'rotate-90' : 'rotate-0'}
                                                            ${isActive ? 'text-white' : 'text-gray-400'}
                                                        `}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Animated Submenu */}
                                    {item.hasSubmenu && (
                                        <div
                                            className="overflow-hidden transition-all duration-500 ease-in-out"
                                            style={{
                                                maxHeight: isExpanded ? `${getSubmenuHeight(item.id)}px` : '0px',
                                                opacity: isExpanded ? 1 : 0,
                                            }}
                                        >
                                            <div className="ml-6 mt-2 space-y-1">
                                                {item.submenu.map((subItem, index) => (
                                                    <Link
                                                        key={index}
                                                        to={subItem.path}
                                                        className="
                                                            flex items-center py-2 px-4 text-sm text-gray-600 
                                                            rounded-lg transition-all duration-300 hover:bg-blue-50 
                                                            hover:text-blue-600 hover:pl-6 hover:shadow-sm
                                                            border-l-2 border-transparent hover:border-blue-300
                                                        "
                                                        style={{
                                                            animationDelay: `${index * 50}ms`
                                                        }}
                                                    >
                                                        <div className="w-2 h-2 bg-gray-300 rounded-full mr-3 transition-colors duration-300 hover:bg-blue-400"></div>
                                                        {subItem.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Extra padding at bottom for better scrolling */}
                        <div className="h-4"></div>
                    </div>

                    {/* Bottom fade overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 z-10 scrollbar-fade-bottom"></div>
                </div>

                {/* Enhanced Footer */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-4 bg-gradient-to-r from-gray-50 to-blue-50">
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Phone size={16} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Need Help?</p>
                            <p className="text-sm font-semibold text-blue-600">+91 9769922344</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;