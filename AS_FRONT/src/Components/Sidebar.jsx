import { useState, useEffect, useRef } from 'react';
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
    ChevronRight,
    Menu,
    ChevronLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';


const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [activeItem, setActiveItem] = useState('employees');
    const [hoveredItem, setHoveredItem] = useState(null);
    const [expandedSubmenu, setExpandedSubmenu] = useState(null);
    const [isHovering, setIsHovering] = useState(false);
    const hoverTimerRef = useRef(null);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, hasSubmenu: false, path: '/' },

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
            submenu: [
                { label: 'Schedules', path: '/shift/schedules' },
                { label: 'Time Off', path: '/shift/time-off' },
                { label: 'Rotation', path: '/shift/rotation' }
            ]
        },

        {
            id: 'leaves',
            label: 'Leaves & Holidays',
            icon: Calendar,
            hasSubmenu: true,
            submenu: [
                { label: 'Leave Requests', path: '/leaves/requests' },
                { label: 'Holiday Calendar', path: '/leaves/calendar' },
                { label: 'Policy', path: '/leaves/policy' }
            ]
        },

        { id: 'approval', label: 'Approval Requests', icon: CheckSquare, hasSubmenu: false },

        {
            id: 'payroll',
            label: 'Payroll',
            icon: DollarSign,
            hasSubmenu: true,
            tag: 'New',
            submenu: [
                { label: 'Process Payroll', path: '/payroll/process' },
                { label: 'Salary Structure', path: '/payroll/salary-structure' },
                { label: 'Tax Settings', path: '/payroll/tax-settings' }
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
            submenu: [
                { label: 'Roles', path: '/user/roles' },
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


    const handleMouseEnter = () => {
        if (collapsed) {
            // Clear any existing timer to prevent multiple state changes
            if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
            }

            // Set a small delay before expanding to avoid unwanted triggers
            hoverTimerRef.current = setTimeout(() => {
                setIsHovering(true);
            }, 200);
        }
    };

    const handleMouseLeave = () => {
        // Clear any existing timer
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
        }

        // Set a small delay before collapsing again to improve UX
        hoverTimerRef.current = setTimeout(() => {
            setIsHovering(false);
        }, 300);
    };

    // Effect to handle auto-expand/collapse on hover
    useEffect(() => {
        // Only change the actual collapsed state when hovering changes
        // and we're not manually toggling
        if (isHovering && collapsed) {
            setCollapsed(false);
        } else if (!isHovering && !collapsed && hoverTimerRef.current) {
            // Only auto-collapse if it was previously expanded by hovering
            setCollapsed(true);
        }
    }, [isHovering]);

    // Clean up any timers when component unmounts
    useEffect(() => {
        return () => {
            if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
            }
        };
    }, []);

    const handleMenuClick = (item) => {
        setActiveItem(item.id);

        if (item.hasSubmenu) {
            setExpandedSubmenu(expandedSubmenu === item.id ? null : item.id);
            navigate(item.path); // Navigate programmatically
        } else if (item.path) {
            setExpandedSubmenu(null);
            navigate(item.path); // Navigate programmatically
        } else {
            setExpandedSubmenu(null);
        }
    };

    return (
        <div
            ref={sidebarRef}
            className={`h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 relative ${collapsed ? 'w-16' : 'w-64'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >

            {/* Navigation items */}
            <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto py-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeItem === item.id;
                        const isExpanded = expandedSubmenu === item.id;

                        return (
                            <div key={item.id}>
                                <div
                                    className={`
                    relative cursor-pointer my-1 mx-2 rounded-md
                    ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}
                  `}
                                    onClick={() => handleMenuClick(item)}
                                    onMouseEnter={() => collapsed && setHoveredItem(item.id)}
                                    onMouseLeave={() => collapsed && setHoveredItem(null)}
                                >
                                    <div className="py-2 px-3 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Icon size={18} className={isActive ? 'text-white' : 'text-gray-600'} />
                                            {!collapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                                        </div>
                                        {!collapsed && (
                                            <div className="flex items-center">
                                                {item.tag && (
                                                    <span className="text-xs bg-blue-100 text-blue-600 rounded px-2 py-0.5 mr-2">
                                                        {item.tag}
                                                    </span>
                                                )}
                                                {item.hasSubmenu && (
                                                    <ChevronRight
                                                        size={16}
                                                        className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Tooltip for collapsed state */}
                                    {collapsed && hoveredItem === item.id && (
                                        <div className="absolute left-full ml-2 z-10 bg-white shadow-lg rounded-md py-2 px-3 whitespace-nowrap">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-800 font-medium">{item.label}</span>
                                                {item.tag && (
                                                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded">
                                                        {item.tag}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Show submenu items in tooltip when collapsed */}
                                            {item.hasSubmenu && (
                                                <div className="mt-2 pl-2 border-l border-gray-200">
                                                    {item.submenu.map((subItem, index) => (
                                                        <Link
                                                            key={index}
                                                            to={subItem.path}
                                                            className="py-1.5 text-sm text-gray-600 hover:text-blue-500 cursor-pointer block"
                                                        >
                                                            {subItem.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Submenu items (visible when not collapsed and submenu is expanded) */}
                                {!collapsed && isExpanded && item.hasSubmenu && (
                                    <div className="ml-9 mt-1 mb-2 pl-2 border-l border-gray-200">
                                        {item.submenu.map((subItem, index) => (
                                            <Link
                                                key={index}
                                                to={subItem.path}
                                                className="py-1.5 text-sm text-gray-600 hover:text-blue-500 cursor-pointer block"
                                            >
                                                {subItem.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer with contact info */}
                <div className="border-t border-gray-200 py-3 px-4 mt-auto">
                    <div
                        className="flex items-center text-gray-600 text-sm"
                        onMouseEnter={() => collapsed && setHoveredItem('contact')}
                        onMouseLeave={() => collapsed && setHoveredItem(null)}
                    >
                        {!collapsed ? (
                            <>
                                <Phone size={14} className="flex-shrink-0 text-blue-500" />
                                <span className="ml-2">Help: <span className="font-medium text-blue-500">+91 9769922344</span></span>
                            </>
                        ) : (
                            <div className="w-full flex justify-center">
                                <Phone size={16} className="text-blue-500" />

                                {/* Tooltip for contact info */}
                                {hoveredItem === 'contact' && (
                                    <div className="absolute left-full bottom-4 ml-2 z-10 bg-white shadow-lg rounded py-2 px-3 whitespace-nowrap">
                                        <span>Help: <span className="font-medium text-blue-500">+91 9769922344</span></span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
