from flask import Flask, render_template, request, jsonify
import comandos
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home_func():
    return render_template("home.html")

@app.route('/pagina')
def indexpag():
    return render_template("/pagina/index.html")

@app.route('/carpetas')
def indexdoc():
    return render_template("/carpetas/index.html")



@app.route('/verContenidoArchivo', methods = ['POST'])
def verContenidoArchivo():
	if request.method == 'POST':
		nombre = request.form['nombre']
		return jsonify(contenido = comandos.verContenidoArchivo(nombre))

@app.route('/verContenido',methods = ['POST'])
def verContenido():
	if request.method == 'POST':
		ruta = request.form['ruta']
		return jsonify(contenido = comandos.verContenido(ruta))

@app.route('/crearArchivo',methods = ['POST'])
def crearArchivo():
	if request.method == 'POST':
		nombre = request.form['nombre']
		comandos.crearArchivo(nombre)
		return jsonify(message=True)


@app.route('/borrarArchivo',methods = ['POST'])
def borrarArchivo():
	if request.method == 'POST':
		nombre = request.form['nombre']
		comandos.borrarArchivo(nombre)
		return jsonify(message=True)

@app.route('/crearCarpeta',methods = ['POST'])
def crearCarpeta():
	if request.method == 'POST':
		nombre = request.form['nombre']
		comandos.crearCarpeta(nombre)
		return jsonify(message=True)

@app.route('/moverArchivo',methods = ['POST'])
def moverArchivo():
	if request.method == 'POST':
		nombre = request.form['nombre']
		destino = request.form['destino']
		comandos.moverArchivo(nombre,destino)
		return jsonify(message=True)

@app.route('/borrarCarpeta',methods = ['POST'])
def borrarCarpeta():
	if request.method == 'POST':
		nombre = request.form['nombre']
		comandos.borrarCarpeta(nombre)
		return jsonify(message=True)

@app.route('/copiarArchivo',methods = ['POST'])
def copiarArchivo():
	if request.method == 'POST':
		nombre = request.form['nombre']
		destino = request.form['destino']
		comandos.copiarArchivo(nombre,destino)
		return jsonify(message=True)

@app.route('/editarDueno',methods = ['POST'])
def editarDueno():
	if request.method == 'POST':
		nombre_usuario = request.form['nombre_usuario']
		nombre_archivo = request.form['nombre_archivo']
		comandos.editarDueno(nombre_usuario,nombre_archivo)
		return jsonify(message=True)


@app.route('/editarPermisos',methods = ['POST'])
def editarPermisos():
	if request.method == 'POST':
		nombre = request.form['nombre']
		permisos = request.form['permisos']
		comandos.editarPermisos(nombre, permisos)
		return jsonify(message=True)