import React from "react";
import styles from "./loading.module.css";
import { Spinner } from "react-bootstrap";

const Loading = () => {
  return <Spinner animation="grow" variant="primary"></Spinner>;
};

export default Loading;
