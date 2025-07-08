// 'use client';
// import React from 'react';
// import { useRouter } from 'next/navigation';

// function NewProject() {
//     const [p_name, setP_name] = React.useState('');
//     const [p_title, setP_title] = React.useState('');
//     const [p_description, setP_description] = React.useState('');
//     const [p_status_id, setP_status_id] = React.useState('');
//     const [start_date, setStart_date] = React.useState('');
//     const [end_date, setEnd_date] = React.useState('');
//     const [assigns, setAssigns] = React.useState('');

//     const router = useRouter();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
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
//                 assigns
//             }),
//         })
//         console.log("Project Submitted");
//         alert("Project created successfully");
//         router.push('/');
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
//                             <select
//                                 id="assigns"
//                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                                 value={assigns}
//                                 onChange={(e) => setAssigns(e.target.value)}
//                                 required
//                             >
//                                 <option value="">Add user</option>
//                                 <option value="1">user 1</option>
//                                 <option value="2">user 2</option>
//                             </select>

//                         </div>

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
