import React, { useEffect, useState, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./Redux/Slices/userSlice";

const ProtectedRoute = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const user = useSelector((state) => state.user);

    const [isChecking, setIsChecking] = useState(true);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const firstCheckDone = useRef(false); // track if first check has run

    useEffect(() => {
        setIsChecking(true);
        setShouldRedirect(false);

        const checkAuth = () => {
            const u = user?.userData;
            const token = user?.token;



            // If no user or token → logout + redirect
            if (!u || !token) {
                dispatch(logout());
                setShouldRedirect(true);
                setIsChecking(false);
                return;
            }

            // Admin → full access
            if (u?.user?.role === "Admin") {
                setIsChecking(false);
                return;
            }

            // Employee → must be active + have permissions
            if (u.user?.role === "Employee") {

                const isActive = u.user?.status === "Active";
                const hasPermissions = Array.isArray(u.user?.permissions) && u?.user?.permissions?.length > 0;
                if (!isActive || !hasPermissions) {
                    console.log("not active or no permissions")

                    dispatch(logout());
                    setShouldRedirect(true);
                }
                setIsChecking(false);
                return;
            }

            // Any other role → logout + redirect
            dispatch(logout());
            setShouldRedirect(true);
            setIsChecking(false);
        };

        // If first check → delay 1 second
        if (!firstCheckDone.current) {
            const timeoutId = setTimeout(() => {
                checkAuth();
                firstCheckDone.current = true;
            }, 1000);

            return () => clearTimeout(timeoutId);
        } else {
            // Subsequent checks → no delay
            checkAuth();
        }
    }, [user, location.pathname, dispatch]);

    // Show loading state during check
    if (isChecking) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontSize: "1.2rem",
                color: "#666"
            }}>
                Verifying access...
            </div>
        );
    }

    // Redirect if unauthorized
    if (shouldRedirect) {
        return <Navigate to="/" replace />;
    }

    // Render nested routes
    return <Outlet />;
};

export default ProtectedRoute;
