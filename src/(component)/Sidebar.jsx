"use client";
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";

function Sidebar({ user_id, role, setTasklist, setTopic, setIsEnableAddTask, setCurrentProjectId, viewSideBar, setViewSidebar }) {
    const [projects, setProjects] = useState();
    const [users, setUsers] = useState();
    const [contextMenu, setContextMenu] = useState(null); // { x, y, projectId }
    const [contextMenu_user, setContextMenu_user] = useState(null); // { x, y, userId }

    useEffect(() => {
        const fetchProjects = async () => {
            if (role === "1") {
                // Admin: fetch all projects
                const res = await fetch('/api/all_projects');
                const data = await res.json();
                setProjects(data);
                console.log("All projects:", data);
            } else {
                // Non-admin: fetch only user's projects
                const res = await fetch('/api/user-projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id }),
                });
                const data = await res.json();
                setProjects(data);
                console.log("User projects:", projects);
            }
        };

        const fetchUsers = async () => {
            if (role === "1") {
                // Admin: fetch all users
                const res = await fetch('/api/all_users');
                const data = await res.json();
                setUsers(data);
                console.log("All users:", data);
            }
        };

        if (role) {
            fetchProjects();
            fetchUsers();
        }
    }, [role]); // depend on role so it runs after it's available

    const handleAllClick = async () => {
        setTopic("All");
        if (role == "1") {
            //fetch all tasks
            const res = await fetch('/api/all_tasks');
            const data = await res.json();
            setTasklist(data);
            console.log("All tasks:", data);
        } else {
            //fetch tasks according to user id
            const res = await fetch(`/api/user_tasks?user_id=${user_id}`);
            const tasks = await res.json();
            setTasklist(tasks);
            console.log("User tasks:", tasks);
        }
    }

    const handleProjectClick = async (p_id, p_name) => {
        setCurrentProjectId(p_id);
        setIsEnableAddTask(true);
        setTopic(p_name);
        if (role == "1") {
            //fetch tasks accoring to project id
            const res = await fetch(`/api/project_tasks?p_id=${p_id}`);
            const tasks = await res.json();
            setTasklist(tasks);
            console.log("Project tasks:", tasks);
        } else {
            //fetch tasks according to project id and user id
            const res = await fetch(`/api/user_project_tasks?user_id=${user_id}&project_id=${p_id}`);
            const tasks = await res.json();
            setTasklist(tasks);
            console.log("Project-User tasks:", tasks);
        }
        // console.log("project tasks: ",tasklist);
    }

    const handleUserClick = async (u_id, u_name) => {
        setIsEnableAddTask(false);
        setTopic(u_name);
        if (role == "1") {
            //fetch tasks according to user id
            const res = await fetch(`/api/user_tasks?user_id=${u_id}`);
            const tasks = await res.json();
            setTasklist(tasks);
            console.log("User tasks:", tasks);
        }
        // console.log("user tasks: ",tasklist);
    }

    const handleContextMenu = (e, projectId) => {
        e.preventDefault();
        setContextMenu({
            x: e.pageX,
            y: e.pageY,
            projectId,
        });
    };

    const handleContextMenu_user = (e, userId) => {
        e.preventDefault();
        setContextMenu_user({
            x: e.pageX,
            y: e.pageY,
            userId,
        });
    };

    const handleDeleteProject = async (projectId) => {
        const confirmed = window.confirm("Are you sure you want to delete this project?");
        if (confirmed) {
            try {
                await deleteProject(projectId);//api call
                alert('Project deleted!');
                setContextMenu(null); // close the context menu
                setProjects((prev) => prev.filter((project) => project.p_id !== projectId));
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (confirmed) {
            try {
                await deleteUser(userId);//api call
                alert('User deleted!');
                setContextMenu_user(null); // close the user context menu
                setUsers((prev) => prev.filter((user) => user.u_id !== userId));
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const deleteProject = async (projectId) => {
        try {
            const response = await fetch(`/api/delete_project/${projectId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete project');
            }
            return true; // success
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    };

    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`/api/delete_user/${userId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete user');
            }
            return true; // success
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    };

    return (
        <aside id="separator-sidebar">

            <AnimatePresence>
                {viewSideBar ? (
                    <motion.div
                        key="sidebar"
                        initial={{ x: -250, opacity: 1 }}   // start hidden
                        animate={{ x: 0, opacity: 1 }}      // slide in
                        exit={{ x: -250, opacity: 1 }}      // slide out
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <div className="top-0 left-0 w-64 h-screen bg-gray-100 dark:bg-gray-800 overflow-y-auto transition-transform -translate-x-full sm:translate-x-0 border-r border-gray-300" aria-label="Sidebar">
                            <div className="px-3 py-4 overflow-y-auto">
                                <Image className="rounded-lg shadow-xl" src="/images/eblix.jpg" width={100} height={40} alt="eBlix Logo" />
                                {/* horizontal line */}
                                <div className='bg-gray-300 h-1 w-full mt-4 rounded-full'>
                                </div>
                                {/* Collapse Sidebar Icon*/}
                                <div className="absolute top-0 right-0 p-4" onClick={() => setViewSidebar(false)}>
                                    <svg className=" w-6 h-6 text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.99994 10 7 11.9999l1.99994 2M12 5v14M5 4h14c.5523 0 1 .44772 1 1v14c0 .5523-.4477 1-1 1H5c-.55228 0-1-.4477-1-1V5c0-.55228.44772-1 1-1Z" />
                                    </svg>
                                </div>
                                {/*All Tasks*/}
                                <ul className="pt-4 mb-4 space-y-2 font-medium">
                                    <li className='hover:cursor-pointer hover:shadow-md'>
                                        <div onClick={handleAllClick} className="flex transition-transform hover:scale-[1.05] items-center px-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                            </svg>
                                            <span className="flex-1 ms-3 whitespace-nowrap">All Tasks</span>
                                        </div>
                                    </li>
                                </ul>
                                {/* all projects */}
                                <div>
                                    <div className="bg-gray-300 dark:bg-gray-700 text-gray-900  dark:text-white my-4">
                                        <h1 className="text-2xl font-bold text-white px-5 w-full text-center">
                                            Projects
                                        </h1>
                                    </div>

                                    {/* projects */}
                                    <ul className="space-y-2 font-medium">
                                        {projects?.map((project, index) => (
                                            <li key={project.p_id}>
                                                <div onClick={() => handleProjectClick(project.p_id, project.p_name)} onContextMenu={(e) => handleContextMenu(e, project.p_id)} className="flex items-center px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:shadow-md hover:cursor-pointer transition-transform hover:scale-[1.05] dark:hover:bg-gray-700 group">
                                                    <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                        <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                                    </svg>
                                                    <span className="flex-1 ms-3 whitespace-nowrap text-1xl">{project.p_name}</span>
                                                    <button>
                                                        <svg className="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 6h.01M12 12h.01M12 18h.01" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* adding a new project */}
                                    {role == "1" &&
                                        <ul className="pt-2 space-y-2 font-medium dark:border-gray-700">
                                            <li>
                                                <Link href="/newproject" className="flex items-center p-2 text-gray-300 duration-75 rounded-lg transition-transform hover:scale-[1.05] hover:text-black dark:hover:text-gray-700 dark:text-white group">
                                                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                                    </svg>
                                                    <span className="ms-3">Add Project</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    }

                                </div>

                                {/* Member */}
                                {role == "1" &&
                                    <div className="py-4 bg-gray-100 w-full dark:bg-gray-800">

                                        <div className="bg-gray-300 dark:bg-gray-700 text-gray-900 w-full dark:text-white">
                                            <h1 className="text-2xl font-bold text-white w-full text-center">
                                                Members
                                            </h1>
                                        </div>

                                        <ul className="mt-4 space-y-2 font-medium border-t border-gray-100 dark:border-gray-700">
                                            {users?.map((user, index) => (
                                                <li key={user.u_id}>
                                                    <div onClick={() => handleUserClick(user.u_id, user.u_name)} onContextMenu={(e) => handleContextMenu_user(e, user.u_id)} className="flex items-center px-2 py-1 text-gray-900 rounded-lg transition-transform hover:scale-[1.05] dark:text-white hover:cursor-pointer hover:shadow-md dark:hover:bg-gray-700 group">
                                                        <svg class="w-6 h-6 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                            <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clip-rule="evenodd" />
                                                        </svg>

                                                        <span className="flex-1 ms-3 whitespace-nowrap">{user.u_name}</span>
                                                        <button>
                                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 6h.01M12 12h.01M12 18h.01" />
                                                            </svg>
                                                        </button>

                                                    </div>
                                                </li>
                                            ))}

                                        </ul>

                                        <ul className="pt-2 space-y-2 font-medium">
                                            <li>
                                                <Link href="/newuser" className="flex items-center p-2 text-gray-300 duration-75 rounded-lg transition-transform hover:scale-[1.05] hover:text-black dark:hover:bg-gray-700 dark:text-white group">
                                                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                                    </svg>
                                                    <span className="ms-3">Add User</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                }
                            </div>

                            {contextMenu && (
                                <button
                                    style={{ top: contextMenu.y, left: contextMenu.x }}
                                    className="z-50 bg-red-500 text-white hover:bg-red-300 rounded shadow"
                                    onClick={() => handleDeleteProject(contextMenu.projectId)}
                                >
                                    Delete Project
                                </button>
                            )}

                            {contextMenu_user && (
                                <button
                                    style={{ top: contextMenu_user.y, left: contextMenu_user.x }}
                                    className="z-50 bg-red-500 text-black hover:bg-red-300 rounded shadow"
                                    onClick={() => handleDeleteUser(contextMenu_user.userId)}
                                >
                                    Delete User
                                </button>
                            )}
                        </div>

                    </motion.div>
                ) : (
                    <motion.div
                        key="ribbon"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-12 h-screen bg-gray-100 flex flex-col items-center gap-6 border-r border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                    >
                        <Image className="rounded-lg shadow-2xl border border-gray-300" src="/images/e.jpg" width={100} height={40} alt="e Logo" />
                        <svg onClick={() => { setViewSidebar(true) }} className="w-6 h-6 text-gray-600 dark:text-white cursor-pointer scale-x-[-1] z-50" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.99994 10 7 11.9999l1.99994 2M12 5v14M5 4h14c.5523 0 1 .44772 1 1v14c0 .5523-.4477 1-1 1H5c-.55228 0-1-.4477-1-1V5c0-.55228.44772-1 1-1Z" />
                        </svg>
                        <Link href={"/newproject"} title='Add Project'>
                            <svg class="w-6 h-6 text-gray-600 dark:text-white cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 17h6m-3 3v-6M4.857 4h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 9.143V4.857C4 4.384 4.384 4 4.857 4Zm10 0h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857h-4.286A.857.857 0 0 1 14 9.143V4.857c0-.473.384-.857.857-.857Zm-10 10h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 19.143v-4.286c0-.473.384-.857.857-.857Z" />
                            </svg>
                        </Link>
                        <Link href={"/newuser"} title='Add User'>
                            <svg class="w-6 h-6 text-gray-600 dark:text-white cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </Link>

                    </motion.div>
                )
                }
            </AnimatePresence>

        </aside>
    )
}

export default Sidebar