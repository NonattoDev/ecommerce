import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import axiosCliente from "@/services/axiosCliente";
import { toast } from "react-toastify";

const Endereco = ({ id }) => {
  const [novoEndereco, setNovoEndereco] = useState(false);
  const [enderecoAtual, setEnderecoAtual] = useState(null);

  useEffect(() => {
    const fetchEndereco = async () => {
      try {
        const response = await axiosCliente.get(`/usuarios/endereco/${id}`);
        setEnderecoAtual(response.data);
      } catch (error) {
        toast.warn(error.message);
      }
    };

    fetchEndereco();
  }, []);

  const handleNovoEndereco = () => {
    setNovoEndereco(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnderecoAtual((prevEndereco) => ({
      ...prevEndereco,
      [name]: value,
    }));
  };

  return (
    <div>
      {novoEndereco || !enderecoAtual ? (
        <Form>
          <Form.Group controlId="formEndereco">
            <Form.Label>Rua</Form.Label>
            <Form.Control type="text" name="rua" value={enderecoAtual?.rua || ""} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group controlId="formNumero">
            <Form.Label>Número</Form.Label>
            <Form.Control type="text" name="numero" value={enderecoAtual?.numero || ""} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group controlId="formCidade">
            <Form.Label>Cidade</Form.Label>
            <Form.Control type="text" name="cidade" value={enderecoAtual?.cidade || ""} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Control type="text" name="estado" value={enderecoAtual?.estado || ""} onChange={handleInputChange} />
          </Form.Group>
        </Form>
      ) : (
        <div>
          <p>Rua: {enderecoAtual.rua}</p>
          <p>Número: {enderecoAtual.numero}</p>
          <p>Cidade: {enderecoAtual.cidade}</p>
          <p>Estado: {enderecoAtual.estado}</p>
        </div>
      )}
      <Button onClick={handleNovoEndereco}>Novo Endereço</Button>
    </div>
  );
};

export default Endereco;
