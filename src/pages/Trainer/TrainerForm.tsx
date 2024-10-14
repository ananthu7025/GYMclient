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
  createTrainer,
  editTrainer,
  getTrainerById,
} from "../../slices/trainerSlice";
import { TrainerValidationSchema } from "./trainerValidation";

const TrainerForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    resolver: yupResolver(TrainerValidationSchema),
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [dayInput, setDayInput] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [availability, setAvailability] = useState<Array<string>>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null); 

  function processAvailability(data: any): { days: any; timeSlots: any } {
    const availability = {
      days: [] as any[],
      timeSlots: [] as any[],
    };

    data.forEach((item: any) => {
      const [day, timeSlot] = item.split(": ");
      if (day && timeSlot) {
        // Ensure both day and timeSlot are present
        availability.days.push(day);
        availability.timeSlots.push(timeSlot);
      }
    });

    return availability;
  }
  console.log(errors);

  // Handle form submission
  const onSubmit = async (data: any) => {
    setValue("availability.days", "");
    setValue("availability.timeSlots", "");
    const dateSlots = processAvailability(availability);
    console.log(dateSlots);
    const transformedAvailability = {
      days: dateSlots.days || [],
      timeSlots: dateSlots.timeSlots || [],
    };

    const trainerData = {
      ...data,
      availability: transformedAvailability,
      gym: gymDetails?._id || null,
    };
    if (gymDetails?._id) {
      trainerData.gymId = gymDetails._id;
    }
    if (isEdit && id) {
      const res = await dispatch<any>(editTrainer(id, trainerData));
      if (res?.saveStatus) {
        toaster.success(res.message);
        navigate("/trainers");
      }
    } else {
      const res = await dispatch<any>(createTrainer(trainerData));
      if (res?.saveStatus) {
        toaster.success(res.message);
        navigate("/trainers");
      }
    }
  };

  const handleDrop = (acceptedFiles: any) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setValue("img", file);
      if (file) {
        setImagePreview(file);
      }
    }
  };

  const addDayTime = () => {
    if (dayInput && startTime && endTime) {
      const dayTime = `${dayInput}: ${startTime} - ${endTime}`;

      if (editingIndex !== null) {
        // Update the existing item if in editing mode
        const updatedAvailability = [...availability];
        updatedAvailability[editingIndex] = dayTime;
        setAvailability(updatedAvailability);
        setEditingIndex(null); // Reset editing state
      } else {
        // Add a new item if not in editing mode
        setAvailability([...availability, dayTime]);
      }

      // Clear inputs after adding or updating
      setDayInput("");
      setStartTime("");
      setEndTime("");
    }
  };

  // Function to remove an availability item
  const removeDayTime = (index: number) => {
    const newAvailability = [...availability];
    newAvailability.splice(index, 1);
    setAvailability(newAvailability);
  };


  useEffect(() => {
    if (id) {
      const fetchTrainer = async () => {
        const res = await dispatch<any>(getTrainerById(id));
        if (res) {
          setIsEdit(true);
          reset(res);

          if (res.img) {
            setImagePreview(res.img);
          }

          if (res.availability) {
            setValue("availability.days", "");
            setValue("availability.timeSlots", "");
            const { availability } = res;
            const days = availability.days || [];
            const timeSlots = availability.timeSlots || [];
            const availabilityArray = days.map((day: any, index: any) => {
              return `${day}: ${timeSlots[index]}`;
            });
            setAvailability(availabilityArray);
            if (availabilityArray.length > 0) {
              const firstAvailability = availabilityArray[0].split(": ");
              if (firstAvailability.length === 2) {
                const [day, time] = firstAvailability;
                setDayInput(day);
                const [start, end] = time.split(" - ");
                setStartTime(start);
                setEndTime(end);
              }
            }
          }
        } else {
          toaster.error("Failed to fetch trainer details");
        }
      };
      fetchTrainer();
    }
  }, [id]);

  function splitDayAndTime(timeString:any) {
    // Split the input string at the first occurrence of ": "
    const [day, timeRange] = timeString.split(': ');

    // Split the time range into start and end times
    const [startTime, endTime] = timeRange.split(' - ');

    // Trim whitespace from the day, start time, and end time
    return {
        day: day.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim()
    };
}


  const handleClick =  (data:any,index:any) =>{
    const result = splitDayAndTime(data);
    setDayInput(result.day)
    setEndTime(result.endTime)
    setStartTime(result.startTime)
    setEditingIndex(index); 
  }

  // Function to cancel the edit
  const cancelEdit = () => {
    setDayInput(""); // Clear inputs
    setStartTime("");
    setEndTime("");
    setEditingIndex(null); // Exit editing mode
  };
  const handleBack = () => {
    reset(); // Your reset function
    navigate('/trainers'); // Navigate to the trainers route
  };

  return (
    <div className="row gx-4">
      <div className="col-sm-12">
        <div className="card">
          <div className="container">
            <div className="row mt-5">
              <div className="col-md-12">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <fieldset>
                    <legend className="mb-4 px-3">Trainer Information</legend>
                    <div style={{ paddingLeft: "4rem" }}>
                      <div className="mb-3 row">
                        <label
                          htmlFor="name"
                          className="col-md-2 col-form-label"
                        >
                          Trainer Name<span className="text-danger"> *</span>
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
                          htmlFor="email"
                          className="col-md-2 col-form-label"
                        >
                          Email<span className="text-danger"> *</span>
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
                          htmlFor="experience"
                          className="col-md-2 col-form-label"
                        >
                          Experience (Years)
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="number"
                            className={`form-control ${
                              errors.experience ? "is-invalid" : ""
                            }`}
                            id="experience"
                            {...register("experience")}
                          />
                          <div className="invalid-feedback">
                            {errors.experience?.message}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 row">
                        <label
                          htmlFor="qualifications"
                          className="col-md-2 col-form-label"
                        >
                          Qualifications
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.qualifications ? "is-invalid" : ""
                            }`}
                            id="qualifications"
                            {...register("qualifications")}
                          />
                          <div className="invalid-feedback">
                            {errors.qualifications?.message}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 row">
                        <label
                          htmlFor="specialization"
                          className="col-md-2 col-form-label"
                        >
                          Specializations
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.specialization ? "is-invalid" : ""
                            }`}
                            id="specialization"
                            {...register("specialization")}
                          />
                          <div className="invalid-feedback">
                            {errors.specialization?.message}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 row">
                        <label
                          htmlFor="salary"
                          className="col-md-2 col-form-label"
                        >
                          Salary<span className="text-danger"> *</span>
                        </label>
                        <div className="col-md-6">
                          <input
                            type="number"
                            className={`form-control ${
                              errors.salary ? "is-invalid" : ""
                            }`}
                            id="salary"
                            {...register("salary")}
                          />
                          <div className="invalid-feedback">
                            {errors.salary?.message}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 row">
                        <label
                          htmlFor="availability"
                          className="col-md-2 col-form-label"
                        >
                          Availability (Days & Time Slots)
                        </label>
                        <div className="col-md-6">
                          <div className="d-flex flex-wrap mb-2">
                            {availability &&
                              availability?.map((dayTime, index) => (
                                <div
                                  key={index}
                                  onClick={() => handleClick(dayTime, index)}
                                  className="badge bg-info me-2 mb-2"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    cursor:"pointer"
                                  }}
                                >
                                  {dayTime}
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger ms-2"
                                    onClick={() => removeDayTime(index)}
                                  >
                                    &times;
                                  </button>
                                  
                                </div>
                                
                              ))}
                          </div>

                          {/* Day and Time Slot Inputs */}
                          <div className="row">
                            <div className="col-md-4">
                              <select
                                className="form-control"
                                value={dayInput}
                                onChange={(e) => setDayInput(e.target.value)}
                              >
                                <option value="">Select Day</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                              </select>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="time"
                                className="form-control"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                placeholder="Start Time"
                              />
                            </div>
                            <div className="col-md-4">
                              <input
                                type="time"
                                className="form-control"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                placeholder="End Time"
                              />
                            </div>
                          </div>
                              <div style={{display:"flex",gap:"4px"}}>
                              <button
                            type="button"
                            className="btn btn-secondary mt-2"
                            onClick={addDayTime}
                          >
                          {editingIndex !== null ? "Update Availability" : "Add Availability"}
                          </button>
                          {editingIndex !== null && (
            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={cancelEdit} // Show cancel button only when editing
            >
              Cancel
            </button>
          )}
                              </div>

                        </div>
                      </div>

                      <div className="mb-3 row">
                        <label
                          htmlFor="img"
                          className="col-md-2 col-form-label"
                        >
                          Trainer Image
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
                             onClick={() => {
                              setImagePreview(null);
                              setValue("img", "");
                            }}
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
                    <div className="col-sm-8 mx-3 mt-2 mb-3">
                      <div className="d-flex gap-2 justify-content-end">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="btn btn-outline-secondary btn-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                        >
                          {isEdit ? "Update Trainer" : "Add Trainer"}
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
};

export default TrainerForm;
