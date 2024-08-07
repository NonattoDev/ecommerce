// components/CookieConsent.js
import React, { useEffect, useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";

const CookieConsent = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const consentGiven = document.cookie.split(";").some((item) => item.trim().startsWith("cookieConsent=true"));
    setShow(!consentGiven);
  }, []);

  const handleClose = () => setShow(false);
  const handleAccept = () => {
    const oneYearFromNow = moment().add(1, "years").toDate();

    document.cookie = `cookieConsent=true; path=/; expires=${oneYearFromNow.toUTCString()}; SameSite=Lax;`;

    setShow(false);
  };

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="bottom">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Consentimento de Cookies e Privacidade</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Ao continuar usando nosso site, você concorda com o uso de cookies para melhorar sua experiência de navegação e com nossa política de privacidade, que assegura a proteção de seus dados
          pessoais.
          <div className="mt-3">
            <Button variant="primary" onClick={handleAccept}>
              Aceitar Cookies
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default CookieConsent;
