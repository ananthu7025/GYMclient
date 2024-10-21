import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Select, { StylesConfig } from "react-select";
import { API_URLS } from "../../api/urls";
import axiosClient from "../../api/axios.client";
import toaster from "../../utils/toaster";
import { useNavigate } from "react-router-dom";

interface MemberSearchModalProps {
  show: boolean;
  handleClose: () => void;
  members: any; // Changed to accept MemberOption array
  workoutPlanId: string; // Add workoutPlanId prop
}

export const MemberSearchModal: React.FC<MemberSearchModalProps> = ({
  show,
  handleClose,
  members,
  workoutPlanId,
}) => {
  const navigate = useNavigate();

  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add state for error handling

  // Handle member selection
  const handleMemberChange = (selectedOption: any) => {
    setSelectedMember(selectedOption ? selectedOption : null);
  };

  const mappedMembers = members.map((member: any) => ({
    value: member._id,
    label: member.name,
    imageUrl: member.displayImage,
    email: member.email,
    phone: member.phone,
  }));

  // Custom styles for react-select
  const customStyles: StylesConfig<null> = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #ced4da",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid #80bdff",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // Ensure dropdown is on top
    }),
  };

  // Function to handle assignment of workout plan
  const handleAssignWorkoutPlan = async () => {
    if (!selectedMember) {
      setError("Please select a member.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.post(API_URLS.WORKOUT_ASSIGN, {
        memberId: selectedMember.value,
        workoutPlanId: workoutPlanId, // Use the passed workoutPlanId
      });
      handleClose();
      toaster.success(response.data.message);
      navigate("/workoutplan");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "An error occurred while assigning the workout plan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Search Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}{" "}
        {/* Display error message */}
        <Select
          value={selectedMember}
          onChange={handleMemberChange}
          options={mappedMembers}
          placeholder="Search for a member..."
          isClearable
          isSearchable
          styles={customStyles}
        />
        {!selectedMember && (
          <div className="text-center mb-4">
            <img
              src="../../../assets/images/workout/1.svg"
              alt="Introductory"
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            />
            <h5 className="mt-2">Assign a workout plan to a Member </h5>
            <p>Type to search for a member..</p>
          </div>
        )}
        {selectedMember && (
          <div className="card mb-4 mt-4">
            <div className="card-body">
              <div className="text-center">
                <a className="d-flex align-items-center flex-column">
                  <img
                    src={selectedMember.imageUrl || "assets/images/user2.png"}
                    alt={selectedMember.label}
                    className="img-7x rounded-circle mb-3"
                    style={{ width: "100px", height: "100px" }}
                  />
                  <h5>{selectedMember.label}</h5>
                  <h6>Details</h6>
                  <p>{selectedMember.email || ""}</p>
                  <p>{selectedMember.phone || ""}</p>
                </a>
                <Button
                  variant="outline-primary"
                  onClick={handleAssignWorkoutPlan}
                  disabled={loading} // Disable button while loading
                >
                  {loading ? "Assigning..." : "Assign"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
     
    </Modal>
  );
};
