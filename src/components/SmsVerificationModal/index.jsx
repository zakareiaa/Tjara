import React, { useState } from "react";
import AUTH from "@client/authClient";
import { usePopup } from "@components/DataContext";
import { toast } from "react-toastify";
import { useAuth } from "@contexts/Auth";

function SmsVerificationModal() {
    const { smsVerificationPopup, signInPopup, setSmsVerificationPopup } = usePopup();
    const [verificationCode, setVerificationCode] = useState("");
    const [loading, setLoading] = useState(false);
    const userID = localStorage.getItem('userID');
    const { login } = useAuth();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (verificationCode == '' || verificationCode == null || verificationCode == undefined) {
            toast.error('Please enter your verification code!');
            return;
        }
        setLoading(true);
        const { data, error } = await AUTH.smsVerification({
            user_id: userID ?? '',
            verification_code: verificationCode
        });
        if (data) {
            toast.success(data.message);
            login(data.user);
            setSmsVerificationPopup(false);
        }
        if (error) {
            toast.error(error.data.message);
        }
        setLoading(false);
    };

    return (
        <div className={`loginModal ${smsVerificationPopup ? "active" : ""}`}>
            <div className="background-transparent-layer" onClick={() => setSmsVerificationPopup(false)} />
            <div className="login-modal-container">
                <p className="sign-to-heading">Enter verification code</p>
                <div className="sign-to-field-box">
                    <label htmlFor="">Verification code</label>
                    <input type="number" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                </div>
                <button className="login-btn" onClick={handleForgotPassword}>
                    {loading ? "Verifying..." : "Verify"}
                </button>
                <p className="have-account-heading">Already verified ?</p>
                <button className="create-account-btn" onClick={signInPopup}>
                    Login
                </button>
            </div>
        </div>
    );
}

export default SmsVerificationModal;
