import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';

const SecretAdminAccess = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  const SECRET_ACCESS_CODE = 'LALNOVA2024ADMIN';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSecretCodeSubmit = (e) => {
    e.preventDefault();
    if (secretCode === SECRET_ACCESS_CODE) {
      setIsValid(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      alert('Invalid access code');
      setSecretCode('');
    }
  };

  if (isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="text-green-600 mb-4">
            <Shield size={64} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Access Granted</h2>
          <p className="text-gray-600 mb-4">Redirecting to admin login...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="mx-auto text-red-600 mb-4" size={48} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access</h1>
          <p className="text-gray-600">Enter the secret access code to continue</p>
        </div>

        <form onSubmit={handleSecretCodeSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secret Access Code
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter secret code..."
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Verify Access
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecretAdminAccess;
