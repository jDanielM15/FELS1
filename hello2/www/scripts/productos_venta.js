var reimprimirdos=1;
var noImpresora=1;
var myDB;
var idUsuario;
var folio;
var descuentoefe=0;
var descuentopor=0;
var totalImprime=0;
var idcliente=0;
var monedero=0;
var pagar=0;
var iddelcliente="";
var nombre="";
var monederogeneral=0;
var creditogeneral=0;
var debe=0;
var direccion="";
var sumatotalpagarmone=0;
var sumatotalpagarmone2=0;
var deberemos=0;
var pdfOutput;
var bono=0;
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

function onDeviceReady() {
	folio=sessionStorage.getItem("folio");
	idUsuario=sessionStorage.getItem("idUsuario");
	myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
 const esperar1Seg = () => new Promise(resolve => setTimeout(resolve, 300));
 esperar1Seg()
 .then(() => {
	 cargaproductos(folio);
 	return esperar1Seg();
 })
 .then(() => {
	 datoscliente(folio)
 	return esperar1Seg();
 })
 .then(() => {
	 sumatotal(folio)
 	return esperar1Seg();
 })
 .then(() => {
   myDB.transaction(function(transaction) {
       transaction.executeSql('SELECT * FROM "categorias" where estado=1 ', [], function(tx, results) {
           var len = results.rows.length,i;
           var html ='<option value="0" selected>Seleccionar Categoria</option>';
                 for (i = 0; i < len; i++) {
                   html=html+'<option value="'+results.rows.item(i).idRemoto+'">'+results.rows.item(i).categoria+'</option>';
                   }
                   $("#selectCategorias").html(html);
   }, null);
   });
 	return esperar1Seg();
 })

$("#conteinerproductos").on("click", ".btnagrega", function(){
	esperar1Seg()
	.then(() => {
		$("#exampleModalLabel").html("Agregar "+$(this).attr("data-nombre"));
		$("#idProducto").val($(this).attr("data-idproducto"))
		$("#precio").val($(this).attr("data-precio"))
		return esperar1Seg();
	})
	.then(() => {
		total($("#idProducto").val(),$("#idFolio").val())
		return esperar1Seg();
	})
});
$("#btndescuentotodoefec").click(function (){
	descuentotodosefe($("#txtdescuentofijo").val());
});
$("#btndescuentotodopor").click(function (){
	descuentoporcentajetodos($("#txtdescuentofijo").val());
});
//  $("#btnguardar").click(function (){
// 	 esperar1Seg()
// 	 .then(() => {
// 		 insertaproductos($("#idFolio").val(),$("#idProducto").val(),$("#txtcantidad").val(),$("#precio").val());
// 		 return esperar1Seg();
// 	 })
// });


$("#productosvender").on("click", ".btnsuma", function(){
	sumaproductos($(this).attr("data-id"))
});
$("#productosvender").on("click", ".btnresta", function(){
	restaproductos($(this).attr("data-id"),$(this).attr("data-cantidad"))
});
$("#productosvender").on("click", ".btndescuentoefe", function(){


		descuentoefectivo($(this).attr("data-id"),$("#txtdescuento"+$(this).attr("data-id")).val())

});

$("#productosvender").on("click", ".btndescuentoporce", function(){
	descuentoporcentaje($(this).attr("data-id"),$("#txtdescuento"+$(this).attr("data-id")).val(),$(this).attr("data-precio"))

});
$("#productosvender").on("click", ".btndescuentototalefe", function(){
	descuentoefectivototal($(this).attr("data-id"),$(this).attr("data-cantidad"),$("#txtdescuento"+$(this).attr("data-id")).val())

});
$("#productosvender").on("click", ".pulso", function(){
//$(this).attr("data-id")




});
$("#txtabono").keyup(function(){

	 deberemos=debe+(sumatotalpagarmone-$(this).val());
	if(deberemos<0){
		$(this).val("")
		Swal.fire({
	  icon: 'warning',
	  title: 'No puedes realizar esta operacion'
	})
	sumatotal(folio)
	}else{
		$("#labeltotaldespues").html(deberemos.toFixed(2))
	}

});
$("#btntermina").click(function(){
$("#botonesPrincipales").css("display", "none");
$("#botonRegresaInicio").css("display", "none");
sessionStorage.setItem("tipoVenta","0");
window.location.href = "venta.html";
	//imprimir(folio)
});

$("#btn-info").click(function(){
	$("#botonesPrincipales").css("display", "none");
	$("#botonRegresaInicio").css("display", "none");
	sessionStorage.setItem("tipoVenta","1");
	window.location.href = "venta.html";
	//  imprimircredito(folio)
});

$("#btnguarda").click(function(){
	if($("#selectguardar").val()==0){
			window.location.href = "menu.html";
	}else{
		$("#botonesPrincipales").css("display", "none");
		$("#botonRegresaInicio").css("display", "none");
		sessionStorage.setItem("tipoVenta","2");
		window.location.href = "venta.html";




	}
});

function imprimircredito(folio){
	if (typeof (BTPrinter) === 'undefined') {
		// Error: plugin not installed
		//console.error('Error: BTPrinter plugin not detected');
		alert('OCURRIO UN ERROR MAYOR NO SE PUEDE IMPRIMIR');
	//	window.plugins.toast.showLongBottom('BTPrinter plugin not detected');
	} else {
		esperar1Seg()
 	 .then(() => {
		 var strPrinter=sessionStorage.getItem("impresora");
		 console.log(strPrinter)
		 BTPrinter.connect(function (data) {
			// console.log("conecta")
			// window.plugins.toast.showLongBottom('CONECTA: ' + data);
		 }, function (err) {
			 Swal.fire(
	 'No se detecto impresora!',
	 'Se guardara la venta intenta reimprimir',
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
		 var meses = new Array ("Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic");
var diasSemana = new Array("Do","Lu","Ma","Mi","Ju","Vi","Sa");
var f=new Date();
var date=diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
var strText = "Folio :"+sessionStorage.getItem("idDispositivo")+folio+"      "+date;
if(reimprimirdos==1){
	strText = "Folio :"+sessionStorage.getItem("idDispositivo")+folio+"      "+date;
}else{
strText = "Folio :"+folio+"      "+date;

}

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
		 var strText = "Cliente:"+nombre+"\nLugar: "+direccion;
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
		 var strText = "------------------------------------------------------------------------";
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
			myDB.transaction(function(transaction) {
					transaction.executeSql(sql, [], function(tx, results) {
							var len = results.rows.length,i;
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
		 var strText = "Total :$"+totalImprime;
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
				 var strText = "Monedero (-):$"+monedero;
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

		 var strText = "Saldo pendiente (+):$"+debe;
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
		 bono=$("#txtabono").val();
		 if(noImpresora==1){

			if(bono==""){bono=0}
		 var strText = "Abono (-): $"+bono;
		 var strSize=1;
		 var strAlign=2;
		 BTPrinter.printTextSizeAlign(function (data) {

		 }, function (err) {

		 }, strText, strSize, strAlign);
	 }


		return esperar1Seg();
	 })
	 .then(() => {
		 if(noImpresora==1){

		 var strText = "Total a liquidar :$"+deberemos;
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
		 var strText = "PAGO A CREDITO";
		 if(deberemos==0){ strText = "PAGO DE CONTADO";}

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
return esperar1Seg();

 })
 .then(() => {
	 	if(monedero>=totalImprime){
			if(reimprimirdos==1){
			monedero=monedero-totalImprime;
			myDB.transaction(function(transaction) {
		 var executeQuery = 'UPDATE "clientes" SET "monedero"='+monedero+' WHERE idRemoto="'+idcliente+'"';
		 				console.log(executeQuery)
					 transaction.executeSql(executeQuery, function(tx, result) {
						 },
							 function(error) {

							 });
			 });
		 }
		}else{
			if(reimprimirdos==1){
			myDB.transaction(function(transaction) {
		 var executeQuery = 'UPDATE "clientes" SET "monedero"="0" WHERE idRemoto="'+idcliente+'"';
		 console.log(executeQuery)
					 transaction.executeSql(executeQuery, function(tx, result) {
						 },
							 function(error) {

							 });
			 });
}
		}
		return esperar1Seg();
 })
 .then(() => {
	 if(reimprimirdos==1){
	 var executeQuery = 'UPDATE "folios" SET "estado"="1",foliolocal="'+sessionStorage.getItem("idDispositivo")+folio+'","total"='+sumatotalpagarmone2+', "tipoventa"="1", "abono"="'+bono+'", "monedero"="'+monedero+'", "debeahora"="'+deberemos+'" WHERE id="'+folio+'"';
	 myDB.transaction(function(transaction) {

				 transaction.executeSql(executeQuery, function(tx, result) {
					 },
						 function(error) {});
		 });
	 }
		 return esperar1Seg();
 })
 .then(() => {
if(reimprimirdos==1){
	myDB.transaction(function(transaction) {
	var executeQuery = 'UPDATE "ventaproductos" SET foliolocal="'+sessionStorage.getItem("idDispositivo")+folio+'" WHERE foliolocal="'+folio+'"';
	console.log(executeQuery)
				transaction.executeSql(executeQuery, function(tx, result) {
					},
						function(error) {});
		});
	}
		return esperar1Seg();
 })
 .then(() => {
if(reimprimirdos==1){
	 myDB.transaction(function(transaction) {
	 var executeQuery = 'UPDATE "clientes" SET "debe"='+deberemos+' WHERE idRemoto="'+iddelcliente+'"';
	 console.log(executeQuery)
				 transaction.executeSql(executeQuery, function(tx, result) {
					 },
						 function(error) {});
		 });
	 }
		 return esperar1Seg();
 })
 .then(() => {
	 let options = { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' };
let formatter = new Intl.DateTimeFormat([], options);
let date = formatter.format(new Date()).replace(/\//g, '-');
date = date.split("-").reverse().join("-");

	 var fechita = date;
	if(monedero>=totalImprime){
		if(reimprimirdos==1){
		var diferiencia=monedero-totalImprime;
		var usemonedero=monedero-diferiencia;
		myDB.transaction(function(transaction) {
		var executeQuery = 'INSERT INTO "monedero"("idCliente","cantidad","fecha","tipo") VALUES ("'+iddelcliente+'","'+idUsuario+'","'+usemonedero+'","'+fechita+'","0");';
		console.log(executeQuery)
					transaction.executeSql(executeQuery, function(tx, result) {
						},
							function(error) {});
			});
		}
	}else{
		if(reimprimirdos==1){
		myDB.transaction(function(transaction) {
	 var executeQuery = 'INSERT INTO "monedero"("idCliente","cantidad","fecha","tipo") VALUES ("'+iddelcliente+'","'+idUsuario+'","'+monedero+'","'+fechita+'","0");';
	 console.log(executeQuery)
				 transaction.executeSql(executeQuery, function(tx, result) {
					 },
						 function(error) {

						 });
		 });
	 }

	}

		return esperar1Seg();
 })
 .then(() => {return esperar1Seg();})
 .then(() => {
	 if(reimprimirdos==1){
		 let options = { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' };
	let formatter = new Intl.DateTimeFormat([], options);
	let date = formatter.format(new Date()).replace(/\//g, '-');
	date = date.split("-").reverse().join("-");

		 var fechita = date;
	myDB.transaction(function(transaction) {
	var executeQuery = 'INSERT INTO "creditos"("idRemoto","idfolio","idfolioremoto","idCliente","cantidad","fecha","tipo") VALUES ("0","'+sessionStorage.getItem("idDispositivo")+folio+'","0","'+iddelcliente+'","'+totalImprime+'","'+fechita+'","0")';
	console.log(executeQuery)
				transaction.executeSql(executeQuery, function(tx, result) {
					},
						function(error) {});
		});
	}
		return esperar1Seg();
 })
 .then(() => {return esperar1Seg();})
 .then(() => {
	if(reimprimirdos==1){
		let options = { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' };
 let formatter = new Intl.DateTimeFormat([], options);
 let date = formatter.format(new Date()).replace(/\//g, '-');
 date = date.split("-").reverse().join("-");

 	 var fechita = date;
	 if(bono>0){
		 myDB.transaction(function(transaction) {
		 var executeQuery = 'INSERT INTO "creditos"("idRemoto","idfolio","idfolioremoto","idCliente","cantidad","fecha","tipo") VALUES ("0","'+sessionStorage.getItem("idDispositivo")+folio+'","0","'+iddelcliente+'","'+bono+'","'+fechita+'","1")';
		 console.log(executeQuery)
					transaction.executeSql(executeQuery, function(tx, result) {
						},
							function(error) {});
			});


	 }

 }
	 return esperar1Seg();
 })
 .then(() => {return esperar1Seg();})
 .then(() => {
	if(reimprimirdos==1){
		reimprimirdos=0;
			window.location.href = "menu.html";
		//imprimircredito(sessionStorage.getItem("idDispositivo")+folio);
return esperar1Seg();
	}else{
			window.location.href = "menu.html";
		}

 })

	}


	//////siguiente llave termina impresion
}

function imprimir(folio){
	if (typeof (BTPrinter) === 'undefined') {
		// Error: plugin not installed
	//	console.error('Error: BTPrinter plugin not detected');
		alert('OCURRIO UN ERROR MAYOR NO SE PUEDE IMPRIMIR');
	//	window.plugins.toast.showLongBottom('BTPrinter plugin not detected');
	} else {
		esperar1Seg()
 	 .then(() => {
		 var strPrinter=sessionStorage.getItem("impresora");
		 console.log(strPrinter)
		 BTPrinter.connect(function (data) {
			 console.log("conecta")
			// window.plugins.toast.showLongBottom('CONECTA: ' + data);
		 }, function (err) {
			 Swal.fire(
  'No se detecto impresora!',
  'Se guardara la venta intenta reimprimir',
  'error'
)
			 noImpresora=0;
			 console.log("ERROR : "+err)
			// window.plugins.toast.showLongBottom('connect: ' + err);
		 }, strPrinter);
 		 return esperar1Seg();
 	 })
	 .then(() => {
		 if(noImpresora==1){
			 var printBase64 = $('#logo').val();
			 var strAlign = 0;
			 BTPrinter.printBase64(function (data) {
				 console.log('printBase64: ' + data);
				// window.plugins.toast.showLongBottom('printBase64: ' + data);
			 }, function (err) {
				 console.error('printBase64: ' + err);
				// window.plugins.toast.showLongBottom('printBase64: ' + err);
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
			//	window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
			}, function (err) {
				console.error('printTextSizeAlign: ' + err);
//window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
			}, strText, strSize, strAlign);

		 }



	 	return esperar1Seg();
	 })
	 .then(() => {
		 if(noImpresora==1){
			 var meses = new Array ("Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic");
	var diasSemana = new Array("Do","Lu","Ma","Mi","Ju","Vi","Sa");
	var f=new Date();
	var date=diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
			 var strText;
			 if(reimprimirdos==1){strText = "Folio :"+sessionStorage.getItem("idDispositivo")+folio+"      "+date;}else{
				 strText = "Folio :"+folio+"      "+date;
			 }
			 var strSize=1;
			 var strAlign=0;
			 BTPrinter.printTextSizeAlign(function (data) {
				 console.log('printTextSizeAlign: ' + data);
				// window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
			 }, function (err) {
				 console.error('printTextSizeAlign: ' + err);
				// window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
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
				 console.log('printTextSizeAlign: ' + data);
				 //window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
			 }, function (err) {
				 console.error('printTextSizeAlign: ' + err);
				 //window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
			 }, strText, strSize, strAlign);

		 }



	 	return esperar1Seg();
	 })
	 .then(() => {
		 if(noImpresora==1){
			 var strText = "---------------------------------------------------------------------------------------------";
			 var strSize=1;
			 var strAlign=0;
			 BTPrinter.printTextSizeAlign(function (data) {
				 console.log('printTextSizeAlign: ' + data);
				// window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
			 }, function (err) {
				 console.error('printTextSizeAlign: ' + err);
			//	 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
			 }, strText, strSize, strAlign);

		 }



		return esperar1Seg();
	 })
	 .then(() => {

			 var sql='select codigo,nombre,precioFinal,cantidad,(cantidad*precioFinal) as total,ventaproductos.id as id, ventaproductos.descuentoDinero as dinero,ventaproductos.descuentoPorcentaje as porcentaje,sum(ventaproductos.descuentoDinero) as descuentoefe,sum(ventaproductos.descuentoPorcentaje) as descuentopor,ventaproductos.precio as real from ventaproductos inner join productos on ventaproductos.idProducto=productos.idRemoto where ventaproductos.foliolocal="'+folio+'" GROUP by ventaproductos.id';
			 myDB.transaction(function(transaction) {
					 transaction.executeSql(sql, [], function(tx, results) {
							 var len = results.rows.length,i;
							 var html ='';
							 totalImprime=0;
										 for (i = 0; i < len; i++) {
											 if(noImpresora==1){
											 var strText = "Codigo :"+results.rows.item(i).codigo+" Prod :"+palabras(results.rows.item(i).nombre,22)+" \n"+palabras("Cant: "+results.rows.item(i).cantidad,10)+"      pu: "+palabras("$"+results.rows.item(i).precioFinal,10)+"    t: $"+palabras(results.rows.item(i).total,6);
											var strSize=1;
												var strAlign=0;
												BTPrinter.printTextSizeAlign(function (data) {
													console.log('printTextSizeAlign: ' + data);
												//	window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
												}, function (err) {
													console.error('printTextSizeAlign: ' + err);
													//window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
												}, strText, strSize, strAlign);
											}
											totalImprime=totalImprime+results.rows.item(i).total;
								 }

			 }, null);
			 });


		return esperar1Seg();
	 })
	 .then(() => {
		 if(noImpresora==1){
			 var strText = "Subtotal :$"+totalImprime;
			 var strSize=1;
			 var strAlign=2;
			 BTPrinter.printTextSizeAlign(function (data) {
			 	console.log('printTextSizeAlign: ' + data);
			 //	window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
			 }, function (err) {
			 	console.error('printTextSizeAlign: ' + err);
			// 	window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
			 }, strText, strSize, strAlign);

		 }



		return esperar1Seg();
	 })
	 .then(() => {
		 if(noImpresora==1){
			 if(monedero>0){
				 var strText = "Monedero (-):$"+monedero;
				var strSize=1;
				var strAlign=2;
				BTPrinter.printTextSizeAlign(function (data) {
				 console.log('printTextSizeAlign: ' + data);
			 // 	window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
				}, function (err) {
				 console.error('printTextSizeAlign: ' + err);
			 // 	window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
				}, strText, strSize, strAlign);
			 }


		 }



		return esperar1Seg();
	 })
	 .then(() => {

			 pagar=totalImprime-monedero;
 		 if(pagar<0){pagar=0;}
 		 var strText = "Total a pagar :$"+pagar;
 		 var strSize=1;
 		 var strAlign=2;
		 if(noImpresora==1){
 		 BTPrinter.printTextSizeAlign(function (data) {
 			 console.log('printTextSizeAlign: ' + data);
 			// window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
 		 }, function (err) {
 			 console.error('printTextSizeAlign: ' + err);
 			// window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
 		 }, strText, strSize, strAlign);
	 }




		return esperar1Seg();
	 })
	 .then(() => {
		 if(noImpresora==1){
			 var strText = "PAGO DE CONTADO";
			var strSize=1;
			var strAlign=1;
			BTPrinter.printTextSizeAlign(function (data) {
				console.log('printTextSizeAlign: ' + data);
			//	window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
			}, function (err) {
				console.error('printTextSizeAlign: ' + err);
			//	window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
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
			//	 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
			 }, function (err) {
				 console.error('printTextSizeAlign: ' + err);
			//	 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
			 }, strText, strSize, strAlign);

		 }



		return esperar1Seg();
	 })
	 .then(() => {
		 if(noImpresora==1){
			 var strText = "PARA VISUALIZAR NUESTRO CATALOGO ESCANEE EL CODIGO SIGUIENTE";
			 var strSize=1;
			 var strAlign=1;
			 BTPrinter.printTextSizeAlign(function (data) {
				 console.log('printTextSizeAlign: ' + data);
			//	 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
			 }, function (err) {
				 console.error('printTextSizeAlign: ' + err);
			//	 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
			 }, strText, strSize, strAlign);

		 }



		return esperar1Seg();
	 })
	 .then(() => {
		 if(noImpresora==1){
			 var data = "bit.ly/3iyNg1Z";
			var align = 1;
			var model = 49;
			var size = 30;
			var eclevel = 50;
			BTPrinter.printQRCode(function (data) {
				console.log('printQRCode:' + data);
			//	window.plugins.toast.showLongBottom('printQRCode:' + data);
			}, function (err) {
				console.error('printQRCode:' + err);
			//	window.plugins.toast.showLongBottom('printQRCode:' + err);
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
			//	 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
			 }, function (err) {
				 console.error('printTextSizeAlign: ' + err);
				// window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
			 }, strText, strSize, strAlign);

		 }



		return esperar1Seg();
	 })
 .then(() => {
	 if(noImpresora==1){
		 BTPrinter.disconnect(function (data) {
			 console.log('disconnect: ' + data);
			// window.plugins.toast.showLongBottom('DESCONECTAMOS: ' + data);
		 }, function (err) {
			 console.error('disconnect: ' + err);
			// window.plugins.toast.showLongBottom('disconnect: ' + err);
		 });

	 }

 })
 .then(() => {
	 let options = { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' };
let formatter = new Intl.DateTimeFormat([], options);
let date = formatter.format(new Date()).replace(/\//g, '-');
date = date.split("-").reverse().join("-");

	 var fechita = date;
	if(monedero>=totalImprime){
		var diferiencia=monedero-totalImprime;
		var usemonedero=monedero-diferiencia;
		myDB.transaction(function(transaction) {
		var executeQuery = 'INSERT INTO "monedero"("idCliente","cantidad","fecha","tipo") VALUES ("'+iddelcliente+'","'+idUsuario+'","'+usemonedero+'","'+fechita+'","0");';
		console.log(executeQuery)
					transaction.executeSql(executeQuery, function(tx, result) {
						},
							function(error) {});
			});
	}else{
		myDB.transaction(function(transaction) {
	 var executeQuery = 'INSERT INTO "monedero"("idCliente","cantidad","fecha","tipo") VALUES ("'+iddelcliente+'","'+idUsuario+'","'+monedero+'","'+fechita+'","0");';
	 console.log(executeQuery)
				 transaction.executeSql(executeQuery, function(tx, result) {
					 },
						 function(error) {

						 });
		 });

	}

		return esperar1Seg();
 })
 .then(() => {
	 	if(monedero>=totalImprime){
			monedero=monedero-totalImprime;
			myDB.transaction(function(transaction) {
		 var executeQuery = 'UPDATE "clientes" SET "monedero"='+monedero+' WHERE idRemoto="'+idcliente+'"';
		 				console.log(executeQuery)
					 transaction.executeSql(executeQuery, function(tx, result) {
						 },
							 function(error) {

							 });
			 });
		}else{
			myDB.transaction(function(transaction) {
		 var executeQuery = 'UPDATE "clientes" SET "monedero"="0" WHERE idRemoto="'+idcliente+'"';
		 console.log(executeQuery)
					 transaction.executeSql(executeQuery, function(tx, result) {
						 },
							 function(error) {

							 });
			 });

		}
		return esperar1Seg();
 })
 .then(() => {
if(reimprimirdos==1){
	 myDB.transaction(function(transaction) {
	 var executeQuery = 'UPDATE "ventaproductos" SET "foliolocal"="'+sessionStorage.getItem("idDispositivo")+folio+'" WHERE foliolocal="'+folio+'"';
	 console.log(executeQuery)
				 transaction.executeSql(executeQuery, function(tx, result) {
					 },
						 function(error) {});
		 });
}

		 return esperar1Seg();
 })
 .then(() => {
if(reimprimirdos==1){
	myDB.transaction(function(transaction) {
	var executeQuery = 'UPDATE "folios" SET "estado"="1",foliolocal="'+sessionStorage.getItem("idDispositivo")+folio+'","total"='+pagar+', "tipoventa"="0", "monedero"="'+monedero+'" WHERE id="'+folio+'"';
	console.log(executeQuery)
				transaction.executeSql(executeQuery, function(tx, result) {
					},
						function(error) {});
		});

}

		return esperar1Seg();
 })

 .then(() => {
	 if(reimprimirdos==1){
		 reimprimirdos=0;
		 //imprimir(sessionStorage.getItem("idDispositivo")+folio);
		 window.location.href = "menu.html";
return esperar1Seg();
	 }else{
			 window.location.href = "menu.html";
		 }

 })

	}



}
function datoscliente(fol){
	var sql='select clientes.idRemoto as iddelcliente,clientes.nombre||'+"' '"+'||clientes.apellido as nombre,clientes.telefono as clientetelefono,clientes.monedero as monedero,credito,debe,balnearios.nombre ||'+"' '"+'||ruta as direccion  from folios inner join clientes on clientes.idRemoto=folios.idCliente inner join balnearios on clientes.balneario=balnearios.idRemoto inner join rutas on rutas.idRemoto=balnearios.idRuta where id="'+fol+'"';
	console.log(sql)
	myDB.transaction(function(transaction) {
			transaction.executeSql(sql, [], function(tx, results) {
					var len = results.rows.length,i;

								for (i = 0; i < len; i++) {
									 iddelcliente=results.rows.item(i).iddelcliente;
									 nombre=results.rows.item(i).nombre;

									 monederogeneral=results.rows.item(i).monedero;
									 clientetelefono=results.rows.item(i).clientetelefono;
									 creditogeneral=results.rows.item(i).credito;

									 debe=results.rows.item(i).debe;
									 direccion=results.rows.item(i).direccion;

									}
									$("#labelcredito").html("$"+creditogeneral.toFixed(2))
									$("#labeltotaldebe").html("$"+debe.toFixed(2))


	}, null);
	});

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
 function sumaproductos(id){

		 myDB.transaction(function(transaction) {
	  var executeQuery = 'UPDATE "ventaproductos" SET "cantidad"=cantidad+1 WHERE id="'+id+'"';
	  			transaction.executeSql(executeQuery, function(tx, result) {
	  				},
	  					function(error) {

	  					});
	  	});
	 cargaproductos(folio);
	 sumatotal(folio);
 }
 function descuentoporcentaje(id,descuento,precio){
	 console.log("id :"+id)
	 console.log("descuento :"+descuento)
	 console.log("Precio :"+precio)
	 var descuentoap=((descuento/100)*precio);
		 myDB.transaction(function(transaction) {

	  var executeQuery = 'UPDATE "ventaproductos" SET "precioFinal"=precio-('+descuentoap+'/cantidad) ,"descuentoDinero"="0", "descuentoPorcentaje"="'+descuento+'" WHERE id="'+id+'"';
		console.log(executeQuery)
	  			transaction.executeSql(executeQuery, function(tx, result) {
	  				},
	  					function(error) {

	  					});
	  	});
	 cargaproductos(folio);
	 sumatotal(folio);
 }
 function descuentoefectivo(id,descuento){

		 myDB.transaction(function(transaction) {

	  var executeQuery = 'UPDATE "ventaproductos" SET "precioFinal"=precio-'+descuento+' ,"descuentoPorcentaje"="0", "descuentoDinero"="'+descuento+'" WHERE id="'+id+'"';
	  			transaction.executeSql(executeQuery, function(tx, result) {
	  				},
	  					function(error) {

	  					});
	  	});
	 cargaproductos(folio);
	 sumatotal(folio);
 }
 function descuentoefectivototal(id,cantidad,descontar){
	 console.log("id ="+id)
	  console.log("cantidad ="+cantidad)
		 console.log("descontar ="+descontar)
	var descuento=descontar/cantidad;
			console.log("descuento "+descuento);
		myDB.transaction(function(transaction) {

	 var executeQuery = 'UPDATE "ventaproductos" SET "precioFinal"=precio-'+descuento.toFixed(2)+' ,"descuentoPorcentaje"="0", "descuentoDinero"="'+descuento+'" WHERE id="'+id+'"';
				 transaction.executeSql(executeQuery, function(tx, result) {
					 },
						 function(error) {

						 });
		 });
	cargaproductos(folio);
	sumatotal(folio);
 }
 function restaproductos(id,cantidad){

	 if(cantidad==1 || cantidad==0){
		 myDB.transaction(function(transaction) {
	  var executeQuery = 'DELETE FROM ventaproductos WHERE id= ("'+id+'")';

	  			transaction.executeSql(executeQuery, function(tx, result) {
	  				},
	  					function(error) {

	  					});
	  	});

	 }else{
		 myDB.transaction(function(transaction) {
	  var executeQuery = 'UPDATE "ventaproductos" SET "cantidad"=cantidad-1 WHERE id="'+id+'"';
	  			transaction.executeSql(executeQuery, function(tx, result) {
	  				},
	  					function(error) {

	  					});
	  	});

	 }

	 cargaproductos(folio);
	 sumatotal(folio);
 }
 function total(idproducto,folio){
	 myDB.transaction(function(transaction) {
			 transaction.executeSql('SELECT sum(cantidad*precio) as total, sum(cantidad) as cantidad FROM ventaproductos where idProducto="'+idproducto+'" and foliolocal='+folio, [], function(tx, results) {
					 var len = results.rows.length,i;
					 var html ='';
					 var total=0;
					 var cantidad=0;
								 for (i = 0; i < len; i++) {
									 if(results.rows.item(i).total>0){
										 total=results.rows.item(i).total;
									 }
									 if(results.rows.item(i).cantidad>0){
										 cantidad=results.rows.item(i).cantidad;
									 }

									 }
									 $("#labelcantidad").html(cantidad);
									 $("#labeltotal").html("$"+total.toFixed(2));
									 $("#ocultocantidad").val(cantidad)

	 }, null);
	 });
 }
 function sumatotal(folio){
	 var sql='select folios.idCliente as idcliente,clientes.monedero,sum(ventaproductos.descuentoDinero) as descuentoefe,sum(ventaproductos.descuentoPorcentaje) as descuentopor,(cantidad*precioFinal)as total from ventaproductos inner join folios on ventaproductos.foliolocal=folios.id inner join clientes on clientes.idRemoto=folios.idCliente where ventaproductos.foliolocal="'+folio+'" GROUP by ventaproductos.id';
	 console.log(sql)
	myDB.transaction(function(transaction) {
			transaction.executeSql(sql, [], function(tx, results) {
					var len = results.rows.length,i;
					var total =0;

					var total=0;
					var cantidad=0;
								for (i = 0; i < len; i++) {
									total=total+results.rows.item(i).total;
									monedero=results.rows.item(i).monedero;
									descuentoefe=descuentoefe+results.rows.item(i).descuentoefe;
									descuentopor=descuentopor+results.rows.item(i).descuentopor;
									idcliente=descuentopor+results.rows.item(i).idcliente;

									}
									 sumatotalpagarmone=total-monedero;
									 sumatotalpagarmone2=total;
									 if(sumatotalpagarmone<0){
										 sumatotalpagarmone=0;
									 }
									 deberemos=debe+sumatotalpagarmone;
									$("#labeltotal").html(sumatotalpagarmone.toFixed(2));
									$("#labeltotalventamodal").html(sumatotalpagarmone.toFixed(2));
									$("#labelmonedero").html(monedero.toFixed(2));
									$("#labeltotaldespues").html("$"+deberemos.toFixed(2))

	}, null);
	});
 }

 function subcategorias(idcategoria){
	 myDB.transaction(function(transaction) {
			 transaction.executeSql('SELECT * FROM "subcategorias" where idcategoria="'+idcategoria+'" and estado=1 ', [], function(tx, results) {
					 var len = results.rows.length,i;
					 var html ='<option value="0" selected>Seleccionar Subcategoria</option>';
								 for (i = 0; i < len; i++) {
									 html=html+'<option value="'+results.rows.item(i).idRemoto+'">'+results.rows.item(i).subcategoria+'</option>';
									 }
									 $("#selectSubcategoria").html(html);
	 }, null);
	 });
 }
 function cargaproductos(folio){
	 var sql='select precio,nombre,precioFinal,cantidad,(cantidad*precioFinal) as total,ventaproductos.id as id, ventaproductos.descuentoDinero as dinero,ventaproductos.descuentoPorcentaje as porcentaje,sum(ventaproductos.descuentoDinero) as descuentoefe,sum(ventaproductos.descuentoPorcentaje) as descuentopor,(ventaproductos.precio*ventaproductos.cantidad) as real from ventaproductos inner join productos on ventaproductos.idProducto=productos.idRemoto where ventaproductos.foliolocal="'+folio+'" GROUP by ventaproductos.id';
	 myDB.transaction(function(transaction) {
			 transaction.executeSql(sql, [], function(tx, results) {
					 var len = results.rows.length,i;
					 var html ='';
					 var descuentoxprod=0;
								 for (i = 0; i < len; i++) {

									 descuentoxprod=(results.rows.item(i).precio-results.rows.item(i).precioFinal);

									html=html+'<div class="container"><div class="row g-3" ><div class="col-12"><p><b class="pulso" data-id="'+results.rows.item(i).id+'">'+results.rows.item(i).nombre+'</b></p></div><div class="col-4"><p>Piezas: <b>'+results.rows.item(i).cantidad+'</b></p><p id="TAMBIEN" style="display:none">D: $<b>'+descuentoxprod.toFixed(2)+'</b></p></div><div class="col-4"><label >Precio:</label><p><b>$'+results.rows.item(i).precio+'</b></p><p id="TAMBIEN" style="color: orange;"><b>$'+(results.rows.item(i).precio-descuentoxprod)+'</b></p></div><div class="col-4"><p >Total: $<b>'+((results.rows.item(i).precio*results.rows.item(i).cantidad)-(descuentoxprod*results.rows.item(i).cantidad))+'</b></p></div><div class="col-3"><a class="btn m-2 btn-sm btn-creative btn-warning btnresta" data-cantidad="'+results.rows.item(i).cantidad+'"  data-id="'+results.rows.item(i).id+'" href="#">-</a></div><div class="col-6" ><input class="form-control" id="txtdescuento'+results.rows.item(i).id+'" type="number" placeholder=""></div><div class="col-3"><a class="btn m-2 btn-sm btn-creative btn-success btnsuma" data-id="'+results.rows.item(i).id+'" href="#">+</a></div> <div class="col-4" ><a class="btn m-2 btn-sm btn-creative btn-primary btndescuentoporce" data-id="'+results.rows.item(i).id+'" data-precio="'+results.rows.item(i).real+'" href="#">%</a></div><div class="col-4" ><a class="btn m-2 btn-sm btn-creative btn-secondary btndescuentototalefe" data-id="'+results.rows.item(i).id+'"  data-cantidad="'+results.rows.item(i).cantidad+'" data-total="'+results.rows.item(i).total+'"  href="#">$</a></div><div class="col-4"><a class="btn m-2 btn-sm btn-creative btn-success btndescuentoefe" data-descuentoefe="'+results.rows.item(i).descuentoefe+'" data-id="'+results.rows.item(i).id+'" href="#">T</a></div>  <hr></div></div>';

									 }
								 $("#productosvender").html(html);
	 }, null);
	 });
 }
 function descuentotodosefe(descuento){

	 		 myDB.transaction(function(transaction) {

	 	  var executeQuery = 'UPDATE "ventaproductos" SET "precioFinal"=precio-'+descuento+' ,"descuentoPorcentaje"="0", "descuentoDinero"="'+descuento+'" WHERE foliolocal="'+folio+'"';
	 	  			transaction.executeSql(executeQuery, function(tx, result) {
	 	  				},
	 	  					function(error) {

	 	  					});
	 	  	});
	 	 cargaproductos(folio);
	 	 sumatotal(folio);
 }
 function descuentoporcentajetodos(descuento){
	var descuentoap=((descuento/100));
		myDB.transaction(function(transaction) {
	 var executeQuery = 'UPDATE "ventaproductos" SET "precioFinal"=precio- ('+descuentoap+'*precio) ,"descuentoDinero"="0", "descuentoPorcentaje"="'+descuento+'" WHERE foliolocal="'+folio+'"';
	 console.log(executeQuery)
				 transaction.executeSql(executeQuery, function(tx, result) {
					 },
						 function(error) {

						 });
		 });
	cargaproductos(folio);
	sumatotal(folio);
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
