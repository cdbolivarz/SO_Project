import os
import subprocess

"""
Ver contenido carpeta X
Ver contenido archivo X
Crear arch y carpeta X
Borrar arch y carpeta X
Copiar arch X
Mover arch X
Editar permisos X
Editar due;o X
Ver informacion espacio X
Ver informacion due;o X
"""


def verContenido(ruta):
    ls = str(subprocess.check_output("ls -l ficheros" + ruta, shell = True))
    ls = ls.split('\\')
    aux = []
    l = []
    for elemento in ls[1:len(ls)-1]:
        aux = elemento.split(' ')
        aux = [x for x in aux if x]
        aux.pop(1)
        l.append({
            'permisos': aux[0],
            'usuario': aux[1],
            'grupo': aux[2],
            'peso': aux[3],
            'fecha': aux[4] + " "+ aux[5] + " " + aux[6],
            'nombre': aux[7]})
    return l

def verContenidoArchivo(nombre):
    cat = subprocess.run(['cat', nombre],stdout = subprocess.PIPE,stderr=subprocess.PIPE, universal_newlines=True)
    l = []
    l.append({
        "nombre":nombre,
        "contenido":cat.stdout
    })
    return l

def crearArchivo(nombre):
    os.system("touch " + nombre)

def crearCarpeta(nombre):
    os.system("mkdir " + nombre)

def borrarArchivo(nombre):
    os.system("rm -f "+ nombre)

def borrarCarpeta(nombre):
    os.system("rm -rf " + nombre)

def moverArchivo(nombre,destino):
    os.system("mv "+ nombre + " " + destino)

def copiarArchivo(nombre,destino):
    os.system("cp -r " + nombre + " " + destino)

def editarPermisos(nombre, permisos):
    os.system("chmod " + nombre + " " + permisos)

def editarDueno(nombre_usuario, nombre_archivo):
    os.system("chown -R " + nombre_usuario + " " + nombre_archivo)