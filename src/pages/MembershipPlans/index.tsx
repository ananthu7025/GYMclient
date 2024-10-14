/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  bulkImportMemberships,
  fetchMemberships,
} from "../../slices/membershipSlice";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../components/Modal/confirmationModal";
import toaster from "../../utils/toaster";

const MembershipList: React.FC = () => {
  const dispatch = useDispatch();
  const { memberships, loading, error, suggestion } = useSelector(
    (state: any) => state.memberships
  );
  const userDetails = useSelector((state: any) => state.auth.userDetails);

  const [isSuggestionModalVisible, setIsSuggestionModalVisible] =
    useState(false);

  useEffect(() => {
    dispatch<any>(fetchMemberships());
  }, [dispatch]);

  useEffect(() => {
    if (suggestion && suggestion.length > 0) {
      setIsSuggestionModalVisible(true);
    } else {
      setIsSuggestionModalVisible(false);
    }
  }, [suggestion]);

  const handleHideSuggestionModal = () => setIsSuggestionModalVisible(false);

  const handleBulkAdd = async () => {
    const modifiedSuggestions: any[] = suggestion.map((item: any) => {
      const { franchiseId, ...rest } = item;
      return { ...rest, gymId: userDetails?.additionalDetails?._id };
    });
    const res = await dispatch<any>(bulkImportMemberships(modifiedSuggestions));
    if (res?.saveStatus) {
      dispatch<any>(fetchMemberships());
      toaster.success(res?.message);
      handleHideSuggestionModal();
    } else {
      toaster.error(res?.message);
    }
  };

  return (
    <div className="row gx-4">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title">Membership List</h5>
            <Link to="/add-membership" className="btn btn-primary ms-auto">
              Add New Membership
            </Link>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table id="basicExample" className="table m-0 align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Period</th>
                    <th>Amount</th>
                    <th>Signup Fee</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {memberships && memberships.length > 0 ? (
                    memberships.map((membership: any, index: number) => (
                      <tr key={membership._id}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={
                              membership.image ||
                              "../assets/images/default-avatar.png"
                            }
                            className="img-shadow img-2x rounded-5 me-1"
                            alt="Membership Avatar"
                          />
                          {membership.name}
                        </td>
                        <td>{membership.period}</td>
                        <td>{membership.amount}</td>
                        <td>{membership.signupFee}</td>
                        <td>{membership.description}</td>
                        <td>
                          <div className="d-inline-flex gap-1">
                            <Link
                              to={`/edit-membership/${membership._id}`}
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
        show={isSuggestionModalVisible}
        title="we couldn't find any gym memberships."
        cancelText="Cancel"
        confirmText="Import"
        onConfirm={handleBulkAdd}
        onCancel={handleHideSuggestionModal}
        message="Here are some franchise membership options for you.do you want to import this?"
      />
    </div>
  );
};

export default MembershipList;
