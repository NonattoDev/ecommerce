import Link from "next/link";
import Carrinho from "../Carrinho/Carrinho";
import { useSession } from "next-auth/react";
import Loading from "../Loading/Loading";
import { useState } from "react";
import MyVerticallyCenteredModal from "../LoginModal/loginModal";
import { Button } from "react-bootstrap";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Session {
  user?: User & { cliente?: string | null };
}

function UsuarioOptions() {
  const [modalShow, setModalShow] = useState(false);

  const { data: session, status } = useSession<Session>();

  return (
    <>
      {status === "loading" ? (
        <Loading />
      ) : status === "unauthenticated" ? (
        <>
          <Button variant="primary" onClick={() => setModalShow(true)}>
            <svg style={{ width: "40px", margin: "0 4px 0 0 " }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Login
          </Button>
          <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)} />
        </>
      ) : (
        <Link href="/api/auth/signout" style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "13px", textDecoration: "none" }}>
          <svg style={{ width: "40px", margin: "0 4px 0 0 " }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {session?.user?.cliente}
        </Link>
      )}

      {status === "authenticated" && <Carrinho />}
    </>
  );
}

export default UsuarioOptions;
