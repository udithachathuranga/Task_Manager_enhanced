import React, { use, useEffect, useRef } from 'react'
import OutsideClickWrapper from './OutsideClickWrapper';
import Image from 'next/image';
import { comment } from 'postcss';

function Descriptionbar({ currentTask, role, setShowDescription, userId, setTasklist }) {

  const [timeSheets, setTimeSheets] = React.useState([]);
  const [newRow, setNewRow] = React.useState(false);
  const [isEnableAddTask, setIsEnableAddTask] = React.useState(false);
  const [date, setDate] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [taskDescription, setTaskDescription] = React.useState(currentTask.t_description ? currentTask.t_description : "");
  const [contextMenu, setContextMenu] = React.useState(null);
  const [editDescription, setEditDescription] = React.useState(false);
  const [comments, setComments] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [activities, setActivities] = React.useState([]);

  const rowRef = useRef();

  const statusMap = {
    '1': 'OPEN',
    '2': 'IN PROGRESS',
    '3': 'COMPLETED',
  };

  const colorMap = {
    'OPEN': 'bg-rose-600',
    'IN PROGRESS': 'bg-indigo-600',
    'COMPLETED': 'bg-teal-600',
  };

  const status = statusMap[currentTask.task_status_id];
  const colorClass = colorMap[status] || 'bg-gray-400';

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

  async function fetchTimeSheets() {
    console.log("Fetching time sheets for task ID:", currentTask.t_id);
    const res = await fetch(`/api/task_time_sheet?taskId=${currentTask.t_id}`);
    const timeSheets = await res.json();
    setTimeSheets(timeSheets);
    console.log("Task time sheets:", timeSheets);
  }

  async function fetchComments() {
    console.log("Fetching comments for task ID:", currentTask.t_id);
    const res = await fetch(`/api/task_comments?taskId=${currentTask.t_id}`);
    const comments = await res.json();
    setComments(comments);
    console.log("Task comments:", comments);
  }

  async function fetchActivities() {
    console.log("Fetching activities for task ID:", currentTask.t_id);
    const res = await fetch(`/api/task_activities?taskId=${currentTask.t_id}`);
    const activities = await res.json();
    setActivities(activities);
    console.log("Task activities:", activities);
  }

  useEffect(() => {
    console.log("current task: ", currentTask);
    fetchTimeSheets();
    fetchComments();
    fetchActivities();
    console.log("time sheets: ", timeSheets);
    if (role === "1" || role === "2") {
      setIsEnableAddTask(true);
    }
  }, [])

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      //create task
      const res = await fetch('/api/new_time_sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: currentTask.t_id,
          date,
          duration: parseInt(duration, 10)
        }),
      })
      const result = await res.json();
      if (res.ok) {
        alert("time sheet created successfully");
        setTimeSheets((prev) => [...prev, result.timeSheet]);
        setNewRow(false);
      } else {
        const errorData = await res.json();
        console.error("Error creating time sheet:", errorData);
        alert("Failed to create time sheet: " + errorData.error);
      }
    }
  };

  const handleContextMenu = (e, timeSheetId) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      timeSheetId,
    });
  };

  const handleDeleteTimeSheet = async (timeSheetId) => {
    const confirmed = window.confirm("Are you sure you want to delete this time sheet?");
    if (confirmed) {
      try {
        await deleteTimeSheet(timeSheetId);//api call
        alert('Time Sheet deleted!');
        setContextMenu(null); // close the context menu
        setTimeSheets((prev) => prev.filter((timeSheet) => timeSheet.timeSheetId !== timeSheetId));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const deleteTimeSheet = async (timeSheetId) => {
    try {
      const response = await fetch(`/api/delete_project/${timeSheetId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete time sheet');
      }
      return true; // success
    } catch (error) {
      console.error('Error deleting time sheet:', error);
      throw error;
    }
  };

  const updateDescription = async () => {
    try {
      const res = await fetch('/api/update_task', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          t_id: currentTask.t_id,
          t_description: taskDescription,
        }),
      });

      const newTask = await res.json(); // await is required here
      if (res.ok) {
        setTasklist(prev => [...prev, newTask]);
        currentTask.t_description = taskDescription;
        setEditDescription(false);
      } else {
        console.error("Error creating task:", newTask);
        alert("Failed to create task");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred while creating the task.");
    }
  };

  const saveComment = async () => {
    try {
      const res = await fetch('/api/new_comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: userId,
          date: taskDescription,
          message: message,
          related_task_id: currentTask.t_id,
        }),
      });
      const newComment = await res.json();
      if (res.ok) {
        setMessage("");
        console.log("New comment added:", newComment);
        setComments((prev) => [...prev, newComment.comment]);
      } else {
        console.error("Error creating comment:", newComment);
        alert("Failed to create comment");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred while creating the comment.");
    }
  };

  const formatColomboDateTime = (iso) =>
    new Date(iso).toLocaleString("en-GB", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const TZ = "Asia/Colombo";
  const MS_DAY = 24 * 60 * 60 * 1000;

  function zonedMidnightUTC(d) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ, year: "numeric", month: "numeric", day: "numeric",
    }).formatToParts(d);
    const get = t => Number(parts.find(p => p.type === t).value);
    const utc = Date.UTC(get("year"), get("month") - 1, get("day"));
    const dayIndex = new Date(utc).getUTCDay(); // 0..6
    return { utc, dayIndex };
  }

  function formatSmartDate(iso) {
    const taskDate = new Date(iso);
    const task = zonedMidnightUTC(taskDate);
    const today = zonedMidnightUTC(new Date());
    const diffDays = Math.round((task.utc - today.utc) / MS_DAY);

    if (diffDays === 0) return "Today";
    if (diffDays === -1) return "Yesterday";
    if (diffDays === 1) return "Tomorrow";

    // This week? (Mon–Sun in Colombo)
    const mondayOffset = ((today.dayIndex + 6) % 7);
    const weekStart = today.utc - mondayOffset * MS_DAY;
    const weekEnd = weekStart + 6 * MS_DAY;

    if (task.utc >= weekStart && task.utc <= weekEnd) {
      // 3-letter weekday, e.g., "Wed"
      return new Intl.DateTimeFormat("en-US", {
        timeZone: TZ, weekday: "short",
      }).format(taskDate);
    }

    // Fallback date like "09 Oct 2025"
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ, day: "2-digit", month: "short", year: "numeric",
    }).format(taskDate);
  }

  const isOverdue = (iso) => {
    if (!iso) return false;
    const due = zonedMidnightUTC(new Date(iso)).utc;   // local (Colombo) midnight of due date
    const today = zonedMidnightUTC(new Date()).utc;    // local (Colombo) midnight of today
    return due < today;                                // strictly before today
  };

  return (
    <aside id="separator-sidebar" className="fixed rounded-lg top-0 right-0 z-40 w-1/2 h-screen transition-transform -translate-x-full sm:translate-x-0 border-l border-black dark:border-white" aria-label="Sidebar">

      <div className='absolute right-0 top-0 mx-16 my-10 p-2 hover:bg-gray-100 rounded-md' onClick={() => { setShowDescription(false) }}>
        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
        </svg>
      </div>

      <div className="h-full px-10 py-4 overflow-y-auto bg-white dark:bg-gray-800">

        <h1 className="text-4xl font-bold text-black pt-4 pb-8 rounded-md text-left">
          {currentTask.t_title}
        </h1>

        <div className='flex items-center'>
          <div className={`flex items-center ${colorClass} rounded-lg w-fit h-70 mb-2`}>
            <div className='px-3 py-2'> {getIcon(status, "text-white")} </div>
            <h1 className="text-1xl mr-4 text-white">{status}</h1>
          </div>

          {currentTask.due_date ? (
            <div className='flex items-center ml-10 text-gray-600'>
              <strong>Due : </strong>
              <span className={`${currentTask.due_date && isOverdue(currentTask.due_date) && currentTask.task_status_id != 3 ? "text-red-600" : "text-gray-700"}`}>{currentTask.due_date ? formatSmartDate(currentTask.due_date) : "due"}</span>
            </div>
          ) : (
            <div className='mx-10 text-xs hover:border hover:b-gray-400 p-2 rounded-xl text-red-500'>No Due Dates for this task.</div>
          )}

          <div className="relative flex group/avatar -space-x-1 rtl:space-x-reverse mx-10">
            {currentTask.assigns && currentTask.assigns.length > 0 ? (
              <>
                {currentTask.assigns.map((assign, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 border-2 border-white rounded-full bg-blue-600 dark:border-gray-800 text-white flex items-center justify-center font-semibold uppercase" title={assign}
                  >
                    {assign.substring(0, 2) || "NA"}
                  </div>
                ))}
              </>
            ) : (
              <div className='text-xs hover:border hover:b-gray-400 p-2 rounded-xl text-red-500'>No assignees for this task.</div>
            )}
          </div>
        </div>

        <div className='relative bg-gray-100 rounded-lg w-full h-20 px-2 py-auto my-5'>
          <div className="flex items-center h-full px-4 w-[calc(100%-20px)]">
            {editDescription ? (
              <OutsideClickWrapper onOutsideClick={() => { setEditDescription(false); setTaskDescription(""); }}>
                <div className='flex items-center'>
                  <input
                    type="text"
                    id="taskTitle"
                    placeholder='Add Description'
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-[500px] p-2.5 "
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    autoFocus
                  />
                  <button
                    className='px-3 py-1 bg-blue-400 hover:bg-blue-500 rounded-lg m-5'
                    onClick={() => { updateDescription() }}
                  >
                    save
                  </button>
                </div>
              </OutsideClickWrapper>
            ) : (
              <div>
                <p onClick={() => { setEditDescription(true) }} className='text-left text-gray-400'>{currentTask.t_description ? currentTask.t_description : "+ Add Description"}</p>
                <svg onClick={() => { setEditDescription(true) }} className="absolute m-4 right-0 bottom-0 w-6 h-6 text-gray-600 dark:text-white z-50" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        <table className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white mt-4 p-4 w-full">
          <tr className='flex item-center my-2'>
            <td className='flex'>
              <svg class="w-6 h-6 text-gray-800 dark:text-white mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z" />
              </svg>
              <strong>Time Estimated :</strong>
            </td>
            <td className='ml-5 mr-28'>
              {currentTask.time_estimate}
            </td>
            <td className='flex'>
              <svg class="w-6 h-6 text-gray-800 dark:text-white mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z" />
              </svg>
              <strong>Time :</strong>
            </td>
            <td className='px-5'>
              {currentTask.time_estimate}
            </td>
          </tr>
          <tr className='flex item-center my-2'>
            <td className='flex'>
              <svg class="w-6 h-6 text-gray-800 dark:text-white mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z" />
              </svg>
              <strong>{currentTask.numberOfSubTasks} Sub Tasks.</strong>
            </td>
          </tr>
        </table>

        <div className='py-4 border-t border-gray-300'>
          <h1 className="text-2xl font-bold text-gray-600 rounded-md text-left ml-4 mb-3">
            Activities
          </h1>

          {activities.length > 0 ? (
            <ul>
              {activities.map((activity, index) => (
                <li className='flex items-center my-1 ml-10 text-gray-600'>
                  <strong>•</strong>
                  <div className='mx-5'>{activity.done_by.u_name} {activity.content}</div>
                  <div className='text-xs'>at {formatColomboDateTime(activity?.date)}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className='mx-10 text-xs hover:border hover:b-gray-400 p-2 rounded-xl text-red-500'>No Activities for this task yet.</div>
          )}


        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
          <div className="flex items-center justify-center pt-4 border-t border-gray-300 dark:border-gray-600 text-lg font-semibold text-gray-800 dark:text-white tracking-wide">
            Track Times
          </div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Time Duration
                </th>
              </tr>
            </thead>
            <tbody>

              {timeSheets?.map((timeSheet, index) => (
                <tr
                  key={timeSheet.tSheetId}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 cursor-pointer hover:bg-gray-300"
                  onContextMenu={(e) => { handleContextMenu(e, timeSheet.tSheetId); console.log("context menu clicked", timeSheet.tSheetId); }}>
                  <td className="px-6 py-2">
                    {new Date(timeSheet.date).toLocaleDateString()}
                  </td>
                  <td className="flex items-center px-6 py-2">
                    <span className='flex-1 ms-3 whitespace-nowrap'>{timeSheet.duration}</span>
                    <button>
                      <svg class="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg">
                        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 6h.01M12 12h.01M12 18h.01" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}

              {newRow &&
                <tr
                  onKeyPress={handleKeyPress}
                  ref={rowRef}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 cursor-pointer hover:bg-gray-300">

                  {/* Due Date */}
                  <td className="px-4 py-2">
                    <input
                      type="date"
                      id="date"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </td>

                  {/* Time Duration */}
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      id="duration"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </td>
                </tr>
              }

              {isEnableAddTask && !newRow &&
                <tr onClick={() => { setNewRow(true); }} className=" dark:bg-gray-800 cursor-pointer hover:bg-gray-300">
                  <th scope="row" className="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                    </svg>
                    <span className="ms-3">Add Time Sheet</span>
                  </th>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div className='border-t border-gray-100 py-2 bg-gray-100 px-4 rounded-lg mb-3'>
          {comments.length} Comments
          {comments.map((comment) => (
            <div className='flex items-start px-5 py-1 my-1 shadow-md rounded-lg bg-white'>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-3 mt-1 font-semibold uppercase" title={comment.sender.u_name}>
                {comment.sender.u_name.substring(0, 2) || "NA"}
              </div>
              <div className='border-b border-gray-100'>
                <div className='flex items-center'>
                  <strong>{comment.sender.u_name}</strong>
                  <div className='text-gray-400 text-sm mx-3'>{comment.date}</div>
                </div>
                <div>{comment.message}</div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label for="chat" className="sr-only">Your comment</label>
          <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
            <textarea id="chat" rows="1" class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your comment..." value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
            <button className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600" onClick={() => { saveComment() }}>
              <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
              </svg>
              <span className="sr-only">Send message</span>
            </button>
          </div>
        </div>

      </div>

      <div className='relative'>
        {contextMenu && (
          <button
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="absolute z-50 bg-red-500 text-white hover:bg-red-300 rounded shadow"
            onClick={() => handleDeleteTimeSheet(contextMenu.timeSheetId)}
          >
            Delete Time Sheet
          </button>
        )}
      </div>


    </aside>
  )
}

export default Descriptionbar