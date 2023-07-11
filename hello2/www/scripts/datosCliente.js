//sessionStorage.setItem("nombre", "Gonzalo");
//console.log(sessionStorage.getItem("nombre"))
//sessionStorage.removeItem("nombre");
var myDB;
var servidor="sistema.fels.com.mx";
var conn = false;
var myDB;
var monederocliente=0;
var debecliente=0;
var deberemos=0;
var nombreimprime="";
var domicilioimprime="";
var bandera=1;
var noImpresora=1;
var saldoTotal =0;
var app = {
	initialize: function () {
		if (typeof (window.cordova) !== 'undefined') {
			document.addEventListener('deviceready', function () {
				onDeviceReady(true);
			}, false);
		} else {
			onDeviceReady(false);
		}
	}
};

var success = function(message) {
	conn=true;
        console.log("HAY CONEXCION")
    }

    var failure = function() {
			conn = false
        console.log("NO HAY CONEXCION")
    }

function onDeviceReady() {
const esperar1Seg = () => new Promise(resolve => setTimeout(resolve, 100));
const esperar2Seg = () => new Promise(resolve => setTimeout(resolve, 500));
esperar1Seg()
.then(() => {
	hello.greet("", success, failure);
	return esperar1Seg();
}).then(() => {
myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
return esperar1Seg();

})
.then(() => {
  myDB.transaction(function(transaction) {
      transaction.executeSql('SELECT * FROM balnearios ', [], function(tx, results) {
          var len = results.rows.length,i;
          var html ='<option value="0">Seleccione un Balneario</option>';
                for (i = 0; i < len; i++) {
                  html=html+'<option value="'+results.rows.item(i).idRemoto+'">'+results.rows.item(i).nombre+'</option>';
								}
                  $("#selectbalneariobuscar").html(html);
  }, null);
  });
	return esperar1Seg();
})
.then(() => {
consultacliente(sessionStorage.getItem("idCliente"));
return esperar1Seg();
})
.then(() => {
hventas(sessionStorage.getItem("idCliente"))
return esperar1Seg();
})
.then(() => {
credito();
// monedero();
return esperar1Seg();
})
.then(() => {
//subetodo();
return esperar1Seg();
})

function credito(){
	myDB.transaction(function(transaction) {
		var sql='select * from creditos where idCliente='+sessionStorage.getItem("idCliente")+' order by id desc';
		console.log(sql)
			transaction.executeSql(sql, [], function(tx, results) {
					var len = results.rows.length,i;
						var html='';
						var saldoT=0;
								for (i = 0; i < len; i++) {
									var tipo="Abono";
								
									var validar=results.rows.item(i).tipo;
									if(validar==0){tipo="Compra";}
									var cantidad=results.rows.item(i).cantidad;
									console.log(cantidad+" "+tipo)
									saldoT += parseFloat(cantidad);
									console.log("SUMAR SALDO "+saldoT);
									html=html+'<div class="container" align="center"><div class="row g-3"><div class="col-4"><p><b>'+results.rows.item(i).fecha+'</b></p></div><div class="col-4"><p><b>'+tipo+'</b></p></div><div class="col-4"><p><b>Total: $</b>'+cantidad+'</p></div></div><div class="col-4">\n<button data-saldoTot="'+saldoT+'" data-fecha="'+results.rows.item(i).fecha+'" data-cantidad="'+cantidad+'" data-id="'+results.rows.item(i).id+'" class="btn btn-sm btn-info btnReimprime" type="button"><span class="fas fa-print"></span>Reimprimir</button></div><hr></div>';
								}
								
									$("#contenedorcreditos").html(html)
								}, null);
	});
}
function monedero(){
	myDB.transaction(function(transaction) {
		var sql='select * from monedero where idCliente='+sessionStorage.getItem("idCliente")+' order by id desc';
		console.log(sql)
			transaction.executeSql(sql, [], function(tx, results) {
					var len = results.rows.length,i;
						var html='';

								for (i = 0; i < len; i++) {

									var tipo="Devolucion";
									var validar=results.rows.item(i).tipo;
									if(validar==0){tipo="Compra";}
									var cantidad=results.rows.item(i).cantidad;
									html=html+'<div class="container" ><div class="row g-3" align="center"><div class="col-4" ><p><b>'+results.rows.item(i).fecha+'</b></p></div><div class="col-4" ><p><b>'+tipo+'</b> </p></div><div class="col-4" ><p><b>$'+results.rows.item(i).cantidad+'</b></p></div></div><hr></div>';

									}
									$("#contenedormonederoNO").html(html)
								}, null);
	});
}
function hventas(id){
	var sql='select * from folios where idCliente= '+id+' order by id desc';

	myDB.transaction(function(transaction) {
		console.log(sql)
			transaction.executeSql(sql, [], function(tx, results) {
					var len = results.rows.length,i;
						var html='';

								for (i = 0; i < len; i++) {

									var tipo="Credito";
									var validar=results.rows.item(i).tipoventa;
									if(validar==0){tipo="Contado";}
									var cantidad=results.rows.item(i).total;
									html=html+' <tr><th scope="row">'+results.rows.item(i).fecha+'</th><td>'+tipo+'</td><td>$'+cantidad+'</td><td><button  data-bs-toggle="modal" data-bs-target="#bootstrapBasicModal3" data-bs-dismiss="modal" href="#" class="btn btn-sm btn-success btnverdetalle" data-folio="'+results.rows.item(i).foliolocal+'" type="button"><span class="fas fa-eye"></span></button></td><td><button  data-bs-dismiss="modal" class="btn btn-sm btn-info btnimprime" data-folio="'+results.rows.item(i).foliolocal+'" type="button"><span class="fas fa-print"></span></button></td><td><button  data-bs-dismiss="modal" class="btn btn-sm btn-warning btniva"  data-folio="'+results.rows.item(i).foliolocal+'" type="button"><span class="fas fa-print"></span></button></td> <td><button  data-bs-dismiss="modal" class="btn btn-sm btn-danger btneliminarv"  data-folio="'+results.rows.item(i).foliolocal+'" type="button"><span class="fas fa-times"></span></button></td></tr>';

									}
									$("#tablitaventas").html(html)
								}, null);
	});
}
function hventasdetallado(id){
	var sql='select cantidad, upper(codigo||" "||nombre) as producto,(cantidad*precioFinal)as total from ventaproductos inner join productos on productos.idRemoto=ventaproductos.idProducto where foliolocal="'+id+'"';

	myDB.transaction(function(transaction) {
			transaction.executeSql(sql, [], function(tx, results) {
					var len = results.rows.length,i;
						var html='';

								for (i = 0; i < len; i++) {
									html=html+'<tr><th scope="col">'+results.rows.item(i).cantidad+'</th><th scope="col">'+results.rows.item(i).producto+'</th><th scope="col">$'+results.rows.item(i).total+'</th></tr>';

									}
									$("#tablitaventasProd").html(html)
								}, null);
	});
}

$("#tablitaventas").on("click", ".btnimprime", function(){
    folioelimina=$(this).attr("data-folio");
    esperar1Seg()
    .then(() => {
      imprimir(folioelimina)
      return esperar1Seg();
    })

});
$("#tablitaventas").on("click", ".btnverdetalle", function(){
    folioelimina=$(this).attr("data-folio");
    esperar1Seg()
    .then(() => {
      hventasdetallado(folioelimina)
      return esperar1Seg();
    })

});
$("#tablitaventas").on("click", ".btniva", function(){
    folioelimina=$(this).attr("data-folio");
    esperar1Seg()
    .then(() => {
      imprimiriva(folioelimina)
      return esperar1Seg();
    })

});
$("#tablitaventas").on("click", ".btneliminarv", function(){
    folioelimina=$(this).attr("data-folio");
		console.log("eliminamos :"+folioelimina)
		Swal.fire({
		icon: 'warning',
		title: '¿Eliminar la venta?',
		text: 'Accion no reversible',
		confirmButtonText: 'Si'
	}).then((result) => {
		/* Read more about isConfirmed, isDenied below */
		if (result.isConfirmed) {
				esperar1Seg()
				.then(() => {
					myDB.transaction(function(transaction) {
						var sql='DELETE FROM "ventaproductos" WHERE foliolocal='+folioelimina;
						console.log(sql)
							transaction.executeSql("DELETE FROM ventaproductos WHERE foliolocal= '"+folioelimina+"'", [], function(tx, results) {
							}, null);
					});
					return esperar1Seg();
				})
				.then(() => {
					myDB.transaction(function(transaction) {
							transaction.executeSql("DELETE FROM folios WHERE foliolocal='"+folioelimina+"'", [], function(tx, results) {
							}, null);
					});
				})
				.then(() => {
				hventas(sessionStorage.getItem("idCliente"))
				})

		}
	})

});
function consultacliente(id){
	var nombre;
	var apellido;
	var telefono;
	var balneario;
	var razonsocial;
	var domicilio;
	var codigopostal;
	var regimenfiscal;
	var rfc;
	var email;
	var credito;
	var selectbalneario;
var sql='select *, balnearios.nombre as nombrebalneario,clientes.nombre as nombrecliente  from clientes inner join balnearios on clientes.balneario=balnearios.idRemoto where clientes.idRemoto='+id;
console.log(sql)
	myDB.transaction(function(transaction) {
			transaction.executeSql(sql, [], function(tx, results) {
					var len = results.rows.length,i;

								for (i = 0; i < len; i++) {
									selectbalneario=results.rows.item(i).balneario;
									nombre=results.rows.item(i).nombrecliente;//
									apellido=results.rows.item(i).apellido;//
									telefono=results.rows.item(i).telefono;//
									balneario=results.rows.item(i).nombrebalneario;
									razonsocial=results.rows.item(i).razonsocial;//
									domicilio=results.rows.item(i).domicilio;//
									codigopostal=results.rows.item(i).codigopostal;//
									regimenfiscal=results.rows.item(i).regimenfiscal;//
									rfc=results.rows.item(i).rfc;//
									email=results.rows.item(i).email;//
									credito=results.rows.item(i).credito;//
									debecliente=results.rows.item(i).debe;
									nombreimprime=nombre+" "+apellido;
									domicilioimprime=domicilio+" "+balneario;
									monederocliente=results.rows.item(i).monedero;
									}
									$('#selectbalneariobuscar > option[value="'+selectbalneario+'"]').attr('selected', 'selected');
									$('#selectrf > option[value="'+regimenfiscal+'"]').attr('selected', 'selected');
									$("#labelNombre").html(nombre+" "+apellido)
									$("#labelmonedero").html("Saldo $"+monederocliente);
									$("#labelDireccion").html(domicilio)
									$("#labelrfc").html(rfc)
									$("#labelcp").html(codigopostal)
									$("#labeltelefono").html(telefono)
									$("#labelemail").html(email)
									$("#labelrazon").html(razonsocial)

									$("#labelregimen").html(regimenfiscal)
									$("#labelbalnerario").html(balneario)
									$("#labeldebe").html("Debe : $"+debecliente.toFixed(2))
									$("#labeltotaldebe").html("$"+debecliente.toFixed(2))
									$("#labelcreditor").html("$"+credito.toFixed(2))

									$("#txtnombre").val(nombre)
									$("#txtapellido").val(apellido)
									$("#txtdomicilio").val(domicilio)
									$("#txtrfc").val(rfc)
									$("#txtcodigopostal").val(codigopostal)
									$("#txttelefono").val(telefono)
									$("#txtemail").val(email)
									$("#txtrazonsocial").val(razonsocial)
									$("#txtcredito").val(credito)


	}, null);
	});
}


function actualizacliente(id){
	myDB.transaction(function(transaction) {
	transaction.executeSql('UPDATE "clientes" SET nombre="'+$("#txtnombre").val()+'",apellido="'+$("#txtapellido").val()+'",telefono="'+$("#txttelefono").val()+'",balneario="'+$("#selectbalneariobuscar").val()+'",razonsocial="'+$("#txtrazonsocial").val()+'",domicilio="'+$("#txtdomicilio").val()+'",codigopostal="'+$("#txtcodigopostal").val()+'",regimenfiscal="'+$("#selectrf").val()+'",rfc="'+$("#txtrfc").val()+'",email="'+$("#txtemail").val()+'",credito="'+$("#txtcredito").val()+'",actualizar="1" WHERE "idRemoto"='+id, [], function(tx,results) {}, null);
	});
}
function subedatos(){
	var url="http://"+servidor+"/fels/administrador/clientes/EditarRegistro.php";
	var datos = {
							"id" : sessionStorage.getItem("idCliente"),
							"nombre" : $("#txtnombre").val(),
							"apellido" : $("#txtapellido").val(),
							"tel" : $("#txttelefono").val(),
							"balneario" : $("#selectbalneariobuscar").val(),
							"rfc" : $("#txtrfc").val(),
							"razonsocial" : $("#txtrazonsocial").val(),
							"domicilio" : $("#txtdomicilio").val(),
							"codigopostal" : $("#txtcodigopostal").val(),
							"regimenfiscal" : $("#selectrf").val(),
							"email" : $("#txtemail").val(),
							"credito" : $("#txtcredito").val(),
							"dispositivo":sessionStorage.getItem("idDispositivo")
						};
						$.ajax({
					data: datos,
					method: "POST",
					url: url,
					async: false,
					}).done(function(data) {

					});
}
$("#btnterminacredito").click(function(){
	if ($("#txtabono").val() == "" || $("#txtabono").val() <= 0 ) {
		alert('NO SE PUEDE REGISTRAR EL ABONO');
		console.log('NO SE PUEDE REGISTRAR EL ABONO');
	}else{
		console.log("imprime abono");
		imprimerecibo()

	}

});
function imprimerecibo(){
	esperar2Seg()
	.then(() => {
		if(bandera==1){
			let date = new Date();
			var fechita=date.toISOString().split('T')[0];
		myDB.transaction(function(transaction) {
		var executeQuery = 'INSERT INTO "creditos"("idRemoto","idfolio","idfolioremoto","idCliente","cantidad","fecha","tipo") VALUES ("0","0","0","'+sessionStorage.getItem("idCliente")+'","'+$("#txtabono").val()+'","'+fechita+'","1")';
		console.log(executeQuery)
					transaction.executeSql(executeQuery, function(tx, result) {
						},
							function(error) {});
			});
		}

		return esperar2Seg();
	})
	.then(() => {

			let date = new Date();
			var fechita=date.toISOString().split('T')[0];
		myDB.transaction(function(transaction) {
		var executeQuery = 'UPDATE "clientes" SET "debe"='+deberemos+' WHERE "idRemoto"='+sessionStorage.getItem("idCliente");
		console.log(executeQuery)
					transaction.executeSql(executeQuery, function(tx, result) {
						},
							function(error) {});
			});


		return esperar2Seg();
	})
	.then(() => {
		if(bandera==0){
			consultacliente(sessionStorage.getItem("idCliente"));
		}

		return esperar2Seg();
	})

	if (typeof (BTPrinter) === 'undefined') {
		// Error: plugin not installed
		console.error('Error: BTPrinter plugin not detected');
		alert('Error: BTPrinter plugin not detected');
		window.plugins.toast.showLongBottom('BTPrinter plugin not detected');
	} else {
		esperar1Seg()
	 .then(() => {
		 var strPrinter=sessionStorage.getItem("impresora");
		 console.log(strPrinter)
		 BTPrinter.connect(function (data) {
			 console.log("conecta")
			 window.plugins.toast.showLongBottom('CONECTA: ' + data);
		 }, function (err) {
			 console.log("ERROR : "+err)
			 window.plugins.toast.showLongBottom('connect: ' + err);
		 }, strPrinter);
		 return esperar1Seg();
	 })
	 .then(() => {
		 var printBase64 = $('#logo').val();
		 var strAlign = 0;
		 BTPrinter.printBase64(function (data) {
			 console.log('printBase64: ' + data);
			 window.plugins.toast.showLongBottom('printBase64: ' + data);
		 }, function (err) {
			 console.error('printBase64: ' + err);
			 window.plugins.toast.showLongBottom('printBase64: ' + err);
		 }, printBase64, strAlign);

		return esperar1Seg();
	 })
	 .then(() => {
		 var strText = "Cda.Gabino Barreda S/N.Col Cerrito\n colorado. Progreso de Obregon Hidalgo\nTel. 7714145428 - 7721154533\n Tel. 7721571521 - 7715685165 \n\n";
		 var strSize=1;
		 var strAlign=1;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	 .then(() => {
		 var meses = new Array ("Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic");
	var diasSemana = new Array("Do","Lu","Ma","Mi","Ju","Vi","Sa");
	var f=new Date();
	var date=diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
		 var strText = "Recibo \n Fecha "+date;
		 var strSize=1;
		 var strAlign=0;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	 .then(() => {
		 var strText = "Cliente:"+nombreimprime+"\nLugar: "+domicilioimprime;
		 var strSize=1;
		 var strAlign=0;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	 .then(() => {
		 var strText = "Saldo anterior :$"+debecliente;
		 var strSize=1;
		 var strAlign=0;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	 .then(() => {
		 var strText = "SU ABONO: $"+$("#txtabono").val();
		 var strSize=1;
		 var strAlign=0;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	 .then(() => {
		 var strText = "Saldo a liquidar :$"+deberemos;
		 var strSize=1;
		 var strAlign=2;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	 .then(() => {
		 var strText = "GRACIAS POR SU PREFERENCIA";
		 var strSize=1;
		 var strAlign=1;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	 .then(() => {
		 var strText = "PARA VISUALIZAR NUESTRO CATALOGO ESCANEE\n EL CODIGO SIGUIENTE";
		 var strSize=1;
		 var strAlign=1;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	 .then(() => {
		 var data = "bit.ly/3iyNg1Z";
		 var align = 1;
		 var model = 49;
		 var size = 49;
		 var eclevel = 50;
		 BTPrinter.printQRCode(function (data) {
			 console.log('printQRCode:' + data);
			 window.plugins.toast.showLongBottom('printQRCode:' + data);
		 }, function (err) {
			 console.error('printQRCode:' + err);
			 window.plugins.toast.showLongBottom('printQRCode:' + err);
		 }, data, align, model, size, eclevel);


		return esperar1Seg();
	 })
	 .then(() => {
		 var strText = "\n\n\n";
		 var strSize=1;
		 var strAlign=1;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	.then(() => {
	 BTPrinter.disconnect(function (data) {
		 console.log('disconnect: ' + data);
		 window.plugins.toast.showLongBottom('DESCONECTAMOS: ' + data);
	 }, function (err) {
		 console.error('disconnect: ' + err);
		 window.plugins.toast.showLongBottom('disconnect: ' + err);
	 });
	})
	.then(() => {
		credito();
		if(bandera==0){
			$("#txtabono").val("0");
		}

		return esperar1Seg();
	})
	.then(() => {

		///termina llave recibos
		if(bandera==1){
			bandera=2;
		//	imprimerecibo();
		location.reload()
		}else if(bandera==2){location.reload()}

		return esperar1Seg();
	})


	}


}


//SE AGREGO REIMPRIMIR
$("#contenedorcreditos").on("click", ".btnReimprime", function(){
	fechaRe = $(this).attr("data-fecha");
	cantidad = $(this).attr("data-cantidad");

	reimprimirAbono(fechaRe, cantidad);

});

function reimprimirAbono(fechaRe, cantidad){
 
	esperar2Seg()

	.then(() => {

			consultacliente(sessionStorage.getItem("idCliente"));

		return esperar2Seg();
	})

	if (typeof (BTPrinter) === 'undefined') {
		// Error: plugin not installed
		console.error('Error: BTPrinter plugin not detected');
		alert('Error: BTPrinter plugin not detected');
		window.plugins.toast.showLongBottom('BTPrinter plugin not detected');
	} else {

		esperar1Seg()
	 .then(() => {
		 var strPrinter=sessionStorage.getItem("impresora");
		 console.log(strPrinter)
		 BTPrinter.connect(function (data) {
			 console.log("conecta")
			 window.plugins.toast.showLongBottom('CONECTA: ' + data);
		 }, function (err) {
			 console.log("ERROR : "+err)
			 window.plugins.toast.showLongBottom('connect: ' + err);
		 }, strPrinter);
		 return esperar1Seg();
	 })
	 .then(() => {
		 var printBase64 = $('#logo').val();
		 var strAlign = 0;
		 BTPrinter.printBase64(function (data) {
			 console.log('printBase64: ' + data);
			 window.plugins.toast.showLongBottom('printBase64: ' + data);
		 }, function (err) {
			 console.error('printBase64: ' + err);
			 window.plugins.toast.showLongBottom('printBase64: ' + err);
		 }, printBase64, strAlign);

		return esperar1Seg();
	 })
	 .then(() => {
		 var strText = "Cda.Gabino Barreda S/N.Col Cerrito\n colorado. Progreso de Obregon Hidalgo\nTel. 7714145428 - 7721154533\n Tel. 7721571521 - 7715685165 \n\n";
		 var strSize=1;
		 var strAlign=1;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	 .then(() => {
		 var meses = new Array ("Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic");
	var diasSemana = new Array("Do","Lu","Ma","Mi","Ju","Vi","Sa");
	var f=new Date();
	var date=diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
		 var strText = "Reimpresión \nFecha "+fechaRe;
		 var strSize=1;
		 var strAlign=0;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	 .then(() => {
		 var strText = "Cliente:"+nombreimprime+"\nLugar: "+domicilioimprime;
		 var strSize=1;
		 var strAlign=0;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	//  .then(() => {
	// 	var totall = (parseFloat(debecliente) + parseFloat($(this).attr("data-saldoTot"))) ;
	// 	 var strText = "Saldo anterior:$"+(parseFloat(totall) - parseFloat(cantidad));
	// 	 var strSize=1;
	// 	 var strAlign=0;
	// 	 BTPrinter.printTextSizeAlign(function (data) {
	// 		 console.log('printTextSizeAlign: ' + data);
	// 		 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
	// 	 }, function (err) {
	// 		 console.error('printTextSizeAlign: ' + err);
	// 		 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
	// 	 }, strText, strSize, strAlign);


	// 	return esperar1Seg();
	//  })
	 .then(() => {
		 var strText = "SU ABONO: $"+cantidad;
		 var strSize=1;
		 var strAlign=0;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	 .then(() => {
		 var strText = "Saldo actual :$"+debecliente;
		 var strSize=1;
		 var strAlign=2;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	 .then(() => {
		 var strText = "GRACIAS POR SU PREFERENCIA";
		 var strSize=1;
		 var strAlign=1;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	 .then(() => {
		 var strText = "PARA VISUALIZAR NUESTRO CATALOGO ESCANEE\n EL CODIGO SIGUIENTE";
		 var strSize=1;
		 var strAlign=1;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	 .then(() => {
		 var data = "bit.ly/3iyNg1Z";
		 var align = 1;
		 var model = 49;
		 var size = 49;
		 var eclevel = 50;
		 BTPrinter.printQRCode(function (data) {
			 console.log('printQRCode:' + data);
			 window.plugins.toast.showLongBottom('printQRCode:' + data);
		 }, function (err) {
			 console.error('printQRCode:' + err);
			 window.plugins.toast.showLongBottom('printQRCode:' + err);
		 }, data, align, model, size, eclevel);


		return esperar1Seg();
	 })
	 .then(() => {
		 var strText = "\n\n\n";
		 var strSize=1;
		 var strAlign=1;
		 BTPrinter.printTextSizeAlign(function (data) {
			 console.log('printTextSizeAlign: ' + data);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
		 }, function (err) {
			 console.error('printTextSizeAlign: ' + err);
			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
		 }, strText, strSize, strAlign);


		return esperar1Seg();
	 })
	.then(() => {
	 BTPrinter.disconnect(function (data) {
		 console.log('disconnect: ' + data);
		 window.plugins.toast.showLongBottom('DESCONECTAMOS: ' + data);
	 }, function (err) {
		 console.error('disconnect: ' + err);
		 window.plugins.toast.showLongBottom('disconnect: ' + err);
	 });
	})
	.then(() => {
		credito();
		if(bandera==0){
			$("#txtabono").val("0");
		}

		return esperar1Seg();
	})
	.then(() => {

		///termina llave recibos
		if(bandera==1){
			bandera=2;
		//	imprimerecibo();
		location.reload()
		}else if(bandera==2){location.reload()}

		return esperar1Seg();
	})


	}


}
/////
$("#txtabono").keyup(function(){

	 deberemos=debecliente-$(this).val();
	if(deberemos<0||$(this).val()<0){
		$("#labeltotaldespues").html("$"+debecliente.toFixed(2))
		$(this).val("")
		Swal.fire({
	  icon: 'warning',
	  title: 'No puedes realizar esta operacion'
	})
	sumatotal(folio)
	}else{
		$("#labeltotaldespues").html("$"+deberemos.toFixed(2))
	}

});

		$("#btnactualiza").click(function(){
			esperar1Seg()
			.then(() => {
			actualizacliente(sessionStorage.getItem("idCliente"));
			return esperar1Seg();
			})
			.then(() => {
				hello.greet("", success, failure);
				return esperar1Seg();
			})
			.then(() => {
				if(conn){
						subedatos();
				}
				return esperar1Seg();
			})
			.then(() => {
				consultacliente(sessionStorage.getItem("idCliente"))
				return esperar1Seg();
			})

		});
		$("#btnRegresar").click(function(){
			console.log("se preciona")
				setTimeout('window.location = "nuevo_cliente.html"', 500)
		})

		function subetodo(){
			esperar1Seg()
			.then(() => {
				subefolios();
				return esperar1Seg();
			})
			.then(() => {
				//subefolios
				subeproductosventa();

				return esperar1Seg();
			})
			.then(() => {

				bajainformacion();

				return esperar1Seg();
			})

			/////SIGUIENTE LLAVE CIERRA METODO
		}

		function bajainformacion(){
			esperar1Seg()
			.then(() => {

			  		if(conn){
							var url="http://"+servidor+"/fels/json/actualizacion.php?id="+sessionStorage.getItem("idDispositivo");
							console.log(url)
							console.log("CONSULTA LOGS")
							$.ajax({
						method: "GET",
						url: url,
						async: false,
						}).done(function(data) {
							console.log(data);
							console.log("IMprime data")
							if(data!=0){
								var obj = $.parseJSON(data);
									if(obj[0].tabla=="clientes"){

										if(obj[0].funcion=="create"){

											insertacliente(obj[0].idRemoto,obj[0].nombre,obj[0].apellido,obj[0].telefono,obj[0].balneario,obj[0].razonsocial,obj[0].domicilio,obj[0].codigopostal,obj[0].regimenfiscal,obj[0].rfc,obj[0].email,obj[0].credito);
										}else if(obj[0].funcion=="update"){
					myDB.transaction(function(transaction) {
					transaction.executeSql('UPDATE "clientes"SET nombre="'+obj[0].nombre+'",apellido="'+obj[0].apellido+'",telefono="'+obj[0].telefono+'",balneario="'+obj[0].balneario+'",razonsocial="'+obj[0].razonsocial+'",domicilio="'+obj[0].domicilio+'",codigopostal="'+obj[0].codigopostal+'",regimenfiscal="'+obj[0].regimenfiscal+'",rfc="'+obj[0].rfc+'",email="'+obj[0].email+'",credito="'+obj[0].credito+'" WHERE "idRemoto"='+obj[0].idRemoto, [], function(tx,results) {}, null);
											});
										}
									}else if(obj[0].tabla=="folios"){
											insertafolios(obj[0].idLocal,obj[0].idRemoto,obj[0].idCliente,obj[0].idusuario,obj[0].total,obj[0].tipoventa,obj[0].estado)
									}else if(obj[0].tabla=="rutas"){

										if(obj[0].funcion=="UpdateActivar"){
											myDB.transaction(function(transaction) {
											transaction.executeSql('UPDATE "rutas"SET estado="'+obj[0].estado+'" WHERE "idRemoto"='+obj[0].idRemoto, [], function(tx,results) {}, null);
																	});

										}else if(obj[0].funcion=="Update"){
											myDB.transaction(function(transaction) {
											transaction.executeSql('UPDATE "rutas"SET ruta="'+obj[0].ruta+'" WHERE "idRemoto"='+obj[0].idRemoto, [], function(tx,results) {}, null);
																	});

										}else{
											myDB.transaction(function(transaction) {
												var sql='INSERT INTO "rutas"("idRemoto","ruta","estado") VALUES ("'+obj[0].idRemoto+'","'+obj[0].ruta+'","1")';
												console.log(sql)
											transaction.executeSql(sql, [], function(tx,results) {}, null);
																	});

										}
									}else if(obj[0].tabla=="Balnearios"){
										if(obj[0].funcion=="UpdateActivar"){
											myDB.transaction(function(transaction) {
											transaction.executeSql('UPDATE "balnearios" SET estado="'+obj[0].estado+'" WHERE "idRemoto"='+obj[0].idRemoto, [], function(tx,results) {}, null);
																	});

										}else if(obj[0].funcion=="Update"){
											myDB.transaction(function(transaction) {
											transaction.executeSql('UPDATE "balnearios" SET nombre="'+obj[0].nombre+'", ruta="'+obj[0].ruta+'" WHERE "idRemoto"='+obj[0].idRemoto, [], function(tx,results) {}, null);
																	});

										}else{
											myDB.transaction(function(transaction) {
												var sql='INSERT INTO "balnearios"("idRemoto","idRuta","nombre","estado") VALUES ("'+obj[0].idRemoto+'","'+obj[0].ruta+'","'+obj[0].nombre+'","1")';
												console.log(sql)
											transaction.executeSql(sql, [], function(tx,results) {}, null);
																	});

										}
									}else if(obj[0].tabla=="Categoria"){
										if(obj[0].funcion=="UpdateActivar"){
											myDB.transaction(function(transaction) {
											transaction.executeSql('UPDATE "categorias" SET estado="'+obj[0].estado+'" WHERE "idRemoto"='+obj[0].idRemoto, [], function(tx,results) {}, null);
																	});

										}else if(obj[0].funcion=="Update"){
											myDB.transaction(function(transaction) {
											transaction.executeSql('UPDATE "categorias" SET categoria="'+obj[0].categoria+'" WHERE "idRemoto"='+obj[0].idRemoto, [], function(tx,results) {}, null);
																	});

										}else{
											myDB.transaction(function(transaction) {
												var sql='INSERT INTO "categorias"("idRemoto","categoria","estado") VALUES ("'+obj[0].idRemoto+'","'+obj[0].categoria+'","1")';
												console.log(sql)
											transaction.executeSql(sql, [], function(tx,results) {}, null);
																	});

										}

									}else if(obj[0].tabla=="Subcategoria"){
										if(obj[0].funcion=="UpdateActivar"){
											myDB.transaction(function(transaction) {
											transaction.executeSql('UPDATE "subcategorias" SET estado="'+obj[0].estado+'" WHERE "idRemoto"='+obj[0].idRemoto, [], function(tx,results) {}, null);
																	});

										}else if(obj[0].funcion=="Update"){
											myDB.transaction(function(transaction) {
											transaction.executeSql('UPDATE "subcategorias" SET subcategoria="'+obj[0].nombre+'", idCategoria="'+obj[0].idcategoria+'" WHERE "idRemoto"='+obj[0].idRemoto, [], function(tx,results) {}, null);
																	});

										}else{
											myDB.transaction(function(transaction) {
												var sql='INSERT INTO "subcategorias"("idRemoto","idCategoria","subcategoria","estado") VALUES ("'+obj[0].idRemoto+'","'+obj[0].idcategoria+'","'+obj[0].nombre+'","1")';
												console.log(sql)
											transaction.executeSql(sql, [], function(tx,results) {}, null);
																	});

										}

									}else if(obj[0].tabla=="Usuarios"){
										if(obj[0].funcion=="UpdateActivar"){
											console.log("PENDIENTE DE VERIFICAR")

										}else if(obj[0].funcion=="Update"){
											myDB.transaction(function(transaction) {
											transaction.executeSql('UPDATE "usuarios" SET "nombre"="'+obj[0].nombre+'" ,user="'+obj[0].user+'" WHERE "idPrincipal"="'+obj[0].idRemoto+'"', [], function(tx,results) {}, null);
																	});

										}else if(obj[0].funcion=="Contra"){
											myDB.transaction(function(transaction) {
												var sql='UPDATE "usuarios" SET "contra"="'+obj[0].contra+'" WHERE "idPrincipal"="'+obj[0].idRemoto+'"';
												console.log(sql)
											transaction.executeSql(sql, [], function(tx,results) {}, null);
																	});

										}else{
											myDB.transaction(function(transaction) {
												var sql='INSERT INTO "usuarios"("idPrincipal","user","contra","nombre") VALUES ("'+obj[0].idRemoto+'","'+obj[0].user+'","'+obj[0].contra+'","'+obj[0].nombre+'");';
												console.log(sql)
											transaction.executeSql(sql, [], function(tx,results) {}, null);
																	});

										}
									}else if(obj[0].tabla=="Productos"){

										if(obj[0].funcion=="UpdateActivar"){
											myDB.transaction(function(transaction) {
											transaction.executeSql('UPDATE "productos" SET "estado"="'+obj[0].estado+'" WHERE "idRemoto"="'+obj[0].idRemoto+'"', [], function(tx,results) {}, null);
																	});

										}else if(obj[0].funcion=="Update"){
											myDB.transaction(function(transaction) {
												var sql='UPDATE "productos" SET "codigo"="'+obj[0].codigo+'", nombre="'+obj[0].nombre+'",imagen="'+obj[0].imagen+'",venta="'+obj[0].venta+'",caja="'+obj[0].caja+'",idcategoria="'+obj[0].idcategoria+'",idsubcategoria="'+obj[0].idsubcategoria+'" WHERE "idRemoto"="'+obj[0].idRemoto+'"';
												console.log(sql)
											transaction.executeSql(sql, [], function(tx,results) {}, null);
																	});

										}else{
											myDB.transaction(function(transaction) {
												var sql='INSERT INTO "productos"("idRemoto","codigo","nombre","imagen","venta","caja","idcategoria","idsubcategoria","estado") VALUES ("'+obj[0].idRemoto+'","'+obj[0].codigo+'","'+obj[0].nombre+'","'+obj[0].imagen+'","'+obj[0].venta+'","'+obj[0].caja+'","'+obj[0].idCategoria+'","'+obj[0].idSubcategoria+'","1")';
												console.log(sql)
											transaction.executeSql(sql, [], function(tx,results) {}, null);
																	});

										}


									}else{}
						bajainformacion()
						}


						});
						}
						return esperar1Seg();
			})


		}
		function insertacliente(idRemoto,nombre,apellido,telefono,balneario,razonsocial,domicilio,codigopostal,regimenfiscal,rfc,email,credito){
			myDB.transaction(function(transaction) {
		var executeQuery = "INSERT INTO clientes('idRemoto','nombre','apellido','telefono','balneario','razonsocial','domicilio','codigopostal','regimenfiscal','rfc','email','credito','debe','monedero','estado')VALUES('"+idRemoto+"','"+nombre+"','"+apellido+"','"+telefono+"','"+balneario+"','"+razonsocial+"','"+domicilio+"','"+codigopostal+"','"+regimenfiscal+"','"+rfc+"','"+email+"','"+credito+"','0','0','1')";
					console.log(executeQuery);
					transaction.executeSql(executeQuery, function(tx, result) {
						},
							function(error) {

							});
			});
		}
		function insertafolios(foliolocal,idremoto,idcliente,idUsuario,total,tipoventa,estado){
			myDB.transaction(function(transaction) {
		var executeQuery = 'INSERT INTO "folios"("foliolocal","idRemoto","idCliente","idusuario","total","tipoventa","estado") VALUES ("'+foliolocal+'","'+idremoto+'","'+idcliente+'","'+idUsuario+'","'+total+'","'+tipoventa+'","'+estado+'")';
					console.log(executeQuery);
					transaction.executeSql(executeQuery, function(tx, result) {
						},
							function(error) {

							});
			});
		}
		function imprimir(folio){
			if (typeof (BTPrinter) === 'undefined') {
				// Error: plugin not installed
				console.error('Error: BTPrinter plugin not detected');

				window.plugins.toast.showLongBottom('BTPrinter plugin not detected');
			} else {
				esperar1Seg()
		 	 .then(() => {
				 var strPrinter=sessionStorage.getItem("impresora");
				 console.log(strPrinter)
				 BTPrinter.connect(function (data) {
					 console.log("conecta")
					 window.plugins.toast.showLongBottom('CONECTA: ' + data);
				 }, function (err) {
					 Swal.fire(
			'No se detecto impresora!',
			'Verifica tu impresora',
			'error'
		 )
					noImpresora=0;
				 }, strPrinter);
		 		 return esperar1Seg();
		 	 })
			 .then(() => {
				 if(noImpresora==1){
					 var printBase64 = $('#logo').val();
					 var strAlign = 0;
					 BTPrinter.printBase64(function (data) {
						 console.log('printBase64: ' + data);
						 window.plugins.toast.showLongBottom('printBase64: ' + data);
					 }, function (err) {
						 console.error('printBase64: ' + err);
						 window.plugins.toast.showLongBottom('printBase64: ' + err);
					 }, printBase64, strAlign);
				 }


			 	return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "Cda.Gabino Barreda S/N.Col Cerrito\n colorado. Progreso de Obregon Hidalgo\nTel. 7714145428 - 7721154533\n Tel. 7721571521 - 7715685165 \n\n";
						var strSize=1;
						var strAlign=1;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



			 	return esperar1Seg();
			 })
			 .then(() => {
			if(noImpresora==1){
			 var sql='select fecha,clientes.nombre||" "||clientes.apellido as nombre,rutas.ruta||" "||balnearios.nombre as domicilio, tipoventa,abono,folios.monedero,debeahora from folios inner join clientes on clientes.idRemoto=folios.idcliente inner join balnearios on balnearios.idRemoto=clientes.balneario inner join rutas on rutas.idRemoto=balnearios.idRuta where foliolocal="'+folio+'"';
			 console.log(sql)
			 myDB.transaction(function(transaction) {
					 transaction.executeSql(sql, [], function(tx, results) {
							 var len = results.rows.length,i;
							 totalImprime=0;
										 for (i = 0; i < len; i++) {
											 nombre=results.rows.item(i).nombre;
											 direccion=results.rows.item(i).domicilio;
											 tipoventa=results.rows.item(i).tipoventa;
											 abono=results.rows.item(i).abono;
											 monedero=results.rows.item(i).monedero;
											 debeahora=results.rows.item(i).debeahora;
											 fechaventa=results.rows.item(i).fecha;

								 }

			 }, null);
			 });
			}

							return esperar1Seg();
			 })
			 .then(() => {
				 var meses = new Array ("Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic");
		var diasSemana = new Array("Do","Lu","Ma","Mi","Ju","Vi","Sa");
		var f=new Date();
		var date=diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
				 var strText = "Folio :"+folio+"    Fecha de venta"+fechaventa+"\n Fecha de Reimpresion :"+date;
				 var strSize=1;
				 var strAlign=0;
				  if(noImpresora==1){
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "Cliente:"+nombre+"\nLugar: "+direccion;
						var strSize=1;
						var strAlign=0;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: XXXXXX' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



			 	return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "------------------------------------------------";
						var strSize=1;
						var strAlign=0;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "REIMPRESION DE TICKET";
						var strSize=1;
						var strAlign=1;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



				return esperar1Seg();
			 })

			 .then(() => {
				  if(noImpresora==1){
						var strText = "------------------------------------------------";
						var strSize=1;
						var strAlign=0;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}
				return esperar1Seg();
			 })
			 .then(() => {
		 if(noImpresora==1){
			 var sql='select codigo,nombre,precioFinal,cantidad,(cantidad*precioFinal) as total,ventaproductos.id as id, ventaproductos.descuentoDinero as dinero,ventaproductos.descuentoPorcentaje as porcentaje,sum(ventaproductos.descuentoDinero) as descuentoefe,sum(ventaproductos.descuentoPorcentaje) as descuentopor,ventaproductos.precio as real from ventaproductos inner join productos on ventaproductos.idProducto=productos.idRemoto where ventaproductos.foliolocal="'+folio+'" GROUP by ventaproductos.id';
			 console.log(sql)
			 myDB.transaction(function(transaction) {
					 transaction.executeSql(sql, [], function(tx, results) {
							 var len = results.rows.length,i;
							 console.log(len)
							 var html ='';
							 totalImprime=0;
										 for (i = 0; i < len; i++) {

											 var strText = "Codigo :"+results.rows.item(i).codigo+" Prod :"+palabras(results.rows.item(i).nombre,22)+" \n"+palabras("Cant: "+results.rows.item(i).cantidad,10)+"      pu: "+palabras("$"+results.rows.item(i).precioFinal,10)+"    t: $"+palabras(results.rows.item(i).total,6);
												var strSize=1;
												var strAlign=0;
												BTPrinter.printTextSizeAlign(function (data) {

													window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
												}, function (err) {
													console.error('printTextSizeAlign: ' + err);
													window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
												}, strText, strSize, strAlign);
											totalImprime=totalImprime+results.rows.item(i).total;
								 }

			 }, null);
			 });
		 }

		return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "Subtotal :$"+totalImprime;
						var strSize=1;
						var strAlign=2;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						if(monedero>0){
							var strText = "Monedero : $"+monedero;
							var strSize=1;
							var strAlign=2;
							BTPrinter.printTextSizeAlign(function (data) {
								console.log('printTextSizeAlign: ' + data);
								window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
							}, function (err) {
								console.error('printTextSizeAlign: ' + err);
								window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
							}, strText, strSize, strAlign);
						}

					}



				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						if(abono>0&&tipoventa==1){
							var strText = "Abono : $"+abono;
							var strSize=1;
							var strAlign=2;
							BTPrinter.printTextSizeAlign(function (data) {
								console.log('printTextSizeAlign: ' + data);
								window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
							}, function (err) {
								console.error('printTextSizeAlign: ' + err);
								window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
							}, strText, strSize, strAlign);

						}
					}




				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						if(abono>=0&&tipoventa==1){
							var strText = "Saldo pendiente : $"+(debeahora-(totalImprime-(monedero+abono)));
							var strSize=1;
							var strAlign=2;
							BTPrinter.printTextSizeAlign(function (data) {
								console.log('printTextSizeAlign: ' + data);
								window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
							}, function (err) {
								console.error('printTextSizeAlign: ' + err);
								window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
							}, strText, strSize, strAlign);

						}

					}



				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "Total a pagar :$"+(totalImprime-monedero);
			 		 if(tipoventa==1){
			 			 strText = "Total a liquidar :$"+(debeahora);
			 		 }
			 		 var strSize=1;
			 		 var strAlign=2;
			 		 BTPrinter.printTextSizeAlign(function (data) {
			 			 console.log('printTextSizeAlign: ' + data);
			 			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
			 		 }, function (err) {
			 			 console.error('printTextSizeAlign: ' + err);
			 			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
			 		 }, strText, strSize, strAlign);
					}



				return esperar1Seg();
			 })
			 .then(() => {
					if(noImpresora==1){
						var strText = "VENTA DE CONTADO";
						if(tipoventa==1){
							strText = "VENTA DE CREDITO";
						}
						var strSize=1;
						var strAlign=1;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "GRACIAS POR SU PREFERENCIA";
						var strSize=1;
						var strAlign=1;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "PARA VISUALIZAR NUESTRO CATALOGO ESCANEE EL\n CODIGO SIGUIENTE";
			 		 var strSize=1;
			 		 var strAlign=1;
			 		 BTPrinter.printTextSizeAlign(function (data) {
			 			 console.log('printTextSizeAlign: ' + data);
			 			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
			 		 }, function (err) {
			 			 console.error('printTextSizeAlign: ' + err);
			 			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
			 		 }, strText, strSize, strAlign);

					}



				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var data = "bit.ly/3iyNg1Z";
						var align = 1;
						var model = 49;
						var size = 49;
						var eclevel = 50;
						BTPrinter.printQRCode(function (data) {
							console.log('printQRCode:' + data);
							window.plugins.toast.showLongBottom('printQRCode:' + data);
						}, function (err) {
							console.error('printQRCode:' + err);
							window.plugins.toast.showLongBottom('printQRCode:' + err);
						}, data, align, model, size, eclevel);

					}



				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "\n\n\n";
						var strSize=1;
						var strAlign=1;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);

					}



				return esperar1Seg();
			 })
		 .then(() => {
			  if(noImpresora==1){
					BTPrinter.disconnect(function (data) {
			 		 console.log('disconnect: ' + data);
			 		 window.plugins.toast.showLongBottom('DESCONECTAMOS: ' + data);
			 	 }, function (err) {
			 		 console.error('disconnect: ' + err);
			 		 window.plugins.toast.showLongBottom('disconnect: ' + err);
			 	 });

				}

		 })

			}


			//////siguiente llave termina impresion
		}
		function imprimiriva(folio){
			if (typeof (BTPrinter) === 'undefined') {
				// Error: plugin not installed
				console.error('Error: BTPrinter plugin not detected');

				window.plugins.toast.showLongBottom('BTPrinter plugin not detected');
			} else {
				esperar1Seg()
		 	 .then(() => {
				 var strPrinter=sessionStorage.getItem("impresora");
				 console.log(strPrinter)
				 BTPrinter.connect(function (data) {
					 console.log("conecta")
					 window.plugins.toast.showLongBottom('CONECTA: ' + data);
				 }, function (err) {
					 Swal.fire(
			'No se detecto impresora!',
			'Verifica tu impresora',
			'error'
		 )
					noImpresora=0;
				 }, strPrinter);
		 		 return esperar1Seg();
		 	 })
			 .then(() => {
				 if(noImpresora==1){
					 var printBase64 = $('#logo').val();
					 var strAlign = 0;
					 BTPrinter.printBase64(function (data) {
						 console.log('printBase64: ' + data);
						 window.plugins.toast.showLongBottom('printBase64: ' + data);
					 }, function (err) {
						 console.error('printBase64: ' + err);
						 window.plugins.toast.showLongBottom('printBase64: ' + err);
					 }, printBase64, strAlign);
				 }


			 	return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "Cda.Gabino Barreda S/N.Col Cerrito\n colorado. Progreso de Obregon Hidalgo\nTel. 7714145428 - 7721154533\n Tel. 7721571521 - 7715685165 \n\n";
						var strSize=1;
						var strAlign=1;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



			 	return esperar1Seg();
			 })
			 .then(() => {
			if(noImpresora==1){
			 var sql='select fecha,clientes.nombre||" "||clientes.apellido as nombre,rutas.ruta||" "||balnearios.nombre as domicilio, tipoventa,abono,folios.monedero,debeahora from folios inner join clientes on clientes.idRemoto=folios.idcliente inner join balnearios on balnearios.idRemoto=clientes.balneario inner join rutas on rutas.idRemoto=balnearios.idRuta where foliolocal="'+folio+'"';
			 console.log(sql)
			 myDB.transaction(function(transaction) {
					 transaction.executeSql(sql, [], function(tx, results) {
							 var len = results.rows.length,i;
							 totalImprime=0;
										 for (i = 0; i < len; i++) {
											 nombre=results.rows.item(i).nombre;
											 direccion=results.rows.item(i).domicilio;
											 tipoventa=results.rows.item(i).tipoventa;
											 abono=results.rows.item(i).abono;
											 monedero=results.rows.item(i).monedero;
											 debeahora=results.rows.item(i).debeahora;
											 fechaventa=results.rows.item(i).fecha;

								 }

			 }, null);
			 });
			}

							return esperar1Seg();
			 })
			 .then(() => {
				 var meses = new Array ("Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic");
		var diasSemana = new Array("Do","Lu","Ma","Mi","Ju","Vi","Sa");
		var f=new Date();
		var date=diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
				 var strText = "Folio :"+folio+"    Fecha "+fechaventa;
				 var strSize=1;
				 var strAlign=0;
				  if(noImpresora==1){
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "Cliente:"+nombre+"\nLugar: "+direccion;
						var strSize=1;
						var strAlign=0;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: XXXXXX' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



			 	return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "------------------------------------------------";
						var strSize=1;
						var strAlign=0;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



				return esperar1Seg();
			 })
			 .then(() => {
		 if(noImpresora==1){
			 var sql='select codigo,nombre,precioFinal,cantidad,(cantidad*precioFinal) as total,ventaproductos.id as id, ventaproductos.descuentoDinero as dinero,ventaproductos.descuentoPorcentaje as porcentaje,sum(ventaproductos.descuentoDinero) as descuentoefe,sum(ventaproductos.descuentoPorcentaje) as descuentopor,ventaproductos.precio as real from ventaproductos inner join productos on ventaproductos.idProducto=productos.idRemoto where ventaproductos.foliolocal="'+folio+'" GROUP by ventaproductos.id';
			 console.log(sql)
			 myDB.transaction(function(transaction) {
					 transaction.executeSql(sql, [], function(tx, results) {
							 var len = results.rows.length,i;
							 console.log(len)
							 var html ='';
							 totalImprime=0;
										 for (i = 0; i < len; i++) {

											 var strText = "Codigo :"+results.rows.item(i).codigo+" Prod :"+palabras(results.rows.item(i).nombre,22)+" \n"+palabras("Cant: "+results.rows.item(i).cantidad,10)+"      pu: "+palabras("$"+results.rows.item(i).precioFinal,10)+"    t: $"+palabras(results.rows.item(i).total,6);
												var strSize=1;
												var strAlign=0;
												BTPrinter.printTextSizeAlign(function (data) {

													window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
												}, function (err) {
													console.error('printTextSizeAlign: ' + err);
													window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
												}, strText, strSize, strAlign);
											totalImprime=totalImprime+results.rows.item(i).total;
								 }

			 }, null);
			 });
		 }

		return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "Subtotal :$"+totalImprime;
						var strSize=1;
						var strAlign=2;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



				return esperar1Seg();
			 })
			 .then(() => {
					if(noImpresora==1){
						var ivaim=((totalImprime*1.16)-totalImprime);
						var strText = "IVA :$"+ivaim.toFixed(2);
						var strSize=1;
						var strAlign=2;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var totalimr=(totalImprime*1.16)
						var strText = "Total a pagar :$"+totalimr.toFixed(2);

			 		 var strSize=1;
			 		 var strAlign=2;
			 		 BTPrinter.printTextSizeAlign(function (data) {
			 			 console.log('printTextSizeAlign: ' + data);
			 			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
			 		 }, function (err) {
			 			 console.error('printTextSizeAlign: ' + err);
			 			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
			 		 }, strText, strSize, strAlign);
					}



				return esperar1Seg();
			 })
			 .then(() => {
					if(noImpresora==1){
						var strText = "VENTA DE CONTADO";
						if(tipoventa==1){
							strText = "VENTA DE CREDITO";
						}
						var strSize=1;
						var strAlign=1;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "GRACIAS POR SU PREFERENCIA";
						var strSize=1;
						var strAlign=1;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);
					}



				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "PARA VISUALIZAR NUESTRO CATALOGO ESCANEE EL\n CODIGO SIGUIENTE";
			 		 var strSize=1;
			 		 var strAlign=1;
			 		 BTPrinter.printTextSizeAlign(function (data) {
			 			 console.log('printTextSizeAlign: ' + data);
			 			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
			 		 }, function (err) {
			 			 console.error('printTextSizeAlign: ' + err);
			 			 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
			 		 }, strText, strSize, strAlign);

					}



				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var data = "bit.ly/3iyNg1Z";
						var align = 1;
						var model = 49;
						var size = 49;
						var eclevel = 50;
						BTPrinter.printQRCode(function (data) {
							console.log('printQRCode:' + data);
							window.plugins.toast.showLongBottom('printQRCode:' + data);
						}, function (err) {
							console.error('printQRCode:' + err);
							window.plugins.toast.showLongBottom('printQRCode:' + err);
						}, data, align, model, size, eclevel);

					}



				return esperar1Seg();
			 })
			 .then(() => {
				  if(noImpresora==1){
						var strText = "\n\n\n";
						var strSize=1;
						var strAlign=1;
						BTPrinter.printTextSizeAlign(function (data) {
							console.log('printTextSizeAlign: ' + data);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
						}, function (err) {
							console.error('printTextSizeAlign: ' + err);
							window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
						}, strText, strSize, strAlign);

					}



				return esperar1Seg();
			 })
		 .then(() => {
			  if(noImpresora==1){
					BTPrinter.disconnect(function (data) {
			 		 console.log('disconnect: ' + data);
			 		 window.plugins.toast.showLongBottom('DESCONECTAMOS: ' + data);
			 	 }, function (err) {
			 		 console.error('disconnect: ' + err);
			 		 window.plugins.toast.showLongBottom('disconnect: ' + err);
			 	 });

				}

		 })

			}


			//////siguiente llave termina impresion
		}
		function palabras(palabra,corta){
			if(palabra.length<corta){
				for (var i = palabra.length; i < corta; i++) {
						palabra=palabra+" ";
				}
			}
			if(palabra.length>corta){
				palabra=palabra.substring(0, corta);
			}
			return palabra
		}

}

function onPause() {
	// TODO: This application has been suspended. Save application state here.
}

function onResume() {
	// TODO: This application has been reactivated. Restore application state here.
}



/* Initialize app */
app.initialize();
