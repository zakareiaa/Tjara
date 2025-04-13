import React from 'react'
import './style.css'
import { Info } from 'lucide-react'

const ProductCardNotice = ({ noticeText, className }) => {
  return (
    <div className={`product-card-notice ${className}`}>
      <Info size={18} className='product-card-notice-icon' />
      <div className="product-card-notice-text" dangerouslySetInnerHTML={{ __html: noticeText }}></div>
    </div>

  )
}

export default ProductCardNotice