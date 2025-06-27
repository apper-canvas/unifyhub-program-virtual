import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'Layout' },
    { name: 'Inbox', href: '/inbox', icon: 'Inbox' },
    { name: 'Calendar', href: '/calendar', icon: 'Calendar' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
    { name: 'Projects', href: '/projects', icon: 'Folder' },
    { name: 'Rules', href: '/rules', icon: 'Zap' },
    { name: 'Services', href: '/services', icon: 'Settings' },
  ];
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
    {/* Logo */}
    <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
            <div
                className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Layers" className="text-white" size={20} />
            </div>
            <h1
                className="font-display font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">UnifyHub
                          </h1>
        </div>
    </div>
    {/* Navigation */}
    <nav className="flex-1 p-4">
        <div className="space-y-1">
            {navigation.map(item => {
                const isActive = location.pathname === item.href;

                return (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={(
                            {
                                isActive
                            }
                        ) => `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm" : "text-gray-700 hover:bg-primary/5 hover:text-primary"}`}>
                        {(
                            {
                                isActive
                            }
                        ) => <>
                            <ApperIcon
                                name={item.icon}
                                className={`mr-3 h-5 w-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-primary"}`} />
                            {item.name}
                            {isActive && <motion.div
                                layoutId="activeTab"
                                className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                        </>}
                    </NavLink>
                );
            })}
        </div>
    </nav>
    {/* Footer */}
    {/* Footer */}
    <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
            <div
                className="w-8 h-8 bg-gradient-to-br from-accent to-emerald-400 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="text-white" size={16} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName || user?.name || "Authenticated User"}
                </p>
                <p className="text-xs text-gray-500">
                    {user?.emailAddress || "Connected to services"}
                </p>
            </div>
        </div>
    </div></div>
  );
};

export default Sidebar;