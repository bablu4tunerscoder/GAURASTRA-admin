import React, { useEffect } from "react";
import { Lock, LogIn, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Redux/Slices/userSlice";
import "./Login.scss";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            dispatch(loginUser(data));
        } catch (error) {
            toast.error(error?.response?.data?.message || "Login failed");
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/OnlineAdmin");
        }
    }, [user, navigate]);

    return (
        <div className="login-page">
            {/* Background Image */}
            <div
                className="login-page__background"
                style={{
                    backgroundImage: "url('/images/login-bg.jpg')",
                }}
            />

            {/* Dark overlay */}
            <div className="login-page__overlay" />

            {/* Main container */}
            <div className="login-page__container">
                {/* Form Section */}
                <div className="login-page__form-container">
                    <div className="login-page__form-card">
                        <h2 className="login-page__form-title">
                            Login to Your Account
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="login-page__form">
                            {/* Email/Phone Input */}
                            <div className="login-page__input-group">
                                <label htmlFor="emailOrPhone" className="login-page__label">
                                    Phone Number or Email
                                </label>
                                <div className="login-page__input-wrapper">
                                    <Phone className="login-page__input-icon" />
                                    <input
                                        id="emailOrPhone"
                                        type="text"
                                        placeholder="Enter your phone or email"
                                        className={`login-page__input ${errors.emailOrPhone ? 'login-page__input--error' : ''
                                            }`}
                                        {...register("emailOrPhone", {
                                            required: "Phone number or email is required",
                                        })}
                                    />
                                </div>
                                {errors.emailOrPhone && (
                                    <p className="login-page__error">
                                        {errors.emailOrPhone.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="login-page__input-group">
                                <label htmlFor="password" className="login-page__label">
                                    Password
                                </label>
                                <div className="login-page__input-wrapper">
                                    <Lock className="login-page__input-icon" />
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        className={`login-page__input ${errors.password ? 'login-page__input--error' : ''
                                            }`}
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters",
                                            },
                                        })}
                                    />
                                </div>
                                {errors.password && (
                                    <p className="login-page__error">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="login-page__button"
                            >
                                {isSubmitting ? (
                                    "Logging in..."
                                ) : (
                                    <>
                                        <LogIn className="login-page__button-icon" />
                                        Login
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}