import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div  className="flex flex-col items-center justify-center py-40">
            {children}
        </div>
    );
}

export default AuthLayout;
 