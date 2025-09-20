import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import { ToastContainer, toast } from 'react-toastify';
import { setUserData } from '../../redux/userDetails/UserSlice';
import { useDispatch } from "react-redux";


const OTP = () => {
    const location = useLocation();
    const email = location.state?.email || '';
    const name = location.state?.name || null; // if name exists → registration
    const [isloder, setisloder] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    useEffect(() => { document.title = "OTP Verification | Eventify"; }, []);

    useEffect(() => {
        const token = localStorage.getItem('garbagoToken');
        const role = localStorage.getItem('garbagoRole');

        if (token) {
            if (role === 'admin') navigate('/admin/dashboard');
            else navigate('/home');
        }
    }, [navigate]);

    const onSubmit = async (data) => {
        if (name) data.name = name; // pass name if registration

        const endpoint = name
            ? "http://localhost:3000/api/auth/verify-register-otp"
            : "http://localhost:3000/api/auth/verify-login-otp";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const res = await response.json();

            if (res.message === "success") {
                // ✅ Save token & role
                localStorage.setItem("garbagoToken", res.token);
                localStorage.setItem("garbagoRole", res.role || "user");

                console.log(res)
                // ✅ Save user in Redux
                if (res.user) {
                    dispatch(setUserData({
                        name: res.user.name,
                        email: res.user.email
                    }));


                    // (optional) persist user in localStorage for reload
                    localStorage.setItem("garbagoUser", JSON.stringify(res.user));
                }

                // ✅ Loader + navigation
                setisloder(true);
                setTimeout(() => {
                    setisloder(false);
                    if (res.role === "admin") navigate("/admin/dashboard");
                    else navigate("/home");
                }, 2000);
            } else {
                toast.error(res.message, {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "light",
                });
            }
        } catch (err) {
            console.error("Error verifying OTP:", err);
            toast.error("Something went wrong. Please try again.", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };


    const resendOTP = async () => {
        const data = { email };
        const endpoint = name
            ? "http://localhost:3000/api/auth/send-register-otp"
            : "http://localhost:3000/api/auth/send-login-otp";

        try {
            const r = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const res = await r.json();

            if (res.message === "success") {
                toast.success('OTP Successfully Sent to Email', {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "light",
                });
            } else {
                toast.info('Unable to Send OTP', {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "light",
                });
            }
        } catch (err) {
            console.error("Error resending OTP:", err);
            toast.error("Something went wrong while resending OTP.", {
                position: "top-right",
                autoClose: 5000,
            });
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
            <div className='flex lg:flex-row flex-col items-center justify-center  lg:justify-around gap-10'>
                <div className="left w-[50%]  flex flex-col items-end ">
                    <img className='w-[70%] h-[95%] hidden rounded-xl lg:block' src="/imgs/loginImg.png" alt="" />
                </div>
                <div className="right lg:w-1/2 flex flex-col h-[50vh] lg:h-[80vh] items-center lg:justify-center">
                    <div className="div w-[400px]">
                        <h1 className='font-bold text-3xl w-[400px] text-center'>Check your inbox</h1>
                        <p className='text-center mt-3'>Enter the 6-digit code we sent to <span className='font-bold'>{email} </span>to finish your login.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} action="" className='flex flex-col gap-4 mt-10'>
                        <input type="hidden" value={email} {...register("email")} />
                        <div className="field flex flex-col items-center justify-center">
                            <input className='md:w-[400px] md:h-[55px] p-2 w-[300px] h-[50px] rounded-sm border border-black ' type="number" placeholder='OTP' {...register("otp", { required: { value: true, message: "Please Enter OTP" }, maxLength: { value: 6, message: "Please Enter Valid OTP" } })} required />
                            {errors.otp && <span className='self-start text-red-500 pl-7 lg:pl-0'>{errors.otp.message}</span>}
                        </div>
                        <button className='bg-purple-500 rounded-sm md:w-[400px] w-[300px] md:h-[54px] h-[50px] flex items-center justify-center gap-2 self-center'>
                            <p className='font-bold text-xl'>Log in</p>
                        </button>
                        <button className='text-purple-400 font-bold underline cursor-pointer text-center hover:text-purple-600' onClick={resendOTP}>Resend code</button>

                    </form>
                    <div className="signup mt-5 bg-[#f6f7f9] p-2 md:p-0 w-[300px] mp-2 md:w-full lg:w-1/2 md:h-[70px] flex justify-center items-center rounded-sm">
                        <Link to={'/login'} className='text-purple-400 hover:text-purple-600 font-bold underline cursor-pointer'>Log in to a different account</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OTP