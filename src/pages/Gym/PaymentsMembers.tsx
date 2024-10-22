import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMembersWithDueFees,
  fetchMembers,
} from "../../slices/memberSlice";
import { Modal, Button } from "react-bootstrap";
import { fetchMemberships } from "../../slices/membershipSlice";
import { useForm } from "react-hook-form";
import axiosClient from "../../api/axios.client";
import { API_URLS } from "../../api/urls";
import toaster from "../../utils/toaster";

interface PaymentData {
  memberId: any;
  membershipId: any;
  paymentAmount: any;
  paymentDate: Date;
  newMembershipId?: any; // Optional property
}

const MemberPayments: React.FC = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue, watch } = useForm();
  const [showModal, setShowModal] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<any>(null);

  useEffect(() => {
    dispatch<any>(fetchMemberships());
  }, [dispatch]);

  const { memberships } = useSelector((state: any) => state.memberships);

  useEffect(() => {
    dispatch<any>(fetchMembersWithDueFees());
    dispatch<any>(fetchMembers());
    setValue("isContinuingWithSamePackage", true);
  }, [dispatch, setValue]);

  const { dueMembers, loading, error } = useSelector(
    (state: any) => state.members
  );

  const handleOpenModal = (member: any) => {
    setSelectedMember(member);
    setValue("membershipId", member.membershipId); // Prepopulate membershipId
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMember(null);
    setValue("isContinuingWithSamePackage", false); // Reset checkbox state
  };

  const onSubmit = async (data: any) => {
    if (!data.membershipId) {
      alert("Please select a membership before proceeding.");
      return;
    }

    // Get the selected membership amount
    const selectedMembership = memberships.find(
      (m: any) => m._id === data.membershipId
    );
    const paymentData: PaymentData = {
      memberId: selectedMember._id,
      membershipId: data.membershipId,
      paymentAmount: selectedMembership ? selectedMembership.amount : 0, // Set the payment amount
      paymentDate: new Date(),
    };

    if (data.isContinuingWithSamePackage === false) {
      paymentData.newMembershipId = data.membershipId; // Set newMembershipId conditionally
    }

    try {
      const response = await axiosClient.post(API_URLS.MEMBER_FEES_PAYMENT, {
        ...paymentData,
      });
      toaster.success(response.data.message);
      handleCloseModal();
    } catch (error) {
      console.error("Error processing payment:", error);
      toaster.error("There was an error processing the payment.");
    }
  };

  const isChangingPackage = watch("isContinuingWithSamePackage");

  return (
    <div className="row gx-4">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between"></div>
          <div className="card-body">
            <div className="table-responsive">
              <table id="basicExample" className="table m-0 align-middle">
                <thead>
                  <tr>
                    <th>Member ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Next Payment Date</th>
                    <th>Due Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dueMembers?.length > 0 ? (
                    dueMembers.map((member: any) => (
                      <tr key={member.memberId}>
                        <td>{member.memberId}</td>
                        <td>{member.name}</td>
                        <td>{member.email}</td>
                        <td>{member.phone}</td>
                        <td>
                          {new Date(
                            member.nextPaymentDate
                          ).toLocaleDateString()}
                        </td>
                        <td>{member.isPaymentDue ? "Yes" : "No"}</td>
                        <td>
                          <Button
                            variant="primary"
                            onClick={() => handleOpenModal(member)}
                          >
                            Mark Payment
                          </Button>
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

      {/* Modal for marking payment */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Mark Payment for {selectedMember?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="membershipSelect" className="form-label">
                Select Membership
              </label>
              <select
                id="membershipSelect"
                className="form-select"
                {...register("membershipId")}
                disabled={isChangingPackage} // Disable the select based on checkbox state
              >
                {memberships.length > 0 ? (
                  memberships.map((membership: any) => (
                    <option
                      key={membership._id}
                      value={membership._id}
                      selected={selectedMember?.membershipId === membership._id}
                    >
                      {membership.name} - {membership.period} months - $
                      {membership.amount}
                    </option>
                  ))
                ) : (
                  <option>No memberships available</option>
                )}
              </select>
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                id="continuingWithSamePackage"
                {...register("isContinuingWithSamePackage")}
              />
              <label
                htmlFor="continuingWithSamePackage"
                className="form-check-label"
              >
                Are you changing the membership package?
              </label>
            </div>

            <div>
              <label>Are you sure you want to mark this payment?</label>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Confirm Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MemberPayments;
