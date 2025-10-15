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
import AccountDetails from "@/(component)/AccountDetails";


export default function Home() {

  const [role, setRole] = useState("");
  const [u_id, setU_id] = useState("");
  const [topic, setTopic] = useState("All");
  const [currentTask, setCurrentTask] = useState();
  const [tasklist, setTasklist] = useState([]);
  const [toDoTasks, setToDoTasks] = useState([]);
  const [onHoldTasks, setOnHoldTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [qaTasks, setQaTasks] = useState([]);
  const [productionTasks, setProductionTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [isEnableAddTask, setIsEnableAddTask] = useState(false);
  const [currentProjectId, setCurrentprojectId] = useState(null);
  const [viewSideBar, setViewSidebar] = useState(true);
  const [description, setDescription] = useState(null);
  const [showAccountDropDown, setShowAccountDropDown] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [showUserDetails, setShowUserDetails] = useState(false);

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

        const res = await fetch(`/api/user_details`);
        const user = await res.json();
        setUserDetails(user);
        console.log("User details:", user);

        setTopic("All");

        if (userRole === "1") {
          // Fetch all tasks
          const res = await fetch('/api/all_tasks');
          const data = await res.json();
          setTasklist(data);
          console.log("All tasks:", data);
        } else {
          // Fetch tasks for user
          const res = await fetch(`/api/user_tasks`);
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
    if (tasklist.length === 0) {
      setToDoTasks([]);
      setOnHoldTasks([]);
      setInProgressTasks([]);
      setQaTasks([]);
      setProductionTasks([]);
      setCompletedTasks([]);
    } else {
      setToDoTasks(tasklist?.filter(task => task.task_status_id === "1"));
      setOnHoldTasks(tasklist?.filter(task => task.task_status_id === "2"));
      setInProgressTasks(tasklist?.filter(task => task.task_status_id === "3"));
      setQaTasks(tasklist?.filter(task => task.task_status_id === "4"));
      setProductionTasks(tasklist?.filter(task => task.task_status_id === "5"));
      setCompletedTasks(tasklist?.filter(task => task.task_status_id === "6"));
      console.log("todo tasks: ", toDoTasks);
      console.log("onhold tasks: ", onHoldTasks);
      console.log("inprogress tasks: ", inProgressTasks);
      console.log("qa tasks: ", qaTasks);
      console.log("production tasks: ", productionTasks);
      console.log("completed tasks: ", completedTasks);
    }

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
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <div className="flex">
      <Sidebar user_id={u_id} role={role} setTasklist={setTasklist} setTopic={setTopic} setIsEnableAddTask={setIsEnableAddTask} setCurrentProjectId={setCurrentprojectId} viewSideBar={viewSideBar} setViewSidebar={setViewSidebar} setDescription={setDescription} />

      <div className={`${viewSideBar ? 'w-[calc(100%-16rem)]' : 'w-full'} h-screen overflow-y-auto`}>
        <div>

          <div className="flex items-center justify-between bg-white dark:bg-gray-700 text-gray-900  dark:text-white border-b border-gray-300">
            <div className="flex py-2 dark:bg-gray-800 ">
              <div>
                <div className="mx-5 px-10 py-1 border-r border-r-gray-300 w-fit">
                  <h1 className="text-3xl font-bold text-left">{topic}</h1>
                </div>
                {description && <span>{ }</span>}
              </div>

            </div>
            {/* User Profile and Logout */}
            <div onClick={() => setShowAccountDropDown(true)} className="flex items-center group mx-16 rounded-full w-fit h-12 hover:border hover:border-gray-300 p-1 bg-gray-100 text-black border border-gray-300 cursor-pointer" onMouseEnter={() => setShowUserDetails(true)} onMouseLeave={() => setShowUserDetails(false)}>
              <button className="rounded-full w-11 h-11 text-black">
                <svg class="w-11 h-11 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clip-rule="evenodd" />
                </svg>
              </button>
              {showUserDetails &&
                <div className="flex flex-col mr-4">
                  <span className="text-base font-bold ml-3">{userDetails.u_name}</span>
                  <span className="text-xs font-semibold ml-3">{userDetails.email}</span>
                </div>
              }

            </div>
          </div>

          <div>
            {/* Tables */}
            <Table statusId="1" tasks={toDoTasks} showDescription={showDescription} setShowDescription={setShowDescription} isEnableAddTask={isEnableAddTask} currentProjectId={currentProjectId} userId={u_id} setCurrentTask={setCurrentTask} setTasklist={setTasklist} viewSideBar={viewSideBar} />
            <Table statusId="2" tasks={onHoldTasks} showDescription={showDescription} setShowDescription={setShowDescription} isEnableAddTask={isEnableAddTask} currentProjectId={currentProjectId} userId={u_id} setCurrentTask={setCurrentTask} setTasklist={setTasklist} viewSideBar={viewSideBar} />
            <Table statusId="3" tasks={inProgressTasks} showDescription={showDescription} setShowDescription={setShowDescription} isEnableAddTask={isEnableAddTask} currentProjectId={currentProjectId} userId={u_id} setCurrentTask={setCurrentTask} setTasklist={setTasklist} viewSideBar={viewSideBar} />
            <Table statusId="4" tasks={qaTasks} showDescription={showDescription} setShowDescription={setShowDescription} isEnableAddTask={isEnableAddTask} currentProjectId={currentProjectId} userId={u_id} setCurrentTask={setCurrentTask} setTasklist={setTasklist} viewSideBar={viewSideBar} />
            <Table statusId="5" tasks={productionTasks} showDescription={showDescription} setShowDescription={setShowDescription} isEnableAddTask={isEnableAddTask} currentProjectId={currentProjectId} userId={u_id} setCurrentTask={setCurrentTask} setTasklist={setTasklist} viewSideBar={viewSideBar} />
            <Table statusId="6" tasks={completedTasks} showDescription={showDescription} setShowDescription={setShowDescription} isEnableAddTask={isEnableAddTask} currentProjectId={currentProjectId} userId={u_id} setCurrentTask={setCurrentTask} setTasklist={setTasklist} viewSideBar={viewSideBar} />
          </div>
          
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
                <Descriptionbar currentTask={currentTask} role={role} setShowDescription={setShowDescription} userId={u_id} setTasklist={setTasklist} />
              </div>
            </OutsideClickWrapper>
          </div>
        }

        {/* Account Dropdown */}
        <OutsideClickWrapper onOutsideClick={() => setShowAccountDropDown(false)}>
          {showAccountDropDown &&
            <div className={`fixed z-10 w-fit py-2 px-1 bg-white border rounded-md shadow-lg`} style={{ top: `60px`, right: `100px`, position: 'fixed' }}>
              <ul className="flex flex-col py-1">
                <li onClick={() => { setShowAccountDetails(true); setShowAccountDropDown(false) }} className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-2 rounded-md">
                  <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clip-rule="evenodd" />
                  </svg>
                  Account Details
                </li>
                <li onClick={handleLogout} className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-2 rounded-md">
                  <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
                  </svg>
                  Logout
                </li>
              </ul>

            </div>
          }
        </OutsideClickWrapper>

        {/* Account Detail Modal */}
        <OutsideClickWrapper onOutsideClick={() => setShowAccountDetails(false)}>
          {showAccountDetails &&
            <AccountDetails setShowAccountDetails={setShowAccountDetails} userDetails={userDetails} />
          }
        </OutsideClickWrapper>

      </div>
    </div>
  );
}
