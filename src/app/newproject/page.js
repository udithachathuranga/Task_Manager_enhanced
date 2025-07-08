// 'use client';
// import React, { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { jwtDecode } from "jwt-decode";
// import Cookies from 'js-cookie';

// function NewProject() {
//     const [p_name, setP_name] = React.useState('');
//     const [p_title, setP_title] = React.useState('');
//     const [p_description, setP_description] = React.useState('');
//     const [p_status_id, setP_status_id] = React.useState('');
//     const [start_date, setStart_date] = React.useState('');
//     const [end_date, setEnd_date] = React.useState('');
//     const [assigns, setAssigns] = React.useState([]);
//     const [created_by_id, setCreated_by_id] = React.useState("");
//     const [allUsers, setAllUsers] = React.useState([]);
//     const [isJobDropdownOpen, setIsJobDropdownOpen] = React.useState(false);

//     const router = useRouter();

//     useEffect(() => {

//         const token = Cookies.get('token');
//         console.log('token: ', token);

//         if (token) {
//             const decoded = jwtDecode(token);
//             console.log("Decoded token:", decoded);
//             const role = decoded.role;
//             console.log("Role: ", role);
//             setCreated_by_id(decoded.userId)
//             console.log("user_id: ", decoded.userId);
//             if (role != "1") {
//                 alert("You are not authorized to this page!!");
//                 router.push('/');
//             }
//         } else {
//             console.warn('No token found');
//         }

//         const fetchUsers = async () => {
//             try {
//                 console.log("begore");
//                 const res = await fetch('/api/all_users');
//                 if (!res.ok) throw new Error("Failed to fetch users");
//                 const allUsers = await res.json();
//                 console.log(allUsers);

//                 console.log("Users in the projectttt:", allUsers);
//                 setAllUsers(allUsers);
//             } catch (err) {
//                 console.error("Error fetching users:", err);
//                 return [];
//             }
//         }
//         fetchUsers();

//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log("created by: ", created_by_id);
//         // Create a new project object
//         const res = await fetch('/api/newproject', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 p_name,
//                 p_title,
//                 p_description,
//                 p_status_id,
//                 start_date,
//                 end_date,
//                 created_by_id,
//                 assigns
//             }),
//         })
//         if (res.ok) {
//             console.log("Project Submitted");
//             alert("Project created successfully");
//             console.log("created by: ", created_by_id);
//             router.push('/');
//         } else {
//             alert("Error in project submitting!!");
//             console.log("project was not submited!!");
//         }
//     };

//     return (
//         <div className="bg-white">
//             <div className="absolute top-1/2 left-1/2 bg-white p-10 rounded-lg opacity-80 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] shadow-2xl">
//                 <h1 className="text-center text-6xl mb-8 w-full">Add Project</h1>

//                 <form className="px-20 mx-auto" onSubmit={handleSubmit}>
//                     <div className='flex gap-4 w-full'>

//                         <div className="mb-5 w-96">
//                             <label htmlFor="p_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                                 Project Name
//                             </label>
//                             <input
//                                 type="text"
//                                 id="p_name"
//                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                                 placeholder="Project Name"
//                                 value={p_name}
//                                 onChange={(e) => setP_name(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div className="mb-5 w-96">
//                             <label htmlFor="p_title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                                 Project Title
//                             </label>
//                             <input
//                                 type="text"
//                                 id="p_title"
//                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                                 value={p_title}
//                                 onChange={(e) => setP_title(e.target.value)}
//                                 required
//                             />
//                         </div>

//                     </div>

//                     <div className="mb-5 w-full">
//                         <label htmlFor="p_description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                             Description
//                         </label>
//                         <input
//                             type="text"
//                             id="p_description"
//                             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                             value={p_description}
//                             onChange={(e) => setP_description(e.target.value)}
//                         //required
//                         />
//                     </div>

//                     <div className='flex gap-4 w-full'>

//                         <div className="mb-5 w-96">
//                             <label htmlFor="start_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                                 Start Date
//                             </label>
//                             <input
//                                 type="date"
//                                 id="start_date"
//                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                                 placeholder="YYYY-MM-DD"
//                                 value={start_date}
//                                 onChange={(e) => setStart_date(e.target.value)}
//                             //required
//                             />
//                         </div>
//                         <div className="mb-5 w-96">
//                             <label htmlFor="end_date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                                 End Date
//                             </label>
//                             <input
//                                 type="date"
//                                 id="end_date"
//                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                                 value={end_date}
//                                 onChange={(e) => setEnd_date(e.target.value)}
//                             //required
//                             />
//                         </div>

//                     </div>

//                     <div className='flex gap-4 w-full'>
//                         <div className="mb-5 w-96">
//                             <label htmlFor="p_status_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                                 Status
//                             </label>
//                             <select
//                                 id="p_status_id"
//                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                                 value={p_status_id}
//                                 onChange={(e) => setP_status_id(e.target.value)}
//                                 required
//                             >
//                                 <option value=''>Select status</option>
//                                 <option value='1'>Public</option>
//                                 <option value='2'>Private</option>
//                             </select>

//                         </div>
                    
//                         <div className="mb-5 w-96">
//                             <label htmlFor="assigns" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                                 Assigns
//                             </label>
//                             <button
//                                 type="button"
//                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                                 onClick={() => setIsJobDropdownOpen(!isJobDropdownOpen)}
//                             >
//                                 {assigns.length > 0 ? `${assigns.length} selected` : "Add User"}
//                                 <span className="ml-1">▼</span>
//                             </button>
//                             {isJobDropdownOpen && (
//                                 <div className="absolute z-10 mt-1 w-56 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
//                                     <div className="p-2">
//                                         {allUsers.map((user, index) => (
//                                             <div
//                                                 key={user.u_id}
//                                                 className="px-3 py-1.5 hover:bg-gray-100 rounded text-gray-800"
//                                             >
//                                                 <label className="flex items-center cursor-pointer">
//                                                     <input
//                                                         type="checkbox"
//                                                         className="mr-2 h-4 w-4 accent-blue-600"
//                                                         value={user.u_id}
//                                                         checked={assigns.includes(user.u_id)}
//                                                         onChange={(e) => {
//                                                             const userId = user.u_id;
//                                                             const updatedList = e.target.checked
//                                                                 ? [...assigns, userId]
//                                                                 : assigns.filter(id => id !== userId);

//                                                             setAssigns(updatedList);
//                                                             console.log("Assigns:", updatedList);
//                                                         }}
//                                                     />
//                                                     <span className="text-gray-800">{user.u_name}</span>
//                                                 </label>
//                                             </div>
//                                         ))}

//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                         {/* //////////////////////////////////////////////////////////////////////////// */}
//                     </div>

//                     <div className="gap-4 width-full flex justify-end">
//                         <button
//                             type="button"
//                             onClick={() => router.push('/')}
//                             className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mt-3 right-0"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mt-3 right-0"
//                         >
//                             Create Project
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default NewProject;
