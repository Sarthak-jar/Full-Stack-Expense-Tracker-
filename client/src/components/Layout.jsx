import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
