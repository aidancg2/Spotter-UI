import { useState } from 'react';
import { Mail, Lock, Phone, User, Calendar, ArrowLeft, AlertCircle } from 'lucide-react';

interface SignUpProps {
  onSignUp: (userData: SignUpData) => void;
  onBack: () => void;
}

export interface SignUpData {
  email: string;
  phoneNumber: string;
  password: string;
  displayName: string;
  username: string;
  birthday: string;
}

// Mock database of existing users
const existingUsers = [
  { email: 'john@example.com', phoneNumber: '+1234567890', username: 'john_doe' },
  { email: 'jane@example.com', phoneNumber: '+0987654321', username: 'jane_smith' },
];

export function SignUp({ onSignUp, onBack }: SignUpProps) {
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    phoneNumber: '',
    password: '',
    displayName: '',
    username: '',
    birthday: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    } else if (existingUsers.some(u => u.email === formData.email)) {
      newErrors.email = 'This email is already registered';
    }

    // Phone number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (existingUsers.some(u => u.phoneNumber === formData.phoneNumber)) {
      newErrors.phoneNumber = 'This phone number is already registered';
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (existingUsers.some(u => u.username === formData.username)) {
      newErrors.username = 'This username is already taken';
    }

    // Display name validation
    if (!formData.displayName) {
      newErrors.displayName = 'Display name is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Birthday validation
    if (!formData.birthday) {
      newErrors.birthday = 'Birthday is required';
    } else {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.birthday = 'You must be at least 13 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSignUp(formData);
    }
  };

  const handleInputChange = (field: keyof SignUpData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to login</span>
        </button>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-neutral-400">
            Join Spottr and start your fitness journey
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Email *
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                className={`w-full pl-12 pr-4 py-3 bg-neutral-900 border ${
                  errors.email ? 'border-red-500' : 'border-neutral-800'
                } rounded-lg focus:outline-none focus:border-cyan-500 transition-colors`}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                <AlertCircle size={14} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <Phone size={20} />
              </div>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={`w-full pl-12 pr-4 py-3 bg-neutral-900 border ${
                  errors.phoneNumber ? 'border-red-500' : 'border-neutral-800'
                } rounded-lg focus:outline-none focus:border-cyan-500 transition-colors`}
              />
            </div>
            {errors.phoneNumber && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                <AlertCircle size={14} />
                <span>{errors.phoneNumber}</span>
              </div>
            )}
          </div>

          {/* Display Name Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Display Name *
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <User size={20} />
              </div>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="John Doe"
                className={`w-full pl-12 pr-4 py-3 bg-neutral-900 border ${
                  errors.displayName ? 'border-red-500' : 'border-neutral-800'
                } rounded-lg focus:outline-none focus:border-cyan-500 transition-colors`}
              />
            </div>
            {errors.displayName && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                <AlertCircle size={14} />
                <span>{errors.displayName}</span>
              </div>
            )}
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Username *
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                @
              </div>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="johndoe123"
                className={`w-full pl-12 pr-4 py-3 bg-neutral-900 border ${
                  errors.username ? 'border-red-500' : 'border-neutral-800'
                } rounded-lg focus:outline-none focus:border-cyan-500 transition-colors`}
              />
            </div>
            {errors.username && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                <AlertCircle size={14} />
                <span>{errors.username}</span>
              </div>
            )}
          </div>

          {/* Birthday Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Birthday *
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <Calendar size={20} />
              </div>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => handleInputChange('birthday', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-neutral-900 border ${
                  errors.birthday ? 'border-red-500' : 'border-neutral-800'
                } rounded-lg focus:outline-none focus:border-cyan-500 transition-colors`}
              />
            </div>
            {errors.birthday && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                <AlertCircle size={14} />
                <span>{errors.birthday}</span>
              </div>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Password *
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Min. 8 characters"
                className={`w-full pl-12 pr-4 py-3 bg-neutral-900 border ${
                  errors.password ? 'border-red-500' : 'border-neutral-800'
                } rounded-lg focus:outline-none focus:border-cyan-500 transition-colors`}
              />
            </div>
            {errors.password && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                <AlertCircle size={14} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Confirm Password *
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }
                }}
                placeholder="Re-enter your password"
                className={`w-full pl-12 pr-4 py-3 bg-neutral-900 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-neutral-800'
                } rounded-lg focus:outline-none focus:border-cyan-500 transition-colors`}
              />
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                <AlertCircle size={14} />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-bold text-lg transition-colors shadow-lg mt-6"
          >
            Create Account
          </button>
        </form>

        {/* Terms */}
        <p className="text-center text-sm text-neutral-500 mt-6">
          By creating an account, you agree to our{' '}
          <button className="text-cyan-400 hover:text-cyan-300">Terms of Service</button>
          {' '}and{' '}
          <button className="text-cyan-400 hover:text-cyan-300">Privacy Policy</button>
        </p>
      </div>
    </div>
  );
}
