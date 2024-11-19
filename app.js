const axios = require("axios");
const qs = require("querystring");

function enviarResultado(data) {
  // Formatar os dados corretamente
  const formattedData = qs.stringify({
    [`loterias[56_${data}]`]: data,
    [`loterias[26_${data}]`]: data,
    [`loterias[35_${data}]`]: data,
    [`loterias[49_${data}]`]: data,
    [`loterias[10_${data}]`]: data,
    [`loterias[8_${data}]`]: data,
    [`loterias[58_${data}]`]: data,
    [`loterias[52_${data}]`]: data,
    [`loterias[34_${data}]`]: data,
    [`loterias[85_${data}]`]: data,
    [`loterias[25_${data}]`]: data,
    [`loterias[55_${data}]`]: data,
    [`loterias[47_${data}]`]: data,
    [`loterias[66_${data}]`]: data,
    [`loterias[27_${data}]`]: data,
    [`loterias[6_${data}]`]: data,
    [`loterias[7_${data}]`]: data,
    [`loterias[57_${data}]`]: data,
    [`loterias[70_${data}]`]: data,
    [`loterias[89_${data}]`]: data,
    [`loterias[33_${data}]`]: data,
    [`loterias[71_${data}]`]: data,
    [`loterias[22_${data}]`]: data,
    [`loterias[15_${data}]`]: data,
    [`loterias[9_${data}]`]: data,
    [`loterias[24_${data}]`]: data,
    [`loterias[65_${data}]`]: data,
    [`loterias[69_${data}]`]: data,
    [`loterias[16_${data}]`]: data,
    [`loterias[32_${data}]`]: data,
    [`loterias[54_${data}]`]: data,
    [`loterias[17_${data}]`]: data,
    [`loterias[3_${data}]`]: data,
    [`loterias[2_${data}]`]: data,
    [`loterias[61_${data}]`]: data,
    [`loterias[64_${data}]`]: data,
    [`loterias[48_${data}]`]: data,
    [`loterias[51_${data}]`]: data,
    [`loterias[23_${data}]`]: data,
    [`loterias[63_${data}]`]: data,
    [`loterias[68_${data}]`]: data,
    [`loterias[31_${data}]`]: data,
    [`loterias[53_${data}]`]: data,
    [`loterias[11_${data}]`]: data,
    [`loterias[5_${data}]`]: data,
    [`loterias[1_${data}]`]: data,
    [`loterias[60_${data}]`]: data,
    [`loterias[62_${data}]`]: data,
    [`loterias[67_${data}]`]: data,
    [`loterias[46_${data}]`]: data,
    [`loterias[30_${data}]`]: data,
    [`loterias[13_${data}]`]: data,
    [`loterias[28_${data}]`]: data,
    [`loterias[72_${data}]`]: data,
    [`loterias[94_${data}]`]: data,
    [`loterias[86_${data}]`]: data,
    [`loterias[59_${data}]`]: data,
    [`loterias[83_${data}]`]: data,
    [`loterias[82_${data}]`]: data,
    [`loterias[37_${data}]`]: data,
    [`loterias[20_${data}]`]: data,
    [`loterias[36_${data}]`]: data,
  });

  console.log("Dados formatados enviados:", formattedData);

  const config = {
    method: "post",
    url: "https://aguiareal.net/resultado/buscar-resultado",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: formattedData,
  };

  // Enviar a requisição
  axios(config)
    .then((response) => {
      console.log(response.data);
      alert("Resultado enviado com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao fazer a requisição:", error);
      alert("Erro ao enviar o resultado.");
    });
}
