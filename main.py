from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from google_sheets import conectar_hoja
from datetime import datetime

app = Flask(__name__)

@app.route("/whatsapp", methods=["POST"])
def whatsapp():
    msg_in = request.form.get("Body")
    from_number = request.form.get("From")
    respuesta = MessagingResponse()
    msg = respuesta.message()

    hoja = conectar_hoja("Usuarios_LARA")
    datos = hoja.get_all_values()

    fila_usuario = None
    for i, fila in enumerate(datos):
        if fila[0] == from_number:
            fila_usuario = (i + 1, fila)

    if msg_in.lower().startswith("/registrarme"):
        if fila_usuario:
            msg.body("🧠 Ya estás registrado o en proceso. Escribe /reiniciar si deseas empezar de nuevo.")
        else:
            hoja.append_row([from_number, "", "", "", "", datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "esperando_nombre"])
            msg.body("👋 ¡Hola! Te he registrado como nuevo usuario. ¿Cuál es tu nombre completo?")
        return str(respuesta)

    if fila_usuario and fila_usuario[1][-1] == "esperando_nombre":
        fila_num = fila_usuario[0]
        hoja.update_cell(fila_num, 2, msg_in)  # Columna Nombre
        hoja.update_cell(fila_num, 7, "registrado")  # Estado
        msg.body(f"✅ Gracias, {msg_in}. Te he registrado con éxito.")
        return str(respuesta)

    msg.body("❌ Comando no reconocido. Escribe /registrarme para comenzar.")
    return str(respuesta)

app.run(host="0.0.0.0", port=3000)