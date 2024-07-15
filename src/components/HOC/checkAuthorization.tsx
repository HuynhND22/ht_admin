import React from 'react';
import { Navigate } from 'react-router-dom';
import getInfoStorege from "../../helpers/getInfoStorege";

const withAdmin = <P extends object>(Component: React.ComponentType<P>) => {
    return (props: P) => {
        const user:any = getInfoStorege.user
        const isAdmin = JSON.parse(user).role

        if (isAdmin !== "Quản trị viên") {
            return <Navigate to="/not-permission" />;
        }

        return <Component {...props} />;
    };
};

export default withAdmin;
