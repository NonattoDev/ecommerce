import Loading from "@/components/Loading/Loading";
import axiosCliente from "@/services/axiosCliente";
import Link from "next/link";
import React, { ChangeEvent, useState } from "react";
import { Modal, Form, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import style from "./SearchBar.module.css";

const SearchBar = () => {
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<any>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        if (value.length === 0) setLoading(false);
        if (value.length >= 3) {
          setLoading(true);
          handleSearch(value);
          setLoading(false);
        } else {
          setResult([]);
        }
      }, 1000)
    );
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const response = await axiosCliente.get(`/produtos/search/${query}`);
      setResult(response.data);
      setLoading(false);
    } catch (error: any) {
      if (error.response) {
        return toast.warn(error.response.data);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Form className="d-flex mx-auto" onClick={() => setShowModal(true)}>
        <Form.Control autoComplete="false" name="searchEngine" type="search" placeholder="E-commerce Softline Sistemas" className="me-2 form-control-lg textSearch" aria-label="Search" />
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pesquisa no nosso E-Commerce</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            autoComplete="false"
            name="searchEngine"
            type="search"
            placeholder="E-commerce Softline Sistemas"
            className="me-2 form-control-lg textSearch"
            aria-label="Search"
            value={query}
            onChange={handleChange}
          />

          {query.length > 0 && loading ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <Loading />
            </div>
          ) : result.length > 0 ? (
            <div className={style.cardContainer}>
              {result.length > 0 && (
                <div className={style.scrollContainer}>
                  {result.map((r) => (
                    <Link
                      href={`/produto/${r.CodPro}`}
                      onClick={() => {
                        setShowModal(false);
                        setResult([]);
                        setQuery("");
                      }}
                      style={{ textDecoration: "none" }}
                    >
                      <Card body key={r.CodPro} className={style.card}>
                        <Card.Title>{r.Produto}</Card.Title>
                        <Card.Subtitle>Marca: {r.Categoria}</Card.Subtitle>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : query.length > 0 && !loading ? (
            <p>Poxa, não encontramos isso por aqui.</p>
          ) : null}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SearchBar;
