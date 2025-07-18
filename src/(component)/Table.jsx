'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import OutsideClickWrapper from './OutsideClickWrapper';
import Image from 'next/image';
import Row from './Row';

function Table({ name, tasks, setShowDescription, showDescription, isEnableAddTask, currentProjectId, userId, setCurrentTask, setTasklist }) {
  const [newRow, setNewRow] = useState();
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState();
  const [assigns, setAssigns] = useState([]);
  const [dueDate, setDueDate] = useState();
  const [priority, setPriority] = useState();
  const [taskStatusId, setTaskStatusId] = useState();
  const [timeEstimate, setTimeEstimate] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersInProject, setUsersInProject] = useState([]);
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);
  const [isTaskOptionOpen, setIsTaskOptionOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editableTask, setEditableTask] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [viewSubTasks, setViewSubTasks] = useState(false);

  const isEditingRef = useRef(isEditing);
  const router = useRouter();
  const rowRef = useRef(null);
  const newRowRef = useRef(null);

  const colorMap = {
    'OPEN': 'bg-rose-600',
    'IN PROGRESS': 'bg-indigo-600',
    'COMPLETED': 'bg-teal-600',
  };

  const textColorMap = {
    'OPEN': 'text-rose-600',
    'IN PROGRESS': 'text-indigo-600',
    'COMPLETED': 'text-teal-600',
  };

  const getIcon = (status, color) => {
    switch (status) {
      case 'OPEN':
        return (
          <svg className={`${color} dark:text-white`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z" />
          </svg>
        );
      case 'IN PROGRESS':
        return (
          <svg className={`${color} dark:text-white`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        );
      case 'COMPLETED':
        return (
          <svg className={`${color} dark:text-white`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const colorClass = colorMap[name] || 'bg-gray-400';
  const textClass = textColorMap[name] || 'text-gray-400';

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


  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      //create task
      const res = await fetch('/api/newtask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          t_title: taskTitle,
          t_description: "",
          due_date: new Date(dueDate),
          time_estimate: parseInt(timeEstimate, 10),
          priority: parseInt(priority, 10),
          task_status_id: taskStatusId,
          p_id: currentProjectId,
          added_by_id: userId,
          assigns
        }),
      })

      const newTask = res.json();
      console.log("New Task hhhhhhhhh: ", newTask);
      setTasklist(prev => [...prev, newTask]);
      if (res.ok) {
        alert("task created successfully");
        //submits should be displayed in the table
      } else {
        console.error("Error creating task:", errorData);
        alert("Failed to create task");
      }
    }
  };

  const handleNewTaskSubmit = async () => {
    //create task
    const res = await fetch('/api/newtask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        t_title: taskTitle,
        t_description: "",
        due_date: new Date(dueDate),
        time_estimate: parseInt(timeEstimate, 10),
        priority: parseInt(priority, 10),
        task_status_id: taskStatusId,
        p_id: currentProjectId,
        added_by_id: userId,
        assigns
      }),
    })

    const result = await res.json();
    console.log("ffffffffffffffff: ", result.task);
    setTasklist(prev => [...prev, result.task]);
    if (res.ok) {
      alert("task created successfully");
      //submits should be displayed in the table
    } else {
      console.error("Error creating task:", taskTitle);
      alert("Failed to create task");
    }
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
            alert("Task deleted successfully");
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

  return (
    <div className=" mt-3 rounded-lg bg-white dark:bg-gray-800 p-2">

      <div className={`flex items-center ${colorClass} rounded-lg w-fit h-70 mb-2`}>
        <div className='px-3 py-2'> {getIcon(name, "text-white")} </div>
        <h1 className="text-1xl mr-4 text-white">{name}</h1>
      </div>

      <div className="relative overflow-x-auto">

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 w-[1000px]">
                Task Name
              </th>
              <th></th>
              <th scope="col" className="px-6 py-3">
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
              <React.Fragment key={task.t_id}>
                <Row task={task} showDescription={showDescription} setShowDescription={setShowDescription} setCurrentTask={setCurrentTask} subLevel={0} />
              </React.Fragment>
            ))}

            {newRow &&
              <tr
                onKeyPress={handleKeyPress}
                ref={newRowRef}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 cursor-pointer hover:bg-gray-300"
              >

                {/* Task Name */}
                <td className="px-4">
                  <input
                    type="text"
                    id="taskTitle"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    required
                  />
                </td>

                {/* Assign Dropdown */}
                <td className="px-4 relative">
                  <button
                    type="button"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 text-left"
                    onClick={() => setIsJobDropdownOpen(true)}
                  >
                    {assigns.length > 0 ? `${assigns.length} selected` : "Add User"}
                    <span className="ml-1 float-right">▼</span>
                  </button>

                  {isJobDropdownOpen && (
                    <OutsideClickWrapper onOutsideClick={() => setIsJobDropdownOpen(false)}>
                      <div className="relative z-50 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-2">
                          {usersInProject.map((user, index) => (
                            <div key={user.u_id} className="px-3 py-1.5 hover:bg-gray-100 rounded text-gray-800">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="mr-2 h-4 w-4 accent-blue-600"
                                  value={user.u_id}
                                  checked={assigns.includes(user.u_id)}
                                  onChange={(e) => {
                                    const userId = user.u_id;
                                    const updatedList = e.target.checked
                                      ? [...assigns, userId]
                                      : assigns.filter(id => id !== userId);
                                    setAssigns(updatedList);
                                  }}
                                />
                                <span className="text-gray-800">{user.u_name}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </OutsideClickWrapper>

                  )}
                </td>

                {/* Due Date */}
                <td className="px-4">
                  <input
                    type="date"
                    id="dueDate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </td>

                {/* Priority */}
                <td className="px-4">
                  <input
                    type="number"
                    id="priority"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                </td>

                {/* Task Status */}
                <td className="px-4">
                  <select
                    id="taskStatusId"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={taskStatusId}
                    onChange={(e) => setTaskStatusId(e.target.value)}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="1">Open</option>
                    <option value="2">On-Going</option>
                    <option value="3">Done</option>
                  </select>
                </td>

                {/* Time Estimate */}
                <td className="px-4">
                  <input
                    type="number"
                    id="timeEstimate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={timeEstimate}
                    onChange={(e) => setTimeEstimate(e.target.value)}
                  />
                </td>

                <td className="px-4">
                  <button
                    type="button"
                    className="bg-blue-500 text-black px-4 rounded-lg ml-3 hover:bg-red-800 z-0"
                    onClick={handleNewTaskSubmit}
                  >
                    Save
                  </button>
                </td>
              </tr>
            }

            {isEnableAddTask && !newRow &&
              <tr onClick={() => { setNewRow(true); }} className=" dark:bg-gray-800 cursor-pointer hover:bg-gray-300">
                <th scope="row" className="flex px-6 pt-3 font-medium text-gray-400 whitespace-nowrap dark:text-white">
                  <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                  </svg>
                  <span className="ms-3">Add Task</span>
                </th>
              </tr>
            }

          </tbody>

        </table>

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

      </div>
    </div >
  )
}

export default Table