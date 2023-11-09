import Loading from "@/components/Loading/Loading";
import axiosCliente from "@/services/axiosCliente";
import Link from "next/link";
import React, { ChangeEvent, useState } from "react";
import { Modal, Form, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import style from "./SearchBar.module.css";

interface Product {
  CodPro: number;
  Produto: string;
  Categoria: string;
}

const SearchBar = () => {
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<any>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    let value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
    setQuery(value);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        if (value.length >= 3) {
          handleSearch(value);
        } else {
          setResult([]);
        }
      }, 1000)
    );
  };

  const handleSearch = async (query: string) => {
    setLoading(true); // Sempre inicie uma pesquisa com o estado de loading ativado
    try {
      const response = await axiosCliente.get(`/produtos/search/${query}`);
      setResult(response.data);
    } catch (error: any) {
      if (error.response) {
        toast.warn(error.response.data);
      }
      setResult([]); // Em caso de erro, defina os resultados como vazios para mostrar a mensagem "não encontrado"
    } finally {
      setLoading(false); // Após receber os resultados ou em caso de erro, defina o estado de loading como falso
    }
  };

  return (
    <>
      <Form className="d-flex mx-auto" onClick={() => setShowModal(true)}>
        <Form.Control autoComplete="false" name="searchEngine" type="search" placeholder="E-commerce Softline Sistemas" className="me-3 form-control-lg textSearch" readOnly />
      </Form>

      <Modal
        size="lg"
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setQuery("");
          setResult([]);
        }}
      >
        <Modal.Body>
          <Form.Control
            autoFocus
            autoComplete="false"
            name="searchEngine"
            type="search"
            placeholder="Pesquise por produto, referência ou marca"
            className="me-2 form-control-lg textSearch"
            aria-label="Search"
            value={query}
            onChange={handleChange}
          />

          {loading && query.length > 0 ? (
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
          ) : query.length > 0 ? (
            <p>Poxa, não encontramos isso por aqui.</p>
          ) : null}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SearchBar;
