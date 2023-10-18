import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import styles from "./RegistrationForm.module.css";
import axiosCliente from "@/services/axiosCliente";
import { toast } from "react-toastify";
// @ts-ignore
import InputMask from "react-input-mask";

const RegistrationForm = () => {
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
      });
  };

  useEffect(() => {
    function formatarCep(cep: string) {
      cep = cep.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
      cep = cep.replace(/^(\d{5})(\d)/, "$1-$2"); // Aplica a máscara "xxxxx-xx"
      return cep;
    }
    const fetchCnpjData = async () => {
      try {
        if (formValues.cgc && formValues.cgc.length === 14) {
          const response = await axios.get(`https://cors-anywhere.herokuapp.com/https://www.receitaws.com.br/v1/cnpj/${formValues.cgc}`);

          const CNPJDados = await response.data;

          // Atualizar os campos do formulário com os dados do CNPJ
          setFormValues((prevValues) => ({
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
            cep: formatarCep(CNPJDados.cep),
            email: CNPJDados.email,
            // ...resto dos campos do formulário
          }));
        }
      } catch (error) {
        setFormValues((prevValues) => ({
          ...prevValues,
          cgc: formValues.cgc.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"),
        }));

        console.log(error);
      }
    };
    fetchCnpjData();
  }, [formValues.cgc]);

  return (
    <Form onSubmit={handleSubmit} className={styles.form}>
      <Form.Group controlId="cgc">
        <Form.Label className={styles.label}>CNPJ</Form.Label>
        <Form.Control type="text" name="cgc" value={formValues.cgc} onChange={handleChange} className={styles.input} required={true} maxLength={18} />
      </Form.Group>
      <Form.Group controlId="email">
        <Form.Label className={styles.label}>Email</Form.Label>
        <Form.Control type="email" name="email" value={formValues.email} onChange={handleChange} className={styles.input} required={true} />
      </Form.Group>
      <Form.Group controlId="chave">
        <Form.Label className={styles.label}>Crie uma senha de acesso</Form.Label>
        <Form.Control type="password" name="chave" value={formValues.chave} onChange={handleChange} className={styles.input} required={true} />
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
      <Button variant="primary" type="submit" className={styles.button}>
        Enviar
      </Button>
    </Form>
  );
};

export default RegistrationForm;
