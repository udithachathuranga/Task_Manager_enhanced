// "use client";
// import Link from 'next/link'
// import React, { useEffect, useState } from 'react'

// function Sidebar({ user_id, role, setTasklist, setTopic, setIsEnableAddTask, setCurrentProjectId }) {
//     const [projects, setProjects] = useState();
//     const [users, setUsers] = useState();
//     const [contextMenu, setContextMenu] = useState(null); // { x, y, projectId }
//     const [contextMenu_user, setContextMenu_user] = useState(null); // { x, y, userId }

//     useEffect(() => {
//         const fetchProjects = async () => {
//             if (role === "1") {
//                 // Admin: fetch all projects
//                 const res = await fetch('/api/all_projects');
//                 const data = await res.json();
//                 setProjects(data);
//                 console.log("All projects:", data);
//             } else {
//                 // Non-admin: fetch only user's projects
//                 const res = await fetch('/api/user-projects', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ user_id }),
//                 });
//                 const data = await res.json();
//                 setProjects(data);
//                 console.log("User projects:", projects);
//             }
//         };

//         const fetchUsers = async () => {
//             if (role === "1") {
//                 // Admin: fetch all users
//                 const res = await fetch('/api/all_users');
//                 const data = await res.json();
//                 setUsers(data);
//                 console.log("All users:", data);
//             }
//         };

//         if (role) {
//             fetchProjects();
//             fetchUsers();
//         }
//     }, [role]); // depend on role so it runs after it's available

//     const handleAllClick = async () => {
//         setTopic("All");
//         if (role == "1") {
//             //fetch all tasks
//             const res = await fetch('/api/all_tasks');
//             const data = await res.json();
//             setTasklist(data);
//             console.log("All tasks:", data);
//         } else {
//             //fetch tasks according to user id
//             const res = await fetch(`/api/user_tasks?user_id=${user_id}`);
//             const tasks = await res.json();
//             setTasklist(tasks);
//             console.log("User tasks:", tasks);
//         }
//     }
//     const handleProjectClick = async (p_id, p_name) => {
//         setCurrentProjectId(p_id);
//         setIsEnableAddTask(true);
//         setTopic(p_name);
//         if (role == "1") {
//             //fetch tasks accoring to project id
//             const res = await fetch(`/api/project_tasks?p_id=${p_id}`);
//             const tasks = await res.json();
//             setTasklist(tasks);
//             console.log("Project tasks:", tasks);
//         } else {
//             //fetch tasks according to project id and user id
//             const res = await fetch(`/api/user_project_tasks?user_id=${user_id}&project_id=${p_id}`);
//             const tasks = await res.json();
//             setTasklist(tasks);
//             console.log("Project-User tasks:", tasks);
//         }
//         // console.log("project tasks: ",tasklist);
//     }
//     const handleUserClick = async (u_id, u_name) => {
//         setIsEnableAddTask(false);
//         setTopic(u_name);
//         if (role == "1") {
//             //fetch tasks according to user id
//             const res = await fetch(`/api/user_tasks?user_id=${u_id}`);
//             const tasks = await res.json();
//             setTasklist(tasks);
//             console.log("User tasks:", tasks);
//         }
//         // console.log("user tasks: ",tasklist);
//     }

//     const handleContextMenu = (e, projectId) => {
//         e.preventDefault();
//         setContextMenu({
//             x: e.pageX,
//             y: e.pageY,
//             projectId,
//         });
//     };

//     const handleContextMenu_user = (e, userId) => {
//         e.preventDefault();
//         setContextMenu_user({
//             x: e.pageX,
//             y: e.pageY,
//             userId,
//         });
//     };



//     const handleDeleteProject = async (projectId) => {
//         const confirmed = window.confirm("Are you sure you want to delete this project?");
//         if (confirmed) {
//             try {
//                 await deleteProject(projectId);//api call
//                 alert('Project deleted!');
//                 setContextMenu(null); // close the context menu
//                 setProjects((prev) => prev.filter((project) => project.p_id !== projectId));
//             } catch (error) {
//                 console.error('Delete failed:', error);
//             }
//         }
//     };

//     const handleDeleteUser = async (userId) => {
//         const confirmed = window.confirm("Are you sure you want to delete this user?");
//         if (confirmed) {
//             try {
//                 await deleteUser(userId);//api call
//                 alert('User deleted!');
//                 setContextMenu_user(null); // close the user context menu
//                 setUsers((prev) => prev.filter((user) => user.u_id !== userId));
//             } catch (error) {
//                 console.error('Delete failed:', error);
//             }
//         }
//     };

//     const deleteProject = async (projectId) => {
//         try {
//             const response = await fetch(`/api/delete_project/${projectId}`, {
//                 method: 'DELETE',
//             });
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to delete project');
//             }
//             return true; // success
//         } catch (error) {
//             console.error('Error deleting project:', error);
//             throw error;
//         }
//     };

//     const deleteUser = async (userId) => {
//         try {
//             const response = await fetch(`/api/delete_user/${userId}`, {
//                 method: 'DELETE',
//             });
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Failed to delete user');
//             }
//             return true; // success
//         } catch (error) {
//             console.error('Error deleting user:', error);
//             throw error;
//         }
//     };

//     return (
//         <aside id="separator-sidebar" className="fixed top-0 left-0 w-64 h-screen overflow-y-auto transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">

//             {/*Projects*/}
//             <div className="px-3 py-4 overflow-y-auto bg-gray-200 dark:bg-gray-800">

//                 {/* all projects */}
//                 <ul className="pt-4 mb-8 space-y-2 font-medium">
//                     <li>
//                         <div onClick={handleAllClick} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
//                             <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
//                                 <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
//                             </svg>
//                             <span className="flex-1 ms-3 whitespace-nowrap">All Tasks</span>
//                         </div>
//                     </li>
//                 </ul>

//                 <div className="bg-gray-300 dark:bg-gray-700 rounded-lg text-gray-900  dark:text-white">
//                     <h1 className="text-3xl font-bold text-white text-center py-4 rounded-md">
//                         Projects
//                     </h1>
//                 </div>



//                 {/* projects */}
//                 <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
//                     {projects?.map((project, index) => (
//                         <li key={project.p_id}>
//                             <div onClick={() => handleProjectClick(project.p_id, project.p_name)}
//                                 onContextMenu={(e) => handleContextMenu(e, project.p_id)}
//                                 className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
//                                 <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
//                                     <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
//                                 </svg>
//                                 <span className="flex-1 ms-3 whitespace-nowrap">{project.p_name}</span>
//                                 {/* <button>
//                                     <svg class="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg">
//                                         <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 6h.01M12 12h.01M12 18h.01" />
//                                     </svg>
//                                 </button> */}
//                             </div>

//                         </li>
//                     ))}
//                 </ul>

//                 {/* adding a new project */}
//                 {role == "1" &&
//                     <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
//                         <li>
//                             <Link href="/newproject" className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
//                                 <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
//                                     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
//                                 </svg>
//                                 <span className="ms-3">Add a New Project</span>
//                             </Link>
//                         </li>
//                     </ul>
//                 }
//             </div>

//             {/* User */}
//             {role == "1" &&
//                 <div className="px-3 py-4 bg-gray-200 dark:bg-gray-800">

//                     <div className="bg-gray-300 dark:bg-gray-700 rounded-lg text-gray-900  dark:text-white">
//                         <h1 className="text-3xl font-bold text-white py-4 rounded-md text-center">
//                             Users
//                         </h1>
//                     </div>

//                     <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
//                         {users?.map((user, index) => (
//                             <li key={user.u_id}>
//                                 <div onClick={() => handleUserClick(user.u_id, user.u_name)}
//                                     onContextMenu={(e) => handleContextMenu_user(e, user.u_id)}
//                                     className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
//                                     <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
//                                         <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
//                                     </svg>
//                                     <span className="flex-1 ms-3 whitespace-nowrap">{user.u_name}</span>
//                                     {/* <button>
//                                         <svg class="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg">
//                                             <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 6h.01M12 12h.01M12 18h.01" />
//                                         </svg>
//                                     </button> */}

//                                 </div>
//                             </li>
//                         ))}

//                     </ul>

//                     <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
//                         <li>
//                             <Link href="/newuser" className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
//                                 <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
//                                     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
//                                 </svg>
//                                 <span className="ms-3">Add a New User</span>
//                             </Link>
//                         </li>
//                     </ul>
//                 </div>
//             }

//             {contextMenu && (
//                 <button
//                     style={{ top: contextMenu.y, left: contextMenu.x }}
//                     className="z-50 bg-red-500 text-white hover:bg-red-300 rounded shadow"
//                     onClick={() => handleDeleteProject(contextMenu.projectId)}
//                 >
//                     Delete Project
//                 </button>
//             )}

//             {contextMenu_user && (
//                 <button
//                     style={{ top: contextMenu_user.y, left: contextMenu_user.x }}
//                     className="z-50 bg-red-500 text-black hover:bg-red-300 rounded shadow"
//                     onClick={() => handleDeleteUser(contextMenu_user.userId)}
//                 >
//                     Delete User
//                 </button>
//             )}

//         </aside>
//     )
// }

// export default Sidebar