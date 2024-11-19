document.addEventListener("DOMContentLoaded", () => {
  const btnEnviar = document.getElementById("enviar");
  const dataInput = document.getElementById("data");
  const frase = document.getElementById("frase");
  const processingMessage = document.getElementById("processing");
  const resultado = document.getElementById("resultado");

  // Formata a data no formato dd/mm/aaaa
  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  if (btnEnviar) {
    btnEnviar.addEventListener("click", () => {
      const data = dataInput.value;

      if (!data) {
        alert("Por favor, insira uma data.");
        return;
      }

      // Exibir mensagem de "Processando..."
      processingMessage.style.display = "block";
      resultado.textContent = ""; // Limpa o resultado anterior

      // Formatar a data e enviar para o processo principal
      const formattedDate = formatDate(data);
      window.electron.sendData(formattedDate);
    });
  }

  // Receber o resultado do processamento
  window.electron.onReceiveResult((event, response) => {
    // Ocultar a mensagem de "Processando..."
    processingMessage.style.display = "none";

    if (response.status === "success") {
      // Exibir o resultado
      resultado.textContent = `Resultado da Loteria: ${JSON.stringify(
        response.data
      )}`;
    } else if (response.status === "error") {
      // Exibir mensagem de erro
      resultado.textContent = `Erro: ${response.error}`;
    }
  });
});
