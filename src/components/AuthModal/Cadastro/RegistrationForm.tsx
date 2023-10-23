import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import styles from "./RegistrationForm.module.css";
import axiosCliente from "@/services/axiosCliente";
import { toast } from "react-toastify";
// @ts-ignore
import InputMask from "react-input-mask";
import Loading from "@/components/Loading/Loading";
import { Spinner } from "react-bootstrap";

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false); // Estado para controlar o indicador de carregamento
  const [loadingCNPJ, setLoadingCNPJ] = useState(false); // Estado para controlar o indicador de carregamento
  const [formValues, setFormValues] = useState({
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    email: "",
    chave: "",
    complementoEndereco: "",
    campoLivre: "",
    cgc: "",
    ie: "",
    telent2: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const response = axiosCliente
      .post("/usuarios/cadastro", formValues)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Conta criada com sucesso!");
          // Limpar o formulário
          setFormValues({
            cgc: "",
            ie: "",
            email: "",
            chave: "",
            endereco: "",
            numero: "",
            bairro: "",
            cidade: "",
            estado: "",
            cep: "",
            complementoEndereco: "",
            campoLivre: "",
            telent2: "",
          });
        }
      })
      .catch((error) => {
        if (error.response.data.message) {
          return toast.error(error.response.data.message);
        }
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
        if ((formValues.cgc && formValues.cgc.length === 14) || formValues.cgc.length === 18) {
          if (validarCNPJ(formValues.cgc) === false) return toast.info("CNPJ Inválido");

          setLoadingCNPJ(true);
          // Remover a pontuação do CNPJ
          const cnpj = formValues.cgc.replace(/[^\d]+/g, "");

          const response = await axios.get(`https://cors-anywhere.herokuapp.com/https://www.receitaws.com.br/v1/cnpj/${cnpj}`);
          const CNPJDados = await response.data;
          // Atualizar os campos do formulário com os dados do CNPJ
          setFormValues((prevValues) => {
            const formattedCep = CNPJDados.cep ? formatarCep(CNPJDados.cep) : "";
            return {
              ...prevValues,
              cgc: formValues.cgc.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"),
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
          cgc: formValues.cgc.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"),
        }));

        console.log(error);
        setLoadingCNPJ(false);
      }
    };
    fetchCnpjData();
  }, [formValues.cgc]);

  return (
    <Form onSubmit={handleSubmit} className={styles.form}>
      <Form.Group controlId="cgc">
        <Form.Label className={styles.label}>CNPJ</Form.Label>
        <InputMask mask="99.999.999/9999-99" maskChar="" value={formValues.cgc} onChange={handleChange}>
          {(inputProps: any) => (
            <div className="position-relative">
              <Form.Control type="text" name="cgc" className={styles.input} required={true} maxLength={18} {...inputProps} />
              {loadingCNPJ && <Spinner animation="border" className="position-absolute top-50 start-100 translate-middle" />}
            </div>
          )}
        </InputMask>
      </Form.Group>
      <Form.Group controlId="email">
        <Form.Label className={styles.label}>Email</Form.Label>
        <Form.Control autoComplete="true" type="email" name="email" value={formValues.email} onChange={handleChange} className={styles.input} required={true} />
      </Form.Group>
      <Form.Group controlId="chave">
        <Form.Label className={styles.label}>Crie uma senha de acesso</Form.Label>
        <Form.Control autoComplete="true" type="password" name="chave" value={formValues.chave} onChange={handleChange} className={styles.input} required={true} />
      </Form.Group>
      <Form.Group controlId="ie">
        <Form.Label className={styles.label}>(IE) - Inscrição Estadual </Form.Label>
        <Form.Control type="text" name="ie" value={formValues.ie} onChange={handleChange} className={styles.input} required={true} />
      </Form.Group>
      <Form.Group controlId="telent2">
        <Form.Label className={styles.label}>Whatsapp</Form.Label>
        <InputMask mask="(99)99999-9999" maskChar="" value={formValues.telent2} onChange={handleChange}>
          {(inputProps: any) => <Form.Control type="text" name="telent2" className={styles.input} required={true} {...inputProps} />}
        </InputMask>
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
      <Form.Group controlId="cep">
        <Form.Label className={styles.label}>CEP</Form.Label>
        <InputMask mask="99999-999" maskChar="" value={formValues.cep} onChange={handleChange}>
          {(inputProps: any) => <Form.Control type="text" name="cep" className={styles.input} required={true} {...inputProps} />}
        </InputMask>
      </Form.Group>
      <Form.Group controlId="complementoEndereco">
        <Form.Label className={styles.label}>Complemento de Endereço</Form.Label>
        <Form.Control type="text" name="complementoEndereco" value={formValues.complementoEndereco} onChange={handleChange} className={styles.input} required={true} />
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
