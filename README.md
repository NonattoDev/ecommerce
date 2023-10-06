# Relatório de Funcionalidades e Tarefas - E-commerce Softline Sistemas

Neste relatório, vou apresentar as funcionalidades existentes no projeto e identificar as tarefas adicionais necessárias, como a integração de uma API de pagamento.

## Arquivo axiosCliente.tsx:
### Funcionalidade:
Este arquivo define uma instância do cliente Axios com a configuração da URL base para fazer requisições HTTP.
### Tarefas adicionais:
Nenhuma tarefa adicional identificada.

## Arquivo Navbar.tsx:
### Funcionalidade:
Este arquivo define o componente Navbar do Bootstrap, exibindo categorias e grupos de produtos.
### Tarefas adicionais:
Nenhuma tarefa adicional identificada.

## Arquivo Footer.tsx:
### Funcionalidade:
Este arquivo define o componente Footer, exibindo informações da empresa, como endereço, telefone e email.
### Tarefas adicionais:
Adicionar um mapa do endereço do cliente, será necessário o consumo da API do Google Maps(Verificar valores).

## Arquivo Carrossel.tsx:
### Funcionalidade:
Este arquivo define o componente Carrossel, exibindo imagens em um carrossel de slides.
### Tarefas adicionais:
Deve diminuir ao integrar para o módulo.

## Arquivo Header.tsx:
### Funcionalidade:
Este arquivo define o componente Header, exibindo o logotipo, barra de pesquisa e links para login e carrinho de compras.
### Tarefas adicionais:
Adicionar a funcionalidade ao Search bar / Tornar reativo ao Mobile.

## Arquivo Produto.tsx:
### Funcionalidade:
Define o componente "ProdutoCard", que representa um cartão de produto exibido em um catálogo ou lista de produtos em um e-commerce. O componente recebe várias propriedades que descrevem as informações do produto, como código, nome, referência, preço, promoções, estoque e imagem.

O cartão do produto é implementado usando o componente "Card" do Bootstrap, e exibe as seguintes informações:

- Imagem do produto:
A propriedade "Caminho" contém o caminho da imagem do produto, que é exibida usando o componente "Card.Img".
Se ocorrer algum erro ao carregar a imagem, uma imagem de erro padrão será exibida.

- Disponibilidade do produto:
Se o estoque do produto for menor ou igual a zero (Estoque <= 0), uma mensagem indicando que o produto está indisponível será exibida no cartão.

- Nome e preço do produto:
  - O nome do produto é exibido no componente "Card.Title".
  - O preço do produto é exibido no componente "Card.Text" precedido pelo símbolo "R$" (Real).

- Botão de adicionar ao carrinho:
O componente "Button" do Bootstrap é usado para criar um botão de adicionar ao carrinho.
O botão exibe um ícone de carrinho de compras e possui uma aparência personalizada.

O componente "ProdutoCard" é reutilizável e pode ser renderizado várias vezes para exibir diferentes produtos em uma página de catálogo ou lista de produtos. Ele fornece uma representação visual dos produtos, permitindo que os usuários visualizem as informações básicas e adicionem os produtos ao carrinho de compras.

Página de Detalhamento de Produto:
----------------------------------

Essa página será acessada quando o usuário clicar em um produto específico.
Ela exibirá as informações detalhadas do produto, incluindo fotos, descrição, preço, disponibilidade, etc.
O usuário poderá visualizar imagens adicionais do produto em um carrossel de fotos.
Também pode ser incluído um botão para adicionar o produto ao carrinho.

Página de Login/Cadastro e Recuperação de Senha:
-------------------------------------------------

Essa página pode ser implementada como uma única página que engloba o processo de login, cadastro de novos usuários e recuperação de senha.
O usuário poderá inserir suas credenciais de login ou criar uma nova conta.
Também será fornecida a opção de recuperar a senha em caso de esquecimento.
Após o login ou cadastro bem-sucedido, o usuário será redirecionado para a página desejada, como o carrinho de compras.

Componente de Carrinho Flutuante:
----------------------------------

Esse componente será exibido como um carrinho flutuante que estará sempre visível para o usuário.
Ao clicar no botão "Carrinho" em qualquer página, o carrinho flutuante será ativado eexibirá os itens adicionados pelo usuário.
Ele mostrará os produtos selecionados, incluindo o nome, preço, quantidade e subtotal.
Também será possível remover itens do carrinho diretamente no componente.
O carrinho flutuante terá um resumo do valor total dos itens e um botão "Finalizar Compra" para direcionar o usuário para a página de finalização da compra.

Integração de API de Pagamento:
-------------------------------

Será necessário integrar uma API de pagamento para permitir que os usuários realizem transações seguras ao finalizar suas compras.
Isso envolverá consultar a documentação da API de pagamento escolhida, configurar as chaves de acesso e implementar a lógica necessária para enviar os dados do pedido e processar o pagamento.
Além disso, será necessário lidar com as respostas da API de pagamento para fornecer feedback ao usuário sobre o status da transação.

Essas são as funcionalidades existentes no projeto e as tarefas adicionais identificadas até o momento. Certifique-se de revisar e ajustar conforme necessário para atender aos requisitos específicos do projeto.
