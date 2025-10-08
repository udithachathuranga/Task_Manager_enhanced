import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image';
import OutsideClickWrapper from '../(component)/OutsideClickWrapper';

function Row({ task, showDescription, setShowDescription, setCurrentTask, subLevel, setTasklist, userId, parentTaskId, setParentSubTaskList }) {

    const newRowRef = useRef(null);

    const [taskTitle, setTaskTitle] = useState(task.t_title);
    const [dueDate, setDueDate] = useState(task.due_date);
    const [dateCreated, setDateCreated] = useState(task.date_created);
    const [timeEstimate, setTimeEstimate] = useState(task.time_estimate);
    const [priority, setPriority] = useState(task.priority);
    const [timeSpent, setTimeSpent] = useState(task.time_spent);
    const [assigns, setAssigns] = useState([]);

    const [editTaskTitle, setEditTaskTitle] = useState(false);
    const [editDueDate, setEditDueDate] = useState(false);
    const [editTimeEstimate, setEditTimeEstimate] = useState(false);
    const [editTimeSpent, setEditTimeSpent] = useState(false);
    const [newRow, setNewRow] = useState(false);

    const [viewSubTasks, setViewSubTasks] = useState(false);
    const [showProjectUsers, setShowProjectUsers] = useState(false);
    const [showPriorityList, setShowPriorityList] = useState(false);
    const [showStatusList, setShowStatusList] = useState(false);
    const [isTaskOptionOpen, setIsTaskOptionOpen] = useState(false);
    const [usersInProject, setUsersInProject] = useState();
    const [subtasks, setSubTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/sub_tasks?parent_task_id=${task.t_id}`);
            const data = await res.json();
            console.log("Sub tasks:", data);
            setSubTasks(data);
        };
        fetchData();
        setAssigns(task.assigns);
    }, []);

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

    const statusName = {
        '1': 'Open',
        '2': 'In Progress',
        '3': 'Completed'
    }

    const getIcon = (status) => {
        switch (status) {
            case '1':
                return (
                    <svg className={`${textColorMap['1']} dark:text-white`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z" />
                    </svg>
                );
            case '2':
                return (
                    <svg className={`${textColorMap['2']} dark:text-white`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                );
            case '3':
                return (
                    <svg className={`${textColorMap['3']} dark:text-white`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="3">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const colorClass = colorMap[name] || 'bg-gray-400';
    const textClass = textColorMap[name] || 'text-gray-400';
    const marginLeft = 4 + 50 * subLevel;
    subLevel++;

    const saveTask = async () => {
        try {
            console.log("parent task id 2: ", task.t_id);
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
                    task_status_id: "1",
                    p_id: task.p_id,
                    added_by_id: userId,
                    parent_task_id: task.t_id,
                }),
            });

            const newTask = await res.json(); // await is required here
            if (res.ok) {
                console.log("New task created:", newTask);
                setSubTasks(prev => [...prev, newTask.task]);
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

    const handleTaskOptionClick = (e, taskId) => {
        e.preventDefault();
        e.stopPropagation(); //prevent triggering parent onClick
        console.log("Task ID clicked:", taskId);
        setIsTaskOptionOpen(prev => {
            if (taskId === prev?.taskId) {
                return false; // Close if the same task
            } else {
                return { x: e.pageX, y: e.pageY, taskId };
            }
        });
    };

    const showProjectUserList = (e, taskId) => {
        e.preventDefault();
        e.stopPropagation(); //prevent triggering parent onClick
        setShowProjectUsers(prev => {
            if (taskId === prev?.taskId) {
                return false; // Close if the same task
            } else {
                return { x: e.pageX, y: e.pageY, taskId };
            }
        });
    };

    const handlePriorityClick = (e, taskId) => {
        e.preventDefault();
        e.stopPropagation(); //prevent triggering parent onClick
        setShowPriorityList(prev => {
            if (taskId === prev?.taskId) {
                return false; // Close if the same task
            } else {
                return { x: e.pageX, y: e.pageY, taskId };
            }
        });
    };

    const handleStatusIconClick = (e, taskId) => {
        e.preventDefault();
        e.stopPropagation(); //prevent triggering parent onClick
        setShowStatusList(prev => {
            if (taskId === prev?.taskId) {
                return false; // Close if the same task
            } else {
                return { x: e.pageX, y: e.pageY, taskId };
            }
        });
    }

    const deleteTask = (taskId) => {
        console.log("Deleting task with ID:", taskId);
        const confirmed = window.confirm("Are you sure you want to delete this project??????????");
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
                        if (parentTaskId) {
                            setSubTasks(prev => prev.filter(task => task.t_id !== taskId));
                        } else {
                            setParentSubTaskList(prev => prev.filter(task => task.t_id !== taskId));
                        }
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
            const res = await fetch('/api/update_task', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    t_id: task.t_id,
                    t_title: taskTitle,
                    due_date: new Date(dueDate).toISOString(),
                    date_created: dateCreated,
                    time_estimate: parseInt(timeEstimate, 10),
                    priority: task.priority,//parseInt(priority, 10),
                    time_spent: parseInt(timeSpent, 10),
                    task_status_id: task.task_status_id,
                    p_id: task.p_id,
                    added_by_id: task.added_by_id,
                    assigns: assigns
                }),
            });

            if (res.ok) {
                const responce = await res.json();
                const updatedTask = responce.task;
                updatedTask.project = task.project;
                updatedTask.added_by = task.added_by;
                console.log("updated task responce: ", updatedTask);
                setTasklist(prev => prev.map(t => t.t_id === task.t_id ? updatedTask : t));
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

    const priorityFlag = (priority) => {
        switch (priority) {
            case 1:
                return (
                    <svg className="text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z" />
                    </svg>
                );
            case 2:
                return (
                    <svg className="text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z" />
                    </svg>
                );
            case 3:
                return (
                    <svg className="text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z" />
                    </svg>
                );
            case 4:
                return (
                    <svg className="text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z" />
                    </svg>
                );
            default:
                return (
                    <svg className="text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 14v7M5 4.971v9.541c5.6-5.538 8.4 2.64 14-.086v-9.54C13.4 7.61 10.6-.568 5 4.97Z" />
                    </svg>
                );
        }
    };

    const handleFlagClick = (priorityId) => {
        setPriority(priorityId);
        task.priority = priorityId;
        updateTask();
        setShowPriorityList(false);
    }

    const fetchUsersInProject = async () => {
        const res = await fetch(`/api/users_in_project?project_id=${task.p_id}`);
        if (!res.ok) throw new Error("Failed to fetch users in project");
        const users = await res.json();
        console.log("Users in project:", users);
        setUsersInProject(users);
    }

    const saveAssignment = async (user_id, user_name) => {
        try {
            console.log("user_id::: ", user_id);
            console.log("task_id::: ", task.t_id);
            const res = await fetch('/api/new_assignment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user_id,
                    task_id: task.t_id,
                }),
            });
            if(res.ok){ 
                const assign = await res.json();
                setAssigns(prev => [...prev, user_name]) 
            }
            // setSubTasks(prev => [...prev, user_name]);
        } catch (error) {
            console.error("Error in new_assignment API call:", error);
            alert("An unexpected error occurred while creating the assignment.");
        }
    }

    return (
        <>
            <tr
                key={task.t_id}
                className="group bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 cursor-pointer hover:bg-gray-50 z-0 text-size-2xl"
            >
                <th
                    scope="row"
                    className="flex items-center py-2 font-medium text-gray-700 whitespace-nowrap dark:text-white"
                    style={{ marginLeft: `${marginLeft}px` }}
                >
                    {subtasks ? (
                        viewSubTasks ? (
                            <svg onClick={() => setViewSubTasks(false)} className="w-4 h-4 text-gray-400 ml-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="12" fill="currentColor" viewBox="0 0 24 24" >
                                <path fillRule="evenodd" d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg onClick={() => setViewSubTasks(true)} className="w-4 h-4 text-gray-400 ml-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="12" fill="currentColor" viewBox="0 0 24 24" >
                                <path fillRule="evenodd" d="M10.271 5.575C8.967 4.501 7 5.43 7 7.12v9.762c0 1.69 1.967 2.618 3.271 1.544l5.927-4.881a2 2 0 0 0 0-3.088l-5.927-4.88Z" clipRule="evenodd" />
                            </svg>
                        )
                    ) : (
                        <div className="w-3" />
                    )}

                    <div className="mx-4" onClick={(e) => handleStatusIconClick(e, task.t_id)}>
                        {getIcon(task.task_status_id)}
                    </div>

                    {editTaskTitle ? (
                        <OutsideClickWrapper onOutsideClick={() => { setEditTaskTitle(false); updateTask(); }}>
                            <input
                                type="text"
                                id="taskTitle"
                                placeholder='Task name'
                                className="text-gray-900 font-bold text-sm rounded-sm w-40"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                required
                            />
                        </OutsideClickWrapper>
                    ) : (
                        <strong onClick={() => { setShowDescription(!showDescription); setCurrentTask(task); }} className='transition-transform hover:scale-[1.05]'>{task.t_title}</strong>
                    )}

                </th>

                <th>
                    <div className='flex items-center'>
                        {/* edit task */}
                        <div onClick={() => { setEditTaskTitle(true) }} className='border rounded-md mr-1 border-gray-400 w-fit invisible group-hover:visible'>
                            <svg className="w-5 h-5 text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28" />
                            </svg>
                        </div>
                        {/* add subtasks */}
                        <div className='border rounded-md mr-1 border-gray-400 w-fit invisible group-hover:visible' onClick={() => { setNewRow(true); setViewSubTasks(true); }}>
                            <svg className="w-5 h-5 text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
                            </svg>
                        </div>
                    </div>

                </th>

                <td className="px-5">
                    <div onClick={() => { setCurrentTask(task); }} className="w-full py-1 border border-transparent hover:border-gray-400 rounded">
                        {task.project?.p_name ?? "kkkk"}
                    </div>
                </td>

                <td className="px-6">

                    {editDueDate ? (
                        <OutsideClickWrapper onOutsideClick={() => { setEditDueDate(false); updateTask(); }}>
                            <input
                                type="date"
                                id="due_date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit px-2.5 py-1"
                                // placeholder="YYYY-MM-DD"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            //required
                            />
                        </OutsideClickWrapper>
                    ) : (
                        <div onClick={() => setEditDueDate(true)} className="w-fit px-2 py-1 border border-transparent hover:border-gray-400 rounded">
                            {/* {new Date(task.due_date).toLocaleDateString()} */}
                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : "due"}
                        </div>
                    )}


                </td>

                <td onClick={() => { setCurrentTask(task); }} className="pl-6">
                    <div className="relative flex group/avatar -space-x-1 rtl:space-x-reverse w-[100px]">
                        {assigns && assigns.length > 0 ? (
                            <>
                                {assigns.map((assign, index) => (
                                    <div
                                        key={index}
                                        className="w-7 h-7 border-2 border-white rounded-full bg-blue-600 dark:border-gray-800 text-white flex items-center justify-center font-semibold uppercase" title={assign}
                                    >
                                        {assign.substring(0, 2) || "NA"}
                                    </div>
                                ))
                                }
                                <div className="hidden group-hover/avatar:flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-gray-300 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800" onClick={(e) => { showProjectUserList(e, task.t_id); fetchUsersInProject(); }}>+</div>
                            </>
                        ) : (
                            <div className='text-xs hover:border hover:b-gray-400 p-2 rounded-xl' onClick={(e) => { showProjectUserList(e, task.t_id); fetchUsersInProject(); }}>No assigns</div>
                        )}

                    </div>
                </td>

                <td onClick={() => { setCurrentTask(task); }} className="px-6">
                    <div className="w-fit px-2 py-1 border border-transparent hover:border-gray-400 rounded">
                        {new Date(task.date_created).toLocaleDateString()}
                        {/* {task.date_created} */}
                    </div>
                </td>

                <td onClick={() => { setEditTimeEstimate(true) }} >
                    {editTimeEstimate ? (
                        <OutsideClickWrapper onOutsideClick={() => { setEditTimeEstimate(false); updateTask(); }}>
                            <input
                                type="number"
                                id="timeEstimate"
                                placeholder='Time Estimate'
                                className="text-gray-900 text-sm rounded-sm w-40 p-1.5"
                                value={timeEstimate}
                                onChange={(e) => setTimeEstimate(e.target.value)}
                            />
                        </OutsideClickWrapper>
                    ) : (
                        <div className="w-fit px-2 py-1 border border-transparent hover:border-gray-400 rounded">
                            <div className="flex items-center">
                                <svg className="text-gray-400 dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z" />
                                </svg>
                                {task.time_estimate}
                            </div>
                        </div>
                    )}
                </td>

                <td onClick={() => { setEditTimeSpent(true) }} >
                    {editTimeSpent ? (
                        <OutsideClickWrapper onOutsideClick={() => { setEditTimeSpent(false); updateTask(); }}>
                            <input
                                type="number"
                                id="timeSpent"
                                placeholder='Time Spent'
                                className="text-gray-900 font-bold text-sm rounded-sm w-40"
                                value={timeSpent}
                                onChange={(e) => setTimeSpent(e.target.value)}
                            />
                        </OutsideClickWrapper>
                    ) : (
                        <div className="w-fit px-2 py-1 border border-transparent hover:border-gray-400 rounded">
                            <div className="flex items-center">
                                <svg className="text-gray-400 dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z" />
                                </svg>
                                {task.time_spent}
                            </div>
                        </div>
                    )}
                </td>

                <td onClick={() => { setCurrentTask(task); }} >
                    <div onClick={(e) => handlePriorityClick(e, task.t_id)} className="w-fit px-2 py-1 border border-transparent hover:border-gray-400 rounded">
                        <div className="flex items-center px-6">
                            {priorityFlag(task.priority)}
                        </div>
                    </div>
                </td>

                <td
                    onClick={() => { setCurrentTask(task); }} className="px-6">
                    <div className="relative flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase" title={task.added_by?.u_name}>
                            {task.added_by?.u_name?.substring(0, 2) || "NA"}
                        </div>
                    </div>
                </td>

                <td className=" w-10">
                    <div className="w-fit px-2 border border-transparent hover:border-gray-400 rounded">
                        <button
                            type="button"
                            className="text-black mx-1 rounded-lg z-0"
                            onClick={(e) => handleTaskOptionClick(e, task.t_id)}
                        >
                            <svg className="w-5 h-5 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg">
                                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 6h.01M12 12h.01M12 18h.01" />
                            </svg>
                        </button>
                    </div>
                </td>

            </tr >

            {viewSubTasks && <>
                {subtasks?.map((t, index) => (
                    <React.Fragment>
                        <Row task={t} showDescription={showDescription} setShowDescription={setShowDescription} setCurrentTask={setCurrentTask} subLevel={subLevel} setTasklist={setTasklist} userId={userId} parentTaskId={task.t_id} setParentSubTaskList={setSubTasks} />
                    </React.Fragment>
                ))}
                {newRow &&

                    <tr
                        onKeyPress={handleKeyPress}
                        ref={newRowRef}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 cursor-pointer"
                    >

                        {/* Task Name */}
                        <td colSpan={4} className=" px-14 w-full" style={{ marginLeft: `${marginLeft}px` }}>
                            <div className='flex items-center w-full' style={{ marginLeft: `${marginLeft}px` }}>
                                <div onClick={(e) => handleStatusIconClick(e)} className='px-2 py-2'> {getIcon(task.t_id, textColorMap[task.task_status_id])} </div>
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
                                // onClick={handleNewTaskSubmit}
                                >
                                    Save
                                </button>
                            </div>
                        </td>

                    </tr>
                }
            </>
            }

            {/* Assignee Dropdown */}
            <OutsideClickWrapper onOutsideClick={() => setShowProjectUsers(false)}>
                {showProjectUsers &&
                    <div className={`fixed z-10 w-40 p-2 bg-white border rounded-md shadow-lg ${showProjectUsers ? 'block' : 'hidden'}`} style={{ top: `${showProjectUsers.y + 20}px`, left: `${showProjectUsers.x - 100}px`, position: 'fixed' }}>
                        {usersInProject?.map((u) => (

                            <ul className="py-1 hover:bg-gray-100 cursor-pointer" onClick={() => { saveAssignment(u.u_id, u.u_name); setShowProjectUsers(false); }} key={u.u_id}>

                                <li className='flex items-center'>
                                    <div className="relative flex items-center space-x-2">
                                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase" title={u.u_name}>
                                            {u.u_name?.substring(0, 2) || "NA"}
                                        </div>
                                    </div>
                                    <strong className='mx-3'>{u.u_name}</strong>
                                </li>
                            </ul>
                        ))}
                    </div>
                }
            </OutsideClickWrapper>

            {/* Task Options */}
            <OutsideClickWrapper onOutsideClick={() => setIsTaskOptionOpen(false)}>
                {isTaskOptionOpen &&
                    <div className={`fixed z-10 w-40 p-2 bg-white border rounded-md shadow-lg ${isTaskOptionOpen ? 'block' : 'hidden'}`} style={{ top: `${isTaskOptionOpen.y + 40}px`, left: `${isTaskOptionOpen.x - 100}px`, position: 'fixed' }}>
                        <ul className="py-1">

                            <li className="flex items-center px-3 py-1 hover:bg-gray-100 cursor-pointer" onClick={() => { console.log("Edit Task"); setIsTaskOptionOpen(false); allowEditTask(isTaskOptionOpen.taskId) }}>
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
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

            {/* Priority List Dropdown */}
            <OutsideClickWrapper onOutsideClick={() => setShowPriorityList(false)}>
                {showPriorityList &&
                    <div className={`fixed z-10 w-30 p-2 bg-white border rounded-md shadow-lg ${showPriorityList ? 'block' : 'hidden'}`} style={{ top: `${showPriorityList.y + 20}px`, left: `${showPriorityList.x - 100}px`, position: 'fixed' }}>
                        <ul className="py-1">
                            <li onClick={() => { handleFlagClick(1) }} className='flex items-center hover:bg-gray-100 hover:cursor-pointer'>
                                <svg class="w-6 h-6 text-gray-500 dark:text-white mr-4 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z" />
                                </svg>
                                Low
                            </li>
                            <li onClick={() => { handleFlagClick(2) }} className='flex items-center hover:bg-gray-100 hover:cursor-pointer'>
                                <svg class="w-6 h-6 text-blue-500 dark:text-white mr-4 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z" />
                                </svg>
                                Normal
                            </li>
                            <li onClick={() => { handleFlagClick(3) }} className='flex items-center hover:bg-gray-100 hover:cursor-pointer'>
                                <svg class="w-6 h-6 text-yellow-300 dark:text-white mr-4 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z" />
                                </svg>
                                High
                            </li>
                            <li onClick={() => { handleFlagClick(4) }} className='flex items-center hover:bg-gray-100 hover:cursor-pointer'>
                                <svg class="w-6 h-6 text-red-500 dark:text-white mr-4 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z" />
                                </svg>
                                Urgent
                            </li>
                        </ul>
                    </div>
                }
            </OutsideClickWrapper>

            {/* Status List Dropdown */}
            <OutsideClickWrapper onOutsideClick={() => setShowStatusList(false)}>
                {showStatusList &&
                    <div className={`fixed z-10 w-40 p-2 bg-white border rounded-md shadow-lg ${showStatusList ? 'block' : 'hidden'}`} style={{ top: `${showStatusList.y + 20}px`, left: `${showStatusList.x - 15}px`, position: 'fixed' }}>
                        <ul className="py-1">
                            {Object.entries(statusName).map(([key, value], index) => (
                                <li key={key} className="flex items-center hover:bg-gray-100 hover:cursor-pointer p-1" onClick={() => { setShowStatusList(false); task.task_status_id = key; updateTask(); }}>
                                    <div className='mx-3'>{getIcon(key)}</div>
                                    <strong>{value}</strong>
                                </li>
                            ))}
                        </ul>

                    </div>
                }
            </OutsideClickWrapper>

        </>
    )
}

export default Row