import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import styles from "./RegistrationForm.module.css";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";
import Loading from "@/components/Loading/Loading";
import { Spinner } from "react-bootstrap";

interface Cliente {
  endereco?: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  email: string;
  complementoEndereco: string;
  campoLivre: string;
  cgc: string;
  ie: string;
  telent2: string;
  cpf?: string;
  Cliente?: string;
  rg?: string;
}

const RegistrationForm = () => {
  const [pessoaFisica, setPessoaFisica] = useState(false); // Estado para controlar o tipo de pessoa (física ou jurídica)
  const [loading, setLoading] = useState(false); // Estado para controlar o indicador de carregamento
  const [loadingCNPJ, setLoadingCNPJ] = useState(false); // Estado para controlar o indicador de carregamento
  const [formValues, setFormValues] = useState<Cliente>({} as Cliente);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formValues.complementoEndereco.length > 30) return toast.error("O campo complemento de endereço deve ter no máximo 30 caracteres");
    setLoading(true);
    const response = axios
      .post("/api/usuario/cadastro", formValues)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Conta criada com sucesso!");
          // Limpar o formulário
          setFormValues({
            endereco: "",
            numero: "",
            bairro: "",
            cidade: "",
            estado: "",
            cep: "",
            email: "",
            complementoEndereco: "",
            campoLivre: "",
            cgc: "",
            ie: "",
            telent2: "",
            cpf: "",
            rg: "",
          });
        }
      })
      .catch((error) => {
        if (error?.response?.data) return toast.error(error.response.data.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function validarCNPJ(cnpj: string) {
    // Remover caracteres não numéricos do CNPJ
    cnpj = cnpj.replace(/[^\d]+/g, "");

    // Verificar se o CNPJ possui 14 dígitos
    if (cnpj.length !== 14) {
      return false;
    }

    // Verificar se todos os dígitos do CNPJ são iguais
    if (/^(\d)\1+$/.test(cnpj)) {
      return false;
    }

    // Calcular o primeiro dígito verificador
    let soma = 0;
    let peso = 2;
    for (let i = 11; i >= 0; i--) {
      soma += parseInt(cnpj.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    let digitoVerificador1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    // Verificar o primeiro dígito verificador
    if (parseInt(cnpj.charAt(12)) !== digitoVerificador1) {
      return false;
    }

    // Calcular o segundo dígito verificador
    soma = 0;
    peso = 2;
    for (let i = 12; i >= 0; i--) {
      soma += parseInt(cnpj.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    let digitoVerificador2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    // Verificar o segundo dígito verificador
    if (parseInt(cnpj.charAt(13)) !== digitoVerificador2) {
      return false;
    }

    // CNPJ válido
    return true;
  }

  useEffect(() => {
    function formatarCep(cep: string) {
      cep = cep.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
      cep = cep.replace(/^(\d{5})(\d)/, "$1-$2"); // Aplica a máscara "xxxxx-xx"
      return cep;
    }
    const fetchCnpjData = async () => {
      try {
        if (formValues.cgc && (formValues.cgc.length === 14 || formValues.cgc.length === 18)) {
          if (validarCNPJ(formValues.cgc) === false) return toast.info("CNPJ Inválido");

          setLoadingCNPJ(true);
          // Remover a pontuação do CNPJ
          const cnpj = formValues.cgc.replace(/[^\d]+/g, "");

          const response = await axios.get(`/api/cnpj/${cnpj}`);
          const CNPJDados = await response.data;
          // Atualizar os campos do formulário com os dados do CNPJ
          // Atualizar os campos do formulário com os dados do CNPJ
          setFormValues((prevValues) => {
            const formattedCep = CNPJDados.cep ? formatarCep(CNPJDados.cep) : "";
            const formattedCgc = prevValues.cgc && prevValues.cgc.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
            return {
              ...prevValues,
              cgc: formattedCgc,
              razao: CNPJDados.nome,
              cliente: CNPJDados.fantasia,
              endereco: CNPJDados.logradouro,
              complementoEndereco: CNPJDados.complemento,
              numero: CNPJDados.numero,
              bairro: CNPJDados.bairro,
              cidade: CNPJDados.municipio,
              estado: CNPJDados.uf,
              cep: formattedCep,
              email: CNPJDados.email,
              // ...resto dos campos do formulário
            };
          });
        }
        setLoadingCNPJ(false);
      } catch (error) {
        setFormValues((prevValues) => ({
          ...prevValues,
          cgc: formValues?.cgc.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"),
        }));

        console.log(error);
        setLoadingCNPJ(false);
      }
    };
    fetchCnpjData();
  }, [formValues.cgc]);

  const handleTipoPessoaChange = (event: React.ChangeEvent<any>) => {
    setPessoaFisica(event.target.value === "fisica");

    if (event.target.value === "fisica") {
      setFormValues((prevValues) => ({
        ...prevValues,
        cgc: "",
        ie: "",
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        cpf: "",
        rg: "",
      }));
    }
  };

  const handleFetchCep = async (event: React.FocusEvent<any>) => {
    try {
      const cep = event.target.value;
      if (cep.length === 9) {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const { logradouro, bairro, localidade, uf } = response.data;
        setFormValues((prevValues) => ({
          ...prevValues,
          endereco: logradouro,
          bairro: bairro,
          cidade: localidade,
          estado: uf,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className={styles.form}>
      <Form.Group controlId="tipoPessoa">
        <Form.Label className={styles.label}>Tipo de Pessoa</Form.Label>
        <Form.Control as="select" onChange={handleTipoPessoaChange} className={styles.input} defaultValue={"juridica"}>
          <option value="fisica" disabled={process.env.NEXT_PUBLIC_PERMITE_PESSOA_FISICA !== "TRUE"}>
            Pessoa Física
          </option>
          <option value="juridica">Pessoa Jurídica</option>
        </Form.Control>
      </Form.Group>
      {/* Pessoa Júridica*/}
      {pessoaFisica ? (
        <>
          <Form.Group controlId="formCliente">
            <Form.Label className={styles.label}>Nome Completo</Form.Label>
            <Form.Control value={formValues?.Cliente} onChange={handleChange} type="text" name="Cliente" className={styles.input} required={true} />
            {loadingCNPJ && <Spinner animation="border" className="position-absolute top-50 start-100 translate-middle" />}
          </Form.Group>
          <Form.Group controlId="CPF">
            <Form.Label className={styles.label}>CPF</Form.Label>
            <Form.Control as={InputMask} mask="999999999-99" maskChar={null} value={formValues.cpf} onChange={handleChange} type="text" name="cpf" className={styles.input} required={true} />
            {loadingCNPJ && <Spinner animation="border" className="position-absolute top-50 start-100 translate-middle" />}
          </Form.Group>
          <Form.Group controlId="RG">
            <Form.Label className={styles.label}>RG</Form.Label>
            <Form.Control value={formValues.rg} onChange={handleChange} type="text" name="rg" className={styles.input} required={true} maxLength={18} />
            {loadingCNPJ && <Spinner animation="border" className="position-absolute top-50 start-100 translate-middle" />}
          </Form.Group>
        </>
      ) : (
        <Form.Group controlId="cgc">
          <Form.Label className={styles.label}>CNPJ</Form.Label>
          <Form.Control as={InputMask} mask="99.999.999/9999-99" maskChar={null} value={formValues.cgc} onChange={handleChange} type="text" name="cgc" className={styles.input} required={true} />
          {loadingCNPJ && <Spinner animation="border" className="position-absolute top-50 start-100 translate-middle" />}
        </Form.Group>
      )}
      {!pessoaFisica && (
        <Form.Group controlId="ie">
          <Form.Label className={styles.label}>(IE) - Inscrição Estadual </Form.Label>
          <Form.Control type="text" name="ie" value={formValues.ie} onChange={handleChange} className={styles.input} required={true} />
        </Form.Group>
      )}

      <Form.Group controlId="email">
        <Form.Label className={styles.label}>Email</Form.Label>
        <Form.Control autoComplete="true" type="email" name="email" value={formValues.email} onChange={handleChange} className={styles.input} required={true} />
      </Form.Group>

      <Form.Group controlId="telent2">
        <Form.Label className={styles.label}>Whatsapp</Form.Label>
        <Form.Control as={InputMask} mask="(99)99999-9999" maskChar={null} value={formValues.telent2} onChange={handleChange} type="text" name="telent2" className={styles.input} required={true} />
      </Form.Group>
      <Form.Group controlId="cep">
        <Form.Label className={styles.label}>CEP</Form.Label>
        <Form.Control
          as={InputMask}
          mask="99999-999"
          maskChar={null}
          value={formValues.cep}
          onChange={handleChange}
          onBlur={handleFetchCep}
          type="text"
          name="cep"
          className={styles.input}
          required={true}
        />
      </Form.Group>
      <Form.Group controlId="endereco">
        <Form.Label className={styles.label}>Endereço</Form.Label>
        <Form.Control type="text" name="endereco" value={formValues.endereco} onChange={handleChange} className={styles.input} required={true} />
      </Form.Group>
      <Form.Group controlId="numero">
        <Form.Label className={styles.label}>Número</Form.Label>
        <Form.Control type="text" name="numero" value={formValues.numero} onChange={handleChange} className={styles.input} required={true} />
      </Form.Group>
      <Form.Group controlId="bairro">
        <Form.Label className={styles.label}>Bairro</Form.Label>
        <Form.Control type="text" name="bairro" value={formValues.bairro} onChange={handleChange} className={styles.input} required={true} />
      </Form.Group>
      <Form.Group controlId="cidade">
        <Form.Label className={styles.label}>Cidade</Form.Label>
        <Form.Control type="text" name="cidade" value={formValues.cidade} onChange={handleChange} className={styles.input} required={true} />
      </Form.Group>
      <Form.Group controlId="estado">
        <Form.Label className={styles.label}>Estado</Form.Label>
        <Form.Control type="text" name="estado" value={formValues.estado} onChange={handleChange} className={styles.input} required={true} />
      </Form.Group>
      <Form.Group controlId="complementoEndereco">
        <Form.Label className={styles.label}>Complemento de Endereço</Form.Label>
        <Form.Control type="text" name="complementoEndereco" value={formValues.complementoEndereco} onChange={handleChange} className={styles.input} maxLength={30} required={true} />
      </Form.Group>
      <Form.Group controlId="campoLivre">
        <Form.Label className={styles.label}>Referencia</Form.Label>
        <Form.Control type="text" name="campoLivre" value={formValues.campoLivre} onChange={handleChange} className={styles.input} />
      </Form.Group>
      {loading ? (
        <Loading />
      ) : (
        <Button variant="primary" type="submit" className={styles.button}>
          Enviar
        </Button>
      )}
    </Form>
  );
};

export default RegistrationForm;
