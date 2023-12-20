CREATE TABLE tokens_confirmacao (
    id INT PRIMARY KEY IDENTITY(1,1),
    token NVARCHAR(255) NOT NULL,
    CodCli INT NOT NULL,
    data_expiracao DATETIME NOT NULL
);


ALTER TABLE [Requisi] ADD
   [StatusPagamento]      [varchar](20),
   [idStatus]             [varchar](50),
   [idPagamento]          [varchar](50),
   [Pago]                 [varchar](50),
   [CodAutorizacaoNumber] [varchar](20),
   [Bandeira]             [varchar](10),
   [PDigito]              [varchar](20),
   [UDigito]              [varchar](20),
   [Nome]                 [varchar](100),
   [NSU]                  [varchar](20),
   [CodigoRazao]          [varchar](10)
GO




