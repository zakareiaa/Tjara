import React, { useState } from "react";
import AUTH from "@client/authClient";
import { usePopup } from "@components/DataContext";
import { toast } from "react-toastify";

function ForgotPasswordModal() {
    const { forgotPasswordPopup, signInPopup, setForgotPasswordPopup } = usePopup();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (email == '' || email == null || email == undefined) {
            toast.error('Please enter your email!');
            return;
        }
        setLoading(true);
        const { data, error } = await AUTH.forgotPassword({ email });
        if (data) {
            toast.success(data.message);
            setForgotPasswordPopup(false);
        }
        if (error) {
            toast.error(error.data.message);
        }
        setLoading(false);
    };

    return (
        <div className={`loginModal ${forgotPasswordPopup ? "active" : ""}`}>
            <div className="background-transparent-layer" onClick={() => setForgotPasswordPopup(false)} />
            <div className="login-modal-container">
                <p className="sign-to-heading">Reset your password</p>
                <div className="sign-to-field-box">
                    <label htmlFor="">Email Address</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button className="login-btn" onClick={handleForgotPassword}>
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
                <p className="have-account-heading">Remember password ?</p>
                <button className="create-account-btn" onClick={signInPopup}>
                    Login
                </button>
            </div>
        </div>
    );
}

export default ForgotPasswordModal;
