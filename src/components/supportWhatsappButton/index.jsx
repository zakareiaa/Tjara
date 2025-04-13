import React from 'react'
import whatsapp from "./whatsapp.png";
import { useheaderFooter } from "@contexts/globalHeaderFooter";
import { Link } from 'react-router-dom';
import './style.css'

const index = () => {
    const { globalSettings } = useheaderFooter();
    return (
        <div className="footer-fixed-support-buttons fixedContactIcons">
            {/* ---------------------------------------------------------------------------------------- */}
            {/*                                      Live Chat Popup                                     */}
            {/* ---------------------------------------------------------------------------------------- */}
            {/* <img onClick={() => {
                settoggleLiveChat(!toggleLiveChat)
                handleChatSubmit()
            }} src={chat} alt="" /> */}
            <Link target="_blank" to={`https://api.whatsapp.com/send?phone=${globalSettings?.website_whatsapp_number}`}>
                <img width={70} height={70} src={whatsapp} alt="" />
            </Link>
        </div>
    )
}

export default index