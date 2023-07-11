//sessionStorage.setItem("nombre", "Gonzalo");
//console.log(sessionStorage.getItem("nombre"))
//sessionStorage.removeItem("nombre");
var noImpresora=1;
var myDB;
var servidor="sistema.fels.com.mx";
var conn = false;
var myDB;
var nombre;
var direccion;
var folioelimina=0;
var tipoventa;
var abono;
var monedero;
var debeahora;
var fechaventa;
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

    }

    var failure = function() {
			conn = false

    }

function onDeviceReady() {
const esperar1Seg = () => new Promise(resolve => setTimeout(resolve, 100));
esperar1Seg()
.then(() => {
myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
return esperar1Seg();

})
.then(() => {
  cargadatos("");
	return esperar1Seg();
})


$("#pendientes").on("click", ".btncontinua", function(){
    folioelimina=$(this).attr("data-folio");
    esperar1Seg()
    .then(() => {
      imprimir(folioelimina)
      return esperar1Seg();
    })

});
$("#txtBuscar").keyup(function(){
	cargadatos($(this).val())
})
function cargadatos(folio){
  myDB.transaction(function(transaction) {
		var sql;
		if(folio==""){
			sql='select nombre||" "||apellido as nombre,foliolocal,total,tipoventa,fecha from folios  inner join clientes on clientes.idRemoto=folios.idCliente where folios.estado=1 order by id desc';

		}else{
			sql='select nombre||" "||apellido as nombre,foliolocal,total,tipoventa,fecha from folios  inner join clientes on clientes.idRemoto=folios.idCliente where foliolocal="'+folio+'"';
		}
		console.log(sql)
      transaction.executeSql(sql, [], function(tx, results) {
          var len = results.rows.length,i;
          var html ='';
                for (i = 0; i < len; i++) {
									var tipo='Contado';
									var fecha=results.rows.item(i).fecha;
									var cortado=fecha.slice(5,10);
									var mes=cortado.slice(0,2);
									var dia=cortado.slice(2,5);
									var mestexto='';
									if(mes=='01'){mestexto='Ene'};if(mes=='02'){mestexto='Feb'};if(mes=='03'){mestexto='Mar'};if(mes=='04'){mestexto='Abr'};if(mes=='05'){mestexto='May'};
									if(mes=='06'){mestexto='Jun'};if(mes=='07'){mestexto='Jul'};if(mes=='08'){mestexto='Ago'};if(mes=='09'){mestexto='Sep'};if(mes=='10'){mestexto='Oct'};
									if(mes=='11'){mestexto='Nom'};if(mes=='12'){mestexto='Dic'};
									var fechaarmada=mestexto+dia;
									if(results.rows.item(i).tipoventa==1){tipo='Credito'}
                  html=html+'<div class="container"><div class="row g-3" align="center"><div class="col-8" style="padding-top: 3%"><p><b>'+fechaarmada+' <-> '+tipo+'</b></p><p>Cliente: <b>'+results.rows.item(i).nombre+'</b></p><p>Folio: <b>'+results.rows.item(i).foliolocal+'</b></p><p>Total : $<b>'+results.rows.item(i).total+'</b></p></div><div class="col-4"><a class="btn m-1 btn-sm btn-creative btn-success btncontinua"  data-folio="'+results.rows.item(i).foliolocal+'" href="#"><span class="fas fa-print"></span>Imprimir</a></div><hr></div></div>';
                }
                  $("#pendientes").html(html);
  }, null);
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
				if(abono>0&&tipoventa==1){
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
