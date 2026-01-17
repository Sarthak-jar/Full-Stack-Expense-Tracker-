import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 24, className = "" }) => {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <Loader2 className="animate-spin text-blue-500" size={size} />
        </div>
    );
};

export default Spinner;
