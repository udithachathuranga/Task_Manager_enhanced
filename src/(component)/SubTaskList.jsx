'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import OutsideClickWrapper from './OutsideClickWrapper';

const tasks = [
    {
        t_id: 1,
        t_title: "Design landing page",
        assigns: ["Alice", "Bob"],
        due_date: "2025-07-20",
        priority: 1,
        task_status_id: "1", // Open
        time_estimate: 5
        
    },
    {
        t_id: 2,
        t_title: "Setup backend API",
        assigns: ["Charlie"],
        due_date: "2025-07-18",
        priority: 2,
        task_status_id: "2", // On-Going
        time_estimate: 10
    }
];


function SubTaskList({ taskId, editTaskId, setEditTaskId, subLevel }) {

    const [newRow, setNewRow] = useState();
    let newMargin = 4 + 8 * subLevel;
    console.log("new margin:", newMargin);

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

    return (
        <>
            {tasks?.map((task, index) =>
                editTaskId === task.t_id ? (
                    <tr
                        key={task.t_id}
                        onKeyPress={handleKeyPress}
                        ref={rowRef}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 cursor-pointer hover:bg-gray-300 "
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

                        <td>
                        </td>

                        {/* Assign Dropdown */}
                        <td className="px-4 relative" onClick={() => { setTimeout(() => { setIsEditing(true); }, 500); }}>
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
                                                <div key={task.t_id} className="px-3 py-1.5 hover:bg-gray-100 rounded text-gray-800">
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
                        <td className="px-4" onClick={() => { setTimeout(() => { setIsEditing(true); }, 500); }}>
                            <input
                                type="date"
                                id="dueDate"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </td>

                        {/* Priority */}
                        <td className="px-4" onClick={() => { setTimeout(() => { setIsEditing(true); }, 500); }}>
                            <input
                                type="number"
                                id="priority"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            />
                        </td>

                        {/* Task Status */}
                        <td className="px-4" onClick={() => { setTimeout(() => { setIsEditing(true); }, 500); }}>
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
                        <td className="px-4" onClick={() => { setTimeout(() => { setIsEditing(true); }, 500); }}>
                            <input
                                type="number"
                                id="timeEstimate"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                value={timeEstimate}
                                onChange={(e) => setTimeEstimate(e.target.value)}
                            />
                        </td>

                        {/* Save */}
                        <td className="px-4 bg-blue-400" onClick={() => { setTimeout(() => { setIsEditing(true); }, 500); }}>
                            <button
                                type="button"
                                className="bg-blue-500 text-black px-4 rounded-lg ml-3 hover:bg-red-800 z-0"
                                onClick={updateTask}
                            >
                                Save
                            </button>
                        </td>
                    </tr>
                ) : (
                    <tr
                        key={task.t_id}
                        className="group bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 cursor-pointer hover:bg-gray-300 z-0 text-size-2xl"
                    >

                        <th onClick={() => { setShowDescription(!showDescription); setCurrentTask(task); }} scope="row" className="flex ml-[${newMargin}px] items-center px-6 py-2 font-medium text-gray-700 whitespace-nowrap dark:text-white">
                            <svg className={`w-4 h-4 text-gray-400 ml-[${newMargin}px]`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="12" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M10.271 5.575C8.967 4.501 7 5.43 7 7.12v9.762c0 1.69 1.967 2.618 3.271 1.544l5.927-4.881a2 2 0 0 0 0-3.088l-5.927-4.88Z" clip-rule="evenodd" />
                            </svg>

                            <div className="mx-4">
                                {getIcon(task.task_status_id)}
                            </div>

                            <strong>{task.t_title}</strong>
                        </th>

                        <th>
                            {/* add subtasks */}
                            <div className='border rounded-md border-gray-400 w-fit invisible group-hover:visible'>
                                <svg class="w-3 h-3 text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5" />
                                </svg>
                            </div>
                        </th>

                        <td onClick={() => { setShowDescription(!showDescription); setCurrentTask(task); }} className="px-6">
                            {task.assigns?.join(', ')}
                        </td>

                        <td onClick={() => { setShowDescription(!showDescription); setCurrentTask(task); }} className="px-6">
                            {new Date(task.due_date).toLocaleDateString()}
                        </td>

                        <td onClick={() => { setShowDescription(!showDescription); setCurrentTask(task); }} className="flex items-center px-6">
                            <svg class="text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 14v7M5 4.971v9.541c5.6-5.538 8.4 2.64 14-.086v-9.54C13.4 7.61 10.6-.568 5 4.97Z" />
                            </svg>
                            {task.priority}
                        </td>

                        <td onClick={() => { setShowDescription(!showDescription); setCurrentTask(task); }} className="px-6">
                            {{
                                '1': 'Open',
                                '2': 'On-Going',
                                '3': 'Done'
                            }[task.task_status_id] || 'Unknown'}
                        </td>

                        <td onClick={() => { setShowDescription(!showDescription); setCurrentTask(task); }} className="flex items-center px-6">
                            <svg class="text-gray-400 dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z" />
                            </svg>

                            {task.time_estimate}
                        </td>

                        <td className="px-6">
                            <button
                                type="button"
                                className="text-black px-4 rounded-lg hover:bg-red-800 z-0"
                                onClick={(e) => handleTaskOptionClick(e, task.t_id)}
                            >
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 6h.01M12 12h.01M12 18h.01" />
                                </svg>

                            </button>

                        </td>

                    </tr>
                )
            )}

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

        </>
    )
}

export default SubTaskList