import { Tab, Tabs } from "react-bootstrap";

import LoginForm from "../../Login/LoginForm";
import RegistrationForm from "../../Cadastro/RegistrationForm";
import ForgotPasswordForm from "../../ForgotPassword/ForgotPasswordForm";

const TabLogin = () => {
  return (
    <Tabs defaultActiveKey="LoginForm" id="justify-tab-example" className="mb-3" justify variant="pills">
      <Tab eventKey="LoginForm" title="Login">
        <LoginForm />
      </Tab>
      <Tab eventKey="RegistrationForm" title="Cadastro">
        <RegistrationForm />
      </Tab>
      <Tab eventKey="ForgotPasswordForm" title="Esqueci minha senha">
        <ForgotPasswordForm />
      </Tab>
    </Tabs>
  );
};

export default TabLogin;
