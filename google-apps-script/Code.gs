/**
 * Merchant form receiver for Google Apps Script.
 *
 * Set SPREADSHEET_ID and DRIVE_FOLDER_ID in Project Settings > Script properties.
 * The form posts JSON with Content-Type text/plain, so it can be called from the browser.
 */
const HEADERS = [
  'Submitted at', 'Store name', 'Logo URL', 'Google Maps URL', 'Opening hours',
  'Contact name', 'Contact phone', 'Category', 'Contact channels',
  'Promotion details', 'Store description', 'Photo URLs', 'Consent',
];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const spreadsheetId = getRequiredProperty_('SPREADSHEET_ID');
    const folder = DriveApp.getFolderById(getRequiredProperty_('DRIVE_FOLDER_ID'));
    const sheet = getSheet_(spreadsheetId);
    const timestamp = payload.submittedAt || new Date().toISOString();
    const prefix = timestamp + '-' + safeFileName_(payload.storeName || 'merchant');
    const logoUrl = payload.logo ? uploadDataUrl_(folder, payload.logo, prefix + '-logo') : '';
    const photoUrls = (payload.photos || []).map(function (photo, index) {
      return uploadDataUrl_(folder, photo, prefix + '-photo-' + (index + 1));
    });

    sheet.appendRow([
      timestamp, payload.storeName || '', logoUrl, payload.mapsLink || '',
      payload.openingHours || '', payload.contactName || '', payload.contactPhone || '',
      payload.category || '', payload.contactChannels || '', payload.promotionDetails || '',
      payload.storeDescription || '', photoUrls.join(', '), payload.consent === true ? 'Yes' : 'No',
    ]);
    return json_({ ok: true });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: error.message || String(error) });
  }
}

function getSheet_(spreadsheetId) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function uploadDataUrl_(folder, uploadedFile, prefix) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(uploadedFile.data || '');
  if (!match) throw new Error('Invalid image data for ' + (uploadedFile.name || 'upload'));
  const blob = Utilities.newBlob(
    Utilities.base64Decode(match[2]),
    match[1],
    prefix + '-' + safeFileName_(uploadedFile.name || 'image'),
  );
  return folder.createFile(blob).getUrl();
}

function getRequiredProperty_(name) {
  const value = PropertiesService.getScriptProperties().getProperty(name);
  if (!value) throw new Error('Missing Script Property: ' + name);
  return value;
}

function safeFileName_(value) {
  return String(value).replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 100);
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
