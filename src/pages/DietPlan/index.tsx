/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  fetchDietPlans } from "../../slices/dietPlanSlice";
import { Link } from "react-router-dom";
import { MemberSearchModal } from "./AssignModal";
import { fetchMembers } from "../../slices/memberSlice";


const DietPlans: React.FC = () => {
  const dispatch = useDispatch();
  const { dietPlans, loading, error } = useSelector((state: any) => state.dietPlans);
  const { members } = useSelector((state: any) => state.members); // Updated state to members
  const [dietPlanId, setDietPlanId] = useState(""); // Change from trainerId to workoutId

  const [showModal, setShowModal] = useState<boolean>(false);

  const handleOpenModal = (id: any) => {
    setDietPlanId(id);
    setShowModal(true);
  };

  useEffect(() => {
    dispatch<any>(fetchDietPlans());
  }, [dispatch]);
  useEffect(() => {
    dispatch<any>(fetchMembers()); // Fetch members instead of trainers
  }, [dispatch]);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="row gx-4">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title">Diet Plans</h5>
            <Link to="/dietplan/add" className="btn btn-primary ms-auto">
              Add New Diet Plan
            </Link>
          </div>
          <div className="card-body">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-danger">Error: {error}</div>
            ) : (
              <div className="table-responsive">
                <table id="basicExample" className="table m-0 align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Template Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dietPlans && dietPlans.length > 0 ? (
                      dietPlans.map((plan: any, index: any) => (
                        <tr key={plan._id}>
                          <td>{index + 1}</td>
                          <td>Template {index + 1}</td>
                          <td>
                            <div className="d-inline-flex gap-1">
                              <Link
                                to={`/edit-diet-plan/${plan._id}`}
                                className="btn btn-outline-secondary btn-sm"
                              >
                                <i className="ri-edit-box-line" />
                              </Link>
                               <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleOpenModal(plan._id)} // Handle Assign action
                              >
                                <i className="ri-user-add-line" /> Assign
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center">
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
            )}
          </div>
        </div>
      </div>
      <MemberSearchModal
        show={showModal}
        handleClose={handleCloseModal}
        members={members}
        DietPlanId={dietPlanId}
      />
    </div>
  );
};

export default DietPlans;
