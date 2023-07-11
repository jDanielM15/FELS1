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
const esperar1Seg = () => new Promise(resolve => setTimeout(resolve, 500));
const esperar3Seg = () => new Promise(resolve => setTimeout(resolve, 150));
const esperar2Seg = () => new Promise(resolve => setTimeout(resolve, 1000));
esperar1Seg()
.then(() => {
	hello.greet("", success, failure);
	return esperar1Seg();
}).then(() => {
myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
myDB2 = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
return esperar1Seg();

}).then(() => {
	//$("#idmenuoculto").hide();
	console.log("Ocultamos")

return esperar1Seg();

})
.then(() => {
//subetodo();
return esperar1Seg();
})


	$("#btnRegresar").click(function(){
			console.log("se preciona")
				setTimeout('window.location = "index.html"', 500)
		})




		function subetodo(){
			esperar1Seg()
			.then(() => {
				subeclientespendientes();
				return esperar1Seg();
			})
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
			}).then(() => {

				minusculas();

				return esperar1Seg();
			})
			.then(() => {

				$("#idmenuoculto").show();

				return esperar1Seg();
			})


			/////SIGUIENTE LLAVE CIERRA METODO
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
		function subefolios(){
			hello.greet("", success, failure);
			if(conn){
				myDB.transaction(function(transaction) {
						transaction.executeSql('select * from folios where idRemoto="0" and estado="1"  limit 1', [], function(tx, results) {
								var len = results.rows.length,i;

								if(len>0){
										var idlocal=sessionStorage.getItem("idDispositivo");
										var total=0;
										var idUsuario=0;
										var idCliente=0;
										var tipo=0;
										var folio=0;
										var estadodeventa=0;

										for (i = 0; i < len; i++) {
												idlocal=idlocal+results.rows.item(i).id;
												total=results.rows.item(i).total;
												idUsuario=results.rows.item(i).idusuario;
												idCliente=results.rows.item(i).idCliente;
												tipo=results.rows.item(i).tipoventa;
												folio=results.rows.item(i).id;
												estadodeventa=results.rows.item(i).estado;

										}

											var url="http://"+servidor+"/fels/functions/functions.php?dato=folio&tipo="+tipo+"&idcliente="+idCliente+"&idUsuario="+idUsuario+"&idlocal="+idlocal+"&total="+total+"&dispositivo="+sessionStorage.getItem("idDispositivo")+"&estadodeventa="+estadodeventa;
											console.log(url)
										$.ajax({
									method: "GET",
									url: url,
									async: false,
									}).done(function(data) {
									//	var obj = $.parseJSON(data);
									//	console.log(data["id"])
											if(data!=0){

													myDB.transaction(function(transaction) {
														var sql="update folios set idRemoto='"+data["id"]+"'   where id="+folio;
														console.log("1.- "+sql)
															transaction.executeSql(sql, [], function(tx, results) {
															}, null);
													});
													myDB.transaction(function(transaction) {
														var sql="update ventaproductos set folioremoto='"+data["id"]+"',foliolocal='"+idlocal+"'   where foliolocal="+folio;
														console.log("2.- "+sql)
															transaction.executeSql(sql, [], function(tx, results) {
															}, null);
													});




											}
									});
									subefolios();
								}

				}, null);
				});

			}

		}
		function subeproductosventa(){
			hello.greet("", success, failure);
			if(conn){
				myDB.transaction(function(transaction) {
						transaction.executeSql('select * from ventaproductos where idRemoto="0" and folioremoto!=0 limit 1', [], function(tx, results) {
								var len = results.rows.length,i;

								if(len>0){
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

										$.ajax({
									method: "GET",
									url: url,
									async: false,
									}).done(function(data) {
									//	var obj = $.parseJSON(data);
									//	console.log(data["id"])
											if(data!=0){

													myDB.transaction(function(transaction) {
														var sql="update ventaproductos set idRemoto='"+data["id"]+"'   where id="+idproductoactualizo;
														console.log("1.- "+sql)
															transaction.executeSql(sql, [], function(tx, results) {
															}, null);
													});

											}
									});
									subeproductosventa();
								}

				}, null);
				});

			}


			///termina funcion sube productos
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

			if(conn){
				myDB.transaction(function(transaction) {
						transaction.executeSql('select * from clientes where idRemoto="0" limit 1', [], function(tx, results) {
								var len = results.rows.length,i;

								if(len>0){
										var idlocal='';
										var datos;
										var url="http://"+servidor+"/fels/Administrador/clientes/AgregarNuevo.php";
										for (i = 0; i < len; i++) {
												idlocal=results.rows.item(i).idLocal;
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
																	"dispositivo":sessionStorage.getItem("idDispositivo")
																};
										}


										$.ajax({
									data: datos,
									method: "POST",
									url: url,
									async: false,
									}).done(function(data) {
											if(data!=0){
												myDB.transaction(function(transaction) {
														transaction.executeSql("update clientes set idRemoto='"+data+"'   where idLocal="+idlocal, [], function(tx, results) {
														}, null);
												});

											}
									});
									subeclientespendientes();
								}

				}, null);
				});

			}


		}

		$('#btnventa').click(function(){
			var idVenta=0;
			var cliente=$(this).attr("data-idCliente");
				esperar3Seg()
				.then(() => {
			
					//sessionStorage.setItem("idCliente",cliente);
					usuario=sessionStorage.getItem("idUsuario");
			
					return esperar3Seg();
				})
				.then(() => {
					if(cliente==0){
						alert("Ocurrio un error Intenta nuevamente")
					}else{
						insertaFolio(usuario);
					}
			
			return esperar3Seg();
			
				})
				.then(() => {
					var sql='SELECT id FROM folios where idusuario= "'+usuario+'" and estado= "0" ORDER BY  id DESC limit 1';
					myDB.transaction(function(transaction) {
							transaction.executeSql(sql, [], function(tx, results) {
									var len = results.rows.length,i;
										for (i = 0; i < len; i++) {
													idVenta=results.rows.item(i).id;
													console.log("CONSULTA +"+results.rows.item(i).id)
										}
			
					}, null);
					});
					return esperar3Seg();
				})
				.then(() => {
					if(idVenta==0){
						var sql='SELECT id FROM folios where idusuario= "'+usuario+'" and estado= "0" ORDER BY  id DESC limit 1';
						myDB.transaction(function(transaction) {
								transaction.executeSql(sql, [], function(tx, results) {
										var len = results.rows.length,i;
											for (i = 0; i < len; i++) {
														idVenta=results.rows.item(i).id;
														console.log("CONSULTA +"+results.rows.item(i).id)
											}
			
						}, null);
						});
			
					}else{
						sessionStorage.setItem("folio",idVenta);
					}
			
					return esperar3Seg();
				})
				.then(() => {
					if(idVenta==0){
						var sql='SELECT id FROM folios where idusuario= "'+usuario+'" and estado= "0" ORDER BY  id DESC limit 1';
						myDB.transaction(function(transaction) {
								transaction.executeSql(sql, [], function(tx, results) {
										var len = results.rows.length,i;
											for (i = 0; i < len; i++) {
														idVenta=results.rows.item(i).id;
														console.log("CONSULTA +"+results.rows.item(i).id)
											}
			
						}, null);
						});
			
					}else{
						sessionStorage.setItem("folio",idVenta);
					}
			
					return esperar3Seg();
				})
				.then(() => {
					sessionStorage.setItem("folio",idVenta);
					return esperar3Seg();
				})
				.then(() => {
					sessionStorage.setItem("folio",idVenta);
					return esperar3Seg();
				})
				.then(() => {
			
					return esperar3Seg();
				})
				.then(() => {
			
					setTimeout('window.location = "productos.html"', 100)
					return esperar3Seg();
				})

			// window.location = "productos.html";
		 });
		 $('#btncontinuar').click(function(){
			 window.location = "venta_pendiente.html";
			});
			$('#btnclientes').click(function(){
			 window.location = "nuevo_cliente.html";
			});
			$('#btncontinua').click(function(){
			 window.location = "venta_pendiente.html";
			});
			$('#btncotizaciones').click(function(){
			 window.location = "cotizaciones.html";
			});
			$('#btnreimprimir').click(function(){
			 window.location = "reimprimir.html";
			});
			$('#btnOrdenar').click(function(){
				window.location = "ordenar_productos.html";
			   });
			$('#btnCorte').click(function(){

			imprimir($("#txtFecha").val());
			});
			$('#btnActualiza').click(function(){
			window.location = "sincronizar.html";
			});

			function insertaFolio(usuario){
				esperar1Seg()
				.then(() => {
					let options = { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' };
			let formatter = new Intl.DateTimeFormat([], options);
			let date = formatter.format(new Date()).replace(/\//g, '-');
			date = date.split("-").reverse().join("-");
			
					var fechita = date;
					myDB.transaction(function(transaction) {
					var executeQuery = 'INSERT INTO "folios"("idRemoto","idCliente","idusuario","total","tipoventa","estado","fecha") VALUES ("0","87","'+usuario+'",0,0,0,"'+fechita+'")';
								console.log(executeQuery);
								transaction.executeSql(executeQuery, function(tx, result) {
									},
										function(error) {
			
										});
						});
			
					return esperar1Seg();
				})
			
			}
				//IMPRIMIR CORTE
			function imprimir(fecha){
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
								 var strText = "CORTE DEL DIA "+fecha+"\n Dispositivo: "+sessionStorage.getItem("idDispositivo");
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
				 var sql='select sum(ventaproductos.cantidad) as cantidad,productos.nombre as nombreproducto,sum(ventaproductos.cantidad*ventaproductos.precioFinal) as total, categorias.categoria  from folios inner join ventaproductos on ventaproductos.foliolocal=folios.foliolocal inner join productos on productos.idRemoto=ventaproductos.idProducto inner join categorias on categorias.idRemoto=productos.idcategoria where folios.fecha ="'+fecha+'" and tipoventa=0 GROUP by categorias.categoria order by categoria asc';
				 myDB.transaction(function(transaction) {
						 transaction.executeSql(sql, [], function(tx, results) {
								 var len = results.rows.length,i;
								 var categoria="";
								 var totalCategoria=0;
								 var bandera=0;
								 var totalventacontado=0;

								 var strText = "VENTAS DE CONTADO";
									 var strSize=1;
									 var strAlign=1;
									 BTPrinter.printTextSizeAlign(function (data) {

										 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
									 }, function (err) {
										 console.error('printTextSizeAlign: ' + err);
										 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
									 }, strText, strSize, strAlign);
											 for (i = 0; i < len; i++) {

												 if(categoria!=results.rows.item(i).categoria){

													 bandera=1;
													 categoria=results.rows.item(i).categoria+"---------------$"+results.rows.item(i).total;
													 var strText = categoria;
														var strSize=1;
														var strAlign=1;
														BTPrinter.printTextSizeAlign(function (data) {

															window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
														}, function (err) {
															console.error('printTextSizeAlign: ' + err);
															window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
														}, strText, strSize, strAlign);

												 }

												 var strText = "Cant :"+results.rows.item(i).cantidad+" "+results.rows.item(i).nombreproducto+" Total= $ "+results.rows.item(i).total;
													var strSize=1;
													var strAlign=0;
												//	BTPrinter.printTextSizeAlign(function (data) {}, function (err) {console.error('printTextSizeAlign: ' + err);}, strText, strSize, strAlign);
													totalCategoria=totalCategoria+results.rows.item(i).total;
													totalventacontado=totalventacontado+results.rows.item(i).total;
												}

													totalCategoria=0;

													var strText ="Total Ventas Contado $"+totalventacontado+"";
														var strSize=1;
														var strAlign=1;
														BTPrinter.printTextSizeAlign(function (data) {

															window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
														}, function (err) {
															console.error('printTextSizeAlign: ' + err);
															window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
														}, strText, strSize, strAlign);


				 }, null);
				 });
			 }

			return esperar1Seg();
				 })
			.then(() => {
					  if(noImpresora==1){
							var strText = "";
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
				 var sql='select sum(ventaproductos.cantidad) as cantidad,productos.nombre as nombreproducto,sum(ventaproductos.cantidad*ventaproductos.precioFinal) as total, categorias.categoria  from folios inner join ventaproductos on ventaproductos.foliolocal=folios.foliolocal inner join productos on productos.idRemoto=ventaproductos.idProducto inner join categorias on categorias.idRemoto=productos.idcategoria where folios.fecha ="'+fecha+'" and tipoventa=1 GROUP by ventaproductos.idProducto order by categoria asc';
				 myDB.transaction(function(transaction) {
						 transaction.executeSql(sql, [], function(tx, results) {
								 var len = results.rows.length,i;
								 var categoria="";
								 var totalCategoria=0;
								 var bandera=0;
								 var totalventacontado=0;


								 var strText = "VENTAS DE CREDITO";
									 var strSize=1;
									 var strAlign=1;
									 BTPrinter.printTextSizeAlign(function (data) {

										 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
									 }, function (err) {
										 console.error('printTextSizeAlign: ' + err);
										 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
									 }, strText, strSize, strAlign);
											 for (i = 0; i < len; i++) {

												 if(categoria!=results.rows.item(i).categoria){
													 if(bandera==1){
														 var strText = categoria+"---------------$"+totalCategoria;
															 var strSize=1;
															 var strAlign=1;
															 BTPrinter.printTextSizeAlign(function (data) {

																 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
															 }, function (err) {
																 console.error('printTextSizeAlign: ' + err);
																 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
															 }, strText, strSize, strAlign);
															 totalCategoria=0;

													 }
													 bandera=1;
													 categoria=results.rows.item(i).categoria;
													 var strText = categoria;
														var strSize=1;
														var strAlign=1;
														// BTPrinter.printTextSizeAlign(function (data) {

														// 	window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
														// }, function (err) {
														// 	console.error('printTextSizeAlign: ' + err);
														// 	window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
														// }, strText, strSize, strAlign);

												 }

												 var strText = "Cant :"+results.rows.item(i).cantidad+" "+results.rows.item(i).nombreproducto+" Total= $ "+results.rows.item(i).total;
													var strSize=1;
													var strAlign=0;
												//	BTPrinter.printTextSizeAlign(function (data) {}, function (err) {console.error('printTextSizeAlign: ' + err);}, strText, strSize, strAlign);
													totalCategoria=totalCategoria+results.rows.item(i).total;
													totalventacontado=totalventacontado+results.rows.item(i).total;
												}
												var strText = categoria+"--------------$"+totalCategoria+" \n";
													var strSize=1;
													var strAlign=1;
													BTPrinter.printTextSizeAlign(function (data) {

														window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
													}, function (err) {
														console.error('printTextSizeAlign: ' + err);
														window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
													}, strText, strSize, strAlign);

													var strText = "Total Ventas Credito $"+totalventacontado+"\n\n";
														var strSize=1;
														var strAlign=1;
														BTPrinter.printTextSizeAlign(function (data) {

															window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
														}, function (err) {
															console.error('printTextSizeAlign: ' + err);
															window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
														}, strText, strSize, strAlign);



				 }, null);
				 });
			 }

			return esperar1Seg();
				 })
				 .then(() => {
							 if(noImpresora==1){
								 var abonos=0;
								 var sql='select sum(cantidad) as total from creditos where fecha ="'+fecha+'" and tipo=1';
								 console.log(sql)
								 myDB.transaction(function(transaction) {
										 transaction.executeSql(sql, [], function(tx, results) {
												 var len = results.rows.length,i;
												 totalImprime=0;
															 for (i = 0; i < len; i++) {
																 var strText = "Abonos recibidos: $"+results.rows.item(i).total;
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

								 }, null);
								 });



							 }



						 return esperar1Seg();
						})
						.then(() => {
									if(noImpresora==1){
										var abonos=0;
										var sql='select sum(debe) as deuda from clientes';

										myDB.transaction(function(transaction) {
												transaction.executeSql(sql, [], function(tx, results) {
														var len = results.rows.length,i;
														totalImprime=0;
																	for (i = 0; i < len; i++) {
																		var strText = "Tus clientes te deben:                                $"+results.rows.item(i).deuda;
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

										}, null);
										});



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



			}
}

function imprimire(){
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
	 var sql='select idRemoto from categorias';
	 myDB.transaction(function(transaction) {
			 transaction.executeSql(sql, [], function(tx, results) {
					 var len = results.rows.length,i;
					 var html ='';
					 totalImprime=0;
								 for (i = 0; i < len; i++) {
									 totalCategoria=0;
									  var sqlproductos='select sum(ventaproductos.cantidad) as cantidad,productos.nombre as nombreproducto,sum(ventaproductos.cantidad*ventaproductos.precioFinal) as total from folios inner join ventaproductos on ventaproductos.foliolocal=folios.foliolocal inner join productos on productos.idRemoto=ventaproductos.idProducto inner join categorias on categorias.idRemoto=productos.idcategoria where folios.fecha ="2022-03-30" and tipoventa=0  and productos.idcategoria='+results.rows.item(i).idRemoto+' GROUP by ventaproductos.idProducto';
									 myDB.transaction(function(transaction) {
											 transaction.executeSql(sql, [], function(tx, resultados) {
													 var len = resultados.rows.length,i;

																 for (i = 0; i < len; i++) {
																	 ///Aqui todos se imprimen
																	 var strText = "Cantidad: "+resultados.rows.item(i).idRemoto+" "+resultados.rows.item(i).nombre+" Total= $"+resultados.rows.item(i).total;
													 				var strSize=1;
													 				var strAlign=1;
													 				BTPrinter.printTextSizeAlign(function (data) {
													 					console.log('printTextSizeAlign: ' + data);
													 					window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
													 				}, function (err) {
													 					console.error('printTextSizeAlign: ' + err);
													 					window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
													 				}, strText, strSize, strAlign);
																	totalCategoria=totalCategoria+resultados.rows.item(i).total

																	}
																	var strText = "Total de Categoria = $"+totalCategoria;
																 var strSize=1;
																 var strAlign=1;
																 BTPrinter.printTextSizeAlign(function (data) {
																	 console.log('printTextSizeAlign: ' + data);
																	 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + data);
																 }, function (err) {
																	 console.error('printTextSizeAlign: ' + err);
																	 window.plugins.toast.showLongBottom('printTextSizeAlign: ' + err);
																 }, strText, strSize, strAlign);

									 }, null);
									 });
									}

	 }, null);
	 });
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



}

function onPause() {
	// TODO: This application has been suspended. Save application state here.
}

function onResume() {
	// TODO: This application has been reactivated. Restore application state here.
}



/* Initialize app */
app.initialize();
