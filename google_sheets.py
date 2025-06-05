import gspread
from oauth2client.service_account import ServiceAccountCredentials

def conectar_hoja(nombre_hoja):
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
    creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
    client = gspread.authorize(creds)
    return client.open(nombre_hoja).sheet1