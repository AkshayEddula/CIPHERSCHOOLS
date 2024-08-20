import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../context/context.jsx'

const Nav = () => {

    const {logout} = useContext(UserContext);
    const handleLogout = () => {
        logout();
    }

  return (
    <div className='flex items-center justify-between px-10 py-4 bg-purple-200'>
        <div><h1 className='text-2xl font-extrabold tracking-widest text-purple-800'>Paperwrite</h1></div>
        <div className='flex items-center gap-7'>
            <div className='flex items-center gap-8'>
                <Link className='text-base font-semibold'>Home</Link>
                <Link className='text-base font-semibold'>Tests</Link>
                <Link className='text-base font-semibold'>Scores</Link>
            </div>
            <div>
                <button onClick={handleLogout} className='p-3 py-2 bg-purple-500 text-white font-sans text-base font-medium rounded'>Logout</button>
            </div>
        </div>
    </div>
  )
}

export default Nav
