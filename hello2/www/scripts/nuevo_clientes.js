//sessionStorage.setItem("nombre", "Gonzalo");
//console.log(sessionStorage.getItem("nombre"))
//sessionStorage.removeItem("nombre");
var ruta=0;
var balneario=0;
var myDB;
var servidor="sistema.fels.com.mx";
var conn = false;
var ultimo=0;
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


function checkConnection() {
		$.ajax({
			url: 'http://'+servidor+'/process.php',
			async: false,
			data: {'tag' : 'connection'},
			timeout: 5000
		})
		.fail(function() { conn = false; })
		.done(function() { conn = true; })
		setTimeout(function(){
    console.log("I am the third log after 5 seconds");
},8000);
}
var success = function(message) {
	conn=true;
        console.log("HAY CONEXCION")
    }

    var failure = function() {
			conn = false
        console.log("NO HAY CONEXCION")
    }

function onDeviceReady() {
	hello.greet("", success, failure);
	myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
 const esperar1Seg = () => new Promise(resolve => setTimeout(resolve, 500));
esperar1Seg()
.then(() => {
  myDB.transaction(function(transaction) {
      transaction.executeSql('select * from rutas ', [], function(tx, results) {
          var len = results.rows.length,i;
          var html ='<option value="0">Seleccione una ruta</option>';
                for (i = 0; i < len; i++) {
                  html=html+'<option value="'+results.rows.item(i).idRemoto+'">'+results.rows.item(i).ruta+'</option>';

                  }
                  $("#selectruta").html(html);
									$("#selectrutanuevo").html(html);
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

  }, null);
  });
	return esperar1Seg();
})
.then(() => {

	$('#selectruta > option[value="'+ruta+'"]').attr('selected', 'selected');
	return esperar1Seg();
})
.then(() => {
	var sqlr='select * from balnearios where idRuta='+$("#selectruta").val();
	console.log(sqlr)
	myDB.transaction(function(transaction) {

			transaction.executeSql(sqlr, [], function(tx, results) {
					var len = results.rows.length,i;
					var html ='<option value="0">Seleccione un balneario</option>';
								for (i = 0; i < len; i++) {
									html=html+'<option value="'+results.rows.item(i).idRemoto+'">'+results.rows.item(i).nombre+'</option>';

									}

									$("#selectbalneariobuscar").html(html);
									$('#selectbalneariobuscar > option[value="'+balneario+'"]').attr('selected', 'selected');
	}, null);
	});


	return esperar1Seg();
})
.then(() => {
  myDB.transaction(function(transaction) {
      transaction.executeSql('select * from clientes order by nombre asc', [], function(tx, results) {
          var len = results.rows.length,i;
          var html ='';
                for (i = 0; i < len; i++) {
                  html=html+'<div class="container" align="center"><div class="row g-3"><div class="col-8" ><p><b>'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+'</b></p><p><b>Credito: $</b> '+results.rows.item(i).debe+'</p></div><div class="col-4" style="padding-top: 12%"><a class="btn m-1 btn-md btn-creative btn-success btnidir" data-idCliente="'+results.rows.item(i).idRemoto+'"  href="#" ><span class="fas fa-caret-right"></span> Ir</a></div></div><hr></div>';

                  }
                  $("#divclientes").html(html);
  }, null);
  });
	return esperar1Seg();
})
.then(() => {
	muestraclientes($("#selectruta").val(),$("#selectbalneariobuscar").val(),$("#txtBuscar").val())
	return esperar1Seg();
})
.then(() => {
  //subeclientespendientes();
	return esperar1Seg();
})
.then(() => {
  //subemodificaciones();
	return esperar1Seg();
})

function insertacliente(idRemoto,nombre,apellido,telefono,balneario,razonsocial,domicilio,codigopostal,regimenfiscal,rfc,email,credito){
	esperar1Seg()
	.then(() => {
		myDB.transaction(function(transaction) {
	var executeQuery = "INSERT INTO clientes('idRemoto','nombre','apellido','telefono','balneario','razonsocial','domicilio','codigopostal','regimenfiscal','rfc','email','credito','debe','monedero','estado')VALUES('"+idRemoto+"','"+nombre+"','"+apellido+"','"+telefono+"','"+balneario+"','"+razonsocial+"','"+domicilio+"','"+codigopostal+"','"+regimenfiscal+"','"+rfc+"','"+email+"','"+credito+"','0','0','1')";
				console.log(executeQuery);
				transaction.executeSql(executeQuery, function(tx, result) {
					},
						function(error) {

						});
		});
		return esperar1Seg();
	})
	.then(() => {
		var sql='SELECT idLocal FROM clientes ORDER BY idLocal DESC LIMIT 1;';
		myDB.transaction(function(transaction) {
	      transaction.executeSql(sql, [], function(tx, results) {
	          var len = results.rows.length,i;
	          var html ='';
	                for (i = 0; i < len; i++) {
										ultimo=results.rows.item(i).idLocal;
	                  }}, null);});
		return esperar1Seg();


	})
	.then(() => {
		var sql='UPDATE "clientes" SET "idRemoto"='+ultimo*-1+' WHERE "idLocal"='+ultimo;
		console.log(sql)
		myDB.transaction(function(transaction) {
				transaction.executeSql(sql, [], function(tx, results) {}, null);});
		return esperar1Seg();

	})
	.then(() => {
		muestraclientes($("#selectruta").val(),$("#selectbalneariobuscar").val(),$("#txtBuscar").val())

$("#txtnombrecliente").val("")
$("#txtapellidocliente").val("")
$("#txtcredito").val("0")


		return esperar1Seg();
	})


}




$("#selectruta").change(function(){
	esperar1Seg()
	.then(() => {
		var sqlr='select * from balnearios where idRuta='+$(this).val();
		console.log(sqlr)
		myDB.transaction(function(transaction) {

				transaction.executeSql(sqlr, [], function(tx, results) {
						var len = results.rows.length,i;
						var html ='<option value="0">Seleccione un balneario</option>';
									for (i = 0; i < len; i++) {
										html=html+'<option value="'+results.rows.item(i).idRemoto+'">'+results.rows.item(i).nombre+'</option>';

										}

										$("#selectbalneariobuscar").html(html);
		}, null);
		});
		return esperar1Seg();
	}).then(() => {muestraclientes($(this).val(),0,$("#txtBuscar").val())
esperar1Seg();
})
});

$("#selectbalneariobuscar").change(function(){
	esperar1Seg()
.then(() => {muestraclientes($("#selectruta").val(),$(this).val(),$("#txtBuscar").val())
esperar1Seg();
})
});

	function muestraclientes(ruta,balneario,palabra){
		var sql='SELECT clientes.idRemoto as ir,clientes.nombre||" "||clientes.apellido as nombrecliente,* FROM  clientes WHERE nombre LIKE "'+$("#txtBuscar").val()+'%"  or apellido LIKE "'+$("#txtBuscar").val()+'%" order by nombrecliente asc';
		if(ruta!=0&&balneario==0){
			sql='SELECT clientes.idRemoto as ir,clientes.nombre||" "||clientes.apellido as nombrecliente,balnearios.nombre as bal,* FROM  clientes inner join balnearios on balnearios.idRemoto=clientes.balneario inner join rutas on balnearios.idRuta=rutas.idRemoto WHERE (clientes.nombre LIKE "'+$("#txtBuscar").val()+'%"  or apellido LIKE "'+$("#txtBuscar").val()+'%") and rutas.idRemoto='+ruta+' order by nombrecliente asc'
			console.log(sql)
		}
		if(balneario!=0){
			console.log(sql)
			sql='SELECT clientes.idRemoto as ir,clientes.nombre||" "||clientes.apellido as nombrecliente,balnearios.nombre as bal,* FROM  clientes inner join balnearios on balnearios.idRemoto=clientes.balneario inner join rutas on balnearios.idRuta=rutas.idRemoto WHERE (clientes.nombre LIKE "'+$("#txtBuscar").val()+'%"  or apellido LIKE "'+$("#txtBuscar").val()+'%") and balnearios.idRemoto='+balneario+' order by nombrecliente asc'
		}
		console.log(sql)
		myDB.transaction(function(transaction) {
			transaction.executeSql(sql, [], function(tx, results) {
						var len = results.rows.length,i;
						var html ='';
									for (i = 0; i < len; i++) {
										html=html+'<div class="container" align="center"><div class="row g-3"><div class="col-8" ><p><b>'+results.rows.item(i).nombrecliente+'</b>('+results.rows.item(i).bal+')</p><p><b>Credito: $</b> '+results.rows.item(i).debe+'</p></div><div class="col-4" style="padding-top: 12%"><a class="btn m-1 btn-md btn-creative btn-success btnidir" data-idCliente="'+results.rows.item(i).ir+'"  href="#" ><span class="fas fa-caret-right"></span> Ir</a></div></div><hr></div>';

										}
										$("#divclientes").html(html);
		}, null);
		});

	}
$("#txtBuscar").keyup(function(){

		muestraclientes($("#selectruta").val(),$("#selectbalneariobuscar").val(),$("#txtBuscar").val())

});

$("#divclientes").on("click", ".btnidir", function(){
	var cliente=$(this).attr("data-idCliente");
	sessionStorage.setItem("idCliente",cliente);
	esperar1Seg()
	.then(() => {
///////////
myDB.transaction(function(transaction) {
		transaction.executeSql('select * from referencias', [], function(tx, results) {
				var len = results.rows.length,i;
				if(len>0){

					myDB.transaction(function(transaction) {
				var executeQuery = 'UPDATE "referencias" SET "idcliente"="'+cliente+'" WHERE "id"=1';
							console.log(executeQuery);
							transaction.executeSql(executeQuery, function(tx, result) {
								},function(error) {});
					});


				}else{
					myDB.transaction(function(transaction) {
				var executeQuery = 'INSERT INTO "referencias"("idcliente","idventa","vengo","idcredito") VALUES ("'+cliente+'",0,"ventas",0)';
							console.log(executeQuery);
							transaction.executeSql(executeQuery, function(tx, result) {
								},function(error) {});
					});

				}
}, null);
});
////////////
return esperar1Seg();
	})
	.then(() => {
		setTimeout('window.location = "datosCliente.html"', 1000)
		return esperar1Seg();
	})

});

$("#btnregresar").click(function(){setTimeout('window.location = "menu.html"', 500)});
$("#btnguardar").click(function(){
	//esperar1Seg().then(() => {});
	var nombre=$("#txtnombrecliente").val();
	var apellido=$("#txtapellidocliente").val();
	var telefono="";
	var balneario=$("#selectbalneario").val();
	var razonsocial="";
	var domicilio="";
	var codigopostal="";
	var regimenfiscal="";
	var rfc="";
	var email="";
	var credito=$("#txtcredito").val();
	esperar1Seg()

	.then(() => {
		if(balneario==0){alert("SELECCIONA UN BALNEARIO")
	}else if(nombre==""){
		alert("Falta Ingresar el nombre")
		return

	}else{
		insertacliente(0,nombre,apellido,telefono,balneario,razonsocial,domicilio,codigopostal,regimenfiscal,rfc,email,credito);
	}

		return esperar1Seg();
	})
	.then(() => {

				if(2==3){
					var url="http://"+servidor+"/fels/administrador/clientes/AgregarNuevo.php";
					var datos = {
    									"nombre" : nombre,
    									"apellido" : apellido,
											"tel" : telefono,
											"balneario" : balneario,
											"rfc" : rfc,
											"razonsocial" : razonsocial,
											"domicilio" : domicilio,
											"codigopostal" : codigopostal,
											"regimenfiscal" : regimenfiscal,
											"email" : email,
											"credito" : credito,
											"dispositivo":sessionStorage.getItem("idDispositivo")
										};
					$.ajax({
				data: datos,
				method: "POST",
				url: url,
				async: false,
				}).done(function(data) {
						if(data!=0){
							myDB.transaction(function(transaction) {
									transaction.executeSql("update clientes set idRemoto='"+data+"'   where idLocal=(SELECT idLocal FROM clientes ORDER BY  idLocal DESC limit 1)", [], function(tx, results) {
									}, null);
							});

						}
				});
			}
			return esperar1Seg();
	}).then(() => {
		myDB.transaction(function(transaction) {
				transaction.executeSql('select * from clientes ', [], function(tx, results) {
						var len = results.rows.length,i;
						var html ='';
									for (i = 0; i < len; i++) {
										html=html+'<div class="container" align="center"><div class="row g-3"><div class="col-8" ><p><b>'+results.rows.item(i).nombre+" "+results.rows.item(i).apellido+'</b></p><p><b>Credito: $</b> '+results.rows.item(i).debe+'</p></div><div class="col-4" style="padding-top: 12%"><a class="btn m-1 btn-md btn-creative btn-success btnidir" data-idCliente="'+results.rows.item(i).idRemoto+'"  href="#" ><span class="fas fa-caret-right"></span> Ir</a></div></div><hr></div>';

										}
										$("#divclientes").html(html);
		}, null);
		});

		return esperar1Seg();
	})

});
$("#selectrutanuevo").change(function(){
	var sql='SELECT * FROM balnearios where idRuta='+$(this).val()
	myDB.transaction(function(transaction) {
			transaction.executeSql(sql, [], function(tx, results) {
					var len = results.rows.length,i;
					var html ='<option value="0">Seleccione un Balneario</option>';
								for (i = 0; i < len; i++) {
									html=html+'<option value="'+results.rows.item(i).idRemoto+'">'+results.rows.item(i).nombre+'</option>';

									}
									$("#selectbalneario").html(html);
	}, null);
	});
});



}

function onPause() {
	// TODO: This application has been suspended. Save application state here.
}

function onResume() {
	// TODO: This application has been reactivated. Restore application state here.
}



/* Initialize app */
app.initialize();
