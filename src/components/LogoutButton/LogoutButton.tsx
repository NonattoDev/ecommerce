import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "next-auth/react";

function LogoutButton() {
  return <FontAwesomeIcon icon={faSignOut} onClick={() => signOut()} style={{ background: "none", border: "none", cursor: "pointer", color: "blue", width: "30px" }} />;
}

export default LogoutButton;
