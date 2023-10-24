import { Button, Card, Form } from "react-bootstrap";
import { createContext, useState } from "react";
import { useEffect } from "react";
import axiosCliente from "@/services/axiosCliente";
import { toast } from "react-toastify";
import axios from "axios";
import InputMask from "react-input-mask";

const Endereco = ({ id }) => {
  const [novoEndereco, setNovoEndereco] = useState(false);
  const [enderecoPrincipal, setEnderecoPrincipal] = useState({});
  const [enderecosCadastrados, setEnderecosCadastrado] = useState([]);
  const [redefinir, setRedefinir] = useState(false);
  const [cepDinamico, setCepDinamico] = useState("");

  useEffect(() => {
    setNovoEndereco(false);
    setRedefinir(false);
    const fetchEnderecos = async () => {
      try {
        const response = await axiosCliente.get(`/usuarios/endereco/${id}`);
        setEnderecoPrincipal(response.data.enderecoPrincipal);
        setEnderecosCadastrado(response.data.enderecosEntrega);
      } catch (error) {
        toast.warn(error.message);
      }
    };

    fetchEnderecos();
  }, [id, redefinir]); // Adicione o 'id' como dependência

  const handleNovoEndereco = () => {
    setNovoEndereco(true);
    setRedefinir(false);
    setEnderecoPrincipal({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnderecoPrincipal((prevEndereco) => ({
      ...prevEndereco,
      [name]: value,
    }));
  };

  const adicionarNovoEndereco = async () => {
    if (Object.keys(enderecoPrincipal).length === 0) return toast.warn("Preencha os dados de endereço");
    if (!cepDinamico) return toast.warn("Informe o CEP");
    if (!enderecoPrincipal.Endereco) return toast.warn("Informe o Endereço");
    if (!enderecoPrincipal.Cidade) return toast.warn("Informe a Cidade");
    if (!enderecoPrincipal.Estado) return toast.warn("Informe o Estado");
    if (!enderecoPrincipal.Bairro) return toast.warn("Informe o Bairro");
    if (!enderecoPrincipal.Tel) return toast.warn("Informe o Telefone");
    if (!enderecoPrincipal.Numero) return toast.warn("Informe o Número");

    try {
      const response = await axiosCliente.post(`usuarios/endereco/${id}`, enderecoPrincipal);
      setRedefinir(true);
      setCepDinamico("");
      return toast.success(`Novo endereço cadastrado`);
    } catch (error) {
      return toast.warn(error.message);
    }
  };

  const fetchCEP = async () => {
    const cepFormatado = cepDinamico.replace(/\D/g, ""); // Remove pontos e dígitos usando regex
    if (cepFormatado.length === 8) {
      try {
        const resposta = await axios.get(`https://viacep.com.br/ws/${cepFormatado}/json/`);

        const cep = resposta.data;

        setEnderecoPrincipal((prevEndereco) => ({
          ...prevEndereco,
          CEP: cepDinamico,
          Endereco: cep.logradouro,
          Bairro: cep.bairro,
          Cidade: cep.localidade,
          Estado: cep.uf,
        }));
      } catch (error) {
        toast.warn(error.message);
      }
    }
  };

  return (
    <Card style={{ marginTop: "20px", marginBottom: "20px" }}>
      <Card.Header>
        <Card.Title>Confirme ou Adicione seu endereço</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form.Select
          aria-label="Selecione um endereço"
          style={{ marginBottom: "10px" }}
          onChange={(e) => {
            const selectedAddress = enderecosCadastrados.find((address) => address.Endereco === e.target.value);
            setNovoEndereco(false);
            setRedefinir(false);
            setEnderecoPrincipal(selectedAddress);
          }}
        >
          <option disabled>Seus endereços cadastrados</option>
          {enderecosCadastrados.map((address) => (
            <option key={address.Lanc} value={address.Endereco}>
              {address.Endereco}
            </option>
          ))}
        </Form.Select>
        {!enderecoPrincipal || novoEndereco ? (
          <Form>
            <Form.Group controlId="CEP">
              <Form.Label>CEP</Form.Label>
              <InputMask mask="99999-999" maskChar="" value={cepDinamico} onChange={(e) => setCepDinamico(e.target.value)} onBlur={fetchCEP}>
                {(inputProps: any) => <Form.Control type="text" name="CEP" {...inputProps} />}
              </InputMask>
            </Form.Group>
            <Form.Group controlId="Endereco">
              <Form.Label>Endereço</Form.Label>
              <Form.Control type="text" name="Endereco" value={enderecoPrincipal?.Endereco || ""} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="Cidade">
              <Form.Label>Cidade</Form.Label>
              <Form.Control type="text" name="Cidade" value={enderecoPrincipal?.Cidade || ""} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="Estado">
              <Form.Label>Estado</Form.Label>
              <Form.Control type="text" name="Estado" value={enderecoPrincipal?.Estado || ""} onChange={handleInputChange} maxLength={2} minLength={2} />
            </Form.Group>
            <Form.Group controlId="Bairro">
              <Form.Label>Bairro</Form.Label>
              <Form.Control type="text" name="Bairro" value={enderecoPrincipal?.Bairro || ""} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="Tel">
              <Form.Label>Telefone</Form.Label>
              <InputMask mask="(99)99999-9999" maskChar="" value={enderecoPrincipal?.Tel || ""} onChange={handleInputChange}>
                {(inputProps: any) => <Form.Control type="text" name="Tel" {...inputProps} />}
              </InputMask>
            </Form.Group>

            <Form.Group controlId="Tel2">
              <Form.Label>Telefone 2</Form.Label>
              <InputMask mask="(99) 9999-9999" maskChar="" value={enderecoPrincipal?.Tel2 || ""} onChange={handleInputChange} required>
                {(inputProps: any) => <Form.Control type="text" name="Tel2" {...inputProps} />}
              </InputMask>
            </Form.Group>

            <Form.Group controlId="CampoLivre">
              <Form.Label>Campo Livre</Form.Label>
              <Form.Control type="text" name="CampoLivre" value={enderecoPrincipal?.CampoLivre || ""} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group controlId="ComplementoEndereco">
              <Form.Label>Complemento do Endereço</Form.Label>
              <Form.Control type="text" name="ComplementoEndereco" value={enderecoPrincipal?.ComplementoEndereco || ""} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group controlId="Numero">
              <Form.Label>Número</Form.Label>
              <Form.Control type="text" name="Numero" value={enderecoPrincipal?.Numero || ""} onChange={handleInputChange} />
            </Form.Group>
            <div style={{ marginTop: "10px" }}>
              <Button variant="primary" onClick={() => setRedefinir(true)} style={{ marginRight: "10px" }}>
                Redefinir Campos
              </Button>
              <Button variant="primary" onClick={adicionarNovoEndereco}>
                Salvar
              </Button>
            </div>
          </Form>
        ) : (
          <Form>
            <Form.Group controlId="formCEP">
              <Form.Label>CEP</Form.Label>
              <Form.Control type="text" name="CEP" value={enderecoPrincipal?.CEP || ""} onChange={handleInputChange} disabled />
            </Form.Group>
            <Form.Group controlId="formEndereco">
              <Form.Label>Endereço</Form.Label>
              <Form.Control type="text" name="endereco" value={enderecoPrincipal?.Endereco || ""} onChange={handleInputChange} disabled />
            </Form.Group>
            <Form.Group controlId="formCidade">
              <Form.Label>Cidade</Form.Label>
              <Form.Control type="text" name="cidade" value={enderecoPrincipal?.Cidade || ""} onChange={handleInputChange} disabled />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control type="text" name="estado" value={enderecoPrincipal?.Estado || ""} onChange={handleInputChange} disabled />
            </Form.Group>
            <Form.Group controlId="formBairro">
              <Form.Label>Bairro</Form.Label>
              <Form.Control type="text" name="Bairro" value={enderecoPrincipal?.Bairro || ""} onChange={handleInputChange} disabled />
            </Form.Group>
            <Form.Group controlId="formTel">
              <Form.Label>Telefone</Form.Label>
              <Form.Control type="text" name="Tel" value={enderecoPrincipal?.Tel || ""} onChange={handleInputChange} disabled />
            </Form.Group>

            <Form.Group controlId="formTel2">
              <Form.Label>Telefone 2</Form.Label>
              <Form.Control type="text" name="tel2" value={enderecoPrincipal?.Tel2 || ""} onChange={handleInputChange} disabled />
            </Form.Group>

            <Form.Group controlId="formCampoLivre">
              <Form.Label>Campo Livre</Form.Label>
              <Form.Control type="text" name="campoLivre" value={enderecoPrincipal?.CampoLivre || ""} onChange={handleInputChange} disabled />
            </Form.Group>

            <Form.Group controlId="formComplementoEndereco">
              <Form.Label>Complemento do Endereço</Form.Label>
              <Form.Control type="text" name="ComplementoEndereco" value={enderecoPrincipal?.ComplementoEndereco || ""} onChange={handleInputChange} disabled />
            </Form.Group>

            <Form.Group controlId="formNumero">
              <Form.Label>Número</Form.Label>
              <Form.Control type="text" name="Numero" value={enderecoPrincipal?.Numero || ""} onChange={enderecoPrincipal?.handleInputChange} disabled />
            </Form.Group>
            <Button variant="primary" onClick={handleNovoEndereco} style={{ marginTop: "10px" }}>
              Usar outro endereço
            </Button>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default Endereco;
