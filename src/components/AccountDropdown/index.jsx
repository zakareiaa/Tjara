// AccountDropdown.jsx
import React from 'react';
import { User, LogOut, LayoutDashboard, ShoppingBag, PlusCircle } from 'lucide-react';
import ImageWithFallback from '../ImageWithFallback/ImageWithFallback';
import './style.css';

const AccountDropdown = ({ currentUser, logout, signInPopup }) => {
    const canAddProducts = currentUser?.role === 'admin' || currentUser?.role === 'vendor';
    const isAdmin = currentUser?.role === 'admin';
    const isVendor = currentUser?.role === 'vendor';
    const isCustomer = currentUser?.role === 'customer';
    const userProfile = currentUser?.thumbnail?.media?.optimized_media_url;

    return (
        <div className="account-dropdown">
            {currentUser?.authToken ? (
                <div className="user-trigger">
                    <div className="user-avatar">
                        <ImageWithFallback url={userProfile} name={currentUser?.first_name} />
                    </div>
                    <div className="user-info">
                        <span className="user-name">
                            {`${currentUser?.first_name} ${currentUser?.last_name}`}
                        </span>
                        {/* <span className="user-role">
                            {currentUser?.role}
                        </span> */}
                    </div>
                </div>
            ) : (
                <button className="login-button" onClick={signInPopup}>
                    <User size={20} />
                    <span>Account</span>
                </button>
            )}

            {currentUser?.authToken && (
                <div className="dropdown-menu">
                    <div className="dropdown-header">
                        <p className="header-label">Signed in as (<span className='user-role'>{currentUser?.role}</span>)</p>
                        <p className="user-email">{currentUser?.email}</p>
                    </div>

                    <div className="menu-items">
                        <a href={`${import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT}`} target='_blank' className="menu-item">
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </a>

                        {isCustomer ? (
                            <a href={`${import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT}/placed-orders`} target='_blank' className="menu-item">
                                <ShoppingBag size={18} />
                                <span>My Orders</span>
                            </a>
                        ) : null}

                        {canAddProducts && (
                            <a href={`${import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT}/products/add`} target='_blank' className="menu-item">
                                <PlusCircle size={18} />
                                <span>Add New Product</span>
                            </a>
                        )}
                    </div>

                    <div className="menu-divider" />

                    <div className="menu-footer">
                        <button onClick={logout} className="logout-button">
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountDropdown;