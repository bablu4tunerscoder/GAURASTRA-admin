import React, { useEffect, useState, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./Redux/Slices/userSlice";
import { onlineAdminRoutes } from "./App";

const ProtectedRoute = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const user = useSelector((state) => state.user);

    const [isChecking, setIsChecking] = useState(true);
    const [redirectPath, setRedirectPath] = useState(null);

    const firstCheckDone = useRef(false);

    useEffect(() => {
        setIsChecking(true);
        setRedirectPath(null);

        const checkAuth = () => {
            const u = user?.userData;
            const token = user?.token;

            // ❌ No auth
            if (!u || !token) {
                dispatch(logout());
                setRedirectPath("/");
                setIsChecking(false);
                return;
            }

            const role = u?.user?.role;

            // ✅ Admin → full access
            if (role === "Admin") {
                setIsChecking(false);
                return;
            }

            // 👤 Employee permission check
            if (role === "Employee") {
                const isActive = u.user?.status === "Active";
                const permissions = u.user?.permissions || [];

                if (!isActive || permissions.length === 0) {
                    dispatch(logout());
                    setRedirectPath("/");
                    setIsChecking(false);
                    return;
                }

                const currentPath = location.pathname.toLowerCase();

                // ✅ Does current route match any permission?
                const hasAccess = permissions.some((perm) =>
                    currentPath.includes(perm.toLowerCase())
                );

                if (!hasAccess) {
                    // 🔁 Find first allowed route
                    const fallbackRoute = onlineAdminRoutes.find((route) =>
                        permissions.some((perm) =>
                            route.path.toLowerCase().includes(perm.toLowerCase())
                        )
                    );

                    setRedirectPath(fallbackRoute?.path || "/");
                }

                setIsChecking(false);
                return;
            }

            // ❌ Unknown role
            dispatch(logout());
            setRedirectPath("/");
            setIsChecking(false);
        };

        if (!firstCheckDone.current) {
            const timeoutId = setTimeout(() => {
                checkAuth();
                firstCheckDone.current = true;
            }, 1000);

            return () => clearTimeout(timeoutId);
        } else {
            checkAuth();
        }
    }, [user, location.pathname, dispatch]);

    // ⏳ Loading
    if (isChecking) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    fontSize: "1.2rem",
                    color: "#666",
                }}
            >
                Verifying access...
            </div>
        );
    }

    // 🔁 Redirect
    if (redirectPath) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
