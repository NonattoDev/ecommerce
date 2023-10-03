Header do site: {
    Sempre disposta em todas as páginas.
    - Botão para login
    - Botão para Logout
    - Barra de pesquisa
    - Logomarca
}

Página Inicial: {
Rota: /
Navbar: {
    Limite máximo de 10 Botões, visto que os grandes sites usam esse padrão
    Quais serão os botões? 
    - Categorias || Perifericos || Grupos {
        Consultar backend(banco de dados) para retornar todos os grupos, apresentando os mesmos na lateral do site em forma de Offcanva(Barra lateral que aparece ao ser ativada por um botão.)
    }
    - Sobre nós {
        Pagina estática com uma apresentação da empresa.
    }
    - + 8 categorias que mais vendem {
        Querie deverá ser criada, retornando os 8 grupos que mais tem itens vendidos.
    }
}

Prateleira: {
    CardDoProduto:{
    Produtos dispostos em 5 produtos por linha em 4 colunas
    Botão adicionar ao carrinho
    Valor do produto
    Nome do produto
    Imagem do produto
    De onde vem essa imagem ? (Verificar query, pois nosso serviço será web)
    }
        
}


}

Footer { 
    Sempre disposto em todas as páginas do site.
    - Ano de desenvolvimento
    - Formas de pagamento aceitas
    - Informações da empresa
}