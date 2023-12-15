import Carrinho from "../Carrinho/Carrinho";
import { useSession } from "next-auth/react";
import Loading from "../Loading/Loading";
import { useEffect, useState } from "react";
import MyVerticallyCenteredModal from "../AuthModal/ModalAuth/authModal";
import { Dropdown } from "react-bootstrap";
import styles from "./usuarioOption.module.css";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LogoutButton from "../LogoutButton/LogoutButton";
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

  useEffect(() => {}, [session]);

  const getInitials = (name: string) => {
    const names = name.split(" ");
    const initials = names.map((part) => part[0]).join("");
    return initials.length > 2 ? initials.substring(0, 2) : initials; // Limita a 2 caracteres
  };

  return (
    <>
      {status === "loading" ? (
        <Loading />
      ) : status === "unauthenticated" ? (
        <>
          <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)} />
          <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: "40px", height: "30px", color: "blue" }} onClick={() => setModalShow(true)} cursor="pointer" />
        </>
      ) : (
        <Dropdown className={styles.container}>
          {session?.user.cliente ? (
            <div className={styles.initialsCircle}>{getInitials(session.user.cliente)}</div>
          ) : (
            <FontAwesomeIcon icon={faUser} style={{ color: "blue", height: "30px", width: "30px", marginRight: "-5px" }} />
          )}
          <Dropdown.Toggle variant="transparent" className={styles.DropDowncontainer}>
            <FontAwesomeIcon icon={faUser} style={{ color: "blue", height: "30px", width: "30px", marginRight: "-5px" }} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {session?.user?.admin && <Dropdown.Item href="/painel/admin">Admin</Dropdown.Item>}
            {!session?.user?.admin && (
              <>
                <Dropdown.Item href="/meuperfil">Meu Perfil</Dropdown.Item>
                <Dropdown.Item href="/minhascompras">Minhas Compras</Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
          {!session?.user?.admin && <Carrinho />}
          <LogoutButton />
        </Dropdown>
      )}
    </>
  );
}

export default UsuarioOptions;
