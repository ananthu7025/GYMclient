/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTrainer, fetchTrainers } from "../../slices/trainerSlice";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../components/Modal/confirmationModal";
import toaster from "../../utils/toaster";

const TrainerList: React.FC = () => {
  const dispatch = useDispatch();
  const { trainers, loading, error } = useSelector((state: any) => state.trainers);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [trainerId, setTrainerId] = useState("");

  useEffect(() => {
    dispatch<any>(fetchTrainers());
  }, [dispatch]);

  const handleDelete = async () => {
    const res = await dispatch<any>(deleteTrainer(trainerId));
    if (res?.data?.saveStatus) {
      toaster.success(res.data.message);
      dispatch<any>(fetchTrainers());
      handleHideModal();
    } else {
      toaster.error(res?.data?.message || "Failed to delete the trainer.");
    }
  };

  const handleShowModal = (id: string) => {
    setTrainerId(id);
    setIsModalVisible(true);
  };
  
  const handleHideModal = () => setIsModalVisible(false);

  return (
    <div className="row gx-4">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title">Trainer List</h5>
            <Link to="/add-trainer" className="btn btn-primary ms-auto">
              Add New Trainer
            </Link>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table id="trainerTable" className="table m-0 align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Specialization</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trainers && trainers.length > 0 ? (
                    trainers.map((trainer: any, index: any) => (
                      <tr key={trainer._id}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={trainer.img || "../assets/images/default-avatar.png"}
                            className="img-shadow img-2x rounded-5 me-1"
                            alt="Trainer Avatar"
                          />
                          {trainer.name}
                        </td>
                        <td>{trainer.phone}</td>
                        <td>{trainer.email}</td>
                        <td>{trainer.specialization}</td>
                        <td>
                          <div className="d-inline-flex gap-1">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleShowModal(trainer._id)}
                            >
                              <i className="ri-delete-bin-line" />
                            </button>
                            <Link
                              to={`/edit-trainer/${trainer._id}`}
                              className="btn btn-outline-secondary btn-sm"
                            >
                              <i className="ri-edit-box-line" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
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
      <ConfirmationModal
        show={isModalVisible}
        title="Confirm Deletion"
        message="Are you sure you want to delete this trainer?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={handleHideModal}
      />
    </div>
  );
};

export default TrainerList;
