import Link from "next/link";
import React, { useEffect, useState } from "react";
import axiosCliente from "@/services/axiosCliente";

interface Informacoes {
  Empresa: string;
  Razao: string;
  Endereco: string;
  bairro: string;
  Cidade: string;
  Estado: string;
  Cep: string;
  Tel: string;
  tel2: string;
  Email: string;
}
const Footer = () => {
  const [informacoes, setInformacoes] = useState<Informacoes[]>([]);

  useEffect(() => {
    const infoProdutos = axiosCliente.get("/empresa").then((response) => {
      setInformacoes(response.data);
    });
  }, []);

  return (
    <footer className="bg-success text-light py-4">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6">
            {informacoes.map((info) => (
              <div key={info.Empresa}>
                <h5>{info.Empresa}</h5>
                <p>Razão: {info.Razao}</p>
                <p>Endereço: {info.Endereco}</p>
                <p>Bairro: {info.bairro}</p>
                <p>Cidade: {info.Cidade}</p>
                <p>Estado: {info.Estado}</p>
                <p>CEP: {info.Cep}</p>
                <p>Telefone: {info.Tel}</p>
                <p>Telefone 2: {info.tel2}</p>
                <p>Email: {info.Email}</p>
              </div>
            ))}
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-md-end">
            <div className="d-flex align-items-center">
              <svg style={{ width: "20px", height: "20px", margin: "0 10px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                {/* SVG Path */}
              </svg>
              <Link href="https://softlineinfo.com.br" style={{ textDecoration: "none", color: "#fff" }}>
                <span>Site produzido por Soft Line Sistemas</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
