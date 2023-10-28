import { Button, Card, Form } from "react-bootstrap";
import { ChangeEvent, useContext, useState } from "react";
import { useEffect } from "react";
import axiosCliente from "@/services/axiosCliente";
import { toast } from "react-toastify";
import axios from "axios";
//@ts-ignore
import InputMask from "react-input-mask";
import { Endereco, EnderecoContext } from "@/context/EnderecoContexto";

const Endereco = ({ id }: { id: number }) => {
  const [novoEndereco, setNovoEndereco] = useState(false);
  const [enderecosCadastrados, setEnderecosCadastrado] = useState<Endereco[]>([]);
  const [redefinir, setRedefinir] = useState(false);
  const [cepDinamico, setCepDinamico] = useState("");
  const { endereco, setEndereco } = useContext(EnderecoContext);

  useEffect(() => {
    setNovoEndereco(false);
    setRedefinir(false);
    const fetchEnderecos = async () => {
      try {
        const response = await axiosCliente.get(`/usuarios/endereco/${id}`);
        setEndereco(response.data.enderecoPrincipal);
        setEnderecosCadastrado(response.data.enderecosEntrega);
      } catch (error: any) {
        toast.warn(error.message);
      }
    };

    fetchEnderecos();
  }, [id, redefinir]); // Adicione o 'id' como dependência

  const handleNovoEndereco = () => {
    setNovoEndereco(true);
    setRedefinir(false);
    setEndereco(undefined);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEndereco((prevEndereco) => {
      const updatedEndereco: Endereco = {
        ...prevEndereco,
        [name]: value,
      };

      return updatedEndereco;
    });
  };

  const adicionarNovoEndereco = async () => {
    if (!endereco) return toast.warn("Preencha os dados de endereço");
    if (!cepDinamico) return toast.warn("Informe o CEP");
    if (!endereco.Endereco) return toast.warn("Informe o Endereço");
    if (!endereco.Cidade) return toast.warn("Informe a Cidade");
    if (!endereco.Estado) return toast.warn("Informe o Estado");
    if (!endereco.Bairro) return toast.warn("Informe o Bairro");
    if (!endereco.Tel) return toast.warn("Informe o Telefone");
    if (!endereco.Numero) return toast.warn("Informe o Número");

    try {
      const response = await axiosCliente.post(`usuarios/endereco/${id}`, endereco);
      setRedefinir(true);
      setCepDinamico("");
      return toast.success(`Novo endereço cadastrado`);
    } catch (error: any) {
      return toast.warn(error.message);
    }
  };

  const fetchCEP = async () => {
    const cepFormatado = cepDinamico.replace(/\D/g, ""); // Remove pontos e dígitos usando regex
    if (cepFormatado.length === 8) {
      try {
        const resposta = await axios.get(`https://viacep.com.br/ws/${cepFormatado}/json/`);

        const cep = resposta.data;
        console.log(cep);

        setEndereco((prevEndereco) => {
          const updatedEndereco: Endereco = {
            ...prevEndereco,
            CEP: cepDinamico,
            Endereco: cep.logradouro,
            Bairro: cep.bairro,
            Cidade: cep.localidade,
            Estado: cep.uf,
            Tel: cep.tel || 0,
            Tel2: cep.tel2 ?? null,
            CampoLivre: cep.campoLivre ?? null, // Definir um valor padrão de null caso cep.campoLivre seja undefined
          };

          return updatedEndereco;
        });
      } catch (error: any) {
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
            const selectedAddress = enderecosCadastrados.find((address) => address.Lanc == e.target.value);

            setNovoEndereco(false);
            setRedefinir(false);
            setEndereco(selectedAddress);
          }}
        >
          <option>Seus endereços cadastrados</option>
          {enderecosCadastrados.map((address) => (
            <option key={address.Lanc} value={address.Lanc}>
              {address.Endereco}
            </option>
          ))}
        </Form.Select>
        {!endereco || novoEndereco ? (
          <Form>
            <Form.Group controlId="CEP">
              <Form.Label>CEP</Form.Label>
              <InputMask mask="99999-999" maskChar="" value={cepDinamico} onChange={(e) => setCepDinamico(e.target.value)} onBlur={fetchCEP}>
                {(inputProps: any) => <Form.Control type="text" name="CEP" {...inputProps} />}
              </InputMask>
            </Form.Group>
            <Form.Group controlId="Endereco">
              <Form.Label>Endereço</Form.Label>
              <Form.Control type="text" name="Endereco" value={endereco?.Endereco || ""} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="Cidade">
              <Form.Label>Cidade</Form.Label>
              <Form.Control type="text" name="Cidade" value={endereco?.Cidade || ""} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="Estado">
              <Form.Label>Estado</Form.Label>
              <Form.Control type="text" name="Estado" value={endereco?.Estado || ""} onChange={handleInputChange} maxLength={2} minLength={2} />
            </Form.Group>
            <Form.Group controlId="Bairro">
              <Form.Label>Bairro</Form.Label>
              <Form.Control type="text" name="Bairro" value={endereco?.Bairro || ""} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="Tel">
              <Form.Label>Telefone</Form.Label>
              <InputMask mask="(99)99999-9999" maskChar="" value={endereco?.Tel || ""} onChange={handleInputChange}>
                {(inputProps: any) => <Form.Control type="text" name="Tel" {...inputProps} />}
              </InputMask>
            </Form.Group>

            <Form.Group controlId="Tel2">
              <Form.Label>Telefone 2</Form.Label>
              <InputMask mask="(99) 9999-9999" maskChar="" value={endereco?.Tel2 || ""} onChange={handleInputChange} required>
                {(inputProps: any) => <Form.Control type="text" name="Tel2" {...inputProps} />}
              </InputMask>
            </Form.Group>

            <Form.Group controlId="CampoLivre">
              <Form.Label>Campo Livre</Form.Label>
              <Form.Control type="text" name="CampoLivre" value={endereco?.CampoLivre || ""} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group controlId="ComplementoEndereco">
              <Form.Label>Complemento do Endereço</Form.Label>
              <Form.Control type="text" name="ComplementoEndereco" value={endereco?.ComplementoEndereco || ""} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group controlId="Numero">
              <Form.Label>Número</Form.Label>
              <Form.Control type="text" name="Numero" value={endereco?.Numero || ""} onChange={handleInputChange} />
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
              <Form.Control type="text" name="CEP" value={endereco?.CEP || ""} onChange={handleInputChange} disabled />
            </Form.Group>
            <Form.Group controlId="formEndereco">
              <Form.Label>Endereço</Form.Label>
              <Form.Control type="text" name="endereco" value={endereco?.Endereco || ""} onChange={handleInputChange} disabled />
            </Form.Group>
            <Form.Group controlId="formCidade">
              <Form.Label>Cidade</Form.Label>
              <Form.Control type="text" name="cidade" value={endereco?.Cidade || ""} onChange={handleInputChange} disabled />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control type="text" name="estado" value={endereco?.Estado || ""} onChange={handleInputChange} disabled />
            </Form.Group>
            <Form.Group controlId="formBairro">
              <Form.Label>Bairro</Form.Label>
              <Form.Control type="text" name="Bairro" value={endereco?.Bairro || ""} onChange={handleInputChange} disabled />
            </Form.Group>
            <Form.Group controlId="formTel">
              <Form.Label>Telefone</Form.Label>
              <Form.Control type="text" name="Tel" value={endereco?.Tel || ""} onChange={handleInputChange} disabled />
            </Form.Group>

            <Form.Group controlId="formTel2">
              <Form.Label>Telefone 2</Form.Label>
              <Form.Control type="text" name="tel2" value={endereco?.Tel2 || ""} onChange={handleInputChange} disabled />
            </Form.Group>

            <Form.Group controlId="formCampoLivre">
              <Form.Label>Campo Livre</Form.Label>
              <Form.Control type="text" name="campoLivre" value={endereco?.CampoLivre || ""} onChange={handleInputChange} disabled />
            </Form.Group>

            <Form.Group controlId="formComplementoEndereco">
              <Form.Label>Complemento do Endereço</Form.Label>
              <Form.Control type="text" name="ComplementoEndereco" value={endereco?.ComplementoEndereco || ""} onChange={handleInputChange} disabled />
            </Form.Group>

            <Form.Group controlId="formNumero">
              <Form.Label>Número</Form.Label>
              <Form.Control type="text" name="Numero" value={endereco?.Numero || ""} onChange={handleInputChange} disabled />
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
