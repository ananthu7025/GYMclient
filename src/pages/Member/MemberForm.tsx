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
  createMember,
  editMember,
  fetchMembers,
  getMemberById,
} from "../../slices/memberSlice";
import { memberValidation } from "./memberValidation";
import { fetchMemberships } from "../../slices/membershipSlice";
import moment from "moment";

const MemberForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gymDetails = useSelector(
    (state: any) => state.auth?.userDetails?.additionalDetails
  );
  const { memberships } = useSelector((state: any) => state.memberships);
  const { members } = useSelector((state: any) => state.members);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(memberValidation), // Add member validation
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Handle form submission
  const onSubmit = async (data: any) => {
    const memberData = { ...data };

    if (gymDetails?._id) {
      memberData.gymId = gymDetails._id; // Set gym ID
    }
    const formattedData = {
      ...memberData,
      firstPaymentDate: moment(data.firstPaymentDate).toISOString(),
      dateOfBirth: moment(data.dateOfBirth).toISOString(),
    };
    if (isEdit && id) {
      const res = await dispatch<any>(editMember(id, formattedData));
      if (res?.saveStatus) {
        toaster.success(res.message);
        navigate("/members");
      }
    } else {
      const res = await dispatch<any>(createMember(formattedData));
      if (res?.saveStatus) {
        toaster.success(res.message);
        navigate("/members");
      }
    }
  };

  const handleDrop = (acceptedFiles: any) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setValue("displayImage", file);
      if (file) {
        setImagePreview(file);
      }
    }
  };

  useEffect(() => {
    if (id) {
      const fetchMember = async () => {
        const res = await dispatch<any>(getMemberById(id));
        if (res) {
          setIsEdit(true);
          reset(res);
          console.log(res);
          const formattedFirstPaymentDate = moment(res.firstPaymentDate).format(
            "YYYY-MM-DD"
          );
          const formatteddateOfBirth = moment(res.dateOfBirth).format(
            "YYYY-MM-DD"
          );
          setValue("dateOfBirth", formatteddateOfBirth);
          setValue("firstPaymentDate", formattedFirstPaymentDate);
          if (res.displayImage) {
            setImagePreview(res.displayImage);
          }
        } else {
          toaster.error("Failed to fetch member details");
        }
      };
      fetchMember();
    }
  }, [id]);
  useEffect(() => {
    dispatch<any>(fetchMemberships());
    dispatch<any>(fetchMembers());
  }, [dispatch]);
  useEffect(() => {
    const generateMemberId = () => {
      const count = members.length + 1;
      const formattedCount = count.toString().padStart(2, "0");
      const timestamp = Date.now().toString();
      const uniquePart = timestamp.slice(-4);
      return `MB${formattedCount}-${uniquePart}`;
    };
    setValue("memberId", generateMemberId());
  }, [members]);
  console.log(memberships)
  return (
    <div className="row gx-4">
      <div className="col-sm-12">
        <div className="card">
          <div className="container">
            <div className="row mt-5">
              <div className="col-md-12">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <fieldset>
                    <legend className="mb-4 px-3">Personal Information</legend>
                    <div style={{ paddingLeft: "4rem" }}>
                      {/* Member ID */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="memberId"
                          className="col-md-2 col-form-label"
                        >
                          Member ID<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            disabled={true}
                            type="text"
                            className={`form-control ${
                              errors.memberId ? "is-invalid" : ""
                            }`}
                            id="memberId"
                            {...register("memberId")}
                          />
                          <div className="invalid-feedback">
                            {errors.memberId?.message}
                          </div>
                        </div>
                      </div>

                      {/* Name */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="name"
                          className="col-md-2 col-form-label"
                        >
                          Name<span className="text-danger"> *</span>
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

                      {/* Gender */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="gender"
                          className="col-md-2 col-form-label"
                        >
                          Gender<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <select
                            className={`form-control ${
                              errors.gender ? "is-invalid" : ""
                            }`}
                            id="gender"
                            {...register("gender")}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          <div className="invalid-feedback">
                            {errors.gender?.message}
                          </div>
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="dateOfBirth"
                          className="col-md-2 col-form-label"
                        >
                          Date of Birth<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="date"
                            className={`form-control ${
                              errors.dateOfBirth ? "is-invalid" : ""
                            }`}
                            id="dateOfBirth"
                            {...register("dateOfBirth")}
                          />
                          <div className="invalid-feedback">
                            {errors.dateOfBirth?.message}
                          </div>
                        </div>
                      </div>
                    </div>
                    <legend className="mb-4 px-3">Contact Information</legend>
                    <div style={{ paddingLeft: "4rem" }}>
                      {/* Address */}
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

                      {/* City, State, and Zip Code */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="city"
                          className="col-md-2 col-form-label"
                        >
                          City<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-2">
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

                        <label
                          htmlFor="state"
                          className="col-md-2 col-form-label"
                        >
                          State<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-2">
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

                        <label
                          htmlFor="zipCode"
                          className="col-md-2 col-form-label"
                        >
                          Zip Code<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-2">
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

                      {/* Phone */}
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
                      {/* email */}

                      <div className="mb-3 row">
                        <label
                          htmlFor="email"
                          className="col-md-2 col-form-label"
                        >
                          Email<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.phone ? "is-invalid" : ""
                            }`}
                            id="email"
                            {...register("email")}
                          />
                          <div className="invalid-feedback">
                            {errors.email?.message}
                          </div>
                        </div>
                      </div>
                      {/* Emergency Contact */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="emergencyContactName"
                          className="col-md-2 col-form-label"
                        >
                          Emergency Contact Name
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.emergencyContactName ? "is-invalid" : ""
                            }`}
                            id="emergencyContactName"
                            {...register("emergencyContactName")}
                          />
                          <div className="invalid-feedback">
                            {errors.emergencyContactName?.message}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 row">
                        <label
                          htmlFor="emergencyContactPhone"
                          className="col-md-2 col-form-label"
                        >
                          Emergency Contact Phone
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.emergencyContactPhone ? "is-invalid" : ""
                            }`}
                            id="emergencyContactPhone"
                            {...register("emergencyContactPhone")}
                          />
                          <div className="invalid-feedback">
                            {errors.emergencyContactPhone?.message}
                          </div>
                        </div>
                      </div>

                      {/* Display Image */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="displayImage"
                          className="col-md-2 col-form-label"
                        >
                          Display Image
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
                    <legend className="mb-4 px-3">Physical Information</legend>
                    <div style={{ paddingLeft: "4rem" }}>
                      {/* Weight */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="weight"
                          className="col-md-2 col-form-label"
                        >
                          Weight (kg)<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="number"
                            className={`form-control ${
                              errors.weight ? "is-invalid" : ""
                            }`}
                            id="weight"
                            {...register("weight")}
                          />
                          <div className="invalid-feedback">
                            {errors.weight?.message}
                          </div>
                        </div>
                      </div>

                      {/* Height */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="height"
                          className="col-md-2 col-form-label"
                        >
                          Height (cm)<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="number"
                            className={`form-control ${
                              errors.height ? "is-invalid" : ""
                            }`}
                            id="height"
                            {...register("height")}
                          />
                          <div className="invalid-feedback">
                            {errors.height?.message}
                          </div>
                        </div>
                      </div>

                      {/* Fat */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="fat"
                          className="col-md-2 col-form-label"
                        >
                          Fat (%)<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="number"
                            className={`form-control ${
                              errors.fat ? "is-invalid" : ""
                            }`}
                            id="fat"
                            {...register("fat")}
                          />
                          <div className="invalid-feedback">
                            {errors.fat?.message}
                          </div>
                        </div>
                      </div>

                      {/* Arms */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="arms"
                          className="col-md-2 col-form-label"
                        >
                          Arms (cm)<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="number"
                            className={`form-control ${
                              errors.arms ? "is-invalid" : ""
                            }`}
                            id="arms"
                            {...register("arms")}
                          />
                          <div className="invalid-feedback">
                            {errors.arms?.message}
                          </div>
                        </div>
                      </div>

                      {/* Thigh */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="thigh"
                          className="col-md-2 col-form-label"
                        >
                          Thigh (cm)<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="number"
                            className={`form-control ${
                              errors.thigh ? "is-invalid" : ""
                            }`}
                            id="thigh"
                            {...register("thigh")}
                          />
                          <div className="invalid-feedback">
                            {errors.thigh?.message}
                          </div>
                        </div>
                      </div>

                      {/* Waist */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="waist"
                          className="col-md-2 col-form-label"
                        >
                          Waist (cm)<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="number"
                            className={`form-control ${
                              errors.waist ? "is-invalid" : ""
                            }`}
                            id="waist"
                            {...register("waist")}
                          />
                          <div className="invalid-feedback">
                            {errors.waist?.message}
                          </div>
                        </div>
                      </div>

                      {/* Chest */}
                      <div className="mb-3 row">
                        <label
                          htmlFor="chest"
                          className="col-md-2 col-form-label"
                        >
                          Chest (cm)<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="number"
                            className={`form-control ${
                              errors.chest ? "is-invalid" : ""
                            }`}
                            id="chest"
                            {...register("chest")}
                          />
                          <div className="invalid-feedback">
                            {errors.chest?.message}
                          </div>
                        </div>
                      </div>
                    </div>
                    <legend className="mb-4 px-3">More Information</legend>
                    <div style={{ paddingLeft: "4rem" }}>
                      <div className="mb-3 row">
                        <label
                          htmlFor="membershipId"
                          className="col-md-2 col-form-label"
                        >
                          Membership<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <select
                            className={`form-control ${
                              errors.membershipId ? "is-invalid" : ""
                            }`}
                            id="membershipId"
                            {...register("membershipId")}
                          >
                            <option value="">Select a membership</option>
                            {memberships && memberships?.map((membership: any) => (
                              <option
                                key={membership._id}
                                value={membership._id}
                              >
                                {membership.name} - {membership.period} months -
                                ${membership.amount}
                              </option>
                            ))}
                          </select>
                          <div className="invalid-feedback">
                            {errors.membershipId?.message}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 row">
                        <label
                          htmlFor="firstPaymentDate"
                          className="col-md-2 col-form-label"
                        >
                          First Payment Date
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="date"
                            className={`form-control ${
                              errors.firstPaymentDate ? "is-invalid" : ""
                            }`}
                            id="firstPaymentDate"
                            {...register("firstPaymentDate")}
                          />
                          <div className="invalid-feedback">
                            {errors.firstPaymentDate?.message}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-end">
                      <button type="submit" className="btn btn-primary btn-md">
                        {isEdit ? "Update" : "Add"} Member
                      </button>
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
};

export default MemberForm;
