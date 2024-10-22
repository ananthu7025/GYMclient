/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteFranchise, fetchFranchises, recordPayment, getDues } from "../../slices/franchiseSlice"; // Import the new action
import { Link } from "react-router-dom";
import ConfirmationModal from "../../components/Modal/confirmationModal";
import toaster from "../../utils/toaster";

const FranchisePayment: React.FC = () => {
  const dispatch = useDispatch();
  const { franchises, loading, error,dueFranchise } = useSelector(
    (state: any) => state.franchises
  );

  useEffect(() => {
    // Fetch franchises and dues on component mount
    dispatch<any>(fetchFranchises());
    dispatch<any>(getDues()); // Fetch franchises with dues
  }, [dispatch]);

  // Function to handle payment recording
  const handleRecordPayment = (franchiseId: string) => {
    const paymentDetails = {
      amount: 100, // Example payment amount; you can modify it as needed
      paymentDate: new Date(),
    };

    dispatch<any>(recordPayment(franchiseId, paymentDetails))
      .then(() => {
        toaster.success("Payment recorded successfully!");
        dispatch<any>(getDues()); // Re-fetch dues after recording a payment
      })
      .catch((err: any) => {
        toaster.error("Failed to record payment: " + err.message);
      });
  };

  return (
    <div className="row gx-4">
      <div className="col-sm-12">
        <div className="card">
        
          <div className="card-body">
            <div className="table-responsive">
              <table id="basicExample" className="table m-0 align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dueFranchise && dueFranchise.length > 0 ? (
                    dueFranchise.map((franchise: any, index: any) => (
                      <tr key={franchise._id}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={franchise.logo}
                            className="img-shadow img-2x rounded-5 me-1"
                            alt="Franchise Avatar"
                          />
                          {franchise.name}
                        </td>
                        <td>{franchise.phone}</td>
                        <td>{franchise.email}</td>
                        <td>
                          <div className="d-inline-flex gap-1">
                            <button
                              className="btn btn-success"
                              onClick={() => handleRecordPayment(franchise._id)}
                            >
                              Record Payment
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        <img
                          src="../assets/images/nodata.png"
                          style={{ height: "250px", maxWidth: "400px" }}
                          alt="img"
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
    </div>
  );
};

export default FranchisePayment;
