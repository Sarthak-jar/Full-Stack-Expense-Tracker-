import { PackageOpen } from 'lucide-react';

const EmptyState = ({ message = "No data available", resetFilter }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
            <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-full mb-3">
                <PackageOpen size={32} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{message}</p>
            {resetFilter && (
                <button
                    onClick={resetFilter}
                    className="mt-2 text-sm text-blue-500 hover:underline dark:text-blue-400"
                >
                    Reset Filters
                </button>
            )}
        </div>
    );
};

export default EmptyState;
