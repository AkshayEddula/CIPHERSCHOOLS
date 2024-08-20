import React, { useContext, useState } from 'react'
import mainImg from '../../assets/loginimg.svg';
import { UserContext } from '../../context/context.jsx';
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

const SignUp = () => {

    // getting data from context api
    const { data, handleChange } = useContext(UserContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // define mutation for signup
    const { mutate, isLoading } = useMutation(
        (newUser) => axios.post('http://localhost:5000/auth/signup', newUser),
        {
            onSuccess: () => {
                queryClient.invalidateQueries();
                navigate('/auth/login');
            },
            onError: (error) => {
                alert("error");
                console.log(error);
            }
        }
    );

    // signup handling
    const signupHandle = (e) => {
        e.preventDefault();
        mutate(data);
    }

    return (
        <div className='p-8 overflow-x-hidden'>
            <div className='flex justify-between'>
                <div className='font-sans flex flex-col gap-8'>
                    <div className='text-2xl font-extrabold tracking-widest text-purple-800'>Paperwrite</div>
                    <div className='flex flex-col'>
                        <div className='flex flex-col gap-5'>
                            <h1 className='text-2xl font-bold'>Sign Up</h1>
                            <h2 className='text-xl font-medium'>Enter your name,email and Password to Sign Up</h2>
                        </div>
                        <div className='mt-10'>
                            <form onSubmit={signupHandle} className='flex flex-col gap-3'>
                                <label>Name</label>
                                <input className='p-3 border-2 border-purple-400 rounded outline-none' type='text' name='name' value={data.name} onChange={handleChange} required />

                                <label>Email</label>
                                <input className='p-3 border-2 border-purple-400 rounded outline-none' type='email' name='email' value={data.email} onChange={handleChange} required />

                                <label>Password</label>
                                <input className='p-3 border-2 border-purple-400 rounded outline-none' type='password' name='password' value={data.password} onChange={handleChange} required />

                                <button className={`mt-3 bg-purple-600 px-0 p-3 text-white font-medium text-lg rounded ${isLoading ? 'disabled bg-purple-700' : ''}`}>Sign Up</button>
                            </form>
                        </div>
                        <div className='text-center mt-5 font-medium'>
                            Have an account? <span className='text-purple-700 font-semibold underline cursor-pointer'><Link to='/auth/login'>Sign in here</Link></span>
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

export default SignUp
