import Carrinho from "../Carrinho/Carrinho";
import { useSession } from "next-auth/react";
import Loading from "../Loading/Loading";
import { useEffect, useState } from "react";
import MyVerticallyCenteredModal from "../AuthModal/ModalAuth/authModal";
import { Dropdown } from "react-bootstrap";
import styles from "./usuarioOption.module.css";

import LogoutButton from "../LogoutButton/LogoutButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface User {
  id?: number | null;
  cliente?: string | null;
  email?: string | null;
  image?: string | null;
  admin?: boolean | null;
}

function UsuarioOptions() {
  const [modalShow, setModalShow] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <>
      {status === "loading" ? (
        <Loading />
      ) : status === "unauthenticated" ? (
        <>
          <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)} />
          <button
            onClick={() => setModalShow(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "blue",
              display: "flex",
              alignItems: "center",
              marginRight: "20px",
            }}
          >
            <svg
              style={{
                width: "40px",
                margin: "0 8px 0 0",
              }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h6 style={{ margin: -3 }}>Login</h6>
          </button>
        </>
      ) : (
        <Dropdown className={styles.container}>
          <Dropdown.Toggle variant="transparent" style={{ marginRight: "-20px" }}>
            <span style={{ color: "blue" }}>{session?.user?.cliente}</span>
            <FontAwesomeIcon icon={faUser} style={{ color: "blue", height: "30px", marginLeft: "10px" }} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {session?.user?.admin && <Dropdown.Item href="/painel/admin">Admin</Dropdown.Item>}
            <Dropdown.Item href="/meuperfil">Meu Perfil</Dropdown.Item>
            <Dropdown.Item href="/minhascompras">Minhas Compras</Dropdown.Item>
          </Dropdown.Menu>
          <Carrinho />
          <LogoutButton />
        </Dropdown>
      )}
    </>
  );
}

export default UsuarioOptions;
