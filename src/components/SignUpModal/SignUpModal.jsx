import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import PhoneInput from 'react-phone-input-2';
import { Info, ChevronRight, ChevronDown } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";

import AUTH from "@client/authClient";
import { usePopup } from "@components/DataContext";

import eyeImage from "./assets/eye.svg";

import 'react-phone-input-2/lib/style.css';
import './style.css'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SignUpModal() {
  const { setSignupPopup, signInPopup, signupPopup, ShowSmsVerificationPopup, ReferrelProgramRegisterPopup } = usePopup();
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Password, setPassword] = useState("");
  const [Role, setRole] = useState("customer");
  const [StoreName, setStoreName] = useState("");
  const [Loading, setLoading] = useState("");
  const [ReferrelProgramInvitationCode, setReferrelProgramInvitationCode] = useState("");
  const [showInvitationField, setShowInvitationField] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const PasswordField = useRef();
  const captchaRef = useRef(null);
  const Query = useQuery();
  const [manualToggleState, setManualToggleState] = useState(false);

  /* -------------------------------------------------------------------------------------------- */
  /*                                     Handle Register Form                                     */
  /* -------------------------------------------------------------------------------------------- */

  // Check if the application is running on localhost
  useEffect(() => {
    const hostname = window.location.hostname;
    setIsLocalhost(hostname === 'localhost' || hostname === '127.0.0.1');
  }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  // Handle captcha verification
  const onCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  const handleRegister = async (e) => {
    e.preventDefault();

    if (FirstName == '' || FirstName == undefined || FirstName == null) {
      toast.error('First name is required!');
      return;
    }

    if (LastName == '' || LastName == undefined || LastName == null) {
      toast.error('Last name is required!');
      return;
    }

    if (Email == '' || Email == undefined || Email == null) {
      toast.error('Email is required!');
      return;
    }

    if (Phone == '' || Phone == undefined || Phone == null) {
      toast.error('Phone number is required!');
      return;
    } else if (Phone.match(/[a-z]/i)) {
      toast.error('Phone number should not contain any characters!');
      return;
    } else if (Phone.length < 5) {
      toast.error('Phone number should be at least 8 digits long!');
      return;
    } else if (Phone.length > 15) {
      toast.error('Phone number should not be more than 15 digits long!');
      return;
    }

    if (Password == '' || Password == undefined || Password == null) {
      toast.error('Password is required!');
      return;
    }

    if (Role == '' || Role == undefined || Role == null) {
      toast.error('Role check is required!');
      return;
    }

    if (Role == 'vendor' && (StoreName == '' || StoreName == undefined || StoreName == null)) {
      toast.error('Store Name is required!');
      return;
    }

    // Skip captcha verification if we're on localhost
    if (!isLocalhost && !captchaVerified) {
      toast.error('Please complete the CAPTCHA verification.');
      return;
    }

    setLoading(true);

    const ApiParams = {
      first_name: FirstName,
      last_name: LastName,
      email: Email,
      phone: Phone,
      password: Password,
      role: Role,
    };

    if (Role == 'vendor') {
      ApiParams.store_name = StoreName;
    }

    if (ReferrelProgramInvitationCode !== '') {
      ApiParams.invited_by = ReferrelProgramInvitationCode;
    }

    const { data, error } = await AUTH.register(ApiParams);

    if (data) {
      toast.success(data.message);

      localStorage.setItem('userID', data.user_id);

      // Store email verification status in localStorage
      // if (data.verification_required) {
      localStorage.setItem('pendingEmailVerification', 'true');
      localStorage.setItem('verificationEmail', Email);
      // }

      if (data.user_role == 'customer') {
        setSignupPopup(false);
        signInPopup();
      } else {
        ShowSmsVerificationPopup();
      }
    }

    if (error) {
      toast.error(error.data.message);
      // Reset captcha on error
      if (captchaRef.current && !isLocalhost) {
        captchaRef.current.reset();
        setCaptchaVerified(false);
      }
    }

    setLoading(false);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    setRole('customer');
  }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  // Toggle invitation field visibility
  const toggleInvitationField = () => {
    setManualToggleState(!manualToggleState);
  };

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (Query.get('invited_by') && Query.get('invited_by') !== '' && Query.get('invited_by') !== null && Query.get('invited_by') !== undefined) {
      setReferrelProgramInvitationCode(Query.get('invited_by'));
      setShowInvitationField(true);
    }
  }, [Query]);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invitedBy = params.get('invited_by');

    if (invitedBy) {
      setReferrelProgramInvitationCode(invitedBy);
    }
  }, []);

  /* --------------------------------------------- X -------------------------------------------- */

  useEffect(() => {
    if (ReferrelProgramInvitationCode !== '' &&
      ReferrelProgramInvitationCode !== null &&
      ReferrelProgramInvitationCode !== undefined) {

      // No visibility changes here
      setTimeout(() => {
        ReferrelProgramRegisterPopup();
      }, 1000);
    }
  }, [ReferrelProgramInvitationCode]);

  /* -------------------------------------------------------------------------------------------- */
  /*                                               X                                              */
  /* -------------------------------------------------------------------------------------------- */

  return (
    <div className={`loginModal ${signupPopup ? "active" : ""}`}>
      <div className="background-transparent-layer" onClick={() => setSignupPopup(false)} />
      <div className="login-modal-container">
        <p className="sign-to-heading">Register your account</p>

        <div className="sign-to-field-box">
          <label htmlFor="">Register as:</label>
          <div className="roles">
            <div className="role">
              <input id="role-vendor" checked={Role == 'vendor'} type="radio" name="role" style={{ cursor: 'pointer' }} value="vendor" onChange={(e) => setRole(e.target.value)} />
              <label htmlFor="role-vendor" style={{ cursor: 'pointer' }}>Seller</label>
            </div>
            <div className="role">
              <input id="role-customer" checked={Role == 'customer'} type="radio" name="role" style={{ cursor: 'pointer' }} value="customer" onChange={(e) => setRole(e.target.value)} />
              <label htmlFor="role-customer" style={{ cursor: 'pointer' }}>Customer</label>
            </div>
          </div>
        </div>

        <div className="twin-fields" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
          <div className="sign-to-field-box">
            <label htmlFor="">First Name</label>
            <input type="text" value={FirstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div className="sign-to-field-box">
            <label htmlFor="">Last Name</label>
            <input type="text" value={LastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>

        {Role == 'vendor' && (<div className="sign-to-field-box">
          <label htmlFor="">Store Name</label>
          <input type="text" value={StoreName} onChange={(e) => setStoreName(e.target.value)} />
        </div>)}

        <div className="sign-to-field-box">
          <label htmlFor="">Email Address</label>
          <input type="email" value={Email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="sign-to-field-box">
          <label htmlFor="">Password</label>
          <div className="password-field">
            <input type="password" ref={PasswordField} value={Password} onChange={(e) => setPassword(e.target.value)} />
            <img src={eyeImage} onClick={() => PasswordField.current.type === 'password' ? PasswordField.current.type = 'text' : PasswordField.current.type = 'password'} alt="" />
          </div>
        </div>

        <div className="sign-to-field-box">
          <label htmlFor="">Phone</label>
          <PhoneInput country={'lb'} value={Phone} excludeCountries={['il']} onChange={setPhone} />
        </div>

        {/* Collapsible Invitation Code section */}
        <div className="invitation-code-section">
          <div
            className="invitation-toggle"
            onClick={toggleInvitationField}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '10px 15px 10px 5px',
              color: '#555',
              fontWeight: '500',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              margin: '10px 0',
              transition: 'background-color 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {showInvitationField ? <ChevronDown size={18} style={{ marginRight: '8px' }} /> : <ChevronRight size={18} style={{ marginRight: '8px' }} />}
              <span>Invited by a friend?</span>
            </div>
            <span>+</span>
          </div>

          {manualToggleState && (
            <div className="sign-to-field-box" style={{
              marginTop: '8px',
              animation: 'fadeIn 0.3s ease-in-out',
              padding: '10px',
              backgroundColor: '#f9f9f9',
              borderRadius: '5px'
            }}>
              <label htmlFor="invitation-code">Enter your invitation code here: (Optional)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  id="invitation-code"
                  name="invited_by"
                  placeholder="Enter invitation code..."
                  value={ReferrelProgramInvitationCode}
                  onChange={(e) => setReferrelProgramInvitationCode(e.target.value)}
                  style={{ paddingRight: '30px' }}
                />
                {ReferrelProgramInvitationCode && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: '#999'
                    }}
                    onClick={() => setReferrelProgramInvitationCode('')}
                  >
                    ✕
                  </div>
                )}
              </div>
              <div style={{ marginTop: '5px', fontSize: '12px', color: '#777' }}>
                <Info size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                Enter a referral code if you were invited by another user
              </div>
            </div>
          )}
        </div>

        {/* Google reCAPTCHA v2 Component - Only show if not localhost */}
        {!isLocalhost && (
          <div className="captcha-container" style={{ margin: '15px 0 0' }}>
            <ReCAPTCHA
              ref={captchaRef}
              sitekey="6LcbYt8qAAAAAPJFUOM70LmbKZnsufGqg4cPf9va"
              onChange={onCaptchaChange}
            />
          </div>
        )}

        <button
          className={`login-btn ${!isLocalhost && !captchaVerified ? 'disabled-btn' : ''}`}
          onClick={handleRegister}
          disabled={Loading || (!isLocalhost && !captchaVerified)}
        >
          {Loading ? "Wait..." : "Register"}
        </button>
        <p className="have-account-heading">Have an account ?</p>
        <button className="create-account-btn" onClick={signInPopup}>
          Login
        </button>
      </div>
    </div>
  );
}

export default SignUpModal;