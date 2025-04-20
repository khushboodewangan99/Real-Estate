import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { OAuth } from '../components/OAuth';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password } = formData;
    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get('content-type');

      if (!res.ok) {
        let errorMsg = 'Something went wrong!';
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } else {
          // Fallback in case response is not JSON
          const text = await res.text();
          console.warn('Non-JSON response:', text);
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      console.log('Signup success:', data);

      setLoading(false);
      navigate('/sign-in');
    } catch (error) {
      console.error('Signup error:', error.message);
      setLoading(false);
      setError(error.message || 'Signup failed');
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Enter your username'
          className='border p-3 rounded-lg'
          id='username'
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type='email'
          placeholder='Enter your email'
          className='border p-3 rounded-lg'
          id='email'
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter your password'
            id='password'
            value={formData.password}
            onChange={handleChange}
            className='w-full rounded-[0.5rem] p-[12px] pr-10 text-richblack-5 border'
            required
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute right-3 top-[14px] z-[10] cursor-pointer'
          >
            {showPassword ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
        </label>
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-500'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
};
