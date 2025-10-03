'use client';
import Descriptionbar from "../(component)/Descriptionbar";
import React, { useEffect, useState } from "react";
import Sidebar from "../(component)/Sidebar";
import Table from "../(component)/Table";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import { useFormStatus } from "react-dom";
import OutsideClickWrapper from '../(component)/OutsideClickWrapper';

export default function Home() {

  const [role, setRole] = useState("");
  const [u_id, setU_id] = useState("");
  const [topic, setTopic] = useState("All");
  const [currentTask, setCurrentTask] = useState();
  const [tasklist, setTasklist] = useState([]);
  const [openTasks, setOpenTasks] = useState([]);
  const [ongoingTasks, setOngoingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [isEnableAddTask, setIsEnableAddTask] = useState(false);
  const [currentProjectId, setCurrentprojectId] = useState("");
  const [viewSideBar, setViewSidebar] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('token');
      console.log('token: ', token);

      if (token) {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setRole(decoded.role);
        setU_id(decoded.userId);

        // Wait for state to be updated before using role/u_id directly
        const userRole = decoded.role;
        const userId = decoded.userId;

        setTopic("All");

        if (userRole === "1") {
          // Fetch all tasks
          const res = await fetch('/api/all_tasks');
          const data = await res.json();
          setTasklist(data);
          console.log("All tasks:", data);
        } else {
          // Fetch tasks for user
          const res = await fetch(`/api/user_tasks?user_id=${userId}`);
          const tasks = await res.json();
          setTasklist(tasks);
          console.log("User tasks:", tasks);
        }
      } else {
        console.warn('No token found');
      }

      //await fetch('/api/create_admin');  create admin user if not exists
    };

    fetchData();

  }, []);


  useEffect(() => {
    console.log("Task list updated: ", tasklist)
    setCompletedTasks(tasklist.filter(task => task.task_status_id === "1"));
    setOngoingTasks(tasklist.filter(task => task.task_status_id === "2"));
    setOpenTasks(tasklist.filter(task => task.task_status_id === "3"));
    console.log("completed tasks: ", completedTasks);
    console.log("ongoing tasks: ", ongoingTasks);
    console.log("open tasks: ", openTasks);
  }, [tasklist]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
      });
      const data = await res.json();
      console.log(data.message); // "Logged out"
      if (res.ok) {
        router.push('/login');
        alert('Logout successfully!!')
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <div className="flex">
      {viewSideBar && (<Sidebar user_id={u_id} role={role} setTasklist={setTasklist} setTopic={setTopic} setIsEnableAddTask={setIsEnableAddTask} setCurrentProjectId={setCurrentprojectId} setViewSidebar={setViewSidebar} />)}

      {/* Expand Sidebar Icon*/}
      {!viewSideBar && (
        <svg onClick={() => { setViewSidebar(true) }} className="absolute w-6 h-6 m-5 text-gray-800 dark:text-white scale-x-[-1] z-50" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.99994 10 7 11.9999l1.99994 2M12 5v14M5 4h14c.5523 0 1 .44772 1 1v14c0 .5523-.4477 1-1 1H5c-.55228 0-1-.4477-1-1V5c0-.55228.44772-1 1-1Z" />
        </svg>
      )}

      <div className={`p-3 ${viewSideBar ? 'w-[calc(100%-16rem)]' : 'w-full'} h-screen overflow-y-auto`}>
        <div>

          <div className="relative bg-white dark:bg-gray-700 rounded-lg text-gray-900  dark:text-white mb-3">
            <div className="flex py-4 bg-gradient-to-r from-slate-500 to-white mx-2">
              <h1 className="text-3xl font-bold text-black ml-8">{topic}</h1>
              <button
                onClick={handleLogout}
                className="absolute flex right-0 mx-5 rounded-full hover:bg-red-400 dark:hover:bg-red-500 p-2 text-black"
              >
                Log Out
                <svg className=" ml-3 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                </svg>
              </button>

            </div>
          </div>

          {/* Tables */}
          <Table statusId="1" tasks={completedTasks} showDescription={showDescription} setShowDescription={setShowDescription} isEnableAddTask={isEnableAddTask} currentProjectId={currentProjectId} userId={u_id} setCurrentTask={setCurrentTask} setTasklist={setTasklist} color={"red-500"} />
          <Table statusId="2" tasks={ongoingTasks} showDescription={showDescription} setShowDescription={setShowDescription} isEnableAddTask={isEnableAddTask} currentProjectId={currentProjectId} userId={u_id} setCurrentTask={setCurrentTask} setTasklist={setTasklist} color={"green-200"} />
          <Table statusId="3" tasks={openTasks} showDescription={showDescription} setShowDescription={setShowDescription} isEnableAddTask={isEnableAddTask} currentProjectId={currentProjectId} userId={u_id} setCurrentTask={setCurrentTask} setTasklist={setTasklist} color={"blue-300"} />

        </div>

        {/* Description Bar */}

        {showDescription &&
          <div className="bottom-0 right-0 w-full rounded-lg bg-gray-200 dark:bg-gray-800 p-4 border-l border-black dark:border-white">
            <OutsideClickWrapper onOutsideClick={() => setShowDescription(false)}>
              <div className="fixed rounded-lg inset-0 z-30">
                {/* Dark overlay */}
                <div
                  className="fixed inset-0 bg-black opacity-50"
                  onClick={() => setShowDescription(false)}  // Optional: close on background click
                />
                {/* Sidebar */}
                <Descriptionbar currentTask={currentTask} role={role} setShowDescription={setShowDescription} />
              </div>
            </OutsideClickWrapper>
          </div>
        }
      </div>
    </div>
  );
}
