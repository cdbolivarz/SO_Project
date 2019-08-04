from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home_func():
    return render_template("home.html")
@app.route('/pagina')
def indexpag():
    return "Vista pagina web"

@app.route('/carpetas')
def indexdoc():
    return "Vista carpetas actuales"
