import React from 'react'

function AccountDetails({ setShowAccountDetails, userDetails }) {

    const [editPassword, setEditPassword] = React.useState(false);
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError] = React.useState("");

    async function handleSubmit() {
        if (newPassword !== confirmPassword) {
            setError("New Password and Confirm Password do not match");
            setNewPassword("");
            setConfirmPassword("");
            return;
        }
        const res = await fetch('/api/update_password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });
        const responce = await res.json();
        console.log("Responce from update password:", responce);
        if (res.status === 200) {
            alert("Password updated successfully");
            setEditPassword(false);
        } else {
            console.log("Error updating password:", res);
            setError(responce.error);
        }
    }

    return (
        <>
            <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={() => setShowDescription(false)}  // Optional: close on background click
            />
            <div className='absolute top-5 right-64 w-2/3 px-20 py-10 bg-white border border-gray-300 rounded-md shadow-lg z-50 h-fit'>
                <div className='absolute right-0 top-0 mx-16 my-10 p-2 hover:bg-gray-100 rounded-md' onClick={() => { setShowAccountDetails(false) }}>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                    </svg>
                </div>
                {editPassword ? (
                    <form action={handleSubmit} className='w-full h-full flex flex-col items-center'>
                        <h2 className='text-6xl font-bold text-gray-800 dark:text-white mb-10'>Change Password</h2>
                        <div className='flex flex-col gap-5 mt-12 mb-5 w-5/6'>
                            <div className='flex items-center justify-between text-gray-800 text-2xl dark:text-gray-400'>
                                <div>
                                    Current Password :
                                </div>
                                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className='border border-gray-300 rounded px-2.5 py-1 focus:outline-none focus:ring-0 w-1/2' />
                            </div>
                            <div className='flex items-center justify-between text-gray-800 text-2xl dark:text-gray-400'>
                                <div>
                                    New Password :
                                </div>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='border border-gray-300 rounded px-2.5 py-1 focus:outline-none focus:ring-0 w-1/2' />
                            </div>
                            <div className='flex items-center justify-between text-gray-800 text-2xl dark:text-gray-400'>
                                <div>
                                    Confirm Password :
                                </div>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='border border-gray-300 rounded px-2.5 py-1 focus:outline-none focus:ring-0 w-1/2' />
                            </div>
                            {error && <p className='text-red-500 text-lg'>{error}</p>}
                        </div>
                        <div className='flex justify-end w-5/6 gap-3'>
                            <button onClick={() => setEditPassword(false)} className='my-10 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors'>
                                Cancel
                            </button>
                            <button className='my-10 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'>
                                Save
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className='w-full h-full'>
                        <div className='flex items-center border-b border-gray-300'>
                            <svg class="w-60 h-60 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clip-rule="evenodd" />
                            </svg>
                            <div className='flex flex-col items-start ml-4'>
                                <h2 className='text-8xl font-bold text-gray-800 dark:text-white'>{userDetails.u_name}</h2>
                                <p className='text-gray-800 text-3xl dark:text-gray-400'>{userDetails.email}</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-5 m-12 w-5/6'>
                            <div className='flex items-center justify-between text-gray-800 text-2xl dark:text-gray-400'>
                                <div>
                                    User Name :
                                </div>
                                <div>
                                    {userDetails.u_name}
                                </div>
                            </div>
                            <div className='flex items-center justify-between text-gray-800 text-2xl dark:text-gray-400'>
                                <div>
                                    Email :
                                </div>
                                <div>
                                    {userDetails.email}
                                </div>
                            </div>
                            <div className='flex items-center justify-between text-gray-800 text-2xl dark:text-gray-400'>
                                <div>
                                    Role :
                                </div>
                                <div>
                                    {userDetails.role.role_name}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setEditPassword(true)} className='m-10 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'>
                            Change Password
                        </button>
                    </div>
                )}

            </div>
        </>

    )
}

export default AccountDetails