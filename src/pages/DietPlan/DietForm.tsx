import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  createDietPlan,
  fetchDietPlans,
  editDietPlan,
  getDietPlanById,
} from "../../slices/dietPlanSlice";
import { useNavigate, useParams } from "react-router-dom";
import toaster from "../../utils/toaster";

interface NutritionDetails {
  selected: boolean;
  details: string;
}

interface FormData {
  name: string; // Added name field
  category: string; // Added category field
  nutritionDetails: {
    [key: string]: {
      [key: string]: NutritionDetails;
    };
  };
}

const DietPlan: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      name: "",
      category: "",
      nutritionDetails: {},
    },
  });

  const [activeDay, setActiveDay] = useState<string>("Sunday");
  const [editMode, setEditMode] = useState<boolean>(false);
  const { id } = useParams();
  // Get the specific diet plan from the store
  const dietPlan = useSelector((state: any) => state.dietPlans.dietPlan);

  // Fetch diet plans when component mounts
  useEffect(() => {
    dispatch<any>(fetchDietPlans());
  }, [dispatch]);

  // Fetch diet plan details if in edit mode
  useEffect(() => {
    const fetchDietPlan = async () => {
      if (id) {
        setEditMode(true);
        // Dispatch the action to fetch the diet plan by ID
        const res = await dispatch<any>(getDietPlanById(id));
        // Check if the diet plan exists and reset the form with the fetched data
        if (res) {
          console.log(res);
          reset(res); // Reset the form with the fetched data
        }
      }
    };

    fetchDietPlan();
  }, [id, dispatch, reset]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (editMode && id) {
      dispatch<any>(editDietPlan(id, data)).then(() => {
        toaster.success("Diet plan updated successfully");
        navigate("/dietplans");
      });
    } else {
      dispatch<any>(createDietPlan(data)).then(() => {
        toaster.success("Diet plan added successfully");
        navigate("/dietplans");
      });
    }
    console.log("Form Data: ", data);
  };

  const nutritionItems = [
    "Break Fast",
    "Mid-Morning Snacks",
    "Lunch",
    "Afternoon Snacks",
    "Dinner",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleQuillChange = (value: string, nutrition: string) => {
    setValue(`nutritionDetails.${activeDay}.${nutrition}.details`, value);
  };

  return (
    <div className="row gx-4">
      <div className="col-sm-12">
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-4">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("name", { required: true })}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-4">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("category", { required: true })}
                    />
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                {/* Vertical Tabs for Days Selection */}
                <div className="col-md-4">
                  <h5 className="mb-3">Select Days</h5>
                  <ul className="nav flex-column nav-pills">
                    {days.map((day) => (
                      <li key={day} className="nav-item">
                        <button
                          type="button"
                          className={`nav-link ${
                            activeDay === day ? "active" : ""
                          }`}
                          onClick={() => setActiveDay(day)}
                          style={{
                            borderRadius: "0.5rem",
                            transition: "background-color 0.3s",
                          }}
                        >
                          {day}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nutrition Selection for the Active Day */}
                <div className="col-md-8">
                  <h5 className="mb-3">Select Nutrition for {activeDay}</h5>
                  <ul className="list-unstyled">
                    {nutritionItems.map((nutrition) => (
                      <li key={`${activeDay}-${nutrition}`} className="mb-3">
                        <label className="d-flex align-items-center">
                          <input
                            type="checkbox"
                            value={nutrition}
                            {...register(
                              `nutritionDetails.${activeDay}.${nutrition}.selected`
                            )}
                            className="me-2"
                          />
                          {nutrition}
                        </label>
                        {watch(
                          `nutritionDetails.${activeDay}.${nutrition}.selected`
                        ) && (
                          <ReactQuill
                            value={
                              watch(
                                `nutritionDetails.${activeDay}.${nutrition}.details`
                              ) || ""
                            }
                            onChange={(value) =>
                              handleQuillChange(value, nutrition)
                            }
                            className="mt-2"
                            placeholder={`Enter details for ${nutrition}`}
                            style={{ height: "20rem", marginBottom: "5rem" }}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                  <button type="submit" className="btn btn-primary mt-3">
                    {editMode ? "Update Nutrition Plan" : "+ Add Nutrition"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlan;
