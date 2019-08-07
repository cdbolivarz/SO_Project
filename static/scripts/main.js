var contenido = []
$SCRIPT_ROOT = "http://"+location.hostname+"/";


///////////////////// DIBUJAR BONITO Y FUNCIONAL
async function dibujarTabla(){
    dom = ``
    tipo = ""
    botones = ""
    row_elemento = ""
    contenido.map(
        (elemento)=>{
            //DETERMINAR TIPO DE ARCHIVO
            tipo = tipoElemento(elemento.permisos)
            if(tipo){
                if(tipo=="archivo"){
                    row_elemento = `<td>${elemento.nombre}</td>`
                    botones = botonesArchivo(elemento.nombre)
                }else if(tipo=="carpeta"){
                    botones = botonesCarpeta(elemento.nombre)
                    row_elemento = `<td><p class="hyper" onclick="goto('${elemento.nombre}')">${elemento.nombre}</p></td>`
                }
                elemento.permisos = elemento.permisos.substring(2)
                dom = dom + `
                <tr>
                <td>${elemento.permisos}</td>
                <td>${elemento.usuario}</td>
                <td>${elemento.grupo}</td>
                <td>${elemento.peso}</td>
                <td>${elemento.fecha}</td>
                `
                +row_elemento+
                `
                <td>
                    `+botones+`
                    <a href="#editarPermisos" onclick="elementoSeleccionado('${elemento.nombre}')" class="per" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Editar permisos">security</i></a>
                    <a href="#cambiarPropietario" onclick="elementoSeleccionado('${elemento.nombre}')" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Cambiar propietariox">people</i></a>
                    <a href="#copiarArchivo" onclick="elementoSeleccionado('${elemento.nombre}')" class="move" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Copiar elemento">file_copy</i></a>
                    <a href="#moverArchivo" onclick="elementoSeleccionado('${elemento.nombre}')" class="move" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Mover elemento">send</i></a>
                </td>
                </tr>
                ` 
            }

        }
    )
    document.getElementById("tbody").innerHTML = dom
}

function botonesArchivo(nombre){
    return `
    <a href="#verArchivo" onclick="verContenidoArchivo('${nombre}')" class="move" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Ver contenido archivo">visibility</i></a>
    <a href="#eliminarArchivo" onclick="elementoSeleccionado('${nombre}')" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Borrar archivo">&#xE872;</i></a>
    `
}

function botonesCarpeta(nombre){
    return `
    <a href="#eliminarCarpeta" onclick="elementoSeleccionado('${nombre}')" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Borrar carpeta">&#xE872;</i></a>
    `
}

function tipoElemento(permisos){
    tipo = permisos.substring(0,2)
    if(tipo == "n-"){
        return "archivo"
    }else if(tipo == "nd"){
        return "carpeta"
    }else{
        return false
    }
}

async function renovarTabla(){
    await verContenido()
    dibujarPath()
    dibujarTabla()
}

function dibujarPath(){
    div = document.getElementById("path")
    div.innerHTML = ""
    actual = localStorage.getItem("ruta_actual")
    lista_path = actual.split("/")
    dom = ""
    for (var i = 0; i < lista_path.length - 1; i++) {
        dom = dom +  `
        <p class="folder" onclick="gotoG('${lista_path.slice(0,i+1).join("/") + "/"}')">${lista_path[i]}</p> <p class="slash">/</p>
        
        `
     }
    div.innerHTML = dom

}

function goto(nombre){
    actual = localStorage.getItem("ruta_actual")
    localStorage.setItem("ruta_actual",actual + `${nombre}/`)
    renovarTabla();
}

function gotoG(nombre){
    localStorage.setItem("ruta_actual",nombre)
    renovarTabla();
}

window.onload = async ()=>{
    localStorage.setItem("ruta_actual","ficheros/")
    renovarTabla();
}

function elementoSeleccionado(nombre){
    $('input[name="seleccionado"]').val(nombre);
}

function elementoCandela(nombre = ""){
    if(nombre){
        return localStorage.getItem("ruta_actual") + nombre
    }
    return localStorage.getItem("ruta_actual") + jQuery("[name=seleccionado]").val()
}

function resultadoPermisos(){
    owner = valor_permiso($("[name=ur]").is(":checked"),$("[name=uw]").is(":checked"),$("[name=ux]").is(":checked"))
    group = valor_permiso($("[name=gr]").is(":checked"),$("[name=gw]").is(":checked"),$("[name=gx]").is(":checked"))
    other = valor_permiso($("[name=or]").is(":checked"),$("[name=ow]").is(":checked"),$("[name=ox]").is(":checked"))
    return owner+group+other
}

function valor_permiso(r,w,x){
    sum = 0
    if(r){
        sum = sum + 1
    }
    
    if(w){
        sum = sum + 2
    }

    if(x){
        sum = sum + 4
    }

    return String(sum)

}
////////////////////////////////////////////////////////


///////////////////// METODOS DE REQUEST

async function verContenido(){
    await fetch($SCRIPT_ROOT + '/verContenido', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*"
        },
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify({
            ruta: localStorage.getItem("ruta_actual")
        })
    })
        .then((data) => data.json())
        .then(res =>{
            contenido = res.contenido;
        })
        .catch(function(error) {
            console.log(error);
        });
}



function verContenidoArchivo(nombre) {
    fetch($SCRIPT_ROOT + '/verContenidoArchivo', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*"
        },
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify({
            nombre: elementoCandela(nombre)
        })
    })
        .then((data) => data.json())
        .then(res =>{
            jQuery("[name=avnombre").val(res.contenido[0].nombre)
            jQuery("[name=avcontenido]").val(res.contenido[0].contenido)
        })
        .catch(function(error) {
            console.log(error);
        });
}


$("#mkdirform").submit(function(event) {
    event.preventDefault();
    var nombre = jQuery("[name=cnombre]").val();
    fetch($SCRIPT_ROOT + '/crearCarpeta', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*"
        },
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify({
            nombre: elementoCandela(nombre)
        })
    })
        .then((data) => data.json())
        .then(res =>{
            $("#crearCarpeta").modal('hide')
            renovarTabla()
        })
        .catch(function(error) {
            console.log(error);
        });
})

$("#touchform").submit(function(event) {
    event.preventDefault();
    var nombre = jQuery("[name=anombre]").val();
    var contenido = jQuery("[name=acontenido]").val();
    fetch($SCRIPT_ROOT + '/crearArchivo', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*"
        },
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify({
            nombre: elementoCandela(nombre),
            contenido: contenido 
        })
    })
        .then((data) => data.json())
        .then(res =>{
            $("#crearArchivo").modal('hide')
            renovarTabla()
        })
        .catch(function(error) {
            console.log(error);
        });
})

$("#rmform").submit(function(event) {
    event.preventDefault();
    fetch($SCRIPT_ROOT + '/borrarArchivo', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*"
        },
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify({
            nombre: elementoCandela()
        })
    })
        .then((data) => data.json())
        .then(res =>{
            $("#eliminarArchivo").modal('hide')
            renovarTabla()
        })
        .catch(function(error) {
            console.log(error);
        });
})

$("#rmfform").submit(function(event) {
    event.preventDefault();
    fetch($SCRIPT_ROOT + '/borrarCarpeta', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*"
        },
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify({
            nombre: elementoCandela()
        })
    })
        .then((data) => data.json())
        .then(res =>{
            $("#eliminarCarpeta").modal('hide')
            renovarTabla()
        })
        .catch(function(error) {
            console.log(error);
        });
})

$("#chownform").submit(function(event) {
    event.preventDefault();
    var nombre = jQuery("[name=pnombre]").val();
    fetch($SCRIPT_ROOT + '/editarDueno', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*"
        },
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify({
            nombre_usuario: nombre,
            nombre_archivo: elementoCandela()
        })
    })
        .then((data) => data.json())
        .then(res =>{
            $("#cambiarPropietario").modal('hide')
            renovarTabla()
        })
        .catch(function(error) {
            console.log(error);
        });
})

$("#cpform").submit(function(event) {
    event.preventDefault();
    var ruta = jQuery("[name=cpruta_destino]").val();
    fetch($SCRIPT_ROOT + '/copiarArchivo', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*"
        },
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify({
            nombre: elementoCandela(),
            destino: ruta
        })
    })
        .then((data) => data.json())
        .then(res =>{
            $("#copiarArchivo").modal('hide')
            renovarTabla()
        })
        .catch(function(error) {
            console.log(error);
        });
})

$("#mvform").submit(function(event) {
    event.preventDefault();
    var ruta = jQuery("[name=mvruta_destino]").val();
    fetch($SCRIPT_ROOT + '/moverArchivo', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*"
        },
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify({
            nombre: elementoCandela(),
            destino: ruta
        })
    })
        .then((data) => data.json())
        .then(res =>{
            $("#moverArchivo").modal('hide')
            renovarTabla()
        })
        .catch(function(error) {
            console.log(error);
        });
})

$("#achmodform").submit(function(event) {
    event.preventDefault();
    fetch($SCRIPT_ROOT + '/editarPermisos', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text-plain, */*"
        },
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify({
            nombre: elementoCandela(),
            permisos: resultadoPermisos()
        })
    })
        .then((data) => data.json())
        .then(res =>{
            $("#editarPermisos").modal('hide')
            renovarTabla()
        })
        .catch(function(error) {
            console.log(error);
        });
})
//////////////////////////////////////////////