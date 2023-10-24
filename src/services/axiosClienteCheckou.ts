import axios from "axios";

const options = {
  method: "POST",
  url: "https://sandbox.api.pagseguro.com/orders",
  headers: {
    accept: "application/json",
    Authorization: "Bearer B871F6967C2341489D37924D761FF1BD",
    "content-type": "application/json",
  },
  data: {
    customer: {
      name: "Jose da Silva",
      email: "email@test.com",
      tax_id: "12345678909",
      phones: [{ country: "55", area: "11", number: "999999999", type: "MOBILE" }],
    },
    shipping: {
      address: {
        street: "Avenida Brigadeiro Faria Lima",
        number: "1384",
        complement: "apto 12",
        locality: "Pinheiros",
        city: "São Paulo",
        region_code: "SP",
        country: "BRA",
        postal_code: "01452002",
      },
    },
    reference_id: "ex-00001",
    items: [
      {
        reference_id: "referencia do item",
        name: "nome do item",
        quantity: 1,
        unit_amount: 500,
      },
    ],
    notification_urls: ["https://meusite.com/notificacoes"],
    charges: [
      {
        reference_id: "referencia da cobranca",
        description: "descricao da cobranca",
        amount: { value: 500, currency: "BRL" },
        payment_method: {
          type: "CREDIT_CARD",
          installments: 1,
          capture: true,
          card: {
            number: "5530062640663264",
            exp_month: "12",
            exp_year: "2026",
            security_code: "123",
            holder: { name: "Jose da Silva" },
            store: true,
          },
        },
      },
    ],
  },
};

axios
  .request(options)
  .then(function (response) {
    return response.data
  })
  .catch(function (error) {
    toast.warn(error.message)
    return error.message
  });
