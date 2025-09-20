import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Payment = () => {
    const { eventId } = useParams();
    const navigate = useNavigate(); // ✅ useNavigate for redirection
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => { document.title = "Payment | Eventify"; }, []);

    useEffect(() => {
        const token = localStorage.getItem('garbagoToken');
        const role = localStorage.getItem('garbagoRole');

        if (!token || role !== 'user') {
            toast.error('Access denied! User only.', { position: 'top-right' });
            navigate('/login');
        }
    }, [navigate]);
    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const token = localStorage.getItem("garbagoToken");

                const res = await fetch("http://localhost:3000/api/payment/getPaymentByEvent", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ eventId })
                });

                const data = await res.json();
                if (data.status === "success") setPaymentData(data.data);
                else toast.error(data.message || "Error fetching payment data");
            } catch (err) {
                console.error(err);
                toast.error("Error fetching payment details");
            } finally {
                setLoading(false);
            }
        };
        fetchPayment();
    }, [eventId]);

    const handlePay = () => {
        if (!paymentData) return;

        const options = {
            key: "rzp_test_fdMxs1EwOfxqvG",
            amount: Math.round(paymentData.amount * 100),
            currency: "INR",
            name: paymentData.renterName,
            description: `Pay for ${paymentData.platformName}`,
            method: { upi: true, card: false, netbanking: false, wallet: false },
            prefill: { email: paymentData.email },
            handler: async function (response) {
                try {
                    const token = localStorage.getItem("garbagoToken");

                    const res = await fetch("http://localhost:3000/api/booking/book", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            eventId,
                            paymentId: response.razorpay_payment_id
                        }),
                    });

                    const data = await res.json();
                    if (data.status === "success") {
                        toast.success("🎉 Event booked successfully!");
                        // ✅ Navigate to /mybooking after a short delay
                        setTimeout(() => {
                            navigate("/mybooking");
                        }, 1000);
                    } else {
                        toast.error(`❌ ${data.message}`);
                    }
                } catch (err) {
                    console.error(err);
                    toast.error("❌ Error booking the event");
                }
            },
            modal: { ondismiss: () => toast.info("❌ Payment Cancelled") },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    if (loading) return <p className="text-center py-10">Loading...</p>;
    if (!paymentData) return <p className="text-center py-10 text-red-500">No payment data available</p>;

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
                <h1 className="text-2xl font-bold mb-4">Pay via UPI</h1>

                <div className="mb-4">
                    <label className="block font-semibold mb-1">UPI ID</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded-md"
                        value={paymentData.upiId}
                        readOnly
                    />
                </div>

                <div className="mb-4">
                    <p className="text-gray-700">
                        Amount: <span className="font-bold">₹{paymentData.amount}</span>
                    </p>
                    <p className="text-gray-700">
                        Pay to: <span className="font-bold">{paymentData.renterName}</span>
                    </p>
                </div>

                <button
                    onClick={handlePay}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-md"
                >
                    Pay Now
                </button>
            </div>
        </>
    );
};

export default Payment;
