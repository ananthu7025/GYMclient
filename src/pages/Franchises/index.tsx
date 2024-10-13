import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteFranchise, fetchFranchises } from "../../slices/franchiseSlice";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../components/Modal/confirmationModal";
import toaster from "../../utils/toaster";

const FranchisePage: React.FC = () => {

  const dispatch = useDispatch();
  const { franchises, loading, error } = useSelector(
    (state: any) => state.franchises
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [franchiseId, setFranchiseId] = useState("");

  useEffect(() => {
    dispatch<any>(fetchFranchises());
  }, []);

  const handleDelete = async () => {
    const res = await dispatch<any>(deleteFranchise(franchiseId));
    if (res.data.saveStatus) {
      toaster.success(res.data.message);
      dispatch<any>(fetchFranchises());
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
          <h5 className="card-title">Franchise List</h5>
          <Link to="/add-franchise" className="btn btn-primary ms-auto">
            Add New Franchise
          </Link>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table id="basicExample" className="table m-0 align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Franchise Admin</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Website</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {franchises && franchises.length > 0 ? (
                  franchises.map((franchise: any, index: any) => (
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
                      <td>{franchise.franchiseAdmin.name}</td>
                      <td>{franchise.phone}</td>
                      <td>{franchise.email}</td>
                      <td>{franchise.website}</td>
                      <td>
                        <div className="d-inline-flex gap-1">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                              setFranchiseId(franchise._id);
                              handleShowModal();
                            }}
                          >
                            <i className="ri-delete-bin-line" />
                          </button>
                          <Link
                            to={`/edit-franchise/${franchise._id}`}
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
                     <img src="../assets/images/nodata.png" style={{height:"250px",maxWidth:"400px"}} alt="img"/>
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
      message="Are you sure you want to delete this franchise?"
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={handleDelete}
      onCancel={handleHideModal}
    />
  </div>
  
  );
};

export default FranchisePage;
