import React from 'react'
import { MdEmail } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Loader';

const SignUp = () => {
    const navigate = useNavigate();
    const [isLoading, setisLoading] = useState(false)
    
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm();


    useEffect(() => {
        const token = localStorage.getItem('garbagoToken');
        const role = localStorage.getItem('garbagoRole');

        if (token) {
            // Already logged in → redirect based on role
            if (role === 'admin') navigate('/admin/dashboard');
            else navigate('/home');
        }
    }, [navigate]);


    const onSubmit = async (data) => {
        console.log(data)
        const sending = await fetch("http://localhost:3000/api/auth/send-register-otp", {
            method: 'POST',
            headers: { 'Content-Type': 'Application/json' },
            body: JSON.stringify(data),
        })
        const res = await sending.json()
        if (res.message == "success") {
            console.log("Success")

            toast.success('OTP Successfully Send to Email', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setisLoading(true)
            setTimeout(() => {
                setisLoading(false);
                navigate('/otp', { state: { email: data.email,name:data.name } });
            }, 3000)
        }
        else {
            console.log("Failed")
            toast.info('Account Already Exists!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setisLoading(true)

            setTimeout(() => {
                setisLoading(false);
                navigate('/login');
            }, 3000)
        }
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {isLoading && <Loader />}
            <div className='flex lg:flex-row flex-col items-center justify-center  lg:justify-around gap-10 mt-24 mb-[200px]'>
                <div className="left w-[50%]  flex flex-col items-end ">
                    <img className='w-[70%] h-[95%] hidden rounded-xl lg:block' src="/imgs/loginImg.png" alt="" />
                </div>
                <div className="right lg:w-1/2 flex flex-col h-[50vh] lg:h-[80vh] items-center lg:justify-center">
                    <h1 className='font-bold text-3xl'>Sign up with email</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 mt-10'>
                        <div className="field flex flex-col items-center justify-center">
                            <input className='md:w-[400px] md:h-[55px] p-2 w-[300px] h-[50px] rounded-sm border border-black ' type="text" placeholder='Full name' {...register("name", { required: { value: true, message: "Name is Required!" } })} />
                            {errors.name && <span className='self-start text-red-500 pl-7 lg:pl-0'>{errors.name.message}</span>}
                        </div>
                        <div className="field flex flex-col items-center justify-center">
                            <input className='md:w-[400px] md:h-[55px] p-2 w-[300px] h-[50px] rounded-sm border border-black ' type="email" placeholder='Email' {...register("email", { required: { value: true, message: "Email is Required!" }, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: "Please enter a valid email address" } })} />
                            {errors.email && <span className='self-start text-red-500 pl-7 lg:pl-0'>{errors.email.message}</span>}
                        </div>
                        <div className="field md:w-[400px] w-[400px] md:ml-0 ml-10  flex px-7 md:px-0 gap-2">
                            <input className='size-5' type="checkbox" id='checkme' />
                            <label htmlFor="checkme" className='w-full cursor-pointer text-sm'>Send me special offers, personalized recommendations, and booking tips.</label>
                        </div>
                        <button disabled={isSubmitting} className='bg-purple-500 rounded-sm md:w-[400px] w-[300px] md:h-[54px] h-[50px] flex items-center justify-center gap-2 self-center'>
                            <MdEmail className='size-6' />
                            <p className='font-bold '>Continue with email</p>
                        </button>
                        <div className="otherSign flex justify-center items-center gap-2">
                            <div className='md:w-[100px] w-[50px] h-0 border border-grey-900'></div>
                            <p>Other sign up options</p>
                            <div className='md:w-[100px] h-0 w-[50px] border border-grey-900'></div>
                        </div>
                        <div className="options flex items-center justify-center gap-10">
                            <div className='border border-purple-600 p-2 rounded-sm w-[55px] flex items-center justify-center h-[50px] hover:bg-purple-200 cursor-pointer'>
                                <FcGoogle size={30} className='' />
                            </div>
                            <div className='border border-purple-600 p-2 rounded-sm w-[55px] flex items-center justify-center h-[50px] hover:bg-purple-200 cursor-pointer'>
                                <img className='w-[35px] h-[35px]' src="/imgs/faceboo.png" alt="" />
                            </div>
                            <div className='border border-purple-600 p-2 rounded-sm w-[55px] flex items-center justify-center h-[50px] hover:bg-purple-200 cursor-pointer'>
                                <img className='w-[30px] h-[30px]' src="/imgs/apple.png" alt="" />
                            </div>
                        </div>
                        <div className="policy w-[300px] mx-auto text-center">
                            <p className='text-sm'>By signing up,you agree to our <span className='text-purple-400 underline cursor-pointer'>Terms of use</span> and <span className='text-purple-400 underline cursor-pointer'>Privacy Policy.</span></p>
                        </div>
                    </form>

                    <div className="login mt-5 bg-[#f6f7f9] p-2 md:p-0 w-[300px] mp-2 md:w-full lg:w-1/2 md:h-[70px] flex justify-center items-center rounded-sm">
                        <h3 className='text-xl'>Already have an account?<Link to={'/login'} className='text-purple-400 hover:text-purple-600 font-bold underline cursor-pointer'>Log in</Link></h3>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUp