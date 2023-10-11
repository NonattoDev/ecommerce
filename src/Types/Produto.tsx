export interface Produto {
  CodPro: number;
  Produto: string;
  Referencia: string;
  Preco1: number;
  PrecoPromocao: number | null;
  PromocaoData: string | null;
  Caminho: string;
  Categoria: string;
  Estoque: number;
  Caracteristicas: string;
  EstimativaChegada: string | null;
  Caminho2: string | null;
  Caminho3: string | null;
  Caminho4: string | null;
  Caminho5: string | null;
  Caminho6: string | null;
  Caminho7: string | null;
  Caminho8: string | null;
  Caminho9: string | null;
  Caminho10: string | null;
  Quantidade: number;
}

export interface ProdutosSimilaresType {
  CodPro: number;
  Produto: string;
  Referencia: string;
  Preco1: number;
  PrecoPromocao: number;
  Caminho: string;
  Categoria: string;
  Estoque: number;
}

export interface ResponseData {
  produto: Produto;
  produtosSimilares: ProdutosSimilaresType[];
  freteGratis: number;
}
