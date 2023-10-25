import React, { createContext, useEffect, useState } from "react";

const EnderecoContext = createContext({});

const EnderecoProvider: React.FC = ({ children }) => {
  const [endereco, setEndereco] = useState();

  return <EnderecoContext.Provider value={{ endereco, setEndereco }}>{children}</EnderecoContext.Provider>;
};

export { EnderecoProvider, EnderecoContext };
