import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { login } from "../../slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import toaster from "../../utils/toaster";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    // .min(6, 'Password must be at least 6 characters long'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: any) => {
    const res = await dispatch<any>(
      login({ email: data.email, password: data.password })
    );
    if (res?.data?.saveStatus) {
      toaster.success("Login succsessfull");
      navigate("/super-admin/dashboard");
    }
  };

  return (
    <div className="login-bg">
      <div className="container">
        <div className="auth-wrapper">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="auth-box">
              <Link to="#" className="auth-logo mb-4">
                <img
                  src="assets/images/logo-dark.svg"
                  alt="Bootstrap Gallery"
                />
              </Link>
              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  Your email <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="password">
                  Your password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <div className="invalid-feedback">
                    {errors.password.message}
                  </div>
                )}
              </div>
              <div className="mb-3 d-grid">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
