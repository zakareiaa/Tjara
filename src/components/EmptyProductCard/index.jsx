import React from 'react'
import Skeleton from 'react-loading-skeleton'

const EmptyProductCard = (index) => {
    return (
        <div key={index} className="empty-product-card">
            <div className="product-card-image">
                <Skeleton height={200} style={{ width: '100%' }} />
            </div>
            <div className="product-card-info">
                <Skeleton height={20} style={{ width: '100%', marginTop: '5px' }} />
                <Skeleton height={20} style={{ width: '80%', marginTop: '5px' }} />
                <Skeleton height={20} style={{ width: '50%', marginTop: '5px' }} />
            </div>
        </div>
    )
}

export default EmptyProductCard