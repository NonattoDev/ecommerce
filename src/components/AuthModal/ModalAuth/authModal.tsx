import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "./authModal.module.css";

import TabLogin from "./Tabs/Tabs";

interface MyVerticallyCenteredModalProps {
  show: boolean;
  onHide: () => void;
}

export default function MyVerticallyCenteredModal(props: MyVerticallyCenteredModalProps) {
  return (
    <Modal {...props} centered>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <TabLogin />
      </Modal.Body>
    </Modal>
  );
}
