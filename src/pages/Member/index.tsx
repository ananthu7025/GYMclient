/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMember, fetchMembers } from "../../slices/memberSlice"; // Updated imports for member actions
import { Link } from "react-router-dom";
import ConfirmationModal from "../../components/Modal/confirmationModal";
import toaster from "../../utils/toaster";

const MemberList: React.FC = () => {
  const dispatch = useDispatch();
  const { members, loading, error } = useSelector((state: any) => state.members); // Updated state to members

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [memberId, setMemberId] = useState("");

  useEffect(() => {
    dispatch<any>(fetchMembers()); // Fetch members instead of trainers
  }, [dispatch]);

  const handleDelete = async () => {
    const res = await dispatch<any>(deleteMember(memberId)); // Delete member instead of trainer
    if (res?.data?.saveStatus) {
      toaster.success(res.data.message);
      dispatch<any>(fetchMembers()); // Refetch members
      handleHideModal();
    } else {
      toaster.error(res?.data?.message || "Failed to delete the member.");
    }
  };

  const handleShowModal = (id: string) => {
    setMemberId(id);
    setIsModalVisible(true);
  };
  
  const handleHideModal = () => setIsModalVisible(false);

  return (
    <div className="row gx-4">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title">Member List</h5>
            <Link to="/add-member" className="btn btn-primary ms-auto"> {/* Updated route */}
              Add New Member
            </Link>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table id="memberTable" className="table m-0 align-middle"> {/* Changed table ID */}
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Membership ID</th>
                    <th>Actions</th> {/* Adjusted columns for members */}
                  </tr>
                </thead>
                <tbody>
                  {members && members.length > 0 ? (
                    members.map((member: any, index: any) => (
                      <tr key={member._id}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={member.displayImage || "../assets/images/default-avatar.png"} // Updated to member image
                            className="img-shadow img-2x rounded-5 me-1"
                            alt="Member Avatar"
                          />
                          {member.name}
                        </td>
                        <td>{member.phone}</td>
                        <td>{member.email}</td>
                        <td>{member.membershipId}</td> {/* Updated field */}
                        <td>
                          <div className="d-inline-flex gap-1">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleShowModal(member._id)} // Member deletion
                            >
                              <i className="ri-delete-bin-line" />
                            </button>
                            <Link
                              to={`/edit-member/${member._id}`} // Updated route for editing members
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
        message="Are you sure you want to delete this member?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={handleHideModal}
      />
    </div>
  );
};

export default MemberList;
