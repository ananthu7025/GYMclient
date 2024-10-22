import React from "react";
import { Modal, Button } from "react-bootstrap";
import axiosClient from "../../api/axios.client";
import { API_URLS } from "../../api/urls";
import toaster from "../../utils/toaster";

interface PaymentModalProps {
  show: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  userDetails:any
}
interface PaymentData {
    memberId: any;
    membershipId: any;
    paymentDate: Date;
  }
const PaymentModal: React.FC<PaymentModalProps> = ({
  show,
  title = "Pay Now",
  message,
  confirmText = "Yes",
  onCancel,
  userDetails,
}) => {
    console.log(userDetails);

    const onConfirm = async (data: any) => {
        const paymentData: PaymentData = {
          memberId: userDetails._id,
          membershipId: userDetails.membershipId,
          paymentDate: new Date(),
        };
        try {
          const response = await axiosClient.post(API_URLS.MEMBER_FEES_PAYMENT, {
            ...paymentData,
          });
          toaster.success(response.data.message);
        } catch (error) {
          console.error("Error processing payment:", error);
          toaster.error("There was an error processing the payment.");
        }
      };
  return (
    <Modal show={show} onHide={onCancel} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
