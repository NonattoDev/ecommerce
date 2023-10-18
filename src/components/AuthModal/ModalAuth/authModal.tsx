import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import style from "./authModal.module.css";
import LoginForm from "../Login/LoginForm";
import RegistrationForm from "../Cadastro/RegistrationForm";
import ForgotPasswordForm from "../ForgotPassword/ForgotPasswordForm";

interface MyVerticallyCenteredModalProps {
  show: boolean;
  onHide: () => void;
}

enum ActiveForm {
  Login,
  Registration,
  ForgotPassword,
}

export default function MyVerticallyCenteredModal(props: MyVerticallyCenteredModalProps) {
  const [activeForm, setActiveForm] = useState(ActiveForm.Login);

  const renderForm = () => {
    switch (activeForm) {
      case ActiveForm.Login:
        return <LoginForm />;
      case ActiveForm.Registration:
        return <RegistrationForm />;
      case ActiveForm.ForgotPassword:
        return <ForgotPasswordForm />;
      default:
        return null;
    }
  };

  const handleFormChange = (form: ActiveForm) => {
    setActiveForm(form);
  };

  return (
    <Modal {...props} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" as="h5">
          <span className={style.label}>Autentique</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{renderForm()}</Modal.Body>
      <Modal.Footer className={style.buttonContainer}>
        <button className={`${style.formButton} ${activeForm === ActiveForm.Login && style.active}`} onClick={() => handleFormChange(ActiveForm.Login)}>
          Login
        </button>
        <button className={`${style.formButton} ${activeForm === ActiveForm.Registration && style.active}`} onClick={() => handleFormChange(ActiveForm.Registration)}>
          Cadastro
        </button>
        <button className={`${style.formButton} ${activeForm === ActiveForm.ForgotPassword && style.active}`} onClick={() => handleFormChange(ActiveForm.ForgotPassword)}>
          Esqueci minha senha
        </button>
      </Modal.Footer>
    </Modal>
  );
}
