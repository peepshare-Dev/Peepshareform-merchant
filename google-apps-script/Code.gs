/**
 * Merchant form receiver for Google Apps Script.
 *
 * Set SPREADSHEET_ID in Project Settings > Script properties.
 * The form posts multipart FormData, so values are available in e.parameter.
 */
const HEADERS = [
  'Submitted at', 'Store name', 'Google Maps URL', 'Opening hours',
  'Contact name', 'Contact phone', 'Store category', 'Contact channel',
  'Promotion detail', 'Store description', 'Note',
];

function doPost(e) {
  try {
    const payload = e.parameter;
    const spreadsheetId = getRequiredProperty_('SPREADSHEET_ID');
    const sheet = getSheet_(spreadsheetId);
    const submittedAt = new Date().toISOString();

    sheet.appendRow([
      submittedAt,
      payload.storeName || '',
      payload.googleMapsLink || '',
      payload.openingHours || '',
      payload.contactName || '',
      payload.contactPhone || '',
      payload.storeCategory || '',
      payload.contactChannel || '',
      payload.promotionDetail || '',
      payload.storeDescription || '',
      payload.note || '',
    ]);
    return json_({
      success: true,
      message: 'Merchant registration saved',
      rowNumber: sheet.getLastRow(),
      submittedAt: submittedAt,
    });
  } catch (error) {
    console.error(error);
    return json_({ success: false, error: error.message || String(error) });
  }
}

function getSheet_(spreadsheetId) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function getRequiredProperty_(name) {
  const value = PropertiesService.getScriptProperties().getProperty(name);
  if (!value) throw new Error('Missing Script Property: ' + name);
  return value;
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
