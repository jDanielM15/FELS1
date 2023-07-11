var reimprimirdos=1;
var noImpresora=1;
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
var ruta=0;
var balneario=0;
var myDB;
var usuario;
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
	 $("#idFolio").val(sessionStorage.getItem("folio"));
	 const folio = sessionStorage.getItem("folio");
	console.log("FOLIO: "+ folio);
	var venta = sessionStorage.getItem("tipoVenta");
	console.log("Tipo venta: "+venta);
	myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
 const esperar1Seg = () => new Promise(resolve => setTimeout(resolve, 500));
esperar1Seg()
.then(() => {
  myDB.transaction(function(transaction) {
		var sql='SELECT * FROM rutas where estado= "1" order by ruta asc';
		console.log(sql)
      transaction.executeSql(sql, [], function(tx, results) {
          var len = results.rows.length,i;
          var html ='<option value="0">Seleccione una Ruta</option>';
                for (i = 0; i < len; i++) {
                  html=html+'<option value="'+results.rows.item(i).idRemoto+'">'+results.rows.item(i).ruta+'</option>';
                  }
                  $("#defaultSelectRuta").html(html);
  }, null);
  });
	return esperar1Seg();
})
.then(() => {
  myDB.transaction(function(transaction) {
		var sql='SELECT * FROM rutabalneario';
		console.log(sql)
      transaction.executeSql(sql, [], function(tx, results) {
          var len = results.rows.length,i;

                for (i = 0; i < len; i++) {
										ruta=results.rows.item(i).ruta;
										balneario=results.rows.item(i).balneario;
                  }
                  $('#defaultSelectRuta > option[value="'+ruta+'"]').attr('selected', 'selected');
  }, null);
  });
	return esperar1Seg();
})
.then(() => {
  balnerios($("#defaultSelectRuta").val())
	return esperar1Seg();
})
.then(() => {
    $('#defaultSelect > option[value="'+balneario+'"]').attr('selected', 'selected');
	return esperar1Seg();
})
.then(() => {
	var sql='select * from clientes where estado =1';
  myDB.transaction(function(transaction) {
      transaction.executeSql(sql, [], function(tx, results) {
          var len = results.rows.length,i;
          var html ='';

                for (i = 0; i < len; i++) {
					if (venta==0) {
						html=html+'<div class="container"><tr><th style="padding-top: 4%" scope="row">'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+'('+results.rows.item(i).balne+')</th><td><a class="btn m-1 btn-sm btn-creative btn-success btnidir" data-idCliente="'+results.rows.item(i).idRemoto+'"><span class="fas fa-plus"></span> Vender</a></td></tr></div>';	
					}
					if (venta==1) {
					html=html+'<div class="container"><tr><th style="padding-top: 4%" scope="row">'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+'('+results.rows.item(i).balne+')</th><td><a class="btn m-1 btn-sm btn-creative btn-info btnCredito" data-idCliente="'+results.rows.item(i).idRemoto+'" data-bs-toggle="modal" data-bs-target="#bootstrapBasicModal" href="#"><span class="fas fa-credit-card"></span> Credito</a></td></tr></div>';
					}
					if (venta==2) {
						html=html+'<div class="container"><tr><th style="padding-top: 4%" scope="row">'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+'</th><td><a class="btn m-1 btn-sm btn-creative btn-primary btnCotiza" data-idCliente="'+results.rows.item(i).idRemoto+'"><span class="fas fa-save"></span>Cotizar</a></td></tr></div>';
						}
					//Anterior
                //   html=html+'<div class="container"><tr><th style="padding-top: 4%" scope="row">'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+
				//   '</th><td><a class="btn m-1 btn-sm btn-creative btn-success btnidir" data-idCliente="'+results.rows.item(i).idRemoto+'"><span class="fas fa-plus"></span> Vender</a></td>'+
				//   '<td><a class="btn m-1 btn-sm btn-creative btn-info btnConta" data-idCliente="'+results.rows.item(i).idRemoto+'"><span class="fas fa-plus"></span>Credito</a></td></tr></div>';

                  }
                  $("#divclientes").html(html);
  }, null);
  });
	return esperar1Seg();
})
.then(() => {
	clientesruta($("#defaultSelectRuta").val(),$("#defaultSelect").val())
	return esperar1Seg();
})


/////Buscar
$("#txtBuscar").keyup(function(){
	if($("#defaultSelect").val()=="0"){
		var sql='SELECT * FROM  clientes WHERE nombre LIKE "'+$("#txtBuscar").val()+'%"  or apellido LIKE "'+$("#txtBuscar").val()+'%"';
		console.log(sql)
		myDB.transaction(function(transaction) {
				transaction.executeSql(sql, [], function(tx, results) {
						var len = results.rows.length,i;
						var html ='';
									for (i = 0; i < len; i++) {
										if (venta==0) {
											html=html+'<div class="container"><tr><th style="padding-top: 4%" scope="row">'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+'('+results.rows.item(i).balne+')</th><td><a class="btn m-1 btn-sm btn-creative btn-success btnidir" data-idCliente="'+results.rows.item(i).idRemoto+'"><span class="fas fa-plus"></span> Vender</a></td></tr></div>';	
										}
										if (venta==1) {
										html=html+'<div class="container"><tr><th style="padding-top: 4%" scope="row">'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+'('+results.rows.item(i).balne+')</th><td><a class="btn m-1 btn-sm btn-creative btn-info btnCredito" data-idCliente="'+results.rows.item(i).idRemoto+'" data-bs-toggle="modal" data-bs-target="#bootstrapBasicModal" href="#"><span class="fas fa-credit-card"></span>Credito</a></td></tr></div>';
										}
										if (venta==2) {
											html=html+'<div class="container"><tr><th style="padding-top: 4%" scope="row">'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+'</th><td><a class="btn m-1 btn-sm btn-creative btn-primary btnCotiza" data-idCliente="'+results.rows.item(i).idRemoto+'"><span class="fas fa-save"></span>Cotización</a></td></tr></div>';
											}
										//ANTERIOR
										// html=html+'<div class="container"><tr><th style="padding-top: 4%" scope="row">'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+
										// '</th>  <td><a class="btn m-1 btn-sm btn-creative btn-success btnidir" data-idCliente="'+results.rows.item(i).idRemoto+'"><span class="fas fa-plus"></span> Vender</a></td></tr></div>';

										}
										$("#divclientes").html(html);
		}, null);
		});
	}else{
		var sql='SELECT * FROM  clientes WHERE  balneario="'+$("#defaultSelect").val()+'" and (nombre LIKE "'+$("#txtBuscar").val()+'%"  or apellido LIKE "'+$("#txtBuscar").val()+'%" )';
				console.log(sql)
		myDB.transaction(function(transaction) {
				transaction.executeSql(sql, [], function(tx, results) {
						var len = results.rows.length,i;
						var html ='';
									for (i = 0; i < len; i++) {
										if (venta==0) {
											html=html+'<div class="container"><tr><th style="padding-top: 4%" scope="row">'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+'('+results.rows.item(i).balne+')</th><td><a class="btn m-1 btn-sm btn-creative btn-success btnidir" data-idCliente="'+results.rows.item(i).idRemoto+'"><span class="fas fa-plus"></span> Vender</a></td></tr></div>';	
										}
										if (venta==1) {
										html=html+'<div class="container"><tr><th style="padding-top: 4%" scope="row">'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+'('+results.rows.item(i).balne+')</th><td><a class="btn m-1 btn-sm btn-creative btn-info btnCredito" data-idCliente="'+results.rows.item(i).idRemoto+'" data-bs-toggle="modal" data-bs-target="#bootstrapBasicModal" href="#"><span class="fas fa-credit-card"></span>Credito</a></td></tr></div>';
										}
										if (venta==2) {
											html=html+'<div class="container"><tr><th style="padding-top: 4%" scope="row">'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+'</th><td><a class="btn m-1 btn-sm btn-creative btn-primary btnCotiza" data-idCliente="'+results.rows.item(i).idRemoto+'"><span class="fas fa-save"></span>Cotización</a></td></tr></div>';
											}
										//ANTERIOR
										// html=html+'<div class="container"><tr><th style="padding-top: 4%" scope="row">'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+
										// '</th><td><a class="btn m-1 btn-sm btn-creative btn-success btnidir" data-idCliente="'+results.rows.item(i).idRemoto+'"><span class="fas fa-plus"></span> Vender</a></td></tr></div>';

										}
										$("#divclientes").html(html);
		}, null);
		});

	}
});
///// TERMINA BUSCAR
function insertaFolioNO(cliente,usuario){
	esperar1Seg()
	.then(() => {
		let options = { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' };
let formatter = new Intl.DateTimeFormat([], options);
let date = formatter.format(new Date()).replace(/\//g, '-');
date = date.split("-").reverse().join("-");

		var fechita = date;
		myDB.transaction(function(transaction) {
		var executeQuery = 'INSERT INTO "folios"("idRemoto","idCliente","idusuario","total","tipoventa","estado","fecha") VALUES ("0","'+cliente+'","'+usuario+'",0,0,0,"'+fechita+'")';
					console.log(executeQuery);
					transaction.executeSql(executeQuery, function(tx, result) {
						},
							function(error) {

							});
			});

		return esperar1Seg();
	})

}
//PAGO DE CONTADO
$("#divclientes").on("click", ".btnidir", function(){
	var cliente=$(this).attr("data-idCliente");
	esperar1Seg()
	.then(() => {
		myDB.transaction(function(transaction) {
			var sql='UPDATE folios SET idCliente="'+cliente+'" WHERE id="'+folio+'"';
			console.log("Actualizar cliente: "+sql);
	
				 transaction.executeSql(sql, function(tx, result) {
					 },
						 function(error) {
	
						 });
		 });
	
		return esperar1Seg();
	})
	esperar1Seg()
	.then(() => {
		myDB.transaction(function(transaction) {
			var sql='UPDATE folios SET idCliente="'+cliente+'" WHERE id="'+folio+'"';
			console.log("Actualizar cliente: "+sql);
	
				 transaction.executeSql(sql, function(tx, result) {
					 },
						 function(error) {
	
						 });
		 });
	
		return esperar1Seg();
	})
	esperar1Seg()
	.then(() => {
		myDB.transaction(function(transaction) {
			var sql='UPDATE folios SET idCliente="'+cliente+'" WHERE id="'+folio+'"';
			console.log("Actualizar cliente: "+sql);
	
				 transaction.executeSql(sql, function(tx, result) {
					 },
						 function(error) {
	
						 });
		 });
	
		return esperar1Seg();
	})
	.then(() => {
		datoscliente(cliente)
		return esperar1Seg();
	})
	.then(() => {
	if (venta == 0) {
		imprimir(folio)
	}

})
.then(() => {
	
	return esperar1Seg();
})
.then(() => {
	
	return esperar1Seg();
})
.then(() => {
	
	return esperar1Seg();
})
		.then(() => {
	
			return esperar1Seg();
		})
		.then(() => {
	
		//setTimeout('window.location = "index.html"', 500)
			return esperar1Seg();
		})
	});

//PAGO A CREDITO
$("#divclientes").on("click", ".btnCredito", function(){
	var cliente=$(this).attr("data-idCliente");
	esperar1Seg()
	.then(() => {
		myDB.transaction(function(transaction) {
			var sql='UPDATE folios SET idCliente="'+cliente+'" WHERE id="'+folio+'"';
			console.log("Actualizar cliente: "+sql);
	
				 transaction.executeSql(sql, function(tx, result) {
					 },
						 function(error) {
	
						 });
		 });
	
		return esperar1Seg();
	})
	esperar1Seg()
	.then(() => {
		myDB.transaction(function(transaction) {
			var sql='UPDATE folios SET idCliente="'+cliente+'" WHERE id="'+folio+'"';
			console.log("Actualizar cliente: "+sql);
	
				 transaction.executeSql(sql, function(tx, result) {
					 },
						 function(error) {
	
						 });
		 });
	
		return esperar1Seg();
	})
	esperar1Seg()
	.then(() => {
		myDB.transaction(function(transaction) {
			var sql='UPDATE folios SET idCliente="'+cliente+'" WHERE id="'+folio+'"';
			console.log("Actualizar cliente: "+sql);
	
				 transaction.executeSql(sql, function(tx, result) {
					 },
						 function(error) {
	
						 });
		 });
	
		return esperar1Seg();
	})
	.then(() => {
		datoscliente(cliente)
		return esperar1Seg();
	})

});	
$("#btnterminacredito").click(function(){

 imprimircredito(folio)
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

//Guardar Cotización
$("#divclientes").on("click", ".btnCotiza", function(){
	var cliente=$(this).attr("data-idCliente");
	let options = { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' };
	let formatter = new Intl.DateTimeFormat([], options);
	let date = formatter.format(new Date()).replace(/\//g, '-');
	date = date.split("-").reverse().join("-");
	
			var fechita = date;
	esperar1Seg()
	.then(() => {
		myDB.transaction(function(transaction) {
			var sql='UPDATE folios SET idCliente="'+cliente+'", fecha="'+fechita+'" WHERE id="'+folio+'"';
			console.log("Actualizar cliente: "+sql);
	
				 transaction.executeSql(sql, function(tx, result) {
					 },
						 function(error) {
	
						 });
		 });
	
		return esperar1Seg();
	})
	esperar1Seg()
	.then(() => {
		myDB.transaction(function(transaction) {
			var sql='UPDATE folios SET idCliente="'+cliente+'" WHERE id="'+folio+'"';
			console.log("Actualizar cliente: "+sql);
	
				 transaction.executeSql(sql, function(tx, result) {
					 },
						 function(error) {
	
						 });
		 });
	
		return esperar1Seg();
	})
	esperar1Seg()
	.then(() => {
		myDB.transaction(function(transaction) {
			var sql='UPDATE folios SET idCliente="'+cliente+'" WHERE id="'+folio+'"';
			console.log("Actualizar cliente: "+sql);
	
				 transaction.executeSql(sql, function(tx, result) {
					 },
						 function(error) {
	
						 });
		 });
	
		return esperar1Seg();
	})
	.then(() => {
		datoscliente(cliente)
		return esperar1Seg();
	})
	.then(() => {
	if (venta == 2) {
		generaPDF(folio)
	}

})
.then(() => {
	
	return esperar1Seg();
})
.then(() => {
	
	return esperar1Seg();
})
.then(() => {
	
	return esperar1Seg();
})
		.then(() => {
	
			return esperar1Seg();
		})
		.then(() => {
	
		//setTimeout('window.location = "index.html"', 500)
			return esperar1Seg();
		})
	});

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
// $("#divclientes").on("click", ".btnidir", function(){
// if (venta == 0) {
// 	imprimir(folio)
// }

// 	var idVenta=0;
// var cliente=$(this).attr("data-idCliente");
// 	esperar1Seg()
// 	.then(() => {

// 		sessionStorage.setItem("idCliente",cliente);
// 		usuario=sessionStorage.getItem("idUsuario");

// 		return esperar1Seg();
// 	})
// 	.then(() => {
// 		if(cliente==0){
// 			alert("Ocurrio un error Intenta nuevamente")
// 		}else{
// 			insertaFolio(cliente,usuario);
// 		}

// return esperar1Seg();

// 	})
// 	.then(() => {
// 		var sql='SELECT id FROM folios where idCliente= "'+cliente+'" and estado= "0" ORDER BY  id DESC limit 1';
// 		myDB.transaction(function(transaction) {
// 				transaction.executeSql(sql, [], function(tx, results) {
// 						var len = results.rows.length,i;
// 							for (i = 0; i < len; i++) {
// 										idVenta=results.rows.item(i).id;
// 										console.log("CONSULTA +"+results.rows.item(i).id)
// 							}

// 		}, null);
// 		});
// 		return esperar1Seg();
// 	})
// 	.then(() => {
// 		if(idVenta==0){
// 			var sql='SELECT id FROM folios where idCliente= "'+cliente+'" and estado= "0" ORDER BY  id DESC limit 1';
// 			myDB.transaction(function(transaction) {
// 					transaction.executeSql(sql, [], function(tx, results) {
// 							var len = results.rows.length,i;
// 								for (i = 0; i < len; i++) {
// 											idVenta=results.rows.item(i).id;
// 											console.log("CONSULTA +"+results.rows.item(i).id)
// 								}

// 			}, null);
// 			});

// 		}else{
// 			sessionStorage.setItem("folio",idVenta);
// 		}

// 		return esperar1Seg();
// 	})
// 	.then(() => {
// 		if(idVenta==0){
// 			var sql='SELECT id FROM folios where idCliente= "'+cliente+'" and estado= "0" ORDER BY  id DESC limit 1';
// 			myDB.transaction(function(transaction) {
// 					transaction.executeSql(sql, [], function(tx, results) {
// 							var len = results.rows.length,i;
// 								for (i = 0; i < len; i++) {
// 											idVenta=results.rows.item(i).id;
// 											console.log("CONSULTA +"+results.rows.item(i).id)
// 								}

// 			}, null);
// 			});

// 		}else{
// 			sessionStorage.setItem("folio",idVenta);
// 		}

// 		return esperar1Seg();
// 	})
// 	.then(() => {
// 		sessionStorage.setItem("folio",idVenta);
// 		return esperar1Seg();
// 	})
// 	.then(() => {
// 		sessionStorage.setItem("folio",idVenta);
// 		return esperar1Seg();
// 	})
// 	.then(() => {

// 		return esperar1Seg();
// 	})
// 	.then(() => {

// 		setTimeout('window.location = "index.html"', 500)
// 		return esperar1Seg();
// 	})
// });
$("#defaultSelectRuta").change(function(){
	esperar1Seg()
	.then(() => {
		var sql='SELECT * FROM rutabalneario ';
		myDB.transaction(function(transaction) {
				transaction.executeSql(sql, [], function(tx, results) {
						var len = results.rows.length,i;
						if(len==0){
							var executeQuery = 'INSERT INTO "rutabalneario"("ruta") VALUES ("'+$("#defaultSelectRuta").val()+'")';
							console.log(executeQuery);
							myDB.transaction(function(transaction) {
								transaction.executeSql(executeQuery, function(tx, result) {},
											function(error) {});
							});

						}else{

							var executeQuery = 'UPDATE rutabalneario SET ruta="'+$("#defaultSelectRuta").val()+'" WHERE id="1"';
							console.log(executeQuery);
							myDB.transaction(function(transaction) {
								transaction.executeSql(executeQuery, function(tx, result) {},
											function(error) {});
							});
						}


		}, null);
		});

		return esperar1Seg();
	})
	.then(() => {
		balnerios($(this).val())
		return esperar1Seg();
	})
	.then(() => {
		clientesruta($(this).val(),"")
		return esperar1Seg();
	})

});
$("#defaultSelect").change(function(){
	esperar1Seg()
	.then(() => {
		var executeQuery = 'UPDATE rutabalneario SET balneario="'+$("#defaultSelect").val()+'" WHERE id="1"';
		console.log(executeQuery);
		myDB.transaction(function(transaction) {
			transaction.executeSql(executeQuery, function(tx, result) {},
						function(error) {});
		});

		return esperar1Seg();
	})
	.then(() => {
		clientesruta($("#defaultSelectRuta").val(),$(this).val())
		return esperar1Seg();
	})

});
$("#btnregresar").click(function(){setTimeout('window.location = "productos_venta.html"', 500)});
function balnerios(id){
	myDB.transaction(function(transaction) {
		var sql='SELECT * FROM balnearios where estado=1 and idRuta='+id+' order by nombre asc';
		console.log(sql)
			transaction.executeSql(sql, [], function(tx, results) {
					var len = results.rows.length,i;
					var html ='<option value="0">Seleccione un Balneario</option>';
								for (i = 0; i < len; i++) {
									html=html+'<option value="'+results.rows.item(i).idRemoto+'">'+results.rows.item(i).nombre+'</option>';
									}
									$("#defaultSelect").html(html);
	}, null);
	});
}

//SE AGREGO A CONTINUACION
function datoscliente(fol){
	var sql='select clientes.idRemoto as iddelcliente,clientes.nombre||'+"' '"+'||clientes.apellido as nombre,clientes.telefono as clientetelefono,clientes.monedero as monedero,credito,debe,balnearios.nombre ||'+"' '"+'||ruta as direccion  from folios inner join clientes on clientes.idRemoto=folios.idCliente inner join balnearios on clientes.balneario=balnearios.idRemoto inner join rutas on rutas.idRemoto=balnearios.idRuta where clientes.idRemoto="'+fol+'"';
	console.log("Datos cliente: "+sql)
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
			 window.plugins.toast.showLongBottom('CONECTA: ' + data);
		 }, function (err) {
			 Swal.fire(
  'No se detecto impresora!',
  'Se guardara la venta intenta reimprimir',
  'error'
)
			 noImpresora=0;
			 console.log("ERROR : "+err)
			 window.plugins.toast.showLongBottom('connect: ' + err);
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
			 var strText;
			 if(reimprimirdos==1){strText = "Folio :"+sessionStorage.getItem("idDispositivo")+folio+"      "+date;}else{
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
			 var strText = "---------------------------------------------------------------------------------------------";
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
													window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
												}, function (err) {
													console.error('printTextSizeAlign: ' + err);
													window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
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
			 	window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
			 }, function (err) {
			 	console.error('printTextSizeAlign: ' + err);
				window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
			 }, strText, strSize, strAlign);

		 }



		return esperar1Seg();
	 })
	//  .then(() => {
	// 	 if(noImpresora==1){
	// 		 if(monedero>0){
	// 			 var strText = "Monedero (-):$"+monedero;
	// 			var strSize=1;
	// 			var strAlign=2;
	// 			BTPrinter.printTextSizeAlign(function (data) {
	// 			 console.log('printTextSizeAlign: ' + data);
	// 		  	window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
	// 			}, function (err) {
	// 			 console.error('printTextSizeAlign: ' + err);
	// 		  	window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
	// 			}, strText, strSize, strAlign);
	// 		 }


	// 	 }



	// 	return esperar1Seg();
	//  })
	 .then(() => {

			 pagar=totalImprime-0;
 		 if(pagar<0){pagar=0;}
 		 var strText = "Total a pagar :$"+pagar;
 		 var strSize=1;
 		 var strAlign=2;
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
			 var strText = "PAGO DE CONTADO";
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
			 var strText = "PARA VISUALIZAR NUESTRO CATALOGO ESCANEE EL CODIGO SIGUIENTE";
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
			var size = 30;
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
//  .then(() => {
// 	 let options = { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' };
// let formatter = new Intl.DateTimeFormat([], options);
// let date = formatter.format(new Date()).replace(/\//g, '-');
// date = date.split("-").reverse().join("-");

// 	 var fechita = date;
// 	if(monedero>=totalImprime){
// 		var diferiencia=monedero-totalImprime;
// 		var usemonedero=monedero-diferiencia;
// 		myDB.transaction(function(transaction) {
// 		var executeQuery = 'INSERT INTO "monedero"("idCliente","cantidad","fecha","tipo") VALUES ("'+iddelcliente+'","'+idUsuario+'","'+usemonedero+'","'+fechita+'","0");';
// 		console.log(executeQuery)
// 					transaction.executeSql(executeQuery, function(tx, result) {
// 						},
// 							function(error) {});
// 			});
// 	}else{
// 		myDB.transaction(function(transaction) {
// 	 var executeQuery = 'INSERT INTO "monedero"("idCliente","cantidad","fecha","tipo") VALUES ("'+iddelcliente+'","'+idUsuario+'","'+monedero+'","'+fechita+'","0");';
// 	 console.log(executeQuery)
// 				 transaction.executeSql(executeQuery, function(tx, result) {
// 					 },
// 						 function(error) {

// 						 });
// 		 });

// 	}

// 		return esperar1Seg();
//  })
//  .then(() => {
// 	 	if(monedero>=totalImprime){
// 			monedero=monedero-totalImprime;
// 			myDB.transaction(function(transaction) {
// 		 var executeQuery = 'UPDATE "clientes" SET "monedero"='+monedero+' WHERE idRemoto="'+idcliente+'"';
// 		 				console.log(executeQuery)
// 					 transaction.executeSql(executeQuery, function(tx, result) {
// 						 },
// 							 function(error) {

// 							 });
// 			 });
// 		}else{
// 			myDB.transaction(function(transaction) {
// 		 var executeQuery = 'UPDATE "clientes" SET "monedero"="0" WHERE idRemoto="'+idcliente+'"';
// 		 console.log(executeQuery)
// 					 transaction.executeSql(executeQuery, function(tx, result) {
// 						 },
// 							 function(error) {

// 							 });
// 			 });

// 		}
// 		return esperar1Seg();
//  })
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

function clientesruta(ruta,balneario){
	myDB.transaction(function(transaction) {
		var sql='select * from clientes';
		if(ruta!=0){
			sql='select clientes.nombre,clientes.apellido,clientes.idRemoto,balnearios.nombre as balne  from clientes inner join balnearios on balnearios.idRemoto=clientes.balneario inner join rutas on balnearios.idRuta=rutas.idRemoto where rutas.idRemoto='+ruta;
		}
		if(balneario!=0&&ruta!=0){
			sql='select clientes.nombre,clientes.apellido,clientes.idRemoto,balnearios.nombre as balne from clientes inner join balnearios on balnearios.idRemoto=clientes.balneario inner join rutas on balnearios.idRuta=rutas.idRemoto where balnearios.idRemoto='+balneario+' and rutas.idRemoto='+ruta;
		}
		console.log(sql)
			transaction.executeSql(sql, [], function(tx, results) {
					var len = results.rows.length,i;
					var html ='';

								for (i = 0; i < len; i++) {

									if (venta==0) {
										html=html+'<div class="container"><tr><th style="padding-top: 4%" scope="row">'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+'('+results.rows.item(i).balne+')</th><td><a class="btn m-1 btn-sm btn-creative btn-success btnidir" data-idCliente="'+results.rows.item(i).idRemoto+'"><span class="fas fa-plus"></span> Vender</a></td></tr></div>';	
									}
									if (venta==1) {
									html=html+'<div class="container"><tr><th style="padding-top: 4%" scope="row">'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+'('+results.rows.item(i).balne+')</th><td><a class="btn m-1 btn-sm btn-creative btn-info btnCredito" data-idCliente="'+results.rows.item(i).idRemoto+'" data-bs-toggle="modal" data-bs-target="#bootstrapBasicModal" href="#"><span class="fas fa-credit-card"></span>Credito</a></td></tr></div>';
									}
									if (venta==2) {
										html=html+'<div class="container"><tr><th style="padding-top: 4%" scope="row">'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+'</th><td><a class="btn m-1 btn-sm btn-creative btn-primary btnCotiza" data-idCliente="'+results.rows.item(i).idRemoto+'"><span class="fas fa-save"></span>Cotización</a></td></tr></div>';
										}
									}
									$("#divclientes").html(html);
	}, null);
	});
}

//GENERAR PDF
function generaPDF(params) {
	console.log("generating pdf...");
  var doc = new jsPDF();
const logo1 ='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOQAAAChCAYAAADXwhNSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAXxaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0OCA3OS4xNjQwMzYsIDIwMTkvMDgvMTMtMDE6MDY6NTcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMTEtMjZUMTg6MDM6NTYtMDY6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTAyLTI4VDIxOjQzOjU5LTA2OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTAyLTI4VDIxOjQzOjU5LTA2OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmI1NDUwNzg1LTNkNjMtYTk0ZS04ZTIzLWViZTk3ZjZlNGVlNCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjdkMDgzODIwLTNhZDEtZTg0ZS04ZWJkLTI5YzEzOGNiMmM5NiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjE0NWRjNjUwLWE0YzAtMTM0Ny05MThlLWFmM2I0MzY2MzZiMiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MTQ1ZGM2NTAtYTRjMC0xMzQ3LTkxOGUtYWYzYjQzNjYzNmIyIiBzdEV2dDp3aGVuPSIyMDIwLTExLTI2VDE4OjAzOjU2LTA2OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmI1NDUwNzg1LTNkNjMtYTk0ZS04ZTIzLWViZTk3ZjZlNGVlNCIgc3RFdnQ6d2hlbj0iMjAyMi0wMi0yOFQyMTo0Mzo1OS0wNjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pud7X4wAAAebSURBVHhe7d1RTiM5EMZxQEIi73CDHALugjhXELxxS152qUwnhKTTbbfL7qry/ydFm5nVhNjlz+XuMMPtfz9uGru9vR2e+bbC1CG46oGMEr4xBBLa7ob/qpIQHh4A0qkFkhAC5VQCSQgBHUWBpCMCuhYHkiAC+hYFkjACdWQFcrPZEMYBH3mghqzPIQnjLwKJGpI7JGEE6ksKJGEE2pgNJGG8xHEVtSy6ywqgjslA0h2Btq4G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';
const logo2 ='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABigAAAIRCAYAAADQoTViAAAACXBIWXMAAC4jAAAuIwF4pT92AAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTEyLTI0VDIwOjE2OjA3LTA2OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wMi0yOFQyMTo0NTowNi0wNjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wMi0yOFQyMTo0NTowNi0wNjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNWNlZjhlMy1iYjYwLTIwNGYtYmU3Zi1kZTdmMjg0M2UwMWMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkNTE4MzFkMy1mZmIyLWZmNDEtYTM2MC1lNmVlM2FiZWRmYzciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1YzBlMjNhNS0wOWM4LWM5NDYtOWZmNS0yYmUwYmViMzA3MmUiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjVjMGUyM2E1LTA5YzgtYzk0Ni05ZmY1LTJiZTBiZWIzMDcyZSIgc3RFdnQ6d2hlbj0iMjAyMC0xMi0yNFQyMDoxNjowNy0wNjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowNWNlZjhlMy1iYjYwLTIwNGYtYmU3Zi1kZTdmMjg0M2UwMWMiIHN0RXZ0OndoZW49IjIwMjItMDItMjhUMjE6NDU6MDYtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5cWTF1AABXKklEQVR4nO39y24bS7sgbCY3dACoH+h2S4OGAQ+omWtaw1XiqG6KvIC17ssuDXtamsn4oYLQBVjlSYsAaQHsgbeWZVsHMjPj/DzAGhRqf2I44/RGvBmRk+12u+0AAIAqTCaT1EUYjaUKAADU7T9SFwAAAOA5NSVbAACAP0lQAABAJWrc0K/x3wQAAPwgQQEAABVYLpeXqcsAAACwj4lvUAAAQPlqP2lg2QIAAPVxggIAAApXe3Ki69r4NwIAQGskKAAAAAAAgOgkKAAAoGAtnSxo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kPr7lXEfAMbhiicASOz3a6G22203nU5XqcvVh+RE2WxG9mOTqj2t1LnvUZQjxnjbev25xhMAwpCgAIAM3d/fT59LXORMcqJskhP9uJ+9Xa18QFiSohySFONZLBaXJcVgAFAyVzwBQAXm8/nV58+fP6b6fcmJss1ms9vr6+v3Y/29lupLKN22Vtr6wcHBw/fv3w/G+nutPLdUXPe0H+M4AKQlQQEAlQudvLARUj6nJ/oRRtN12ntfrTy3VMzNzzNuA0B+JCgAgO78/Pz2y5cve79BX1MYsdlsbv77f//v/7//+T//5//77u7uXeryxDJmHZa4WTVETe2fYVpp+5IUZWk5SWF8BoBySFAAADvbbDY379+//7/u7u7eCSHSWy6Xl//jf/yP/9f/+l//6//xv//3//5/bjabo4eHh52vYSl5s3E6na7+63/9r//3p0+fkl1tBo9y3aQNoeRxo1U1X8MoFgGA8klQAAAADNTKRrvvUZSn5JMU6/X65ujo6EOQPw4AZEGCAgAAYKDWNtpdD9fP6enpt//yX/7L//e//bf/9n/+/vvvv1KXZ0z71uPYyS4AoEz/kboAAAAApdtut8n+WywWl13X/Z/UzyCyVdd1/2cymfx/FovFZcrnv89/X79+fffp06ePtSUnntq1PiQnAICu67r/P4WuSNBJExB8AAAAAElFTkSuQmCC';
const esperartiempo = () => new Promise(resolve => setTimeout(resolve, 1000));
	esperartiempo()
	.then(() => {
		// Creamos array con los meses del año
		const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
		// Creamos array con los días de la semana
		const dias_semana = ['Domingo', 'Lunes', 'martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
		// Creamos el objeto fecha instanciándolo con la clase Date
		const fecha = new Date();


			doc.addImage(logo1, "PNG", 15, 10, 40, 20);
			doc.addImage(logo2, "PNG", 155, 10, 40, 20);
		  doc.setFont("courier");
		  doc.setFontType("normal");
		  doc.text(90, 20, 'COTIZACIÓN');
			doc.text(90, 25, 'N° '+sessionStorage.getItem("idDispositivo")+folio);
			doc.text(110, 45, 'Fecha : '+ fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getUTCFullYear());
			doc.setFontSize(10);
			doc.text(15, 60, 'Cliente : '+ nombre);
			doc.text(15, 65, 'Direccion : '+ direccion);
			doc.text(15, 70, 'Estado : Hidalgo');
			doc.text(15, 75, 'Telefono : '+clientetelefono);
			doc.setFontSize(12);
			doc.line(15, 80, 200, 80);
			doc.text(15, 85, 'Codigo');
			doc.text(38, 85, 'Producto');
			doc.text(100, 85, 'Cantidad');
			doc.text(130, 85, 'Precio/Un');
			doc.text(175, 85, 'SubTotal');
			doc.line(15, 90, 200, 90);
			doc.setFontSize(10);

		return esperartiempo();
	})
  .then(() => {
		var sql='select codigo,precio,nombre,precioFinal,cantidad,(cantidad*precioFinal) as total,ventaproductos.id as id, ventaproductos.descuentoDinero as dinero,ventaproductos.descuentoPorcentaje as porcentaje,sum(ventaproductos.descuentoDinero) as descuentoefe,sum(ventaproductos.descuentoPorcentaje) as descuentopor,(ventaproductos.precio*ventaproductos.cantidad) as real from ventaproductos inner join productos on ventaproductos.idProducto=productos.idRemoto where ventaproductos.foliolocal="'+folio+'" GROUP by ventaproductos.id';
		myDB.transaction(function(transaction) {
				transaction.executeSql(sql, [], function(tx, results) {
						var len = results.rows.length,i;
									var salto=95;
									var totalpdf=0;
									for (i = 0; i < len; i++) {
										console.log("vuelta : "+i)
										var nombrep=results.rows.item(i).nombre;
										var codigop=results.rows.item(i).codigo;
										var cantidadp=results.rows.item(i).cantidad;
										var preciofinalp= results.rows.item(i).precioFinal;
										var totalp=results.rows.item(i).total;
										doc.text(15, salto," "+codigop );
										doc.text(38, salto," "+nombrep );
										doc.text(100, salto, " "+cantidadp);
										doc.text(130, salto," $"+preciofinalp );
										doc.text(175,salto," $"+totalp);

										salto=salto+5;
										totalpdf=totalpdf+totalp;
										}
										salto=salto+5;
										var subtotalpdf=totalpdf-((totalpdf*16)/100);
										var ivapdf=((totalpdf*16)/100);
										console.log("Subtotal ="+subtotalpdf)
										console.log("IVA ="+ivapdf)
										//doc.text(160, salto, 'SubTotal $'+subtotalpdf);
									//	salto=salto+5;
										//doc.text(160, salto, 'I.V.A $'+ivapdf);
										//salto=salto+5;
										doc.text(160, salto, 'Total  $'+totalpdf);
										doc.text(120, salto, 'Precios en MXN');
										salto=salto+5;
										salto=salto+5;
										doc.setFontSize(10);
										doc.text(15, salto," Precios y productos sujetos a cambios sin previo aviso." );
										salto=salto+5;
										doc.text(15, salto," Precios no incluyen IVA." );

		}, null);
		});
console.log("TERMINO DE ARMAR");
		return esperartiempo();
	})
	.then(() => {
		console.log("guardo");
		pdfOutput = doc.output('blob');
		return esperartiempo();
})
.then(() => {

  console.log("file system...");
	window.resolveLocalFileSystemURL(cordova.file.dataDirectory,	// <-----------
		function (dirEntry) {	// <-----------
console.log(dirEntry)
			dirEntry.getFile(folio+".pdf", {create: true, exclusive: false},	// <-----------
				function(fileEntry) {	// File loaded/created
					console.log(fileEntry)
					fileEntry.createWriter(
						function(writer) {	// Writer created

							writer.write(pdfOutput);
							console.log('test2 it worked!');

						},
						function(error) {	// Writer failure
							console.log('createWriter', error);
						}
					);

				},
				function(error) {	// File failure
					console.log('getFile', error);
				}
			);

		},
		function(error) { console.log('resolveLocalFileSystemURL', error); }
	);
return esperartiempo();
})
.then(() => {
	cordova.plugins.fileOpener2.open(
	    'file:///data/user/0/com.fels.principal/files/'+folio+'.pdf', // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Downloads/starwars.pdf
	    'application/pdf',
	    {
	        error : function(e) {
	            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
	        },
	        success : function () {
	            console.log('file opened successfully');
	        }
	    }
	);
	return esperartiempo();
})
.then(() => {
	myDB.transaction(function(transaction) {
 var executeQuery = 'UPDATE "folios" SET "estado"="2","total"='+sumatotalpagarmone2+', "tipoventa"="0" WHERE id="'+folio+'"';
				console.log(executeQuery)
			 transaction.executeSql(executeQuery, function(tx, result) {
				 },
					 function(error) {

					 });
	 });

	return esperartiempo();
})
.then(() => {
	window.location.href = "menu.html";

	return esperartiempo();
})

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
