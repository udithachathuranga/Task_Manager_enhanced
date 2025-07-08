'use client'
import React, { useEffect } from 'react';
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

function Signup() {

    const [u_name, setU_name] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [c_password, setCpassword] = useState('')
    const [role_id, setRole_Id] = useState('')
    const router = useRouter();

    useEffect(() => {
    
            const token = Cookies.get('token');
            console.log('token: ', token);
    
            if (token) {
                const decoded = jwtDecode(token);
                console.log("Decoded token:", decoded);
                const role = decoded.role;
                console.log("Role: ",role);
                if (role != "1") {
                    alert("You are not authorized to this page!!");
                    router.push('/');
                }
            } else {
                console.warn('No token found');
            }
        }, []);

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password == c_password) {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    u_name,
                    email,
                    password,
                    role_id
                }),
            })
            console.log("Form submitted");
            alert("User Registered successfully");
            router.push('/');
        } else {
            alert("Password and Confirm Password do not match")
        }

    }

    return (
        <div>
            <div className='absolute top-1/2 left-1/2 bg-white p-10 rounded-lg opacity-80 transform -translate-x-1/2 -translate-y-1/2 w-[600px] shadow-2xl'>
                <h1 className='text-center text-6xl mb-8 w-full'>Add User</h1>
                <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>

                    <div className="flex gap-4 w-96">
                        <div className="mb-5">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User name</label>
                            <input
                                type="text"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="John Doe"
                                value={u_name}
                                onChange={(e) => setU_name(e.target.value)}
                                required />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Role</label>
                            <select
                                id="role"
                                name="role"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={role_id}
                                onChange={(e) => setRole_Id(e.target.value)}
                                required>
                                <option value=''>Select your role</option>
                                <option value='1'>Admin</option>
                                <option value='2'>Manager</option>
                                <option value='3'>Staff</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >User email</label>
                        <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="name@flowbite.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required />
                    </div>

                    <div className="flex gap-4 w-96">
                        <div className="mb-5">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User password</label>
                            <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="c_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                            <input type="password" id="c_password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={c_password}
                                onChange={(e) => setCpassword(e.target.value)}
                                required />
                        </div>
                    </div>

                    <div className="gap-4 width-full flex justify-end">
                        <button
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mt-3 right-0"
                            onClick={() => router.push('/')}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mt-3 right-0">
                            Create User
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Signup