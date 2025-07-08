import React, { use, useEffect, useRef } from 'react'

function Descriptionbar({ currentTask, role }) {

  const [timeSheets, setTimeSheets] = React.useState([]);
  const [newRow, setNewRow] = React.useState(false);
  const [isEnableAddTask, setIsEnableAddTask] = React.useState(false);
  const [date, setDate] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [taskDescription, setTaskDescription] = React.useState("");
  const [contextMenu, setContextMenu] = React.useState(null);

  const rowRef = useRef();

  async function fetchTimeSheets() {
    console.log("Fetching time sheets for task ID:", currentTask.t_id);
    const res = await fetch(`/api/task_time_sheet?taskId=${currentTask.t_id}`);
    const timeSheets = await res.json();
    setTimeSheets(timeSheets);
    console.log("Task time sheets:", timeSheets);

  }

  useEffect(() => {
    console.log("current task: ", currentTask);
    console.log("current task: ", currentTask.projectName);
    fetchTimeSheets();
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
      console.log("ffffffffffffffff: ", result.timeSheet);
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

  return (
    <aside id="separator-sidebar" className="fixed top-0 right-0 z-40 w-2/3 h-screen transition-transform -translate-x-full sm:translate-x-0 border-l border-black dark:border-white" aria-label="Sidebar">
      <div className="h-full px-5 py-4 overflow-y-auto bg-gray-200 dark:bg-gray-800">

        <div className="bg-gray-300 dark:bg-gray-700 rounded-lg text-gray-900  dark:text-white">
          <h1 className="text-3xl font-bold text-white py-4 rounded-md text-center">
            {currentTask.t_title}
          </h1>
        </div>

        <div className="bg-gray-300 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white mt-4 p-4">
          <div className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <p>{`Task Description: ${currentTask.t_description}`}</p>
          </div>
          {/* Assigns */}
          {/* <div className="flex pt-4 mt-4 space-x-2 font-medium border-t border-gray-200 dark:border-gray-700">
          <Image src={img} alt="Rounded avatar" width={50} height={50} className="rounded-full" />
          <Image src={img} alt="Rounded avatar" width={50} height={50} className="rounded-full" />
          <Image src={img} alt="Rounded avatar" width={50} height={50} className="rounded-full" />
          <svg className="w-3.5 h-3.5 ml-4 mt-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
          </svg>
        </div> */}
          <div className="flex pt-4 mt-4 space-x-2 font-medium border-t border-gray-200 dark:border-gray-700">
            Project: {currentTask.projectName}
          </div>
          <div className="flex pt-4 mt-4 space-x-2 font-medium border-t border-gray-200 dark:border-gray-700">
            status: {{
              '1': 'Open',
              '2': 'On-Going',
              '3': 'Done'
            }[currentTask.task_status_id] || 'Unknown'}
          </div>
          <div className="flex pt-4 mt-4 space-x-2 font-medium border-t border-gray-200 dark:border-gray-700">
            Due Date:{currentTask.due_date}
          </div>
          <div className="flex pt-4 mt-4 space-x-2 font-medium border-t border-gray-200 dark:border-gray-700">
            Time Estimate:{currentTask.time_estimate}
          </div>
          <div className="flex pt-4 mt-4 space-x-2 font-medium border-t border-gray-200 dark:border-gray-700">
            Priority: {currentTask.priority}
          </div>
        </div>


        <div className="bg-gray-300 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white mt-4">
          <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-300 dark:border-gray-600 text-lg font-semibold text-gray-800 dark:text-white tracking-wide">
            Track Times
          </div>
          <table className="w-full text-sm mt-4 text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                  <td className="px-6 py-4">
                    {new Date(timeSheet.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {timeSheet.duration}
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