import React, { useContext, useEffect, useState } from 'react'
import mainImg from '../../assets/loginimg.svg';
import { UserContext } from '../../context/context.jsx';
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {

    // getting data from context api
    const { signinData, handleSigninChange, isLoggedIn, setIsLoggedIn, login } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    useEffect(() => {
        if(isLoggedIn){
            navigate('/');
        }
    },[]);


    const { mutate, isLoading } = useMutation(
        (user) => axios.post(`http://localhost:5000/auth/login`, user),
        {
            onSuccess: (response) => {
                queryClient.invalidateQueries();
                const { token, user } = response.data;
                login(token, user);
                navigate('/');
            },
            onError: (error) => {
                setErrorMessage(error.response?.data?.error || 'Something went wrong. Please try again.');
                console.log(error);
            }
        }
    )

    const signInHandle = (e) => {
        e.preventDefault();
        setErrorMessage(null);
        mutate(signinData);
    }

    return (
        <div className='p-8 overflow-x-hidden'>
            <div className='flex justify-between'>
                <div className='font-sans flex flex-col gap-8'>
                    <div className='text-2xl font-extrabold tracking-widest text-purple-800'>Paperwrite</div>
                    <div className='flex flex-col'>
                        <div className='flex flex-col gap-5'>
                            <h1 className='text-2xl font-bold'>Sign Up</h1>
                            <h2 className='text-xl font-medium'>Enter your Email and Password to Sign In</h2>
                        </div>
                        <div className='mt-10'>
                            <form onSubmit={signInHandle} className='flex flex-col gap-3'>

                                {errorMessage && (
                                    <div className='text-red-600 mt-2 font-medium'>
                                        {errorMessage}
                                    </div>
                                )}

                                <label>Email</label>
                                <input className='p-3 border-2 border-purple-400 rounded outline-none' type='email' name='email' value={signinData.email} onChange={handleSigninChange} required />

                                <label>Password</label>
                                <input className='p-3 border-2 border-purple-400 rounded outline-none' type='password' name='password' value={signinData.password} onChange={handleSigninChange} required />

                                <button className={`mt-3 bg-purple-600 px-0 p-3 text-white font-medium text-lg rounded ${isLoading ? 'disabled bg-purple-700' : ''}`}>Sign Up</button>
                            </form>
                        </div>
                        <div className='text-center mt-5 font-medium'>
                            Don't an account? <span className='text-purple-700 font-semibold underline cursor-pointer'><Link to='/auth/signup'>Sign UP here</Link></span>
                        </div>
                    </div>
                </div>
                <div>
                    <img className='w-[600px]' src={mainImg} alt='mainImg' />
                </div>
            </div>
        </div>
    )
}

export default SignIn
