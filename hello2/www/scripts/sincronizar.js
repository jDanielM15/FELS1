//sessionStorage.setItem("nombre", "Gonzalo");
//console.log(sessionStorage.getItem("nombre"))
//sessionStorage.removeItem("nombre");

var totalCategoria=0;
var totalventas=0;
var totalcreditos=0;
var noImpresora=1;
var myDB;
var myDB2;
var servidor="sistema.fels.com.mx";
var conn = false;
var myDB;
var monederocliente=0;
var debecliente=0;
var deberemos=0;
var nombreimprime="";
var domicilioimprime="";
var idRemotoConsulta;
var folio=0;
var porsubir=0;
var contadorsubir=0;
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
const esperar1Seg = () => new Promise(resolve => setTimeout(resolve, 1000));
const esperar2Seg = () => new Promise(resolve => setTimeout(resolve, 1000));
esperar1Seg()
.then(() => {
	$("#idmenuoculto").hide();
	$('#general').html('<div class="loading"><img src="images/progress.gif" alt="loading" /><br/>Un momento, por favor...</div>');

return esperar1Seg();

})
.then(() => {
//	hello.greet("", success, failure);
	return esperar1Seg();
}).then(() => {
	myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
	myDB2 = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});



return esperar1Seg();

})
.then(() => {
	checarcuantosbajar()
})
.then(() => {
	revisar()
})


function revisar(){
	contadorsubir=0;
	esperar1Seg()
	.then(() => {
		myDB.transaction(function(transaction) {
			var sql='DELETE FROM "ventaproductos" WHERE foliolocal= 0 or foliolocal="BXD0" or "cantidad" ='+"''";
			console.log(sql)
				transaction.executeSql(sql, [], function(tx, results) {


		}, null);
		});
	return esperar1Seg();
	})
	.then(() => {
		myDB.transaction(function(transaction) {
			var sql='DELETE FROM "folios" WHERE total= 0 and idCliente !=0 ;';
			console.log(sql)
				transaction.executeSql(sql, [], function(tx, results) {


		}, null);
		});
	return esperar1Seg();
	})
	.then(() => {
		myDB.transaction(function(transaction) {
			var sql='select count() as clientes from clientes where idRemoto<"0"  limit 1';
			console.log(sql)
				transaction.executeSql(sql, [], function(tx, results) {
						var len = results.rows.length,i;
									for (i = 0; i < len; i++) {
										contadorsubir=contadorsubir+results.rows.item(i).clientes
									}

		}, null);
		});
	return esperar1Seg();
	})
	.then(() => {
		myDB.transaction(function(transaction) {
			var sql="select count() as creditos from creditos where idRemoto=0 limit 1";
			console.log(sql)
				transaction.executeSql(sql, [], function(tx, results) {
						var len = results.rows.length,i;
									for (i = 0; i < len; i++) {
										contadorsubir=contadorsubir+results.rows.item(i).creditos
									}

		}, null);
		});


	return esperar1Seg();
	})
	.then(() => {

		myDB.transaction(function(transaction) {
			var sql='select count() as folios from folios where (idRemoto="0" or idRemoto="undefined" )and estado="1"   limit 1';
			console.log(sql)
				transaction.executeSql(sql, [], function(tx, results) {
						var len = results.rows.length,i;
									for (i = 0; i < len; i++) {
										contadorsubir=contadorsubir+results.rows.item(i).folios
									}

		}, null);
		});

	return esperar1Seg();
	})
	.then(() => {

		myDB.transaction(function(transaction) {
			var sql='select count() as productos from ventaproductos where (idRemoto="0" or idRemoto="undefined") and folioremoto>0 limit 1';
			console.log(sql)
				transaction.executeSql(sql, [], function(tx, results) {
						var len = results.rows.length,i;
									for (i = 0; i < len; i++) {
										contadorsubir=contadorsubir+results.rows.item(i).productos
									}

		}, null);
		});


	return esperar1Seg();

	})
	.then(() => {

		corrigefolios();


	return esperar1Seg();

	})
	.then(() => {
$("#txtbtonsube").html('<span class="fas fa-upload"></span>Sube Datos ('+contadorsubir+')');
	return esperar1Seg();
	})
	.then(() => {
	$('#general').html('');
		$("#idmenuoculto").show()
	return esperar1Seg();
	})
}


	$("#btnRegresar").click(function(){

				setTimeout('window.location = "menu.html"', 100)
		})
		$("#btnDatosDemo").click(function(){
			for (var i = 0; i <=500; i++) {
				//	insertacliente(-888,'vic','galvan','7777777777',8,'','','43566','local','rfc','ssss@ddd.com',5000)
			}

		});
		$("#btnsube").click(function(){
			Swal.fire({
title: '¿Deseas subir informacion?',
text: "No se podra usar la aplicación!",
icon: 'warning',
showCancelButton: true,
confirmButtonColor: '#2b8dc2',
cancelButtonColor: '#d33',
confirmButtonText: 'Subir',
cancelButtonText: 'No'
}).then((result) => {
if (result.isConfirmed) {
	$("#idmenuoculto").hide();
	$('#general').html('<div class="loading"><img src="images/progress.gif" alt="loading" /><br/>Un momento, por favor...</div>');
	esperar1Seg()
	.then(() => {
		subeclientespendientes()
		return esperar1Seg();
	})
	.then(() => {
		subecreditos()
		return esperar1Seg();
	})
	.then(() => {
		subefolios()
		return esperar1Seg();
	})
	.then(() => {
		subeproductosventa()
		return esperar1Seg();
	})
	.then(() => {
		revisar()
		return esperar1Seg();
	})
}
})
});
function corrigefolios(){
	console.log("funcion CORRIGEFOLIOS");
	myDB.transaction(function(transaction) {
		var sql='select ventaproductos.foliolocal as folio,ventaproductos.idRemoto,folios.idRemoto as actualiza from ventaproductos inner join folios on folios.foliolocal=ventaproductos.foliolocal where ventaproductos.folioremoto ="undefined" or ventaproductos.folioremoto =0 GROUP BY ventaproductos.foliolocal';
		console.log(sql)
			transaction.executeSql(sql, [], function(tx, results) {
					var len = results.rows.length,i;
					if(len>0){
						for (i = 0; i < len; i++) {
							var sqlactu="update ventaproductos set folioremoto='"+results.rows.item(i).actualiza+"' where foliolocal='"+results.rows.item(i).folio+"'";
							console.log("CORRIGEFOLIOS= "+sqlactu)
							myDB.transaction(function(transaction) {
							transaction.executeSql(sqlactu, [], function(tx,results) {}, null);
													});
						}
						corrigefolios()
					}


	}, null);
	});


}






		function minusculas(){
			myDB.transaction(function(transaction) {
		var executeQuery = "UPDATE productos SET codigo=lower(codigo)";

					transaction.executeSql(executeQuery, function(tx, result) {
						},
							function(error) {

							});
			});
		}
		function checarcuantosbajar(){
			var url="http://"+servidor+"/fels/functions/functions.php?dato=bajarDatosCant&idDispositivo="+sessionStorage.getItem("idDispositivo");
			console.log(url)
			$.ajax({
		method: "GET",
		url: url,
		async: false,
		}).done(function(data) {
			$("#txtbtonBaja").html('<span class="fas fa-download"></span> Descarga Datos ('+data['id']+')');

		})

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
		function subeclientespendientes(){
console.log("SUBE CLIENTES")
			if(1==1){
				myDB.transaction(function(transaction) {
						transaction.executeSql('select * from clientes where idRemoto<"0"  limit 1', [], function(tx, results) {
								var len = results.rows.length,i;

								if(len>0){
									$("#idmenuoculto").hide()
	$('#general').html('<div class="loading"><img src="images/progress.gif" alt="loading" /><br/>Un momento, por favor...</div>');
										var idlocal='';
										var idRemoto='';
										var datos;
										var url="http://"+servidor+"/fels/Administrador/clientes/AgregarNuevo.php";
										for (i = 0; i < len; i++) {
												idlocal=results.rows.item(i).idLocal;
												idRemoto=results.rows.item(i).idRemoto;
												datos = {
																	"nombre" : results.rows.item(i).nombre,
																	"apellido" : results.rows.item(i).apellido,
																	"tel" : results.rows.item(i).telefono,
																	"balneario" : results.rows.item(i).balneario,
																	"rfc" : results.rows.item(i).rfc,
																	"razonsocial" : results.rows.item(i).razonsocial,
																	"domicilio" : results.rows.item(i).domicilio,
																	"codigopostal" : results.rows.item(i).codigopostal,
																	"regimenfiscal" : results.rows.item(i).regimenfiscal,
																	"email" : results.rows.item(i).email,
																	"credito" : results.rows.item(i).credito,
																	"debe" : results.rows.item(i).debe,
																	"dispositivo":sessionStorage.getItem("idDispositivo")+idlocal
																};
										}


										$.ajax({
									data: datos,
									method: "POST",
									url: url,
									async: false,
									}).done(function(data) {
										console.log(data)
											if(data!=0){
												if(esNUm(data)){
													myDB.transaction(function(transaction) {
															transaction.executeSql("update clientes set idRemoto='"+data+"'   where idLocal="+idlocal, [], function(tx, results) {
															}, null);
															console.log("Actualiza cliente")
													});
													myDB.transaction(function(transaction) {
														var sql="UPDATE creditos SET idCliente="+data+" WHERE idCliente="+idRemoto;
															transaction.executeSql(sql, [], function(tx, results) {
															}, null);
															console.log("Actualiza creditos > ")
													});
													myDB.transaction(function(transaction) {
															transaction.executeSql("UPDATE folios SET idCliente="+data+" WHERE idCliente="+idRemoto, [], function(tx, results) {
															}, null);
															console.log("Actualiza folios")
													});
													myDB.transaction(function(transaction) {
															transaction.executeSql("UPDATE monedero SET idCliente="+data+" WHERE idCliente="+idRemoto, [], function(tx, results) {
															}, null);
															console.log("Actualiza monedero")
													});
												}
											}
									});
									subeclientespendientes();
								}

				}, null);
				});

			}


		}
		function subecreditos(){
			console.log("SUBE creditos")

			if(1==1){
				myDB.transaction(function(transaction) {
						transaction.executeSql('select * from creditos where idRemoto=0 and idCliente>0 limit 1', [], function(tx, results) {
								var len = results.rows.length,i;

								if(len>0){
									$("#idmenuoculto").hide()
	$('#general').html('<div class="loading"><img src="images/progress.gif" alt="loading" /><br/>Un momento, por favor...</div>');
										var idlocal=sessionStorage.getItem("idDispositivo");
										var id=0;

										for (i = 0; i < len; i++) {
												idFolio=results.rows.item(i).idfolio;
												idCliente=results.rows.item(i).idCliente;
												cantidad=results.rows.item(i).cantidad;
												fecha=results.rows.item(i).fecha;
												tipo=results.rows.item(i).tipo;
												folioCel=idlocal+results.rows.item(i).id;
												id=results.rows.item(i).id;
										}

											var url="http://"+servidor+"/fels/functions/functions.php?dato=credito&idFolio="+idFolio+"&idcliente="+idCliente+"&cantidad="+cantidad+"&fecha="+fecha+"&tipo="+tipo+"&dispositivo="+sessionStorage.getItem("idDispositivo")+"&folioCel="+folioCel;
											console.log(url)
										$.ajax({
									method: "GET",
									url: url,
									async: false,
									}).done(function(data) {
									//	var obj = $.parseJSON(data);
									//	console.log(data["id"])

											if(data!=0){
													if(esNUm(data["id"])){
														myDB.transaction(function(transaction) {
															var sql="update creditos set idRemoto='"+data["id"]+"'   where id="+id;
															console.log("1.- "+sql)
																transaction.executeSql(sql, [], function(tx, results) {
																}, null);
														});
													}

												}
									});
									subecreditos();
								}

				}, null);
				});

			}

		}
		function subefolios(){
			console.log("SUBE FOLIOS")
			hello.greet("", success, failure);
			if(1==1){
				myDB.transaction(function(transaction) {
						transaction.executeSql('select * from folios where (idRemoto="0" or idRemoto="undefined" )and estado="1" and idcliente>0    limit 1', [], function(tx, results) {
								var len = results.rows.length,i;

								if(len>0){
									$("#idmenuoculto").hide()
	$('#general').html('<div class="loading"><img src="images/progress.gif" alt="loading" /><br/>Un momento, por favor...</div>');
										var idlocal=sessionStorage.getItem("idDispositivo");
										var total=0;
										var idUsuario=0;
										var idCliente=0;
										var tipo=0;

										var estadodeventa=0;

										for (i = 0; i < len; i++) {
												idlocal=idlocal+results.rows.item(i).id;
												total=results.rows.item(i).total;
												idUsuario=results.rows.item(i).idusuario;
												idCliente=results.rows.item(i).idCliente;
												tipo=results.rows.item(i).tipoventa;
												folio=results.rows.item(i).id;
												estadodeventa=results.rows.item(i).estado;

												abono=results.rows.item(i).abono;
												monedero=results.rows.item(i).monedero;
												debeahora=results.rows.item(i).debeahora;
												fechaventa=results.rows.item(i).fecha;

										}

											var url="http://"+servidor+"/fels/functions/functions.php?dato=folio&tipo="+tipo+"&idcliente="+idCliente+"&idUsuario="+idUsuario+"&idlocal="+idlocal+"&total="+total+"&dispositivo="+sessionStorage.getItem("idDispositivo")+"&estadodeventa="+estadodeventa+"&fecha="+fechaventa+"&abono="+abono+"&monedero="+monedero+"&debeahora="+debeahora;
											console.log(url)
										$.ajax({
									method: "GET",
									url: url,
									async: false,
									}).done(function(data) {
									//	var obj = $.parseJSON(data);
									//	console.log(data["id"])
											if(data!=0){
																	if(esNUm(data["id"])){
																		myDB.transaction(function(transaction) {
																			var sql="update folios set idRemoto='"+data["id"]+"'   where id="+folio;
																			console.log("1.- "+sql)
																				transaction.executeSql(sql, [], function(tx, results) {
																				}, null);
																		});
																		myDB.transaction(function(transaction) {
																			var sql="update ventaproductos set folioremoto='"+data["id"]+"' where foliolocal='"+idlocal+"'";
																			console.log("2.- "+sql)
																				transaction.executeSql(sql, [], function(tx, results) {
																				}, null);
																		});
																	}
																}
									});
									subefolios();
								}

				}, null);
				});

			}

		}
		function subeproductosventa(){
			console.log("SUBE PRODUCTOSVENTA")

			if(1==1){
				myDB.transaction(function(transaction) {
						transaction.executeSql('select * from ventaproductos where (idRemoto="0" or idRemoto="undefined") and folioremoto>0 limit 1', [], function(tx, results) {
								var len = results.rows.length,i;

								if(len>0){
									$("#idmenuoculto").hide()
	$('#general').html('<div class="loading"><img src="images/progress.gif" alt="loading" /><br/>Un momento, por favor...</div>');
										var idlocal=sessionStorage.getItem("idDispositivo");
										var precioFinal=0;
										var foliolocal=0;
										var precio=0;
										var idproducto=0;
										var folioRemoto=0;
										var cantidad=0;
										var idproductoactualizo=0;

										for (i = 0; i < len; i++) {
												precioFinal=results.rows.item(i).precioFinal;
												foliolocal=results.rows.item(i).foliolocal;
												precio=results.rows.item(i).precio;
												idproducto=results.rows.item(i).idProducto;
												folioRemoto=results.rows.item(i).folioremoto;
												cantidad=results.rows.item(i).cantidad;
												idproductoactualizo=results.rows.item(i).id;
										}

											var url="http://"+servidor+"/fels/functions/functions.php?dato=productos&cantidad="+cantidad+"&folio="+folioRemoto+"&idproducto="+idproducto+"&precio="+precio+"&dispositivo="+sessionStorage.getItem("idDispositivo")+"&foliolocal="+foliolocal+"&precioFinal="+precioFinal;
											console.log(url)
										$.ajax({
									method: "GET",
									url: url,
									async: false,
									}).done(function(data) {
									//	var obj = $.parseJSON(data);
									//	console.log(data["id"])
											if(data!=0){
														if(esNUm(data["id"])){
															myDB.transaction(function(transaction) {
																var sql="update ventaproductos set idRemoto='"+data["id"]+"'   where id="+idproductoactualizo;
																console.log("1.- "+sql)
																	transaction.executeSql(sql, [], function(tx, results) {
																	}, null);
															});

														}


											}
									});
									subeproductosventa();
								}

				}, null);
				});

			}

		//	location.reload();

		}

			$('#btnActualiza').click(function(){
				Swal.fire({
  title: '¿Actualizar productos?',
  text: "No se podra usar la aplicación!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#2b8dc2',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si Actualizar',
	cancelButtonText: 'No'
}).then((result) => {
  if (result.isConfirmed) {
		esperar1Seg()
		.then(() => {
			$("#idmenuoculto").hide()
			return esperar1Seg();
		})
		.then(() => {
			$('#general').html('<div class="loading"><img src="images/progress.gif" alt="loading" /><br/>Un momento, por favor...</div>');
			return esperar1Seg();
		})
		.then(() => {
			myDB.transaction(function(transaction) {
				var sql='delete from "productos"';
				console.log(sql)
			transaction.executeSql(sql, [], function(tx,results) {}, null);
									});
									return esperar1Seg();
		})
		.then(() => {
			myDB.transaction(function(transaction) {
				var sql='update sqlite_sequence set seq=0 where name="productos"';
				console.log(sql)
			transaction.executeSql(sql, [], function(tx,results) {}, null);
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
		}, 50000);

			});

		});
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
			console.log("YA TERMINO ")
			return esperar1Seg();})
		.then(() => {
			console.log("YA TERMINO Pen Ultimo")
			return esperar1Seg();})
		.then(() => {
			console.log("YA TERMINO final")
			return esperar1Seg();})
		.then(() => {
			$('#general').html('');
			return esperar1Seg();
		})
		.then(() => {
			$("#idmenuoculto").show()
			return esperar1Seg();
		})


  }
})
			});
$('#btndescargaXX').click(function(){
				Swal.fire({
  title: '¿Descargaras Datos?',
  text: "No se podra usar la aplicación!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#2b8dc2',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si Descargar',
	cancelButtonText: 'No'
}).then((result) => {
  if (result.isConfirmed) {
		esperar1Seg()
		.then(() => {
			$("#idmenuoculto").hide()
			return esperar1Seg();
		})
		.then(() => {
			$('#general').html('<div class="loading"><img src="images/progress.gif" alt="loading" /><br/>Un momento, por favor...</div>');
			return esperar1Seg();
		})
		.then(() => {
			myDB.transaction(function(transaction) {
				var sql='delete from "categorias"';
				console.log(sql)
			transaction.executeSql(sql, [], function(tx,results) {}, null);
									});
									return esperar1Seg();
		})
		.then(() => {
			myDB.transaction(function(transaction) {
				var sql='update sqlite_sequence set seq=0 where name="categorias"';
				console.log(sql)
			transaction.executeSql(sql, [], function(tx,results) {}, null);
									});
									return esperar1Seg();
		})
		.then(() => {
			myDB.transaction(function(transaction) {
				var sql='delete from "subcategorias"';
				console.log(sql)
			transaction.executeSql(sql, [], function(tx,results) {}, null);
									});
									return esperar1Seg();

		})
		.then(() => {
			myDB.transaction(function(transaction) {
				var sql='update sqlite_sequence set seq=0 where name="subcategorias"';
				console.log(sql)
			transaction.executeSql(sql, [], function(tx,results) {}, null);
									});
									return esperar1Seg();

		})
		.then(() => {
			myDB.transaction(function(transaction) {
				var sql='delete from "balnearios"';
				console.log(sql)
			transaction.executeSql(sql, [], function(tx,results) {}, null);
									});
									return esperar1Seg();
								})
		.then(() => {
			myDB.transaction(function(transaction) {
				var sql='update sqlite_sequence set seq=0 where name="balnearios"';
				console.log(sql)
			transaction.executeSql(sql, [], function(tx,results) {}, null);
									});
									return esperar1Seg();

		})
		.then(() => {
			myDB.transaction(function(transaction) {
				var sql='delete from "rutas"';
				console.log(sql)
			transaction.executeSql(sql, [], function(tx,results) {}, null);
									});
									return esperar1Seg();
								})
		.then(() => {
			myDB.transaction(function(transaction) {
				var sql='update sqlite_sequence set seq=0 where name="rutas"';
				console.log(sql)
			transaction.executeSql(sql, [], function(tx,results) {}, null);
									});
									return esperar1Seg();
								})
								.then(() => {
									myDB.transaction(function(transaction) {
										var sql='delete from "usuarios"';
										console.log(sql)
									transaction.executeSql(sql, [], function(tx,results) {}, null);
															});
															return esperar1Seg();
														})
								.then(() => {
									myDB.transaction(function(transaction) {
										var sql='update sqlite_sequence set seq=0 where name="usuarios"';
										console.log(sql)
									transaction.executeSql(sql, [], function(tx,results) {}, null);
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
			console.log("YA TERMINO ")
			return esperar1Seg();})
		.then(() => {
			console.log("YA TERMINO Pen Ultimo")
			return esperar1Seg();})
		.then(() => {
			console.log("YA TERMINO final")
			return esperar1Seg();})
		.then(() => {
			$('#general').html('');
			return esperar1Seg();
		})
		.then(() => {
			$("#idmenuoculto").show()
			return esperar1Seg();
		})


  }
})
			});
			function esNUm(val){
  return !isNaN(val)
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
