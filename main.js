const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const axios = require("axios");
const qs = require("querystring");
const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Desativado por questões de segurança
      contextIsolation: true, // Importante para segurança
      preload: path.join(__dirname, "preload.js"), // Arquivo preload para expor o ipcRenderer
    },
  });

  win.loadFile("index.html");
  //win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  ipcMain.on("enviar-dados", (event, data) => {
    console.log("Enviando a data para o servidor:", data);

    const requestData = qs.stringify({
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

    const url = {
      method: "post",
      url: "https://aguiareal.net/resultado/buscar-resultado",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: requestData,
    };

    axios(url)
      .then((response) => {
        console.log("Resposta do servidor:", response.data);
        // Abre o diálogo para escolher onde salvar o arquivo
        abrirDialogoSalvar(response.data, data);
        event.reply("resultado-loteria", {
          status: "success",
          data: response.data,
        });
      })
      .catch((error) => {
        console.error("Erro ao fazer a requisição:", error);
        event.reply("resultado-loteria", {
          status: "error",
          error: error.message,
        });
      });
  });
});

function abrirDialogoSalvar(dados, dataReferencia) {
  const win = BrowserWindow.getFocusedWindow(); // Janela ativa
  dialog
    .showSaveDialog(win, {
      title: "Salvar Resultados",
      defaultPath: `resultados_${dataReferencia}.xlsx`,
      filters: [
        { name: "Planilhas Excel", extensions: ["xlsx"] },
        { name: "Todos os Arquivos", extensions: ["*"] },
      ],
    })
    .then((result) => {
      if (!result.canceled && result.filePath) {
        salvarEmExcel(dados, result.filePath);
      }
    })
    .catch((err) => {
      console.error("Erro ao abrir o diálogo de salvar:", err);
    });
}

function salvarEmExcel(dados, caminhoArquivo) {
  try {
    const loteriasData = dados.data.map((item) => {
      // Parseando o resultado para separar os números e animais
      const resultados = item.DS_RESULTADO.split("#").map((result) => {
        const [pos, numero, animal] = result.split("@");
        return { Posicao: pos, Numero: numero, Animal: animal };
      });

      return {
        Data: item.DT_RESULTADO,
        Loteria: item.DS_LOTERIA_COMPLETA,
        Resultados: resultados,
      };
    });

    // Organizar os dados para o formato tradicional de tabela
    const dadosTabela = loteriasData
      .map((item) => {
        return item.Resultados.map((resultado) => ({
          Data: item.Data,
          Loteria: item.Loteria,
          Posicao: resultado.Posicao,
          Numero: resultado.Numero,
          Animal: resultado.Animal,
        }));
      })
      .flat();

    // Organizar os dados para o formato transposto
    const dadosTranspostos = loteriasData.map((item) => {
      const numeros = [];
      const animais = [];

      // Preencher os números e animais nas listas correspondentes
      item.Resultados.forEach((resultado) => {
        numeros.push(resultado.Numero);
        animais.push(resultado.Animal);
      });

      // Garantir que cada lista tenha exatamente 10 posições (preenchendo com "")
      while (numeros.length < 10) numeros.push("");
      while (animais.length < 10) animais.push("");

      // Retornar a linha com Data, Loteria, Números e Animais
      return [item.Data, item.Loteria, ...numeros, ...animais];
    });

    // Criar a planilha com o formato de tabela
    const worksheetTabela = xlsx.utils.json_to_sheet(dadosTabela, {
      header: ["Data", "Loteria", "Posicao", "Numero", "Animal"],
    });

    // Criar a planilha com o formato transposto
    const worksheetTransposto = xlsx.utils.aoa_to_sheet([
      [
        "Data",
        "Loteria",
        "P1",
        "P2",
        "P3",
        "P4",
        "P5",
        "P6",
        "P7",
        "P8",
        "P9",
        "P10",
        "A1",
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "A8",
        "A9",
        "A10",
      ],
      ...dadosTranspostos,
    ]);

    // Criar um novo workbook
    const workbook = xlsx.utils.book_new();

    // Adicionar ambas as planilhas no workbook
    xlsx.utils.book_append_sheet(
      workbook,
      worksheetTabela,
      "Resultados Tabela"
    );
    xlsx.utils.book_append_sheet(
      workbook,
      worksheetTransposto,
      "Resultados Transpostos"
    );

    // Definir larguras de colunas para a tabela
    worksheetTabela["!cols"] = [
      { wch: 12 }, // Data
      { wch: 25 }, // Loteria
      { wch: 10 }, // Posição
      { wch: 10 }, // Número
      { wch: 15 }, // Animal
    ];

    // Definir larguras de colunas para o formato transposto
    worksheetTransposto["!cols"] = [
      { wch: 12 }, // Data
      { wch: 25 }, // Loteria
      ...Array(10).fill({ wch: 5 }), // Números (P1 a P10)
      ...Array(10).fill({ wch: 10 }), // Animais (A1 a A10)
    ];

    // Definir formatação de cabeçalho
    formatHeader(worksheetTabela);
    formatHeader(worksheetTransposto);

    // Salvar o arquivo Excel
    xlsx.writeFile(workbook, caminhoArquivo);

    console.log(`Arquivo Excel salvo em: ${caminhoArquivo}`);
  } catch (error) {
    console.error("Erro ao salvar em Excel:", error);
  }
}

// Função auxiliar para formatar o cabeçalho das planilhas
function formatHeader(worksheet) {
  const range = xlsx.utils.decode_range(worksheet["!ref"]);
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = xlsx.utils.encode_cell({ r: 0, c: col });
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  }
}
