import React from "react";
const PrivateRoute = ({ as: Comp }) => {
    const identity = useIdentityContext();
    return identity.user ? (
        <Comp />
    ) : (
        <div>
            <h3>You are trying to view a protected page. Please log in</h3>
            <Login />
        </div>
    );
}