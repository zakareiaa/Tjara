import React from 'react'
import loadingGif from "@assets/loading.gif";
import './style.css'

/**
 * RoundLoader component renders a loading animation.
 * 
 * @param {object} props - Component props
 * @param {React.Ref} props.componentRef - Reference to the loader component
 * @returns {JSX.Element} JSX representation of the loader
 */
const RoundLoader = ({ componentRef }) => {
    return (
        <div ref={componentRef} className="loadingAnimGif">
            {/* Image for loading animation */}
            <img src={loadingGif} alt="products-loader" />
        </div>
    )
}

export default RoundLoader