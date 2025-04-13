import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AUTH from '@client/authClient';
import { toast } from 'react-toastify';
import { usePopup } from "@components/DataContext";
import { useAuth } from "@contexts/Auth";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function ResetPassword() {
    const query = useQuery();
    const { resetPasswordPopup, setResetPasswordPopup } = usePopup();
    const [email, setEmail] = useState(query.get('email') || '');
    const [token, setToken] = useState(query.get('token') || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showResetPassForm, setShowResetPassForm] = useState(false);
    const resetPassQuery = query.get('password-reset');
    const { login } = useAuth();

    useEffect(() => {
        if (resetPassQuery === 'true') {
            setTimeout(() => {
                if (token && email) {
                    setShowResetPassForm(true);
                    setResetPasswordPopup(true)
                } else {
                    toast.error("Invalid password reset link");
                    setShowResetPassForm(false);
                    setResetPasswordPopup(false)
                }
            }, 1000)
        }
    }, [resetPassQuery, token, email]);

    /* -------------------------------------------- X ------------------------------------------- */

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        const params = { email, token, password, password_confirmation: confirmPassword };
        const { data, error } = await AUTH.resetPassword(params);
        if (data) {
            toast.success(data.message);
            setResetPasswordPopup(false);
            login(data.user);
        }
        if (error) {
            toast.error(error.data.message);
        }
        setLoading(false);
    };

    /* -------------------------------------------- X ------------------------------------------- */

    return (
        <div className={`loginModal ${resetPasswordPopup ? "active" : ""}`}>
            <div className="background-transparent-layer" onClick={() => setResetPasswordPopup(false)} />
            {showResetPassForm ? (
                <div className="login-modal-container">
                    <p className="sign-to-heading">Reset your password</p>
                    <div className="sign-to-field-box">
                        <label htmlFor="password">New Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="sign-to-field-box">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <button className="login-btn" onClick={handleResetPassword} disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </div>
            ) : (
                <div className="login-modal-container">
                    <p className="sign-to-heading">Invalid Auth token</p>
                </div>
            )}
        </div>
    );
}

export default ResetPassword;
