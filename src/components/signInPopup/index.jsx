import React, { useState } from 'react'
import "./style.css"
import LoginModal from "@components/LoginModal/LoginModal";
import SignUpModal from "@components/SignUpModal/SignUpModal";
import { usePopup } from "@components/DataContext";
const index = () => {
  const {accountCreateBtn, signInPopup,openSigninPopup, setopenSigninPopup  } = usePopup(); 
  return (
<>

    {openSigninPopup && 
      <div className='SinginPopup'>
        <div className="bg" onClick={()=>setopenSigninPopup(false)}></div>
        <div className="container">
            <h2>Please register or login to continue</h2>
            <p>Pellentesque sed lectus nec tortor tristique accumsan quis dictum risus. Donec volutpat mollis nulla non facilisis.</p>
            <div className="buttons">
                <button onClick={()=>{
                  accountCreateBtn()
                  setopenSigninPopup(false)}}>Regiter</button>
                <button onClick={()=>{
                  signInPopup()
                  setopenSigninPopup(false)}}>Login</button>
            </div>
        </div>
    </div>}
</>
  )
}

export default index