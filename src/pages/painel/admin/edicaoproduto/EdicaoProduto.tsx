import React, { useState, useRef, useEffect } from "react";
import { FaSave, FaPlus, FaMinus } from "react-icons/fa";
import { Badge, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "./EdicaoProduto.module.css";
import axios from "axios";
import { useQuery } from "react-query";
import Loading from "@/components/Loading/Loading";
import { useRouter } from "next/router";
import Image from "next/image";

interface Grupo {
  CodGrp: number;
  Grupo: string;
}

interface Subgrupo {
  CodSub: number;
  SubGrupo: string;
}

interface Product {
  CodPro?: number;
  Produto?: string;
  Categoria?: string;
  Referencia?: string;
  CodigoBarras?: string;
  Unidade?: string;
  Preco1?: number;
  Origem?: string;
  CSTCompra?: string;
  Situacao?: string;
  CSOSN?: string;
  CodSub?: string;
  Codgrp?: string;
  Caminho?: string;
  Caminho2?: string;
  Caminho3?: string;
  Caminho4?: string;
  Caminho5?: string;
  ECommerce?: string;
}

//Fetchs
const fetchProductCount = async () => {
  const { data } = await axios.get("/api/admin/produtos/contagem"); // Atualize com o caminho correto do seu endpoint
  return data;
};
const fetchRegimeEmpresa = async () => {
  const response = await axios.get("/api/admin/produtos/regime"); // Atualize com o caminho correto do seu endpoint
  const { regimeNome } = response.data;
  return regimeNome;
};
const fetchGruposEmpresa = async () => {
  const response = await axios.get("/api/admin/produtos/grupos"); // Atualize com o caminho correto do seu endpoint

  return response.data;
};

const EdicaoProduto: React.FC = () => {
  const router = useRouter();
  const [product, setProduct] = useState<Product>({} as Product);
  const { data: productCount, isLoading: isProductCountLoading, error: productCountError } = useQuery("productCount", fetchProductCount);
  const { data: regimeEmpresa, isLoading: isRegimeEmpresaLoading, error: regimeEmpresaError } = useQuery("regimeEmpresa", fetchRegimeEmpresa);
  const { data, isLoading: isgruposEmpresaLoading, error: isGruposEmpresaError } = useQuery("gruposEmpresa", fetchGruposEmpresa);
  const [precoFormatado, setPrecoFormatado] = useState("");
  const fileInputRefCaminho = useRef<HTMLInputElement>(null);
  const fileInputRefCaminho2 = useRef<HTMLInputElement>(null);
  const fileInputRefCaminho3 = useRef<HTMLInputElement>(null);
  const fileInputRefCaminho4 = useRef<HTMLInputElement>(null);
  const fileInputRefCaminho5 = useRef<HTMLInputElement>(null);

  if (isProductCountLoading || isRegimeEmpresaLoading || isgruposEmpresaLoading) return <Loading />;

  if (productCountError || regimeEmpresaError || isGruposEmpresaError) {
    router.push("/");
    return;
  }

  const { grupos, subgrupos } = data;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      // Se for um checkbox, atribui 'X' para true e 'F' para false
      setProduct({ ...product, [name]: checked ? "X" : "F" });
    } else {
      // Para outros tipos de input, usa o valor como está
      setProduct({ ...product, [name]: value });
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, caminho: string) => {
    try {
      if (product.CodPro === undefined) return toast.error("Selecione um produto antes de adicionar uma imagem");
      let arquivo = event.currentTarget.files?.[0];
      if (!arquivo) return;
      if (!arquivo.type.includes("image")) return toast.error("O arquivo selecionado não é uma imagem");
      if (arquivo.size > 3000000) return toast.error("O tamanho máximo permitido é de 3MB");
      // Outras lógicas após a seleção do arquivo
      const formData = new FormData();
      formData.append("file", arquivo);

      const response = await axios.post(`/api/admin/produtos/imagem/${product.CodPro}/${caminho}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response?.data) {
        // Atualizar componente com a imagem
        setProduct((prevState) => ({ ...prevState, [caminho]: response.data.path }));
        return toast.success("Imagem adicionada com sucesso!");
      }
    } catch (error: any) {
      event.target.value = ""; // Resetando o input file
      toast.error(error?.response.data.message);
      return;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      //Atualizando Produto com Rota PUT
      const response = await axios.put(`/api/admin/produtos/editar/${product.CodPro}`, product);
      if (response?.data) {
        toast.success("Produto atualizado com sucesso!");
      } else {
        toast.error("Erro ao atualizar o produto!");
      }
    } catch (error: any) {
      toast.error(error?.response.data.message);
    }
  };

  const handleFetchProduto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Se o campo estiver vazio, define o CodCli como 0
    const CodProValue = e.target.value === "" ? "0" : e.target.value;
    setProduct((prevState) => ({
      ...prevState,
      CodPro: parseInt(CodProValue, 10) || 0,
    }));

    if (CodProValue !== "0") {
      try {
        const response = await axios.get(`/api/admin/produtos/editar/${CodProValue}`);
        if (response?.data) {
          setProduct(response.data);
          console.log(response.data);
        }
      } catch (error: any) {
        toast.warn(error?.response.data.message);
      }
    }
  };

  const handleDeleteImage = (image: string) => async () => {
    try {
      const response = await axios.delete(`/api/admin/produtos/imagem/${product.CodPro}/${image}`);
      if (response?.data) {
        toast.success("Imagem deletada com sucesso!");
        setProduct((prevState) => ({ ...prevState, [image]: "semProduto.png" }));
      }
    } catch (error: any) {
      toast.error(error?.response.data.message);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2 className={styles.Title}>Editar um Produto</h2>
          <div className={styles.SubTitle}>
            <Form.Group controlId="formCodPro" className={styles.CodPro}>
              <Form.Label className={styles.CodProLabel}>Código do Produto: </Form.Label>
              <Form.Control type="text" placeholder="COD" value={product.CodPro} style={{ width: "70px", textAlign: "center" }} onChange={handleFetchProduto} />
            </Form.Group>

            <div className={styles.Badges}>
              <h6>
                Total de Produtos: <Badge bg="secondary">{productCount}</Badge>
              </h6>
              <h6>
                Regime da empresa: <Badge bg="info">{regimeEmpresa}</Badge>
              </h6>
            </div>
          </div>
        </Col>
      </Row>
      <hr />
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} md={4}>
            <Form.Group controlId="Produto">
              <Form.Label className={styles["form-label"]}>Nome do Produto</Form.Label>
              <Form.Control required={true} type="text" name="Produto" value={product.Produto} onChange={handleInputChange} />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group controlId="Categoria">
              <Form.Label className={styles["form-label"]}>Categoria</Form.Label>
              <Form.Control required={true} type="text" name="Categoria" value={product.Categoria} onChange={handleInputChange} />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group controlId="Referencia">
              <Form.Label className={styles["form-label"]}>Referência</Form.Label>
              <Form.Control
                required={true}
                type="text"
                name="Referencia"
                value={product.Referencia}
                onChange={handleInputChange}
                onBlur={() => {
                  if (!product.Referencia || product.Referencia.length <= 0) return toast.error("Preencha o campo referência");
                }}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group controlId="CodigoBarras">
              <Form.Label className={styles["form-label"]}>Código de Barras</Form.Label>
              <Form.Control
                required={true}
                type="text"
                name="CodigoBarras"
                value={product.CodigoBarras}
                maxLength={14}
                minLength={13}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = event.target;
                  const onlyNums = value.replace(/[^0-9]/g, "");
                  if (onlyNums.length <= 14) {
                    setProduct({ ...product, CodigoBarras: onlyNums });
                  }
                }}
                onBlur={() => {
                  if ((product.CodigoBarras ?? "").length < 13) return toast.error("O Código de barras não é válido");
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="Unidade">
              <Form.Label className={styles["form-label"]}>Unidade de medida</Form.Label>
              <Form.Control as="select" required={true} name="Unidade" value={product.Unidade} onChange={handleInputChange}>
                <option value="">Selecione uma opção</option>
                <option value="UN">UN - Unidade</option>
                <option value="PC">PC - Pacote</option>
                <option value="PÇ">PÇ - Peça</option>
                <option value="KG">KG - Kilograma</option>
                <option value="CX">CX - Caixa</option>
                <option value="M2">M² - Metro Quadrado</option>
                <option value="PT">PT - Pote</option>
                <option value="RL">RL - Rolo</option>
                <option value="LT">LT - Litro</option>
                <option value="LA">LA - Lata</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="Preco1">
              <Form.Label className={styles["form-label"]}>Preço</Form.Label>
              <Form.Control
                required={true}
                type="text"
                name="Preco1"
                value={product.Preco1?.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  let { value } = event.target;
                  // Remove tudo que não é dígito
                  value = value.replace(/\D/g, "");
                  // Divide por 100 para obter o valor correto em reais
                  const valueInReais = value ? (parseInt(value, 10) / 100).toFixed(2) : "";
                  // Substitui o ponto decimal por vírgula
                  const formattedValue = valueInReais.toString().replace(".", ",");
                  // Atualiza o estado formatado com o novo valor formatado
                  setPrecoFormatado(formattedValue);
                  // Atualiza o estado do produto com o valor numérico para cálculos ou envio ao servidor
                  setProduct({ ...product, Preco1: parseFloat(valueInReais) });
                }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="Origem">
              <Form.Label className={styles["form-label"]}>Origem</Form.Label>
              <Form.Control as="select" required={true} name="Origem" value={product.Origem} onChange={handleInputChange}>
                <option value="">Selecione uma opção</option>
                <option value="0">0 - Nacional</option>
                <option value="1">1 - Estrangeira - Importação direta</option>
                <option value="2">2 - Estrangeira - Adquirida no mercado interno</option>
                <option value="3">3 - Nacional com mais de 40% de Conteúdo Estrangeiro</option>
                <option value="4">4 - Nacional, produção conforme processos produtivos básicos</option>
                <option value="5">5 - Nacional com menos de 40% de Conteúdo Estrangeiro</option>
                <option value="6">6 - Estrangeira - Importação direta, sem similar nacional</option>
                <option value="7">7 - Estrangeira - Adquirida no mercado interno, sem similar nacional</option>
                <option value="8">8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="CstCompra">
              <Form.Label className={styles["form-label"]}>CST de Compra</Form.Label>
              <Form.Control as="select" required={true} name="CstCompra" value={product.CSTCompra} onChange={handleInputChange}>
                <option value="">Selecione uma opção</option>
                <option value="00">00 - Tributada integralmente</option>
                <option value="10">10 - Tributada e com cobrança do ICMS por substituição tributária</option>
                <option value="20">20 - Com redução de Base de Cálculo</option>
                <option value="30">30 - Isenta ou não tributada e com cobrança do ICMS por substituição tributária.</option>
                <option value="40">40 - Isenta</option>
                <option value="41">41 - Não tributada</option>
                <option value="50">50 - Com suspensão</option>
                <option value="51">51 - Com diferimento</option>
                <option value="60">60 - ICMS cobrado anteriormente por substituição tributária</option>
                <option value="70">70 - Com redução da Base de Cálculo e cobrança do ICMS por substituição tributária</option>
                <option value="90">90 - Outras</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="Situacao">
              <Form.Label className={styles["form-label"]}>CST de Venda</Form.Label>
              <Form.Control as="select" required={true} name="Situacao" value={product.Situacao} onChange={handleInputChange} disabled={regimeEmpresa !== "Regime Normal"}>
                <option value="">Selecione uma opção</option>
                <option value="00">00 - Tributada integralmente</option>
                <option value="10">10 - Tributada e com cobrança do ICMS por substituição tributária</option>
                <option value="20">20 - Com redução de Base de Cálculo</option>
                <option value="30">30 - Isenta ou não tributada e com cobrança do ICMS por substituição tributária.</option>
                <option value="40">40 - Isenta</option>
                <option value="41">41 - Não tributada</option>
                <option value="50">50 - Com suspensão</option>
                <option value="51">51 - Com diferimento</option>
                <option value="60">60 - ICMS cobrado anteriormente por substituição tributária</option>
                <option value="70">70 - Com redução da Base de Cálculo e cobrança do ICMS por substituição tributária</option>
                <option value="90">90 - Outras</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="CSOSN">
              <Form.Label className={styles["form-label"]}>CSOSN</Form.Label>
              <Form.Control as="select" required={true} name="CSOSN" value={product.CSOSN} onChange={handleInputChange} disabled={regimeEmpresa === "Regime Normal"}>
                <option value="">Selecione uma opção</option>
                <option value="101">101 - Tributada pelo Simples Nacional com permissão de crédito de ICMS</option>
                <option value="102">102 - Tributada pelo Simples Nacional sem permissão de crédito</option>
                <option value="103">103 - Isenção de ICMS no Simples Nacional na faixa de receita bruta</option>
                <option value="201">201 - Tributada pelo Simples Nacional com permissão de crédito e cobrança do ICMS por ST</option>
                <option value="202">202 - Tributada pelo Simples Nacional sem permissão de crédito e com cobrança do ICMS por ST</option>
                <option value="203">203 - Isenção do ICMS no Simples Nacional para faixa de receita bruta e cobrança de ICMS por ST</option>
                <option value="300">300 - Imune de ICMS</option>
                <option value="400">400 - Não tributada pelo Simples Nacional</option>
                <option value="500">500 - ICMS cobrado anteriormente por ST ou por antecipação</option>
                <option value="900">900 - Outros (operações que não se enquadram nos códigos anteriores)</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="CodGrp">
              <Form.Label className={styles["form-label"]}>Grupo</Form.Label>
              <Form.Control as="select" required={true} name="CodGrp" value={product.Codgrp} onChange={handleInputChange}>
                <option value="">Selecione uma opção</option>
                {grupos.map((grupo: Grupo) => (
                  <option key={grupo.CodGrp} value={grupo.CodGrp}>
                    {grupo.Grupo}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="CodSub">
              <Form.Label className={styles["form-label"]}>Subgrupo</Form.Label>

              <Form.Control as="select" required={true} name="CodSub" value={product.CodSub} onChange={handleInputChange}>
                <option value="">Selecione uma opção</option>
                {subgrupos.map((subgrupo: Subgrupo) => (
                  <option key={subgrupo.CodSub} value={subgrupo.CodSub}>
                    {subgrupo.SubGrupo}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label className={styles["form-label"]}>Adicionar produto ao Ecommerce?</Form.Label>
              <Form.Check>
                <Form.Check.Input
                  type="checkbox"
                  name="ECommerce"
                  checked={product.ECommerce === "X"} // Simplificado para comparação direta
                  onChange={handleInputChange}
                />
                <Form.Check.Label>Sim</Form.Check.Label>
              </Form.Check>
            </Form.Group>
          </Col>
        </Row>
        <hr />
        <Row className={styles.imagensProduto}>
          <h6>Imagens do produto</h6>
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_FOTOSPRODUTOSURL}/${product?.Caminho != null ? product?.Caminho : "erro/semProduto.png"}`}
                    width={130}
                    height={130}
                    alt={product?.Produto || ""}
                  />
                </Card.Text>
              </Card.Body>
              <Card.Footer className={styles.CardButtons}>
                <Form.Control
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileSelect(e, "Caminho")}
                  ref={fileInputRefCaminho} // Usando a referência aqui
                />
                {product.Caminho === "semProduto.png" || (!product.Caminho && <FaPlus onClick={() => fileInputRefCaminho.current?.click()} style={{ cursor: "pointer" }} />)}
                {product.Caminho && <FaMinus onClick={handleDeleteImage("Caminho")} style={{ cursor: "pointer" }} />}
              </Card.Footer>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_FOTOSPRODUTOSURL}/${product?.Caminho2 != null ? product?.Caminho2 : "erro/semProduto.png"}`}
                    width={130}
                    height={130}
                    alt={product?.Produto || ""}
                  />
                </Card.Text>
              </Card.Body>
              <Card.Footer className={styles.CardButtons}>
                <Form.Control
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileSelect(e, "Caminho2")}
                  ref={fileInputRefCaminho2} // Usando a referência aqui
                />
                {product.Caminho2 === "semProduto.png" || (!product.Caminho2 && <FaPlus onClick={() => fileInputRefCaminho2.current?.click()} style={{ cursor: "pointer" }} />)}
                {product.Caminho2 && <FaMinus onClick={handleDeleteImage("Caminho2")} style={{ cursor: "pointer" }} />}
              </Card.Footer>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_FOTOSPRODUTOSURL}/${product?.Caminho3 != null ? product?.Caminho3 : "erro/semProduto.png"}`}
                    width={130}
                    height={130}
                    alt={product?.Produto || ""}
                  />
                </Card.Text>
              </Card.Body>
              <Card.Footer className={styles.CardButtons}>
                <Form.Control
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileSelect(e, "Caminho3")}
                  ref={fileInputRefCaminho3} // Usando a referência aqui
                />
                {product.Caminho3 === "semProduto.png" || (!product.Caminho3 && <FaPlus onClick={() => fileInputRefCaminho3.current?.click()} style={{ cursor: "pointer" }} />)}
                {product.Caminho3 && <FaMinus onClick={handleDeleteImage("Caminho3")} style={{ cursor: "pointer" }} />}
              </Card.Footer>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_FOTOSPRODUTOSURL}/${product?.Caminho4 != null ? product?.Caminho4 : "erro/semProduto.png"}`}
                    width={130}
                    height={130}
                    alt={product?.Produto || ""}
                  />
                </Card.Text>
              </Card.Body>
              <Card.Footer className={styles.CardButtons}>
                <Form.Control
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileSelect(e, "Caminho4")}
                  ref={fileInputRefCaminho4} // Usando a referência aqui
                />
                {product.Caminho4 === "semProduto.png" || (!product.Caminho4 && <FaPlus onClick={() => fileInputRefCaminho4.current?.click()} style={{ cursor: "pointer" }} />)}
                {product.Caminho4 && <FaMinus onClick={handleDeleteImage("Caminho4")} style={{ cursor: "pointer" }} />}
              </Card.Footer>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Text>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_FOTOSPRODUTOSURL}/${product?.Caminho5 != null ? product?.Caminho5 : "erro/semProduto.png"}`}
                    width={130}
                    height={130}
                    alt={product?.Produto || ""}
                  />
                </Card.Text>
              </Card.Body>
              <Card.Footer className={styles.CardButtons}>
                <Form.Control
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileSelect(e, "Caminho5")}
                  ref={fileInputRefCaminho5} // Usando a referência aqui
                />
                {product.Caminho5 === "semProduto.png" || (!product.Caminho5 && <FaPlus onClick={() => fileInputRefCaminho5.current?.click()} style={{ cursor: "pointer" }} />)}
                {product.Caminho5 && <FaMinus onClick={handleDeleteImage("Caminho5")} style={{ cursor: "pointer" }} />}
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row>
          <Button type="submit" className={styles.botaoSalvar}>
            <FaSave size={24} />
          </Button>
        </Row>
      </Form>
    </Container>
  );
};

export default EdicaoProduto;
