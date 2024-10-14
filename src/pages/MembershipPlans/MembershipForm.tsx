/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DropzoneComponent from "../../components/DropZone";
import toaster from "../../utils/toaster";
import { useNavigate, useParams } from "react-router-dom";
import {
  createMembership,
  updateMembership,
  fetchMembershipById,
} from "../../slices/membershipSlice";
import { MembershipValidationSchema } from "./membershipValidation";

const MembershipForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const franchiseDetails = useSelector(
    (state: any) => state.auth?.userDetails?.additionalDetails?.franchiseDetails
  );
  const gymDetails = useSelector(
    (state: any) => state.auth?.userDetails?.additionalDetails
  );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(MembershipValidationSchema),
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Handle form submission
  const onSubmit = async (data: any) => {
    const membershipData = { ...data };
    if (gymDetails?._id) {
      membershipData.gymId = gymDetails._id;
    }
    if (franchiseDetails?._id) {
      membershipData.franchiseId = franchiseDetails._id;
    }
    if (isEdit && id) {
      const res = await dispatch<any>(updateMembership(id, membershipData));
      console.log(res);
      if (res?.saveStatus) {
        toaster.success(res.message);
        navigate("/memberships");
      }
    } else {
      const res = await dispatch<any>(createMembership(membershipData));
      console.log(res);

      if (res?.saveStatus) {
        toaster.success(res.message);
        navigate("/memberships");
      }
    }
  };

  const handleDrop = (acceptedFiles: any) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setValue("image", file);
      if (file) {
        setImagePreview(file);
      }
    }
  };

  useEffect(() => {
    if (id) {
      const fetchMembership = async () => {
        const res = await dispatch<any>(fetchMembershipById(id));
        if (res) {
          setIsEdit(true);
          console.log(res);
          reset(res);
          if (res.image) {
            setImagePreview(res.image);
          }
        } else {
          toaster.error("Failed to fetch membership details");
        }
      };
      fetchMembership();
    }
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
                    <legend className="mb-4 px-3">
                      Membership Information
                    </legend>
                    <div style={{ paddingLeft: "4rem" }}>
                      <div className="mb-3 row">
                        <label
                          htmlFor="name"
                          className="col-md-2 col-form-label"
                        >
                          Membership Name<span className="text-danger"> *</span>
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
                          htmlFor="period"
                          className="col-md-2 col-form-label"
                        >
                          Duration<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="number"
                            placeholder="months"
                            className={`form-control ${
                              errors.period ? "is-invalid" : ""
                            }`}
                            id="period"
                            {...register("period")}
                          />
                          <div className="invalid-feedback">
                            {errors.period?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          htmlFor="amount"
                          className="col-md-2 col-form-label"
                        >
                          Amount<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="number"
                            className={`form-control ${
                              errors.amount ? "is-invalid" : ""
                            }`}
                            id="amount"
                            {...register("amount")}
                          />
                          <div className="invalid-feedback">
                            {errors.amount?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          htmlFor="signupFee"
                          className="col-md-2 col-form-label"
                        >
                          Signup Fee<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="number"
                            className={`form-control ${
                              errors.signupFee ? "is-invalid" : ""
                            }`}
                            id="signupFee"
                            {...register("signupFee")}
                          />
                          <div className="invalid-feedback">
                            {errors.signupFee?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          htmlFor="description"
                          className="col-md-2 col-form-label"
                        >
                          Description<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <textarea
                            className={`form-control ${
                              errors.description ? "is-invalid" : ""
                            }`}
                            id="description"
                            {...register("description")}
                          />
                          <div className="invalid-feedback">
                            {errors.description?.message}
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 row">
                        <label
                          htmlFor="image"
                          className="col-md-2 col-form-label"
                        >
                          Membership Image
                        </label>
                        <div className="col-md-6">
                          {!imagePreview ? (
                            <DropzoneComponent
                              onDrop={handleDrop}
                              acceptedFileTypes={{ "image/*": [] }}
                              maxFiles={1}
                              isMultiple={false}
                            />
                          ) : (
                            <div className="mt-3 position-relative">
                              <img
                                src={imagePreview}
                                alt="Membership Image Preview"
                                style={{
                                  maxHeight: "200px",
                                  maxWidth: "200px",
                                  display: "block",
                                  margin: "0 auto",
                                }}
                              />
                              <button
                                onClick={() => setImagePreview(null)}
                                className="reupload-button"
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
};

export default MembershipForm;
