/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteWorkout, fetchWorkouts } from "../../slices/workoutSlice"; // Update import to workoutSlice
import { Link } from "react-router-dom";
import ConfirmationModal from "../../components/Modal/confirmationModal";
import toaster from "../../utils/toaster";
import { fetchMembers } from "../../slices/memberSlice"; // Updated imports for member actions
import { MemberSearchModal } from "./AssignModal";

const WorkoutplanList: React.FC = () => {
  const dispatch = useDispatch();
  const { workouts, loading, error } = useSelector(
    (state: any) => state.workouts
  ); // Update state slice
  const { members } = useSelector((state: any) => state.members); // Updated state to members

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [workoutId, setWorkoutId] = useState(""); // Change from trainerId to workoutId
  const [workoutPalns, setWorkoutplans] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleOpenModal = (id: any) => {
    setShowModal(true);
    setWorkoutId(id);
  };
  const handleCloseModal = () => setShowModal(false);
  const fetchWorkoutsData = async () => {
    try {
      const res = await dispatch<any>(fetchWorkouts());
      console.log(res);
      setWorkoutplans(res);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  useEffect(() => {
    fetchWorkoutsData();
  }, [dispatch]);
  useEffect(() => {
    dispatch<any>(fetchMembers()); // Fetch members instead of trainers
  }, [dispatch]);

  const handleShowModal = (id: string) => {
    setWorkoutId(id); // Change from trainerId to workoutId
    setIsModalVisible(true);
  };

  return (
    <div className="row gx-4">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title">Workout List</h5>
            <Link to="/add-workout" className="btn btn-primary ms-auto">
              Add New Workout
            </Link>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table id="workoutTable" className="table m-0 align-middle">
                {" "}
                {/* Change ID */}
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>category</th>

                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workoutPalns && workoutPalns.length > 0 ? (
                    workoutPalns.map(
                      (
                        workout: any,
                        index: any // Update from trainers to workouts
                      ) => (
                        <tr key={workout._id}>
                          <td>{index + 1}</td>
                          <td>{workout.workoutTemplateName}</td>{" "}
                          {/* Update properties based on your workout data */}
                          <td>{workout.category}</td>{" "}
                          {/* Update properties based on your workout data */}
                          <td>
                            <div className="d-inline-flex gap-1">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleOpenModal(workout._id)} // Handle Assign action
                              >
                                <i className="ri-user-add-line" /> Assign
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        {" "}
                        {/* Update colspan */}
                        <img
                          src="../assets/images/nodata.png"
                          style={{ height: "250px", maxWidth: "400px" }}
                          alt="No Data"
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <MemberSearchModal
        show={showModal}
        handleClose={handleCloseModal}
        members={members}
        workoutPlanId={workoutId}
      />
    </div>
  );
};

export default WorkoutplanList;
