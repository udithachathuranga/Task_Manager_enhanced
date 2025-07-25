import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import OutsideClickWrapper from '../(component)/OutsideClickWrapper';

function Row({ task, showDescription, setShowDescription, setCurrentTask, subLevel }) {

    const [viewSubTasks, setViewSubTasks] = useState(false);
    const [showProjectUsers, setShowProjectUsers] = useState(false);
    const [showPriorityList, setShowPriorityList] = useState(false);
    const [isTaskOptionOpen, setIsTaskOptionOpen] = useState(false);
    const [subtasks, setSubTasks] = useState([
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
        },
        {
            t_id: 2,
            t_title: "Setup backend API",
            assigns: ["Charlie"],
            due_date: "2025-07-18",
            priority: 2,
            task_status_id: "3", // Completed
            time_estimate: 10
        }
    ]);

    useEffect(() => {
        //const subtasks = fetch sub tasks related to task id

    }, []);

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

    const colorClass = colorMap[name] || 'bg-gray-400';
    const textClass = textColorMap[name] || 'text-gray-400';
    const marginLeft = 4 + 50 * subLevel;
    console.log("new margin: ", marginLeft);
    subLevel++;

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

    return (
        <>
            <tr
                key={task.t_id}
                className="group bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 cursor-pointer hover:bg-gray-300 z-0 text-size-2xl"
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

                    <div className="mx-4">
                        {getIcon(task.task_status_id)}
                    </div>

                    <strong onClick={() => { setShowDescription(!showDescription); setCurrentTask(task); }} className='transition-transform hover:scale-[1.05]'>{task.t_title}</strong>
                </th>

                <th>
                    <div className='flex items-center'>
                        {/* edit task */}
                        <div className='border rounded-md mr-1 border-gray-400 w-fit invisible group-hover:visible'>
                            <svg className="w-5 h-5 text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28" />
                            </svg>
                        </div>
                        {/* add subtasks */}
                        <div className='border rounded-md mr-1 border-gray-400 w-fit invisible group-hover:visible'>
                            <svg className="w-5 h-5 text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
                            </svg>
                        </div>
                    </div>

                </th>

                <td onClick={() => { setCurrentTask(task); }} className="px-6">

                </td>

                <td className="px-6">
                    <div className="w-fit px-2 py-1 border border-transparent hover:border-gray-400 rounded">
                        {new Date(task.due_date).toLocaleDateString()}
                    </div>
                </td>



                <td onClick={() => { setCurrentTask(task); }} className="pl-6">
                    {/* {task.assigns?.join(', ')} */}
                    <div className="relative flex group/avatar -space-x-1 rtl:space-x-reverse w-[100px]">
                        <Image className="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800" src="/images/uditha.jpg" width={40} height={40} alt="uditha" />
                        <Image className="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800" src="/images/uditha.jpg" width={40} height={40} alt="uditha" />
                        <Image className="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800" src="/images/uditha.jpg" width={40} height={40} alt="uditha" />
                        <div className="hidden group-hover/avatar:flex items-center justify-center w-7 h-7 text-xs font-medium text-white bg-gray-300 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800" onClick={(e) => showProjectUserList(e, task.t_id)}>+</div>
                    </div>
                </td>

                <td onClick={() => { setCurrentTask(task); }} className="px-6">
                    <div className="w-fit px-2 py-1 border border-transparent hover:border-gray-400 rounded">
                        {new Date(task.due_date).toLocaleDateString()}
                    </div>
                </td>

                <td onClick={() => { setCurrentTask(task); }} >
                    <div className="w-fit px-2 py-1 border border-transparent hover:border-gray-400 rounded">
                        <div className="flex items-center px-6">
                            <svg className="text-gray-400 dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z" />
                            </svg>
                            {task.time_estimate}
                        </div>
                    </div>
                </td>

                <td onClick={() => { setCurrentTask(task); }} >
                    <div className="w-fit px-2 py-1 border border-transparent hover:border-gray-400 rounded">
                        <div className="flex items-center px-6">
                            <svg className="text-gray-400 dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z" />
                            </svg>
                            {task.time_estimate}
                        </div>
                    </div>
                </td>

                <td onClick={() => { setCurrentTask(task); }} >
                    <div onClick={(e) => handlePriorityClick(e, task.t_id)} className="w-fit px-2 py-1 border border-transparent hover:border-gray-400 rounded">
                        <div className="flex items-center px-6">
                            <svg className="text-gray-400 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 14v7M5 4.971v9.541c5.6-5.538 8.4 2.64 14-.086v-9.54C13.4 7.61 10.6-.568 5 4.97Z" />
                            </svg>
                            {task.priority}
                        </div>
                    </div>
                </td>

                <td onClick={() => { setCurrentTask(task); }} className="px-6">
                    {/* {task.assigns?.join(', ')} */}
                    <div className="relative flex group/avatar -space-x-1 rtl:space-x-reverse">
                        <Image className="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800" src="/images/uditha.jpg" width={40} height={40} alt="uditha" />
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

            {viewSubTasks &&
                subtasks?.map((task, index) => (
                    <React.Fragment key={task.t_id}>
                        <Row task={task} subLevel={subLevel} />
                    </React.Fragment>
                ))
            }

            {/* Assignee Dropdown */}
            <OutsideClickWrapper onOutsideClick={() => setShowProjectUsers(false)}>
                {showProjectUsers &&
                    <div className={`fixed z-10 w-40 p-2 bg-white border rounded-md shadow-lg ${showProjectUsers ? 'block' : 'hidden'}`} style={{ top: `${showProjectUsers.y + 20}px`, left: `${showProjectUsers.x - 100}px`, position: 'fixed' }}>
                        <ul className="py-1">

                            <li className='flex items-center hover:bg-gray-100'>
                                <Image className="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800" src="/images/uditha.jpg" width={40} height={40} alt="uditha" />
                                Uditha
                            </li>
                            <li className='flex items-center hover:bg-gray-100'>
                                <Image className="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800" src="/images/uditha.jpg" width={40} height={40} alt="uditha" />
                                Uditha
                            </li>
                            <li className='flex items-center hover:bg-gray-100'>
                                <Image className="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800" src="/images/uditha.jpg" width={40} height={40} alt="uditha" />
                                Uditha
                            </li>

                        </ul>
                    </div>
                }
            </OutsideClickWrapper>

            {/* Task Options */}
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

            {/* Priority List Dropdown */}
            <OutsideClickWrapper onOutsideClick={() => setShowPriorityList(false)}>
                {showPriorityList &&
                    <div className={`fixed z-10 w-40 p-2 bg-white border rounded-md shadow-lg ${showPriorityList ? 'block' : 'hidden'}`} style={{ top: `${showPriorityList.y + 20}px`, left: `${showPriorityList.x - 100}px`, position: 'fixed' }}>
                        <ul className="py-1">
                            <li className='flex items-center hover:bg-gray-100'>
                                <svg class="w-6 h-6 text-gray-500 dark:text-white mx-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z" />
                                </svg>
                                Low
                            </li>
                            <li className='flex items-center hover:bg-gray-100'>
                                <svg class="w-6 h-6 text-blue-500 dark:text-white mx-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z" />
                                </svg>
                                Normal
                            </li>
                            <li className='flex items-center hover:bg-gray-100'>
                                <svg class="w-6 h-6 text-yellow-300 dark:text-white mx-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z" />
                                </svg>
                                High
                            </li>
                            <li className='flex items-center hover:bg-gray-100'>
                                <svg class="w-6 h-6 text-red-500 dark:text-white mx-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z" />
                                </svg>
                                Urgent
                            </li>
                        </ul>
                    </div>
                }
            </OutsideClickWrapper>

        </>
    )
}

export default Row