'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import OutsideClickWrapper from './OutsideClickWrapper';
import Image from 'next/image';
import Row from './Row';

function Table({ statusId, tasks, setShowDescription, showDescription, currentProjectId, userId, setCurrentTask, setTasklist }) {
  const [newRow, setNewRow] = useState();
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState();
  const [assigns, setAssigns] = useState([]);
  const [dueDate, setDueDate] = useState();
  const [priority, setPriority] = useState();
  const [timeEstimate, setTimeEstimate] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersInProject, setUsersInProject] = useState([]);
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);
  const [isTaskOptionOpen, setIsTaskOptionOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editableTask, setEditableTask] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [viewSubTasks, setViewSubTasks] = useState(false);
  const [showStatusList, setShowStatusList] = useState(false);
  const [taskStatusId, setTaskStatusId] = useState(statusId);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: '1',
  });

  const isEditingRef = useRef(isEditing);
  const router = useRouter();
  const rowRef = useRef(null);
  const newRowRef = useRef(null);

  const colorMap = {
    '1': 'bg-rose-600',
    '2': 'bg-indigo-600',
    '3': 'bg-teal-600',
  };

  const textColorMap = {
    '1': 'text-rose-600',
    '2': 'text-indigo-600',
    '3': 'text-teal-600',
  };

  const statusNameMap = {
    '1': 'OPEN',
    '2': 'ON GOING',
    '3': 'COMPLETED',
  };

  const getIcon = (status_id, color) => {
    switch (status_id) {
      case '1':
        return (
          <svg className={`${color} dark:text-white`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z" />
          </svg>
        );
      case '2':
        return (
          <svg className={`${color} dark:text-white`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        );
      case '3':
        return (
          <svg className={`${color} dark:text-white`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const colorClass = colorMap[statusId] || 'bg-gray-400';

  useEffect(() => {
    console.log("Opened Project: ", currentProjectId);
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/users_in_project?project_id=${currentProjectId}`);
        if (!res.ok) throw new Error("Failed to fetch users");
        const users = await res.json();
        setUsersInProject(users);
      } catch (err) {
        console.error("Error fetching users:", err);
        return [];
      }
    }
    fetchUsers();
    console.log("taskList: ", tasks)
  }, [currentProjectId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (rowRef.current && !rowRef.current.contains(event.target)) {
        setIsEditing(false);
        setEditTaskId(null);
        setEditableTask(null);
      }
    }
    if (editTaskId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editTaskId]);

  useEffect(() => {
    function handleClickNewRowOutside(event) {
      if (newRowRef.current && !newRowRef.current.contains(event.target)) {
        setNewRow(false);
      }
    }
    if (newRow !== null) {
      document.addEventListener("mousedown", handleClickNewRowOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickNewRowOutside);
    };
  }, [newRow]);

  const saveTask = async () => {
    try {
      const res = await fetch('/api/newtask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          t_title: taskTitle,
          t_description: "",
          due_date: null,
          date_created: new Date(),
          time_estimate: null,
          priority: null,
          task_status_id: taskStatusId,
          p_id: currentProjectId,
          added_by_id: userId,
          parent_task_id: null,
        }),
      });

      const newTask = await res.json(); // await is required here
      if (res.ok) {
        setTasklist(prev => [...prev, newTask.task]);
        // setNewRow(false);
      } else {
        console.error("Error creating task:", newTask);
        alert("Failed to create task");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred while creating the task.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveTask();
      setNewRow(false);
    }
  };

  const handleNewTaskSubmit = async () => {
    setNewRow(false);
    saveTask();
  }

  const deleteTask = (taskId) => {
    console.log("Deleting task with ID:", taskId);
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) {
      console.log("Task deletion cancelled");
      return;
    }
    try {
      fetch(`/api/delete_task/${taskId}`, {
        method: 'DELETE',
      })
        .then(res => {
          if (res.ok) {
            setTasklist(prev => prev.filter(task => task.t_id !== taskId));
          } else {
            throw new Error("Failed to delete task");
          }
        })
        .catch(err => {
          console.error("Error deleting task:", err);
          alert("Failed to delete task");
        });
    } catch (error) {
      console.error("Error in deleteTask function:", error);
      alert("An error occurred while deleting the task.");
    }
  };

  const updateTask = async () => {
    try {
      console.log("Task to update:", editableTask);
      const res = await fetch('/api/update_task', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          t_id: editTaskId,
          t_title: taskTitle,
          due_date: new Date(dueDate),
          time_estimate: parseInt(timeEstimate, 10),
          priority: parseInt(priority, 10),
          task_status_id: taskStatusId,
          p_id: editableTask.p_id,
          added_by_id: userId,
          assigns
        }),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasklist(prev => prev.map(task => task.t_id === editTaskId ? updatedTask : task));
        alert("Task updated successfully");
        setEditTaskId(null);
        setEditableTask(null);
      } else {
        const errorData = await res.json();
        console.error("Error updating task:", errorData);
        alert("Failed to update task");
      }
    } catch (error) {
      console.error("Error in updateTask function:", error);
      alert("An error occurred while updating the task.");
    }
  }

  const allowEditTask = (taskId) => {
    const taskToEdit = tasks.find(task => task.t_id === taskId);
    setEditableTask(taskToEdit);
    console.log("Editing task with ID:", taskId);

    setTaskTitle(taskToEdit.t_title);
    setAssigns(taskToEdit.assigns || []);
    setDueDate(taskToEdit.due_date ? new Date(editableTask.due_date).toISOString().split('T')[0] : '');
    setPriority(taskToEdit.priority || '');
    setTaskStatusId(taskToEdit.task_status_id || '');
    setTimeEstimate(taskToEdit.time_estimate || 0);

    setEditTaskId(taskId);
  };

  // Helper to handle checkbox changes for user selection
  const handleUserSelect = (user, checked) => {
    setSelectedUsers(prev =>
      checked
        ? [...(prev || []), user]
        : (prev || []).filter(u => u !== user)
    );
  };

  const handleStatusIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); //prevent triggering parent onClick
    setShowStatusList({ x: e.pageX, y: e.pageY });
  }

  return (
    <div className=" mt-3 rounded-lg bg-white dark:bg-gray-800">

      <div className={`flex items-center ${colorClass} rounded-lg w-fit h-70 mb-2`}>
        <div className='px-3 py-2'> {getIcon(taskStatusId, "text-white")} </div>
        <h1 className="text-1xl mr-4 text-white">{statusNameMap[statusId] || 'UNKNOWN'}</h1>
      </div>

      <div className="relative overflow-x-auto">

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 w-[1000px]">
                Task Name
              </th>
              <th></th>
              <th scope="col" className="px-6 py-3 w-96">
                Project
              </th>
              <th scope="col" className="px-6 py-3">
                Due date
              </th>
              <th scope="col" className="pl-6 py-3 w-[400px]">
                Assignee
              </th>
              <th scope="col" className="px-6 py-3">
                Date Created
              </th>
              <th scope="col" className="px-3 py-3">
                Time Estimated
              </th>
              <th scope="col" className="px-6 py-3">
                Time Spent
              </th>
              <th scope="col" className="pl-6 py-3">
                Priority
              </th>
              <th scope="col" className="pl-6 py-3">
                Created By
              </th>
              <th scope="col" className="py-3 w-10">
                {/* option */}
              </th>
            </tr>
          </thead>

          <tbody>

            {tasks?.map((task, index) => (
              <React.Fragment>
                <Row task={task} showDescription={showDescription} setShowDescription={setShowDescription} setCurrentTask={setCurrentTask} subLevel={0} setTasklist={setTasklist} userId={userId} parentTaskId={null} />
              </React.Fragment>
            ))}

            {newRow && currentProjectId &&
              <tr
                onKeyPress={handleKeyPress}
                ref={newRowRef}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 cursor-pointer"
              >

                {/* Task Name */}
                <td colSpan={4} className=" px-4 w-full">
                  <div className='flex items-center w-full'>
                    <div onClick={(e) => handleStatusIconClick(e)} className='px-2 py-2'> {getIcon(taskStatusId, textColorMap[taskStatusId])} </div>
                    <input
                      type="text"
                      id="taskTitle"
                      placeholder='Task name'
                      className="text-gray-900 text-sm rounded-lg w-full px-2.5 py-1"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </td>

                <td colSpan={4} className="px-2">
                  <div className='flex items-center'>
                    <button
                      type="button"
                      className="bg-white text-black border border-gray-200 px-2 py-1 mx-1 rounded-lg hover:bg-gray-200 z-0"
                      onClick={() => { setNewRow(false) }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="bg-blue-400 text-black px-2 py-1 mx-1 rounded-lg hover:bg-blue-500 z-0"
                      onClick={handleNewTaskSubmit}
                    >
                      Save
                    </button>
                  </div>
                </td>
              </tr>
            }

            {!newRow && currentProjectId &&
              <tr onClick={() => { setNewRow(true); }} className=" dark:bg-gray-800 cursor-pointer hover:bg-gray-300">
                <th scope="row" className="flex px-6 py-2 font-medium text-gray-400 whitespace-nowrap dark:text-white">
                  <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                  </svg>
                  <span className="ms-3">Add Task</span>
                </th>
              </tr>
            }

          </tbody>

        </table>

        {/* Task Option Dropdown */}
        <OutsideClickWrapper onOutsideClick={() => setIsTaskOptionOpen(false)}>
          {isTaskOptionOpen &&
            <div className={`fixed z-10 w-40 p-2 bg-white border rounded-md shadow-lg ${isTaskOptionOpen ? 'block' : 'hidden'}`} style={{ top: `${isTaskOptionOpen.y + 40}px`, left: `${isTaskOptionOpen.x - 100}px`, position: 'fixed' }}>
              <ul className="py-1">

                <li className="flex items-center px-3 py-1 hover:bg-gray-100 cursor-pointer" onClick={() => { console.log("Edit Task"); setIsTaskOptionOpen(false); allowEditTask(isTaskOptionOpen.taskId) }}>
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                  </svg>
                  Edit Task
                </li>
                <li className="flex items-center px-3 py-1 hover:bg-red-500 hover:text-white cursor-pointer" onClick={() => { console.log("Delete Task"); setIsTaskOptionOpen(false); deleteTask(isTaskOptionOpen.taskId) }}>
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                  </svg>
                  Delete Task
                </li>

              </ul>
            </div>
          }
        </OutsideClickWrapper>

        {/* Status List Dropdown */}
        <OutsideClickWrapper onOutsideClick={() => setShowStatusList(false)}>
          {showStatusList &&
            <div ref={newRowRef} className={`fixed z-10 w-40 p-2 bg-white border rounded-md shadow-lg ${showStatusList ? 'block' : 'hidden'}`} style={{ top: `${showStatusList.y + 20}px`, left: `${showStatusList.x - 15}px`, position: 'fixed' }}>
              <ul className="py-1">
                {Object.entries(statusNameMap).map(([key, value]) => (
                  <li
                    key={key}
                    className="flex items-center hover:bg-gray-100 hover:cursor-pointer p-1"
                    onClick={() => { setTaskStatusId(key); setShowStatusList(false); }}
                  >
                    <div className="mx-3">{getIcon(key, textColorMap[key])}</div>
                    {value}
                  </li>
                ))}

              </ul>

            </div>
          }
        </OutsideClickWrapper>

      </div>
    </div >
  )
}

export default Table