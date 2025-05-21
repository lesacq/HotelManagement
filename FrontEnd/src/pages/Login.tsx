import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";

interface LoginResponse {
  message: string;
  staff: {
    StaffId: string;
    name: string;
    position: string;
    role: string;
    email: string;
  };
}

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    const [{ loading, error }, api] = useApi<LoginResponse>();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log("[Login] Attempting login with StaffId:", email);
        
        const response = await api.post('/api/staff/login', {
            StaffId: email,
            password
        });
        
        if (response) {
            console.log("[Login] Login successful");
            // Store user data in local storage
            localStorage.setItem("user", JSON.stringify(response.data.staff));
            toast.success("Login successful!");
            navigate("/home");
        }
    };

    return (
        <div className="flex bg-gray-100 w-full h-screen items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-96">
                <h1 className="font-bold text-3xl text-center text-[#079b31] mb-4">Hotel Management System</h1>
                <h2 className="text-xl text-center text-gray-700 mb-6">Login</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                <form className="flex flex-col" onSubmit={handleLogin}>
                    <input
                        className="border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#079b31]"
                        type="text"
                        placeholder="Staff ID"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <input
                        className="border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-[#079b31]"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className={`${loading ? 'bg-[#8abe9e]' : 'bg-[#079b31] hover:bg-[#067a24]'} text-white rounded-lg p-3 transition duration-200 flex justify-center items-center`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </>
                        ) : "Login"}
                    </button>
                </form>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                    <p>Use your Staff ID and password to log in</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
