/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DropzoneComponent from "../../components/DropZone";
import {
  createFranchise,
  editFranchise,
  getFranchiseById,
} from "../../slices/franchiseSlice";
import { useDispatch } from "react-redux";
import toaster from "../../utils/toaster";
import { useNavigate, useParams } from "react-router-dom";
import { franchiseValidationSchema } from "./franchiseValidation";

export default function FranchiseForm() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(franchiseValidationSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const onSubmit = async (data: any) => {
    const franchiseData = {
      ...data,
      franchiseAdminData: data.franchiseAdmin,
    };
    if (isEdit && id) {
      const res = await dispatch<any>(editFranchise(id, franchiseData));
      if (res?.saveStatus) {
        toaster.success(res.message);
        navigate("/franchises");
      }
    } else {
      const res = await dispatch<any>(createFranchise(franchiseData));
      if (res?.data.saveStatus) {
        toaster.success(res.data.message);
        navigate("/franchises");
      }
    }
  };

  const handleDrop = (acceptedFiles: any) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setValue("logo", file);
      if (file) {
        setLogoPreview(file);
      }
    }
  };

  useEffect(() => {
    const fetchFranchise = async () => {
      if (id) {
        const res = await dispatch<any>(getFranchiseById(id));
        if (res) {
          setIsEdit(true);
          reset(res);
          if (res.logo) {
            setLogoPreview(res.logo);
          }
        } else {
          toaster.error("Failed to fetch franchise details");
        }
      }
    };
    fetchFranchise();
  }, [id]);
  const subscriptionDuration = watch("subscriptionDuration");

  useEffect(() => {
    const calculateNextPaymentDate = () => {
      const currentDate = new Date();
      let nextPaymentDate;

      if (subscriptionDuration) {
        nextPaymentDate = new Date(currentDate);
        nextPaymentDate.setMonth(
          currentDate.getMonth() + Number(subscriptionDuration)
        );
        setValue(
          "nextPaymentDate",
          nextPaymentDate.toISOString().split("T")[0]
        ); // Format as YYYY-MM-DD
      } else {
        setValue("nextPaymentDate", ""); // Clear the field if no duration is selected
      }
    };

    calculateNextPaymentDate();
  }, [subscriptionDuration]);
  return (
    <div className="row gx-4">
      <div className="col-sm-12">
        <div className="card">
          <div className="container">
            <div className="row mt-5">
              <div className="col-md-12">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <fieldset>
                    <legend className="mb-4 px-3">Franchise Information</legend>
                    <div style={{ paddingLeft: "4rem" }}>
                      <div className="mb-3 row">
                        <label
                          htmlFor="name"
                          className="col-md-2 col-form-label"
                        >
                          Franchise Name<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.name ? "is-invalid" : ""
                            }`}
                            id="name"
                            {...register("name")}
                          />
                          <div className="invalid-feedback">
                            {errors.name?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          htmlFor="address"
                          className="col-md-2 col-form-label"
                        >
                          Address<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.address ? "is-invalid" : ""
                            }`}
                            id="address"
                            {...register("address")}
                          />
                          <div className="invalid-feedback">
                            {errors.address?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          htmlFor="city"
                          className="col-md-2 col-form-label"
                        >
                          City<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.city ? "is-invalid" : ""
                            }`}
                            id="city"
                            {...register("city")}
                          />
                          <div className="invalid-feedback">
                            {errors.city?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          htmlFor="state"
                          className="col-md-2 col-form-label"
                        >
                          State
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.state ? "is-invalid" : ""
                            }`}
                            id="state"
                            {...register("state")}
                          />
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          htmlFor="zipCode"
                          className="col-md-2 col-form-label"
                        >
                          Zip Code<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.zipCode ? "is-invalid" : ""
                            }`}
                            id="zipCode"
                            {...register("zipCode")}
                          />
                          <div className="invalid-feedback">
                            {errors.zipCode?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          htmlFor="country"
                          className="col-md-2 col-form-label"
                        >
                          Country<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.country ? "is-invalid" : ""
                            }`}
                            id="country"
                            {...register("country")}
                          />
                          <div className="invalid-feedback">
                            {errors.country?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          htmlFor="phone"
                          className="col-md-2 col-form-label"
                        >
                          Phone<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.phone ? "is-invalid" : ""
                            }`}
                            id="phone"
                            {...register("phone")}
                          />
                          <div className="invalid-feedback">
                            {errors.phone?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          htmlFor="email"
                          className="col-md-2 col-form-label"
                        >
                          Franchise Email<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="email"
                            className={`form-control ${
                              errors.email ? "is-invalid" : ""
                            }`}
                            id="email"
                            {...register("email")}
                          />
                          <div className="invalid-feedback">
                            {errors.email?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          htmlFor="website"
                          className="col-md-2 col-form-label"
                        >
                          Website
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.website ? "is-invalid" : ""
                            }`}
                            id="website"
                            {...register("website")}
                          />
                          <div className="invalid-feedback">
                            {errors.website?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          htmlFor="establishedYear"
                          className="col-md-2 col-form-label"
                        >
                          Established Year
                        </label>
                        <div className="col-md-6">
                          <input
                            type="number"
                            className={`form-control ${
                              errors.establishedYear ? "is-invalid" : ""
                            }`}
                            id="establishedYear"
                            {...register("establishedYear")}
                          />
                          <div className="invalid-feedback">
                            {errors.establishedYear?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          htmlFor="description"
                          className="col-md-2 col-form-label"
                        >
                          Description
                        </label>
                        <div className="col-md-6">
                          <textarea
                            className={`form-control ${
                              errors.description ? "is-invalid" : ""
                            }`}
                            id="description"
                            {...register("description")}
                          ></textarea>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          htmlFor="logo"
                          className="col-md-2 col-form-label"
                        >
                          Logo
                        </label>
                        <div className="col-md-6">
                          {!logoPreview ? (
                            <DropzoneComponent
                              onDrop={handleDrop}
                              acceptedFileTypes={{ "image/*": [] }} // Change as needed
                              maxFiles={1} // Maximum 1 file
                              isMultiple={false} // Single upload
                            />
                          ) : (
                            <div className="mt-3 position-relative">
                              <img
                                src={logoPreview}
                                alt="Logo Preview"
                                style={{
                                  maxHeight: "200px",
                                  maxWidth: "200px",
                                  display: "block",
                                  margin: "0 auto",
                                }}
                              />
                              <button
                                onClick={() => setLogoPreview(null)} // Reset the logoPreview state
                                className="reupload-button"
                              >
                                <i
                                  className="ri-edit-fill"
                                  style={{ fontSize: "24px", color: "white" }}
                                ></i>{" "}
                                {/* Use Font Awesome or any icon library */}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <fieldset>
                      <legend className="mb-4 px-3">
                        Franchise Admin Data
                      </legend>
                      <div style={{ paddingLeft: "4rem" }}>
                        <div className="mb-3 row">
                          <label
                            htmlFor="adminName"
                            className="col-md-2 col-form-label"
                          >
                            Admin Name<span className="text-danger"> *</span>
                          </label>
                          <div className="col-md-6">
                            <input
                              type="text"
                              className={`form-control ${
                                errors.franchiseAdmin?.name ? "is-invalid" : ""
                              }`}
                              id="adminName"
                              {...register("franchiseAdmin.name")}
                            />
                            <div className="invalid-feedback">
                              {errors.franchiseAdmin?.name?.message}
                            </div>
                          </div>
                        </div>
                        <div className="mb-3 row">
                          <label
                            htmlFor="adminEmail"
                            className="col-md-2 col-form-label"
                          >
                            Admin Email<span className="text-danger"> *</span>
                          </label>
                          <div className="col-md-6">
                            <input
                              type="email"
                              className={`form-control ${
                                errors.franchiseAdmin?.email ? "is-invalid" : ""
                              }`}
                              id="adminEmail"
                              {...register("franchiseAdmin.email")}
                            />
                            <div className="invalid-feedback">
                              {errors.franchiseAdmin?.email?.message}
                            </div>
                          </div>
                        </div>
                        <div className="mb-3 row">
                          <label
                            htmlFor="adminPassword"
                            className="col-md-2 col-form-label"
                          >
                            Admin Password
                            <span className="text-danger"> *</span>
                          </label>
                          <div className="col-md-6">
                            <input
                              type="password"
                              className={`form-control ${
                                errors.franchiseAdmin?.password
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="adminPassword"
                              {...register("franchiseAdmin.password")}
                            />
                            <div className="invalid-feedback">
                              {errors.franchiseAdmin?.password?.message}
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend className="mb-4 px-3">
                        Subscription Information
                      </legend>
                      <div style={{ paddingLeft: "4rem" }}>
                        {/* Subscription Plan */}
                        <div className="mb-3 row">
                          <label
                            htmlFor="subscriptionAmount"
                            className="col-md-2 col-form-label"
                          >
                            Subscription Amount
                            <span className="text-danger"> *</span>
                          </label>
                          <div className="col-md-6">
                            <input
                              type="number"
                              className={`form-control ${
                                errors.subscriptionAmount ? "is-invalid" : ""
                              }`}
                              id="subscriptionAmount"
                              {...register("subscriptionAmount")}
                            />
                            <div className="invalid-feedback">
                              {errors.subscriptionAmount?.message}
                            </div>
                          </div>
                        </div>
                        <div className="mb-3 row">
                          <label
                            htmlFor="subscriptionDuration"
                            className="col-md-2 col-form-label"
                          >
                            Subscription Duration (Months)
                            <span className="text-danger"> *</span>
                          </label>
                          <div className="col-md-6">
                            <select
                              className={`form-control ${
                                errors.subscriptionDuration ? "is-invalid" : ""
                              }`}
                              id="subscriptionDuration"
                              {...register("subscriptionDuration", {
                                required: "This field is required",
                              })}
                            >
                              <option value="">Select Duration</option>
                              <option value="1">1 Month</option>
                              <option value="3">3 Months</option>
                              <option value="6">6 Months</option>
                              <option value="12">12 Months</option>
                            </select>
                            <div className="invalid-feedback">
                              {errors.subscriptionDuration?.message}
                            </div>
                          </div>
                        </div>

                        {/* Next Payment Date */}
                        <div className="mb-3 row">
                          <label
                            htmlFor="nextPaymentDate"
                            className="col-md-2 col-form-label"
                          >
                            Next Payment Date
                            <span className="text-danger"> *</span>
                          </label>
                          <div className="col-md-6">
                            <input
                              type="date"
                              className={`form-control ${
                                errors.nextPaymentDate ? "is-invalid" : ""
                              }`}
                              id="nextPaymentDate"
                              {...register("nextPaymentDate", {
                                required: "This field is required",
                              })}
                              readOnly // Make it read-only as it's calculated
                            />
                            <div className="invalid-feedback">
                              {errors.nextPaymentDate?.message}
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>

                    <div className="col-sm-8 mx-3 mt-2 mb-3">
                      <div className="d-flex gap-2 justify-content-end">
                        <button
                          type="button"
                          onClick={() => reset()}
                          className="btn btn-outline-secondary btn-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
