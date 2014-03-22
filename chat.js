//configura el sistema de templates de dust
var express = require("express");
var dust = require("dustjs-linkedin");
var cons = require("consolidate");


//---NUEVASLIBRERIAS
//habilitamos un websocket (si se soporta el websocket lo usa sino usa ajax)
//es transparente al programador- mecanismo fallback
var socketio = require("socket.io");
var http = require("http");
//para evitar ataces de XSS
var validator = require("validator");


//--trabajremos con un servidor http que para poder usar websockets
//se puede ver como un servidor ligero
var app = express();
//envuelve al servidor express
var servidor = http.createServer(app);


//obtenmos las puertos necesarios para trabajar en openshift o localmente
if (process.env.OPENSHIFT_NODEJS_PORT) {
	servidor.listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP);
} else {
	servidor.listen(8021);
}


//---- configuracion de carpetas estaticas ----
app.use("/css", express.static(__dirname + "/css"));
app.use("/javascript", express.static(__dirname + "/javascript"));


// ----- CONFIGURACION DEL SISTEMA DE TEMPLATES -----
app.engine("dust", cons.dust);
app.set("views", __dirname + "/vistas");
app.set("view engine", "dust");


console.log("servidor web listo");


app.get("/", function(req, res) {


	res.render("cliente");


});


var io = socketio.listen(servidor);


//escuhando preticiones de conexión de los clientes
io.sockets.on("connection",function(socket){
	//escuchando si el cleinte me envia un mensaje
	socket.on("mensaje_al_servidor", function(datosCliente){
		var nombreCliente =  datosCliente.nombre;
		var mensajeCliente = datosCliente.mensaje;
		io.sockets.emit("mensaje_al_cliente",{
			nombre: nombreCliente,
			mensaje: mensajeCliente
		});
	});


});
//--------HABILITAMOS WEBSOCKETS---------


//var io = socketio.listen(servidor);
//habilita un websocket en el puero 8021-se deb mostar info -socket.io
//para cada cliente
//io.sockets.on("connection", function(socket) {
	//para el cliente que se comunica
	//socket.on Cuando recibe mensajes del cliente
	//socket.on("mensaje_al_servidor", function(datosCliente) {
		//alert("ataque") XSS
		/*var nombre = validator.escape(datosCliente.nombre);
		var mensaje = validator.escape(datosCliente.mensaje);*/
		//emite un mensaje al cliente
		/*io.sockets.emit("mensaje_al_cliente", {
			nombre : nombre,
			mensaje : mensaje
		});*/
	//});
//});