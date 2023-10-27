import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface EnderecoProviderProps {
  children: ReactNode;
}

export interface Endereco {
  Lanc: string;
  Endereco: string;
  Bairro: string;
  Cidade: string;
  Estado: string;
  CEP: string;
  Tel: number;
  Tel2: number | null;
  CampoLivre: string | null;
  ComplementoEndereco: string;
  Numero: string;
  CodMun: number;
}

interface EnderecoContextProps {
  endereco: Endereco | undefined;
  setEndereco: Dispatch<SetStateAction<Endereco | undefined>>;
}

const EnderecoContext = createContext<EnderecoContextProps>({
  endereco: undefined,
  setEndereco: () => {}, // Um valor padrão vazio para evitar erros em tempo de execução
});

const EnderecoProvider: React.FC<EnderecoProviderProps> = ({ children }) => {
  const [endereco, setEndereco] = useState<Endereco | undefined>();

  return <EnderecoContext.Provider value={{ endereco, setEndereco }}>{children}</EnderecoContext.Provider>;
};

export { EnderecoProvider, EnderecoContext };
