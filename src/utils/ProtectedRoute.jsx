import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../pages/actions/userSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(getUser());
    }
    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <div className="absolute inset-4 rounded-full border-4 border-purple-500 border-b-transparent animate-spin animation-delay-200"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              WorkFotos
            </span>
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl text-white font-medium">Securing your session</p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce"></div>
            <div className="w-3 h-3 rounded-full bg-purple-400 animate-bounce animation-delay-100"></div>
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce animation-delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}