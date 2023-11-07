import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "next-auth/react";

function LogoutButton() {
  return <FontAwesomeIcon icon={faSignOut} onClick={() => signOut()} style={{ color: "blue", height: "30px" }} cursor={"pointer"} />;
}

export default LogoutButton;
