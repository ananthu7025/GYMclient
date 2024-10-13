import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DropzoneComponent from "../../components/DropZone";
import { createGym, editGym, getGymById } from "../../slices/gymSlice";
import { useDispatch, useSelector } from "react-redux";
import toaster from "../../utils/toaster";
import { useNavigate, useParams } from "react-router-dom";
import { gymValidationSchema } from "./gymValidation";

export default function GymForm() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(gymValidationSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const franchiseDetails = useSelector(
    (state: any) => state.auth.userDetails.additionalDetails.franchiseDetails
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const onSubmit = async (data: any) => {
    const gymData = {
      ...data,
      gymAdminData: data.gymAdmin,
    };
    if (franchiseDetails?._id) {
      gymData.franchiseId = franchiseDetails._id;
    }
    if (isEdit && id) {
      const res = await dispatch<any>(editGym(id, gymData));
      if (res?.saveStatus) {
        toaster.success(res.message);
        navigate("/gyms");
      }
    } else {
      const res = await dispatch<any>(createGym(gymData));
      if (res?.data.saveStatus) {
        toaster.success(res.data.message);
        navigate("/gyms");
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
    if (franchiseDetails) {
      setValue("name", franchiseDetails.name);
      setValue("website", franchiseDetails.website);
      setValue("logo", franchiseDetails.logo);
      setLogoPreview(franchiseDetails.logo);
    }
  }, [franchiseDetails]);

  useEffect(() => {
    const fetchGym = async () => {
      if (id) {
        const res = await dispatch<any>(getGymById(id));
        if (res) {
          setIsEdit(true);
          reset(res);
          if (res.logo) {
            setLogoPreview(res.logo);
          }
        } else {
          toaster.error("Failed to fetch gym details");
        }
      }
    };
    fetchGym();
  }, [id]);

  return (
    <div className="row gx-4">
      <div className="col-sm-12">
        <div className="card">
          <div className="container">
            <div className="row mt-5">
              <div className="col-md-12">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <fieldset>
                    <legend className="mb-4 px-3">Gym Information</legend>
                    <div style={{ paddingLeft: "4rem" }}>
                      {/* Gym Fields */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="name"
                          className="col-md-2 col-form-label"
                        >
                          Gym Name<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.name ? "is-invalid" : ""
                            }`}
                            disabled={franchiseDetails.name}
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
                          htmlFor="openingHours"
                          className="col-md-2 col-form-label"
                        >
                          Opening Hours<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="time"
                            className={`form-control ${
                              errors.openingHours ? "is-invalid" : ""
                            }`}
                            id="openingHours"
                            {...register("openingHours")}
                          />
                          <div className="invalid-feedback">
                            {errors.openingHours?.message}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 row">
                        <label
                          htmlFor="closingHours"
                          className="col-md-2 col-form-label"
                        >
                          Closing Hours<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="time"
                            className={`form-control ${
                              errors.closingHours ? "is-invalid" : ""
                            }`}
                            id="closingHours"
                            {...register("closingHours")}
                          />
                          <div className="invalid-feedback">
                            {errors.closingHours?.message}
                          </div>
                        </div>
                      </div>

                      {/* Address and location fields */}
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
                          <div className="invalid-feedback">
                            {errors.state?.message}
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
                      {/* Phone field */}
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

                      {/* Email field */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="email"
                          className="col-md-2 col-form-label"
                        >
                          Gym Email<span className="text-danger"> *</span>
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

                      {/* Website field */}
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
                            disabled={franchiseDetails.website}
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
                      {/* Dropzone for logo */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="logo"
                          className="col-md-2 col-form-label"
                        >
                          Gym Logo
                        </label>
                        <div className="col-md-6">
                          {!logoPreview ? (
                            <DropzoneComponent
                              onDrop={handleDrop}
                              acceptedFileTypes={{ "image/*": [] }}
                              maxFiles={1}
                              isMultiple={false}
                            />
                          ) : (
                            <div className="mt-3 position-relative">
                              <img
                                src={logoPreview}
                                alt="Gym Logo Preview"
                                style={{
                                  maxHeight: "200px",
                                  maxWidth: "200px",
                                  display: "block",
                                  margin: "0 auto",
                                }}
                              />
                              <button
                                onClick={() => setLogoPreview(null)}
                                className="reupload-button"
                                disabled={franchiseDetails.logo}
                              >
                                <i
                                  className="ri-edit-fill"
                                  style={{ fontSize: "24px", color: "white" }}
                                ></i>{" "}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <fieldset className="mt-4">
                      <legend className="mb-4 px-3">
                        Gym Admin Information
                      </legend>
                      <div style={{ paddingLeft: "4rem" }}>
                        <div className="mb-3 row">
                          <label
                            htmlFor="gymAdminName"
                            className="col-md-2 col-form-label"
                          >
                            Admin Name<span className="text-danger"> *</span>
                          </label>
                          <div className="col-md-6">
                            <input
                              disabled={isEdit}
                              type="text"
                              className={`form-control ${
                                errors.gymAdmin?.name ? "is-invalid" : ""
                              }`}
                              id="gymAdminName"
                              {...register("gymAdmin.name")}
                            />
                            <div className="invalid-feedback">
                              {errors.gymAdmin?.name?.message}
                            </div>
                          </div>
                        </div>

                        <div className="mb-3 row">
                          <label
                            htmlFor="gymAdminEmail"
                            className="col-md-2 col-form-label"
                          >
                            Admin Email<span className="text-danger"> *</span>
                          </label>
                          <div className="col-md-6">
                            <input
                              disabled={isEdit}
                              type="email"
                              className={`form-control ${
                                errors.gymAdmin?.email ? "is-invalid" : ""
                              }`}
                              id="gymAdminEmail"
                              {...register("gymAdmin.email")}
                            />
                            <div className="invalid-feedback">
                              {errors.gymAdmin?.email?.message}
                            </div>
                          </div>
                        </div>

                        <div className="mb-3 row">
                          <label
                            htmlFor="gymAdminPassword"
                            className="col-md-2 col-form-label"
                          >
                            Admin Password
                            <span className="text-danger"> *</span>
                          </label>
                          <div className="col-md-6">
                            <input
                              type="password"
                              className={`form-control ${
                                errors.gymAdmin?.password ? "is-invalid" : ""
                              }`}
                              id="gymAdminPassword"
                              {...register("gymAdmin.password")}
                              disabled={isEdit}
                            />
                            <div className="invalid-feedback">
                              {errors.gymAdmin?.password?.message}
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
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
                      <button type="submit" className="btn btn-primary btn-lg">
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
