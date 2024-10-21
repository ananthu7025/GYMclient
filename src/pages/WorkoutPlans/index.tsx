import React, { useState, useEffect } from "react";
import { Modal, Button, Tab, Nav } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { createWorkout } from "../../slices/workoutSlice";
import toaster from "../../utils/toaster";
import { useNavigate } from "react-router-dom";

// Define the validation schema using Yup
const workoutSchema = Yup.object().shape({
  activities: Yup.array().of(
    Yup.object().shape({
      sets: Yup.string().required("Sets are required"),
      reps: Yup.string().required("Reps are required"),
      kg: Yup.string().required("KG is required"),
      restTime: Yup.string().required("Rest time is required"),
    })
  ),
  workoutTemplateName: Yup.string().required("Workout template name is required"),
  category: Yup.string().required("Workout category is required"),

});

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HorizontalCalendar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
const userDetails = useSelector((state: any) => state.auth.userDetails);
console.log(userDetails)

  const [workouts, setWorkouts] = useState<{ [key: string]: string[] }>({});
  const [showModal, setShowModal] = useState(false);
  const [newWorkout, setNewWorkout] = useState("");
  const [activeDay, setActiveDay] = useState(daysOfWeek[0]);
  const [workoutTemplateName, setWorkoutTemplateName] = useState(""); // State for workout template name

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(workoutSchema),
  });

  // Load workouts from local storage on component mount
  useEffect(() => {
    const storedWorkouts = JSON.parse(localStorage.getItem("workouts") || "{}");
    setWorkouts(storedWorkouts);
  }, []);

  const handleAddWorkout = () => {
    if (newWorkout.trim()) {
      const updatedWorkouts = {
        ...workouts,
        [activeDay]: [...(workouts[activeDay] || []), newWorkout],
      };
      setWorkouts(updatedWorkouts);
      localStorage.setItem("workouts", JSON.stringify(updatedWorkouts)); // Store workouts in local storage
      setNewWorkout(""); // Reset input
      setShowModal(false); // Close modal
    }
  };

  const onSubmit = async (data: any) => {
    // Format the weeklyPlan array according to your controller's requirements
    const weeklyPlan = daysOfWeek.map((day) => ({
      day,
      workouts: (workouts[day] || []).map((workout, index) => ({
        workoutName: workout,
        sets: data.activities?.[index]?.sets || '',
        reps: data.activities?.[index]?.reps || '',
        kg: data.activities?.[index]?.kg || '',
        restTime: data.activities?.[index]?.restTime || '',
      })),
    }));
  
    const workoutPlanData = {
      workoutTemplateName: data.workoutTemplateName, // Collect workout template name from form data
      category: data.category, // Collect category from form data
      weeklyPlan,
      gym:userDetails.additionalDetails._id
    };
  
    console.log("Final Weekly Workout Data: ", workoutPlanData);
  
    // Dispatch the action to create the workout plan
  const  res = await dispatch<any>(createWorkout(workoutPlanData));
    if(res){
      localStorage.removeItem("workouts"); // Clear workouts from local storage
      setWorkouts({}); // Clear state of workouts
      setWorkoutTemplateName(""); // Clear the workout template name input
      toaster.success("workout plan added sucessfully");
      navigate("/workoutplan");
      
    }
    // Optionally reset form and state
  
  };
  

  const handleDeleteWorkout = (workoutToDelete: string, day: string) => {
    const updatedWorkouts = {
      ...workouts,
      [day]: workouts[day].filter((workout) => workout !== workoutToDelete),
    };
    setWorkouts(updatedWorkouts);
    localStorage.setItem("workouts", JSON.stringify(updatedWorkouts)); // Update local storage
  };
  console.log(workouts)
  return (
    <div className="row gx-4">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title">Assign Weekly Workout</h5>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Add Workout
            </Button>
          </div>
          <div className="container mt-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3 row">
                <div className="col-md-6">
                <label htmlFor="workoutTemplateName" className="form-label">
                  Workout Template Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="workoutTemplateName"
                  value={workoutTemplateName}
                  {...register(`workoutTemplateName`)}
                  onChange={(e) => setWorkoutTemplateName(e.target.value)}
                />
                {errors.workoutTemplateName && (
                  <p className="text-danger">{errors.workoutTemplateName.message}</p>
                )}
                </div>
                <div className="col-md-6">
                <label htmlFor="workoutTemplateName" className="form-label">
                  Workout category
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="category"
                  {...register(`category`)}
                />
                {errors.category && (
                  <p className="text-danger">{errors.category.message}</p>
                )}
                </div>
              </div>

              <Tab.Container activeKey={activeDay}>
                <Nav variant="tabs" onSelect={(day) => setActiveDay(day || daysOfWeek[0])}>
                  {daysOfWeek.map((day) => (
                    <Nav.Item key={day}>
                      <Nav.Link eventKey={day}>{day}</Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>

                <Tab.Content className="mt-3">
  {daysOfWeek.map((day) => (
    <Tab.Pane key={day} eventKey={day}>
      {workouts[day] && workouts[day].length > 0 ? (
        <table className="table workout-table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>KG</th>
              <th>Rest Time</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {(workouts[day] || []).map((activity: any, index: any) => (
              <tr key={index}>
                <td>{activity}</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    {...register(`activities.${index}.sets`)}
                  />
                  {errors.activities?.[index]?.sets && (
                    <p className="text-danger">{errors.activities?.[index]?.sets?.message}</p>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    {...register(`activities.${index}.reps`)}
                  />
                  {errors.activities?.[index]?.reps && (
                    <p className="text-danger">{errors.activities?.[index]?.reps?.message}</p>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    {...register(`activities.${index}.kg`)}
                  />
                  {errors.activities?.[index]?.kg && (
                    <p className="text-danger">{errors.activities?.[index]?.kg?.message}</p>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    {...register(`activities.${index}.restTime`)}
                  />
                  {errors.activities?.[index]?.restTime && (
                    <p className="text-danger">{errors.activities?.[index]?.restTime?.message}</p>
                  )}
                </td>
                <td
                  onClick={() => handleDeleteWorkout(activity, day)}
                  style={{ cursor: "pointer", color: "red" }}
                >
                  <i className="ri-delete-bin-6-line" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info">
          <h5>No Activities Added</h5>
          <p>It looks like there are no activities for {day}. To add activities, follow these steps:</p>
          <p><strong>Steps to add activities:</strong></p>
          <ol>
            <li>Click on the "Add Workout" button to add a workout for the day.</li>
            <li>After adding a workout, you can fill in the details like sets, reps, kg, and rest time for each activity.</li>
            <li>Click "Save Weekly Workout Plan" to save your activities.</li>
          </ol>
        </div>
      )}
    </Tab.Pane>
  ))}
</Tab.Content>

              </Tab.Container>

              <button type="submit" className="btn btn-primary mt-3 mb-3">
                Save Weekly Workout Plan
              </button>
            </form>
          </div>
        </div>

        {/* React Bootstrap Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Workout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              className="form-control"
              placeholder="Enter workout name"
              value={newWorkout}
              onChange={(e) => setNewWorkout(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddWorkout}>
              Add Workout
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default HorizontalCalendar;
