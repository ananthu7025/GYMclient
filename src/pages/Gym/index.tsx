import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteGym, fetchGyms } from "../../slices/gymSlice";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../components/Modal/confirmationModal";
import toaster from "../../utils/toaster";

const GymPage: React.FC = () => {
  const dispatch = useDispatch();
  const { gyms, loading, error } = useSelector((state: any) => state.gyms);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [gymId, setGymId] = useState("");

  useEffect(() => {
    dispatch<any>(fetchGyms());
  }, [dispatch]);

  const handleDelete = async () => {
    const res = await dispatch<any>(deleteGym(gymId));
    if (res.data.saveStatus) {
      toaster.success(res.data.message);
      dispatch<any>(fetchGyms());
      handleHideModal();
    }
  };

  const handleShowModal = () => setIsModalVisible(true);
  const handleHideModal = () => setIsModalVisible(false);

  return (
    <div className="row gx-4">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title">Gym List</h5>
            <Link to="/add-gym" className="btn btn-primary ms-auto">
              Add New Gym
            </Link>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table id="basicExample" className="table m-0 align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Gym Admin</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Website</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gyms && gyms.length > 0 ? (
                    gyms.map((gym: any, index: any) => (
                      <tr key={gym._id}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={gym.logo}
                            className="img-shadow img-2x rounded-5 me-1"
                            alt="Gym Avatar"
                          />
                          {gym.name}
                        </td>
                        <td>{gym?.gymAdmin?.name}</td>
                        <td>{gym?.phone}</td>
                        <td>{gym?.email}</td>
                        <td>{gym?.website}</td>
                        <td>
                          <div className="d-inline-flex gap-1">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                setGymId(gym._id);
                                handleShowModal();
                              }}
                            >
                              <i className="ri-delete-bin-line" />
                            </button>
                            <Link
                              to={`/edit-gym/${gym._id}`}
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
                      <td colSpan={7} className="text-center">
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
        message="Are you sure you want to delete this gym?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={handleHideModal}
      />
    </div>
  );
};

export default GymPage;
