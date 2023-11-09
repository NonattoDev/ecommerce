import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { Badge, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "./cadastroproduto.module.css";
import axios from "axios";
import { useQuery } from "react-query";
import Loading from "@/components/Loading/Loading";
import { useRouter } from "next/router";

interface Grupo {
  CodGrp: number;
  Grupo: string;
}

interface Subgrupo {
  CodSub: number;
  SubGrupo: string;
}

interface Product {
  Produto: string;
  Categoria: string;
  Referencia: string;
  CodigoBarras: string;
  Unidade: string;
  Preco1: number;
  Origem: string;
  CstCompra: string;
  Situacao: string;
  CSOSN: string;
  CodSub: string;
  CodGrp: string;
  Caminho: string;
}
interface Props {
  error: { message: string };
}

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

const CadastroProduto: React.FC = () => {
  const router = useRouter();
  const [product, setProduct] = useState<Product>({
    Produto: "",
    Categoria: "",
    Referencia: "",
    CodigoBarras: "",
    Unidade: "",
    Preco1: 0,
    Origem: "",
    CstCompra: "",
    Situacao: "",
    CSOSN: "",
    CodSub: "",
    CodGrp: "",
    Caminho: "",
  });

  const { data: productCount, isLoading: isProductCountLoading, error: productCountError } = useQuery("productCount", fetchProductCount);
  const { data: regimeEmpresa, isLoading: isRegimeEmpresaLoading, error: regimeEmpresaError } = useQuery("regimeEmpresa", fetchRegimeEmpresa);
  const { data, isLoading: isgruposEmpresaLoading, error: isGruposEmpresaError } = useQuery("gruposEmpresa", fetchGruposEmpresa);

  const [precoFormatado, setPrecoFormatado] = useState("");

  if (isProductCountLoading || isRegimeEmpresaLoading || isgruposEmpresaLoading) return <Loading />;

  if (productCountError || regimeEmpresaError || isGruposEmpresaError) {
    router.push("/");
    return;
  }

  const { grupos, subgrupos } = data;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await axios.post("/api/admin/produtos/adicionar", product);

    if (response.data.error) return toast.error(response.data.error);

    toast.success(`Produto nº ${response.data} cadastrado com sucesso!`);

    return fetchProductCount();
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2 className={styles.Title}>Cadastro de Produto</h2>
          <div className={styles.Badges}>
            <h6>
              Total de Produtos: <Badge bg="secondary">{productCount}</Badge>
            </h6>
            <h6>
              Regime da empresa: <Badge bg="info">{regimeEmpresa}</Badge>
            </h6>
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
                  if (product.Referencia.length <= 0) return toast.error("Preencha o campo referência");
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
                  if (product.CodigoBarras.length < 13) return toast.error("O Código de barras não é válido");
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
                value={precoFormatado}
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
              <Form.Control as="select" required={true} name="CstCompra" value={product.CstCompra} onChange={handleInputChange}>
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
              <Form.Control as="select" required={true} name="CodGrp" value={product.CodGrp} onChange={handleInputChange}>
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
            <Form.Group controlId="Caminho">
              <Form.Label className={styles["form-label"]}>URL Imagem</Form.Label>
              <Form.Control required={true} type="text" name="Caminho" value={product.Caminho} onChange={handleInputChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <button type="submit" className={styles.botaoSalvar}>
              <FontAwesomeIcon icon={faSave} cursor={"pointer"} width={30} color="#024968" />
            </button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default CadastroProduto;
