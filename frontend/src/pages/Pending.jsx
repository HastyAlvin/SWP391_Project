import React from "react";
import { Loader2 } from "lucide-react";

const Pending = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-4 bg-gray-100 rounded-lg shadow-md">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="mt-2 text-gray-700 text-lg font-medium">Pending approval...</p>
            <p className="text-gray-500 text-sm">Your request is being processed by the system.</p>
        </div>
    );
};

export default Pending;