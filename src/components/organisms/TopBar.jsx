import { useContext } from 'react';
import { useSelector } from 'react-redux';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { AuthContext } from '@/App';

const TopBar = () => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  const handleSearch = (query) => {
    console.log('Searching for:', query);
  };
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-lg">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Sync Status */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span>All services synced</span>
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" className="relative p-2">
            <ApperIcon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </span>
          </Button>
          
          {/* User Menu with Logout */}
          {isAuthenticated && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {user?.firstName || user?.name || 'User'}
              </span>
              <Button 
                variant="ghost" 
                onClick={logout}
                className="flex items-center space-x-1 text-gray-600 hover:text-error"
              >
                <ApperIcon name="LogOut" size={16} />
                <span>Logout</span>
              </Button>
            </div>
          )}
          
          {/* Quick Actions */}
          <Button variant="accent" className="flex items-center space-x-2">
            <ApperIcon name="Plus" size={16} />
            <span>Quick Add</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;