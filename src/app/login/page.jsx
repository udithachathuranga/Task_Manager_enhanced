'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

function Login() {
  const [u_name, setU_name] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ u_name, password }),
  });

  const data = await res.json();

  if (res.ok) {
    alert('Login successful!');
    router.push('/');
  } else {
    alert(data.error || 'Login failed');
  }
};

  return (
    <div className="bg-white">
      <div className="absolute top-1/2 left-1/2 bg-white p-10 rounded-lg opacity-80 transform -translate-x-1/2 -translate-y-1/2 w-96 shadow-2xl">
        <h1 className="text-center text-6xl mb-8 w-full">Log In</h1>

        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>

          <div className="mb-5">
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your username
            </label>
            <input
              type="text"
              id="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="John Doe"
              value={u_name}
              onChange={(e) => setU_name(e.target.value)}
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-start mb-5">
            <div className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300"
              />
            </div>
            <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Remember me
            </label>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Log in
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;
