import React from "react";
import { Ban } from "lucide-react";

const Deactive = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-4 bg-red-100 rounded-lg shadow-md">
      <Ban className="w-8 h-8 text-red-500" />
      <p className="mt-2 text-gray-700 text-lg font-medium">Account Deactivated</p>
      <p className="text-gray-500 text-sm">Your seller account has been deactivated. Please contact support for assistance.</p>
    </div>
  );
};

export default Deactive;
