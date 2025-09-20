import React, { useEffect, useState } from 'react'
import { MdEmail } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Loader';

const Login = () => {
    const navigate = useNavigate();

    const [isloder, setisloder] = useState(false)
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
        console.log(data);
        setisloder(true); // start loader immediately

        try {
            let r = await fetch('http://localhost:3000/api/auth/send-login-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // fix here
                body: JSON.stringify(data)
            });

            let res = await r.json();

            if (res.message === "success") {
                console.log("Success");

                toast.success('OTP Successfully Sent to Email', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                setTimeout(() => {
                    setisloder(false);
                    navigate('/otp', { state: { email: data.email } });
                }, 3000);
            } else {
                console.log("Failed");

                toast.info(res.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                setTimeout(() => {
                    setisloder(false);
                    navigate('/login'); // fixed typo
                }, 3000);
            }
        } catch (error) {
            console.error("Error:", error);
            setisloder(false);
            toast.error("Something went wrong!", { position: "top-right" });
        }
    };


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
            {isloder && <Loader />}
            <div className='flex lg:flex-row flex-col items-center justify-center  lg:justify-around gap-10 mt-24 mb-24 md:w-auto w-screen'>
                <div className="left w-[50%]  flex flex-col items-end ">
                    <img className='w-[70%] h-[95%] hidden rounded-xl lg:block' src="/imgs/loginImg.png" alt="" />
                </div>
                <div className="right lg:w-1/2 flex flex-col h-[50vh] lg:h-[80vh] items-center lg:justify-center">
                    <h1 className="font-bold text-xl md:text-3xl md:w-[400px] text-center">
                        Log in to book your Garba nights and enjoy the festive beats!
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 mt-10'>
                        <div className="field flex flex-col items-center justify-center">
                            <input className='md:w-[400px] md:h-[55px] p-2 w-[300px] h-[50px] rounded-sm border border-black ' type="email" placeholder='Email' {...register("email", { required: { value: true, message: "Email is Required!" }, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: "Please enter a valid email address" } })} />
                            {errors.email && <span className='self-start text-red-500 pl-7 lg:pl-0'>{errors.email.message}</span>}
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
                    </form>
                    <div className="signup mt-5 bg-[#f6f7f9] p-2 md:p-0 w-[300px] mp-2 md:w-full lg:w-1/2 md:h-[70px] flex justify-center items-center rounded-sm">
                        <h3 className='text-xl'>Don't have an account?<Link to={'/'} className='text-purple-400 hover:text-purple-600 font-bold underline cursor-pointer'>Sign up</Link></h3>
                    </div>
                </div>
            </div>
        </>
    )

}
export default Login