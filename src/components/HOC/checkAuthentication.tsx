import React from 'react';
import { Navigate } from 'react-router-dom';

const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
    return (props: P) => {
        const isLoggedIn = localStorage.getItem('accessToken') ?? sessionStorage.getItem('accessToken')

        if (!isLoggedIn) {
            return <Navigate to="/login" />;
        }

        return <Component {...props} />;
    };
};

export default withAuth;
