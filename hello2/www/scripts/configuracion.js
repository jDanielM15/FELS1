/* global BTPrinter */
var vimpresora =	"";
var usuario =	"";
var myDB;
var servidor="sistema.fels.com.mx";
var conn = true;
var idUsuarioBajar;
//var dato[];
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


function aleatorio(length){
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		 result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	$("#idDispositivo").html("<b>"+result+"</b>");
	return result;
}
function onDeviceReady() {

 myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
const esperar1Seg = () => new Promise(resolve => setTimeout(resolve, 1000));
esperar1Seg()
.then(() => {
	myDB.transaction(function(transaction) {
		transaction.executeSql('CREATE TABLE "monedero" ("id"	INTEGER,"idRemoto"	INTEGER,"idCliente"	INTEGER,"idUsuario"	INTEGER,"cantidad"	TEXT,"fecha"	INTEGER,"tipo"	INTEGER,PRIMARY KEY("id" AUTOINCREMENT))', [],
				function(tx, result) {
					//  alert("Table created successfully");
					//	window.plugins.toast.showLongBottom('Table created successfully');
				},
				function(error) {
					//window.plugins.toast.showLongBottom('Error occurred while creating the table.');
					//  alert("Error occurred while creating the table.");
				});
	});
  return esperar1Seg();
})
.then(() => {
	myDB.transaction(function(transaction) {
		transaction.executeSql('CREATE TABLE "creditos" ("id"	INTEGER,"idRemoto"	INTEGER,"idfolio"	INTEGER,"idfolioremoto"	INTEGER,"idCliente"	INTEGER,"cantidad"	TEXT,"fecha","tipo"	INTEGER,	TEXT,PRIMARY KEY("id" AUTOINCREMENT))', [],
				function(tx, result) {
					//  alert("Table created successfully");
					//	window.plugins.toast.showLongBottom('Table created successfully');
				},
				function(error) {
					//window.plugins.toast.showLongBottom('Error occurred while creating the table.');
					//  alert("Error occurred while creating the table.");
				});
	});
  return esperar1Seg();
})
.then(() => {
	myDB.transaction(function(transaction) {
		transaction.executeSql('CREATE TABLE "rutabalneario" ("id"	INTEGER,"ruta"	INTEGER,"balneario"	INTEGER,PRIMARY KEY("id" AUTOINCREMENT))', [],
				function(tx, result) {
					//  alert("Table created successfully");
					//	window.plugins.toast.showLongBottom('Table created successfully');
				},
				function(error) {
					//window.plugins.toast.showLongBottom('Error occurred while creating the table.');
					//  alert("Error occurred while creating the table.");
				});
	});
  return esperar1Seg();
})
.then(() => {
	myDB.transaction(function(transaction) {
		transaction.executeSql('CREATE TABLE IF NOT EXISTS idcelular (id	INTEGER,foliocel	TEXT,PRIMARY KEY("id" AUTOINCREMENT))', [],
				function(tx, result) {
					//  alert("Table created successfully");
					//	window.plugins.toast.showLongBottom('Table created successfully');
				},
				function(error) {
					//window.plugins.toast.showLongBottom('Error occurred while creating the table.');
					//  alert("Error occurred while creating the table.");
				});
	});
  return esperar1Seg();
})
.then(() => {
	myDB.transaction(function(transaction) {
		transaction.executeSql('CREATE TABLE "ventaproductos" ("id"	INTEGER,"idRemoto"	INTEGER DEFAULT 0,"folioremoto"	INTEGER DEFAULT 0,"foliolocal"	TEXT,"idProducto"	INTEGER,"cantidad"	INTEGER,"precio"	INTEGER,"descuentoPorcentaje"	INTEGER DEFAULT 0,"descuentoDinero"	INTEGER DEFAULT 0,"precioFinal"	TEXT,PRIMARY KEY("id" AUTOINCREMENT))', [],
				function(tx, result) {
					//  alert("Table created successfully");
					//	window.plugins.toast.showLongBottom('Table created successfully');
				},
				function(error) {
					//window.plugins.toast.showLongBottom('Error occurred while creating the table.');
					//  alert("Error occurred while creating the table.");
				});
	});
  return esperar1Seg();
})
.then(() => {
	myDB.transaction(function(transaction) {
		transaction.executeSql('CREATE TABLE "folios" ("id"	INTEGER,"foliolocal"	TEXT,"idRemoto"	INTEGER,"idCliente"	INTEGER,"idusuario"	INTEGER,"total"	TEXT,"abono"	INTEGER DEFAULT 0,"monedero"	INTEGER DEFAULT 0,"debeahora"	INTEGER DEFAULT 0,"tipoventa"	INTEGER,"estado"	INTEGER DEFAULT 0,"fecha"	TEXT,PRIMARY KEY("id" AUTOINCREMENT))', [],
				function(tx, result) {
				},
				function(error) {
				});
	});
  return esperar1Seg();
})
.then(() => {
	myDB.transaction(function(transaction) {
		transaction.executeSql('CREATE TABLE IF NOT EXISTS impresora (id	INTEGER,impresora	TEXT,PRIMARY KEY("id" AUTOINCREMENT))', [],
				function(tx, result) {
				},
				function(error) {
				});
	});
  return esperar1Seg();
})
.then(() => {
	myDB.transaction(function(transaction) {
		transaction.executeSql('CREATE TABLE "productos" ("id"	INTEGER,"idRemoto"	INTEGER,"codigo"	TEXT,"nombre"	TEXT,"imagen"	BLOB,"venta"	INTEGER,"caja"	INTEGER,"idcategoria"	INTEGER,"idsubcategoria"	INTEGER,"estado"	INTEGER,PRIMARY KEY("id"))', [],
				function(tx, result) {
				},
				function(error) {
				});
	});
  return esperar1Seg();
})
.then(() => {
	myDB.transaction(function(transaction) {
		transaction.executeSql('CREATE TABLE "usuarios" ("idLocal"	INTEGER,"idPrincipal"	INTEGER,"user"	TEXT,"contra"	TEXT,"nombre"	TEXT,PRIMARY KEY("idLocal" AUTOINCREMENT))', [],
				function(tx, result) {
				},
				function(error) {
				});
	});
	return esperar1Seg();
})
.then(() => {
	///
	myDB.transaction(function(transaction) {
		transaction.executeSql('CREATE TABLE "rutas" ("idLocar"	INTEGER,"idRemoto"	INTEGER,"ruta"	TEXT,"estado"	INTEGER,PRIMARY KEY("idLocar" AUTOINCREMENT))', [],
				function(tx, result) {
				},
				function(error) {
				});
	});
	return esperar1Seg();
	})
	.then(() => {
		///
		myDB.transaction(function(transaction) {
			transaction.executeSql('CREATE TABLE "balnearios" ("idLocal"	INTEGER,"idRemoto"	INTEGER,"idRuta"	INTEGER,"nombre"	TEXT,"estado"	INTEGER,PRIMARY KEY("idLocal" AUTOINCREMENT))', [],
					function(tx, result) {
					},
					function(error) {
					});
		});
		return esperar1Seg();
		})
		.then(() => {
			///
			myDB.transaction(function(transaction) {
				transaction.executeSql('CREATE TABLE "categorias" ("idLocal"	INTEGER,"idRemoto"	INTEGER,"categoria"	TEXT,"estado"	INTEGER,PRIMARY KEY("idLocal" AUTOINCREMENT))', [],
						function(tx, result) {
						},
						function(error) {
						});
			});
			return esperar1Seg();
			})
			.then(() => {
				///
				myDB.transaction(function(transaction) {
					transaction.executeSql('CREATE TABLE "subcategorias" ("idLocal"	INTEGER,"idRemoto"	INTEGER,"idCategoria"	INTEGER,"subcategoria"	TEXT,"estado"	INTEGER,PRIMARY KEY("idLocal" AUTOINCREMENT))', [],
							function(tx, result) {
							},
							function(error) {
							});
				});
				return esperar1Seg();
				})
				.then(() => {
					///
					myDB.transaction(function(transaction) {
						transaction.executeSql('CREATE TABLE "clientes" ("idLocal"	INTEGER,"idRemoto"	INTEGER,"nombre"	TEXT,"apellido"	TEXT,"telefono"	TEXT,"balneario"	INTEGER,"razonsocial"	TEXT,"domicilio"	TEXT,"codigopostal"	TEXT,"regimenfiscal"	TEXT,"rfc"	TEXT,"email"	TEXT,"credito"	INTEGER,"debe"	INTEGER,"monedero"	INTEGER,"estado"	INTEGER,"actualizar"	INTEGER,PRIMARY KEY("idLocal" AUTOINCREMENT))', [],
								function(tx, result) {
								},
								function(error) {
								});
					});
				//	return esperar1Seg();
					})
					.then(() => {
						///
						myDB.transaction(function(transaction) {
							transaction.executeSql('CREATE TABLE "referencias" ("id"	INTEGER,"idcliente"	INTEGER,"idventa"	INTEGER,"vengo"	TEXT,"idcredito"	INTEGER,PRIMARY KEY("id"))', [],
									function(tx, result) {
									},
									function(error) {
									});
						});
					//	return esperar1Seg();
						})
						.then(() => {
							///
							$.ajax({
											method: "GET",
											url: "http://"+servidor+"/fels/json/datos.php?dato=selector",
											async: false,
										}).done(function(data) {
											var txt='<option value="0" >--Selecciona un usuario--</option>';
											$.each(data, function(i, item) {
														txt=txt+'<option value="'+item.idUsuario+'">--'+item.nombre+'--</option>';

													});
													console.log(txt)
													$("#selectUsuario").html(txt)
												});

							return esperar1Seg();
							})
	.then(() => {
		///
		myDB.transaction(function(transaction) {
				transaction.executeSql('SELECT * FROM idcelular', [], function(tx, results) {
						var len = results.rows.length,i;
						var unico=aleatorio(3);
								if(len==0){
									var url="http://"+servidor+"/fels/json/datos.php?dato=registroDispositivo&idDispositivo="+unico;
									console.log(url);
									$.ajax({
								method: "POST",
								url: url,
								async: false,
								}).done(function(data) {
								console.log(data)
								});
									myDB.transaction(function(transaction) {

									    var executeQuery = "INSERT INTO idcelular ('foliocel') VALUES ('"+unico+"')";
									    transaction.executeSql(executeQuery, function(tx, result) {
									            //alert('Inserted');
															window.plugins.toast.showLongBottom('Inserted');

									        },
									        function(error) {
														window.plugins.toast.showLongBottom('Error occurred');
									          //  alert('Error occurred');
									        });
									});
								}else{
										$("#ocultasincroniza").hide()
									for (i = 0; i < len; i++) {
										strPrinter=results.rows.item(i).title;
											$("#idDispositivo").html("<b>"+results.rows.item(i).foliocel+"</b>");


									}
								}



				}, null);
		});
	//	return esperar1Seg();
		})
		.then(() => {
			///
			myDB.transaction(function(transaction) {
					transaction.executeSql('SELECT * FROM impresora ', [], function(tx, results) {
							var len = results.rows.length,i;
										for (i = 0; i < len; i++) {
												$('#textoImpresora').html("Impresora elegida "+results.rows.item(i).impresora );
												vimpresora=results.rows.item(i).impresora;
											}
			}, null);
			});
		//	return esperar1Seg();
			})
			.then(() => {
				///
				myDB.transaction(function(transaction) {
						transaction.executeSql('select * from usuarios limit 1', [], function(tx, results) {
								var len = results.rows.length,i;
											for (i = 0; i < len; i++) {
												usuario=results.rows.item(i).nombre;
											}
				}, null);
				});
			//	return esperar1Seg();
				})
 //myDB = window.sqlitePlugin.openDatabase({name: "db.db", location: 'default'});
////Empezamos ID CELULAR



$("#selectUsuario").change(function(){idUsuarioBajar=$("#selectUsuario").val()});








////TERMINAMOS ID CELULAR
//// EMPIEZA SELECCIONAR IMPRESORA
if (typeof (BTPrinter) === 'undefined') {
	// Error: plugin not installed
	console.error('Error: BTPrinter plugin not detected');
	alert('Error: BTPrinter plugin not detected');
	window.plugins.toast.showLongBottom('BTPrinter plugin not detected');
} else {
	///LISTAMOS DISPOSITIVOS BLU
	BTPrinter.list(function (data) {
		$.each(data, function (idx, value) {
			/* Add devices (array contains device name every 3 array elements) */
			if (idx % 3 === 0) {
				$('#selectPrinter').append('<option value="' + data[idx] + '" data-name="' + data[idx] + '">' + data[idx] + ' (' + data[idx + 1] + ')</option>');
			}
		});
	}, function (err) {
		window.plugins.toast.showLongBottom('list: ' + err);
	});

	window.setTimeout(function () {

		$('#selectPrinter > option[value="'+vimpresora+'"]').attr('selected', 'selected');
		if(vimpresora!=""&usuario!=""){
			$("#divInicial").hide();
		}

}, 2000);
	///LISTAMOS DISPOSITIVOS BLU
	///clicamos boton para Probar
	$('#prueba').click(function () {
		window.setTimeout(function () {
			/* Use timeout to properly update GUI first */
			var strPrinter = $('#selectPrinter option:selected').attr('data-name');
//var strPrinter =	"";

			BTPrinter.connect(function (data) {
				window.plugins.toast.showLongBottom('CONECTA: ' + data);
			}, function (err) {
				window.plugins.toast.showLongBottom('connect: ' + err);
			}, strPrinter);
		}, 1000);

		setTimeout(function(){
			var printBase64 = $('#logo').val();
			var strAlign = 0;
			BTPrinter.printBase64(function (data) {
				console.log('printBase64: ' + data);
				window.plugins.toast.showLongBottom('printBase64: ' + data);
			}, function (err) {
				console.error('printBase64: ' + err);
				window.plugins.toast.showLongBottom('printBase64: ' + err);
			}, printBase64, strAlign);
		}, 5000);


		setTimeout(function(){
			BTPrinter.disconnect(function (data) {
				console.log('disconnect: ' + data);
				window.plugins.toast.showLongBottom('DESCONECTAMOS: ' + data);
			}, function (err) {
				console.error('disconnect: ' + err);
				window.plugins.toast.showLongBottom('disconnect: ' + err);
			});
		}, 8000);


	});
	///clicamos boton para Probar
	///clicamos boton para guardar impresora default
	$('#impresora').click(function () {
		myDB.transaction(function(transaction) {
				transaction.executeSql('SELECT * FROM impresora limit 1', [], function(tx, results) {
						var len = results.rows.length,i;
								if(len==0){
									myDB.transaction(function(transaction) {
											var executeQuery = "INSERT INTO impresora ('impresora') VALUES ('"+$('#selectPrinter option:selected').attr('data-name')+"')";
											console.log(executeQuery)
											transaction.executeSql(executeQuery, function(tx, result) {
														console.log("SE INSERTA IMPRESORA")
													//		window.plugins.toast.showLongBottom('Impresora guardada Correctamente');

													},
													function(error) {
													//	window.plugins.toast.showLongBottom('Error occurred insertar');
														//  alert('Error occurred');
													});
									});
								}else{

									myDB.transaction(function(transaction) {
											var executeQuery = "UPDATE impresora SET impresora='"+$('#selectPrinter option:selected').attr('data-name')+"' WHERE id=1";
console.log(executeQuery)
											transaction.executeSql(executeQuery, function(tx, result) {
															console.log("SE ACTUALIZA IMPRESORA")
															window.plugins.toast.showLongBottom('Impresora actualizada Correctamente');

													},
													function(error) {
														window.plugins.toast.showLongBottom('Error occurred actualizar');
														//  alert('Error occurred');
													});
									});

								}



				}, null);
		});

	})

	///clicamos boton para guardar impresora default

}

//// TERMINA SELECCIONAR IMPRESORA

//// EMPIEZA SINCRONIZACION
$('#sincroniza').click(function () {


	const esperar1Seg = () => new Promise(resolve => setTimeout(resolve, 5000));
esperar1Seg()
.then(() => {
	 $('#general').html('<div class="loading"><img src="images/progress.gif" alt="loading" /><br/>Un momento, por favor...</div>');
})
.then(() => {
	$.ajax({
method: "GET",
url: "http://"+servidor+"/fels/json/datos.php?dato=usuarios",
async: false,
}).done(function(data) {
	$.each(data, function(i, item) {

			myDB.transaction(function(transaction) {
				var executeQuery = "INSERT INTO usuarios ('idPrincipal','user','contra','nombre') VALUES ('"+item.idUsuarios+"','"+item.user+"','"+item.contra+"','"+item.nombre+"')";
console.log(executeQuery);
					transaction.executeSql(executeQuery, function(tx, result) {
									//window.plugins.toast.showLongBottom('Inserted');

							},
							function(error) {
								//window.plugins.toast.showLongBottom('Error occurred');
								//  alert('Error occurred');
							});
			});
	});

});

  return esperar1Seg();
})
.then(() => {
	$.ajax({
method: "GET",
url: "http://"+servidor+"/fels/json/datos.php?dato=rutas",
async: false,
}).done(function(data) {
	$.each(data, function(i, item) {

			myDB.transaction(function(transaction) {
				var executeQuery = "INSERT INTO rutas ('idRemoto','ruta','estado') VALUES ('"+item.idRuta+"','"+item.ruta+"','"+item.estado+"')";
console.log(executeQuery);
					transaction.executeSql(executeQuery, function(tx, result) {
									//window.plugins.toast.showLongBottom('Inserted');

							},
							function(error) {
								//window.plugins.toast.showLongBottom('Error occurred');
								//  alert('Error occurred');
							});
			});
	});

});
  return esperar1Seg();
})
.then(() => {

	var url= "http://"+servidor+"/fels/json/datos.php?dato=folios&idUsuario="+idUsuarioBajar;
	console.log(url)
	$.ajax({
method: "GET",
url:url,
async: false,
}).done(function(data) {
	$.each(data, function(i, item) {

			myDB.transaction(function(transaction) {
				var executeQuery = 'INSERT INTO "folios"("idRemoto","idCliente","idusuario","total","tipoventa","abono","debeahora","monedero","tipoventa","estado","fecha","foliolocal") VALUES ("'+item.idFolio+'","'+item.idCliente+'","'+item.idUsuario+'","'+item.total+'","'+item.tipoVenta+'","'+item.abono+'","'+item.debeahora+'","'+item.monedero+'","'+item.tipoVenta+'","1","'+item.fechaventa+'","'+item.idFolioDispositivo+'")';
console.log(executeQuery);
					transaction.executeSql(executeQuery, function(tx, result) {},
							function(error) {
							});
			});
	});

});
  return esperar1Seg();
})
.then(() => {

	var url= "http://"+servidor+"/fels/json/datos.php?dato=productosventa&idUsuario="+idUsuarioBajar;
	console.log(url)
	$.ajax({
method: "GET",
url:url,
async: false,
}).done(function(data) {
	$.each(data, function(i, item) {

			myDB.transaction(function(transaction) {
				var executeQuery = 'INSERT INTO "ventaproductos"("idRemoto","folioRemoto","idProducto","cantidad","precio","precioFinal","foliolocal") VALUES ("'+item.idRemoto+'","'+item.folioRemoto+'","'+item.idProducto+'","'+item.cantidad+'","'+item.precio+'","'+item.precio+'","'+item.folioLocal+'")';
console.log(executeQuery);
					transaction.executeSql(executeQuery, function(tx, result) {},
							function(error) {
							});
			});
	});

});
  return esperar1Seg();
})
.then(() => {

	var url= "http://"+servidor+"/fels/json/datos.php?dato=creditos&idUsuario="+idUsuarioBajar;
	console.log(url)
	$.ajax({
method: "GET",
url:url,
async: false,
}).done(function(data) {
	$.each(data, function(i, item) {

			myDB.transaction(function(transaction) {
				var executeQuery = 'INSERT INTO "creditos"("idRemoto","idfolio","idfolioremoto","idcliente","cantidad","fecha","tipo") VALUES ("'+item.idCredito+'","'+item.idFolio+'","0","'+item.idCliente+'","'+item.cantidad+'","'+item.fecha+'","'+item.tipo+'")';
console.log(executeQuery);
					transaction.executeSql(executeQuery, function(tx, result) {},
							function(error) {
							});
			});
	});

});
  return esperar1Seg();
})
.then(() => {
	$.ajax({
method: "GET",
url: "http://"+servidor+"/fels/json/datos.php?dato=balnearios",
async: false,
}).done(function(data) {
	$.each(data, function(i, item) {

			myDB.transaction(function(transaction) {
				var executeQuery = "INSERT INTO balnearios ('idRemoto','idRuta','nombre','estado') VALUES ('"+item.idBalneario+"','"+item.idRuta+"','"+item.nombre+"','"+item.estado+"')";
console.log(executeQuery);
					transaction.executeSql(executeQuery, function(tx, result) {
									//window.plugins.toast.showLongBottom('Inserted');

							},
							function(error) {
								//window.plugins.toast.showLongBottom('Error occurred');
								//  alert('Error occurred');
							});
			});
	});

});
  return esperar1Seg();
})
.then(() => {
	$.ajax({
method: "GET",
url: "http://"+servidor+"/fels/json/datos.php?dato=productos",
async: false,
}).done(function(data) {
	$.each(data, function(i, item) {
		setTimeout(function (){
myDB.transaction(function(transaction) {
			var executeQuery = 'INSERT INTO "productos"("idRemoto","codigo","nombre","imagen","venta","caja","idcategoria","idsubcategoria","estado") VALUES ("'+item.id+'","'+item.codigo+'","'+item.nombre+'","'+item.imagen+'","'+item.venta+'","'+item.caja+'","'+item.idCategoria+'","'+item.idSubcategoria+'","'+item.estado+'")';
console.log(executeQuery);
				transaction.executeSql(executeQuery, function(tx, result) {
								//window.plugins.toast.showLongBottom('Inserted');

						},
						function(error) {
							console.log(error)
							//window.plugins.toast.showLongBottom('Error occurred');
						//	 alert('Error occurred');
						});
		});
}, 5000);

	});

});
  return esperar1Seg();
})
.then(() => {
	$.ajax({
method: "GET",
url: "http://"+servidor+"/fels/json/datos.php?dato=categorias",
async: false,
}).done(function(data) {
	$.each(data, function(i, item) {

			myDB.transaction(function(transaction) {
				var executeQuery = "INSERT INTO categorias ('idRemoto','categoria','estado') VALUES ('"+item.idCategoria+"','"+item.Categoria+"','"+item.estado+"')";
console.log(executeQuery);
					transaction.executeSql(executeQuery, function(tx, result) {
									//window.plugins.toast.showLongBottom('Inserted');

							},
							function(error) {
								//window.plugins.toast.showLongBottom('Error occurred');
								//  alert('Error occurred');
							});
			});
	});

});
  return esperar1Seg();
})
.then(() => {
	$.ajax({
method: "GET",
url: "http://"+servidor+"/fels/json/datos.php?dato=subcategorias",
async: false,
}).done(function(data) {
	$.each(data, function(i, item) {

			myDB.transaction(function(transaction) {
				var executeQuery = "INSERT INTO subcategorias ('idRemoto','idCategoria','subcategoria','estado') VALUES ('"+item.id+"','"+item.idCategoria+"','"+item.nombre+"','"+item.estado+"')";
console.log(executeQuery);
					transaction.executeSql(executeQuery, function(tx, result) {
									//window.plugins.toast.showLongBottom('Inserted');

							},
							function(error) {
								//window.plugins.toast.showLongBottom('Error occurred');
								//  alert('Error occurred');
							});
			});
	});

});
  return esperar1Seg();
})
.then(() => {
	$.ajax({
method: "GET",
url: "http://"+servidor+"/fels/json/datos.php?dato=clientes",
async: false,
}).done(function(data) {
	$.each(data, function(i, item) {

			myDB.transaction(function(transaction) {
				var executeQuery = "INSERT INTO clientes ('idRemoto','nombre','apellido','telefono','balneario','razonsocial','domicilio','codigopostal','regimenfiscal','rfc','email','credito','debe','monedero','estado') VALUES('"+item.idCliente+"','"+item.nombre+"','"+item.apellido+"','"+item.telefono+"','"+item.balneario+"','"+item.razonsocial+"','"+item.domicilio+"','"+item.codigopostal+"','"+item.regimenfiscal+"','"+item.rfc+"','"+item.email+"','"+item.credito+"','"+item.debe+"','"+item.monedero+"','"+item.estado+"')";
console.log(executeQuery);
					transaction.executeSql(executeQuery, function(tx, result) {
									//window.plugins.toast.showLongBottom('Inserted');

							},
							function(error) {
								//window.plugins.toast.showLongBottom('Error occurred');
								//  alert('Error occurred');
							});
			});
	});

});
  return esperar1Seg();
})
.then(() => {
//	setTimeout('window.location = "index.html"', 10000)
//	window.location.href = "index.html"
return esperar1Seg();
})
.then(() => {
//	setTimeout('window.location = "index.html"', 10000)
//	window.location.href = "index.html"
return esperar1Seg();
})
.then(() => {
//	setTimeout('window.location = "index.html"', 10000)
//	window.location.href = "index.html"
return esperar1Seg();
})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {return esperar1Seg();})
.then(() => {
	setTimeout('window.location = "index.html"', 10000)
//	window.location.href = "index.html"
})


});
//// TERMINA SINCRONIZACION
//// MUESTRO DATOs
$('#muestra').click(function () {
	const esperar1Seg = () => new Promise(resolve => setTimeout(resolve, 100));
	esperar1Seg()
.then(() => {
	myDB.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM usuarios ', [], function(tx, results) {
					var len = results.rows.length,i;
								for (i = 0; i < len; i++) {
										console.log(i+".-"+"Usuario --> Id:"+results.rows.item(i).idLocal+" "+results.rows.item(i).user)

								}
	}, null);
	});
  return esperar1Seg();
})
.then(() => {
	myDB.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM rutas ', [], function(tx, results) {
					var len = results.rows.length,i;
								for (i = 0; i < len; i++) {
										console.log(i+".-"+"Ruta --> :"+results.rows.item(i).ruta)

								}
	}, null);
	});
  return esperar1Seg();
});


})
//// TERMINA SINCRONIZACION
	// Handle the Cordova pause and resume events
	document.addEventListener('pause', onPause.bind(this), false);
	document.addEventListener('resume', onResume.bind(this), false);

	/* Initialize plugin */
	if (typeof (BTPrinter) === 'undefined') {
		// Error: plugin not installed
		console.error('Error: BTPrinter plugin not detected');
		alert('Error: BTPrinter plugin not detected');
		window.plugins.toast.showLongBottom('BTPrinter plugin not detected');
	} else {
		// Bind action buttons
		$('#list').click(function () {
			BTPrinter.list(function (data) {
				console.log('list: success');
				window.plugins.toast.showLongBottom('list: success');
				$('#btpPrinter').empty().prop('disabled', false);
				$.each(data, function (idx, value) {
					/* Add devices (array contains device name every 3 array elements) */
					if (idx % 3 === 0) {
						$('#btpPrinter').append('<option value="' + idx + '" data-name="' + data[idx] + '">' + data[idx] + ' (' + data[idx + 1] + ')</option>');
					}
				});
			}, function (err) {
				console.error('list: ' + err);
				window.plugins.toast.showLongBottom('list: ' + err);
				$('#btpPrinter').empty().prop('disabled', true);
			});
		});
		$('#status').click(function () {
			BTPrinter.status(function (data) {
				console.log('status: ' + data);
				window.plugins.toast.showLongBottom('status: ' + data);
			}, function (err) {
				console.error('status: ' + err);
				window.plugins.toast.showLongBottom('status: ' + err);
			});
		});
		$('#connected').click(function () {
			BTPrinter.connected(function (data) {
				console.log('connected: ' + data);
				window.plugins.toast.showLongBottom('connected: ' + data);
			}, function (err) {
				console.error('connected:' + err);
				window.plugins.toast.showLongBottom('connected: ' + err);
			});
		});
		$('#connect').click(function () {
			$('#connect').prop('disabled', true);
			window.setTimeout(function () {
				/* Use timeout to properly update GUI first */
				var strPrinter = $('#btpPrinter option:selected').attr('data-name');
//var strPrinter =	"";

				BTPrinter.connect(function (data) {
					console.log("Mi VARIABLE :"+strPrinter)
	console.log('connect: ' + data);
					window.plugins.toast.showLongBottom('connect: ' + data);
					$('#connect').prop('disabled', false);
				}, function (err) {
					console.error('connect: ' + err);
					window.plugins.toast.showLongBottom('connect: ' + err);
					$('#connect').prop('disabled', false);
				}, strPrinter);
			}, 100);
		});
		$('#disconnect').click(function () {
			BTPrinter.disconnect(function (data) {
				console.log('disconnect: ' + data);
				window.plugins.toast.showLongBottom('disconnect: ' + data);
			}, function (err) {
				console.error('disconnect: ' + err);
				window.plugins.toast.showLongBottom('disconnect: ' + err);
			});
		});
		$('#printQRCode').click(function () {
			var data = $('#txtQRData').val();
			var align = $('#optAlign').val();
			var model = $('#optQRModel').val();
			var size = $('#optQRSize').val();
			var eclevel = $('#optQREclevel').val();
			BTPrinter.printQRCode(function (data) {
				console.log('printQRCode:' + data);
				window.plugins.toast.showLongBottom('printQRCode:' + data);
			}, function (err) {
				console.error('printQRCode:' + err);
				window.plugins.toast.showLongBottom('printQRCode:' + err);
			}, data, align, model, size, eclevel);
			$('#lineFeed').click();
		});
		$('#printBarcode').click(function () {
			var system = $('#optBCSystem').val();
			var data = $('#txtBarcode').val();
			var align = $('#optAlign').val();
			var position = $('#optBCPosition').val();
			var font = $('#optBCFont').val();
			var height = $('#optBCHeight').val();
			BTPrinter.printBarcode(function (data) {
				console.log();
				window.plugins.toast.showLongBottom('printBarcode: ' + data);
			}, function (err) {
				console.error(err);
				window.plugins.toast.showLongBottom('printBarcode: ' + err);
			}, system, data, align, position, font, height);
			$('#lineFeed').click();
		});
		$('#setEncoding').click(function () {
			var strEncoding = $('#txtEncoding').val();
			BTPrinter.setEncoding(function (data) {
				console.log('setEncoding: ' + data);
				window.plugins.toast.showLongBottom('setEncoding: ' + data);
			}, function (err) {
				console.error('setEncoding: ' + err);
				window.plugins.toast.showLongBottom('setEncoding: ' + err);
			}, strEncoding);
		});
		$('#printText').click(function () {
			var strText = $('#txtSample').val();
			BTPrinter.printText(function (data) {
				console.log('printText: ' + data);
				window.plugins.toast.showLongBottom('printText: ' + data);
			}, function (err) {
				console.error('printText: ' + err);
				window.plugins.toast.showLongBottom('printText: ' + err);
			}, strText);
		});


		function imprimir(strText){
		BTPrinter.printText(function (data) {}, function (err) {}, strText);
	}


		$('#printTextSizeAlign').click(function () {
			var strText = $('#txtSample').val();
			var strSize = $('#optSize option:selected').val();
			var strAlign = $('#optAlign option:selected').val();
			BTPrinter.printTextSizeAlign(function (data) {
				console.log('printTextSizeAlign: ' + data);
				window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
			}, function (err) {
				console.error('printTextSizeAlign: ' + err);
				window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
			}, strText, strSize, strAlign);
		});
		$('#printTitle').click(function () {
			var strText = $('#txtSample').val();
			var strSize = $('#optSize option:selected').val();
			var strAlign = $('#optAlign option:selected').val();
			BTPrinter.printTitle(function (data) {
				console.log('printTitle: ' + data);
				window.plugins.toast.showLongBottom('printTitle: ' + data);
			}, function (err) {
				console.error('printTitle: ' + err);
				window.plugins.toast.showLongBottom('printTitle: ' + err);
			}, strText, strSize, strAlign);
		});
		$('#printPOSCommand').click(function () {
			var printPOS = $('#txtPOS').val();
			BTPrinter.printPOSCommand(function (data) {
				console.log('printPOSCommand: ' + data);
				window.plugins.toast.showLongBottom('printPOSCommand: ' + data);
			}, function (err) {
				console.error('printPOSCommand: ' + err);
				window.plugins.toast.showLongBottom('printPOSCommand: ' + err);
			}, printPOS);
		});
		$('#printBase64').click(function () {

				var printBase64 = $('#txtBase64').val();
				var strAlign = $('#optAlign option:selected').val();
				BTPrinter.printBase64(function (data) {
					console.log('printBase64: ' + data);
					window.plugins.toast.showLongBottom('printBase64: ' + data);
				}, function (err) {
					console.error('printBase64: ' + err);
					window.plugins.toast.showLongBottom('printBase64: ' + err);
				}, printBase64, strAlign);
				// Print extras
				$('#txtSample').val('>>> Sent POS:FEED+BEEP');
				$('#printText').click();
				$('#lineFeed').click();
				$('#beepX3').click();


		});
		$('#reset').click(function () {
			// Clear data in buffer and reset modes
			var bytes = '1B40'; /* Initialize printer: https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=192 */
			$('#txtPOS').val(bytes);
			$('#printPOSCommand').click();
			// Reset GUI
			$('#txtSample').val("» BTPrinter Plugin Demo\n» ©2020 Andrés Zsögön");
			$('#optAlign').val(0);
			$('#optSize').val('00');
			$('#invertedIcon').hide();
		});
		$('#lineFeed').click(function () {
			// Print line feed
			var bytes = '0A';
			$('#txtPOS').val(bytes);
			$('#printPOSCommand').click();
		});
		$('#fontDemo').click(function () {
			var TXT_UNDERL_OFF = '1b2d00'; // bluetooth printer underline OFF
			var TXT_UNDERL_ON = '1b2d01'; // bluetooth printer underline font 1-dot ON
			var TXT_UNDERL2_ON = '1b2d02'; // bluetooth printer underline font 2-dot ON
			var TXT_BOLD_OFF = '1b4500'; // bluetooth printer bold font OFF
			var TXT_BOLD_ON = '1b4501'; // bluetooth printer bold font ON
			var TXT_FONT_A = '1b4d48'; // bluetooth printer font type A
			var TXT_FONT_B = '1b4d01'; // bluetooth printer font type B

			$('#reset').click();
			$('#txtEncoding').val('ISO-8859-1');

			/* Print font types demo */
			$('#txtSample').val('>>> FONT DEMO');
			$('#printText').click();

			$('#txtPOS').val(TXT_UNDERL_ON);
			$('#printPOSCommand').click();
			$('#txtSample').val('Underline font 1-dot');
			$('#printText').click();
			$('#reset').click();

			$('#txtPOS').val(TXT_UNDERL2_ON);
			$('#printPOSCommand').click();
			$('#printPOSCommand').click();
			$('#txtSample').val('Underline font 2-dot');
			$('#printText').click();
			$('#reset').click();

			$('#txtPOS').val(TXT_BOLD_ON);
			$('#printPOSCommand').click();
			$('#txtSample').val('Bold font ON');
			$('#printText').click();
			$('#reset').click();

			$('#txtPOS').val(TXT_FONT_A);
			$('#printPOSCommand').click();
			$('#txtSample').val('Font type A');
			$('#printText').click();
			$('#reset').click();

			$('#txtPOS').val(TXT_FONT_B);
			$('#printPOSCommand').click();
			$('#txtSample').val('Font type B');
			$('#printText').click();

			$('#reset').click();
			$('#txtSample').val('>>> Sent POS:FEED+BEEP+RESET');
			$('#printText').click();

			$('#lineFeed').click();
			$('#beepX3').click();
			$('#reset').click();
		});
		$('#sizeDemo').click(function () {
			$('#reset').click();
			$('#txtEncoding').val('ISO-8859-1');

			/* Print font sizes demo */
			$('#txtSample').val('>>> SIZE DEMO');
			$('#printText').click();

			$('#optSize').val('00');
			$('#txtSample').val('00 Normal Size');
			$('#printTextSizeAlign').click();

			$('#optSize').val('01');
			$('#txtSample').val('01 Reduced Size');
			$('#printTextSizeAlign').click();

			$('#optSize').val('10');
			$('#txtSample').val('10 Double Height');
			$('#printTextSizeAlign').click();

			$('#optSize').val('20');
			$('#txtSample').val('20 Double Width');
			$('#printTextSizeAlign').click();

			$('#optSize').val('30');
			$('#txtSample').val('30 Quad Area');
			$('#printTextSizeAlign').click();

			$('#reset').click();
			$('#txtSample').val('>>> Sent POS:FEED+BEEP+RESET');
			$('#printText').click();

			$('#lineFeed').click();
			$('#beepX3').click();
			$('#reset').click();
		});
		$('#beepX1').click(function () {
			// Beeps 1 time for 9*50ms
			var bytes = '1B420109';
			$('#txtPOS').val(bytes);
			$('#printPOSCommand').click();
		});
		$('#beepX3').click(function () {
			// Beeps 3 times for 9*50ms each time
			var bytes = '1B420309';
			$('#txtPOS').val(bytes);
			$('#printPOSCommand').click();
		});
		$('#printGreek').click(function () {
			// Greek sample text
			$('#txtEncoding').val('ISO-8859-7');
			$('#txtSample').val('>>> Set Encoding: ISO-8859-7');
			$('#setEncoding').click();
			$('#printText').click(); // print performed action

//				$('#txtPOS').val('1B740F'); /* (ESC t in HEX => 1B74) + (ISO-8859-7 => EPSON page 15 => 0F in HEX) */
//				$('#txtSample').val('>>> Set POS: 1B740F');
//				$('#printText').click(); // print performed action
//				$('#txtSample').val('    0F=HEX for EPSON page #15');
//				$('#printText').click(); // print performed action
//				$('#printPOSCommand').click();

			/* Greek character tables modes test with ISO-8859-7 encoding */
			testCP(11);
			testCP(14);
			testCP(15);
			testCP(38);
			testCP(47);

			$('#lineFeed').click();
			$('#beepX3').click();

		});
		$('#enableInverted').click(function () {
			// Enable inverted color
			var bytes = '1D4201';
			$('#txtPOS').val(bytes);
			$('#printPOSCommand').click();
			$('#invertedIcon').fadeIn();
			$('#txtSample').val('< Inverted Mode ON >');
			$('#optAlign').val(1);
			$('#printTitle').click();
			$('#optAlign').val(0);
			$('#lineFeed').click();
			$('#beepX1').click();
		});
		$('#disableInverted').click(function () {
			// Disable inverted color
			var bytes = '1D4200';
			$('#txtPOS').val(bytes);
			$('#printPOSCommand').click();
			$('#invertedIcon').fadeOut();
			$('#txtSample').val('< Inverted Mode OFF >');
			$('#optAlign').val(1);
			$('#printTitle').click();
			$('#optAlign').val(0);
			$('#lineFeed').click();
			$('#beepX1').click();
		});
		/* Demo app links */
		$('#btnAndreszsogon').click(function () {
			window.open('http://www.andreszsogon.com/cordova-bluetooth-printer-plugin-demo-app/', '_system');
		});
		$('#btnWebsite').click(function () {
			window.open('configuracion.html', '_system');
		});
	}
}

function onPause() {
	// TODO: This application has been suspended. Save application state here.
}

function onResume() {
	// TODO: This application has been reactivated. Restore application state here.
}

function testCP(table) {
	// Convert table from decimal to hex
	var hexa = table.toString(16);
	hexa = hexa.toUpperCase();
	if (hexa.length == 1) {
		hexa = '0' + hexa;
	}
	// Run POS command ESC + t + table_hex
	var pos = '1B74' + hexa;
	$('#txtPOS').val(pos);
	$('#printPOSCommand').click();
	// Create sample text
	$('#txtSample').val('#' + table + ' POS ' + pos + ' ΑαΒβΓγΔδΕε');
	$('#printText').click();
}

/* Initialize app */
app.initialize();
