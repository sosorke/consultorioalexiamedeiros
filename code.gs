function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const payload = JSON.parse(e.postData.contents || "{}");
    const tipo = payload.tipo || "geral";

    const abaNome = tipo === "agendamento" ? "Agendamentos" : "Mensagens";
    const aba = getOrCreateSheet_(spreadsheet, abaNome, tipo);

    if (tipo === "agendamento") {
      aba.appendRow([
        new Date(),
        payload.nome || "",
        payload.telefone || "",
        payload.email || "",
        payload.data || "",
        payload.periodo || "",
        payload.mensagem || ""
      ]);
    } else {
      aba.appendRow([
        new Date(),
        payload.nome || "",
        payload.email || "",
        payload.telefone || "",
        payload.mensagem || ""
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet_(spreadsheet, abaNome, tipo) {
  let aba = spreadsheet.getSheetByName(abaNome);

  if (!aba) {
    aba = spreadsheet.insertSheet(abaNome);

    if (tipo === "agendamento") {
      aba.appendRow(["Recebido em", "Nome", "Telefone", "Email", "Data desejada", "Periodo", "Observacoes"]);
    } else {
      aba.appendRow(["Recebido em", "Nome", "Email", "Telefone", "Mensagem"]);
    }
  }

  return aba;
}
