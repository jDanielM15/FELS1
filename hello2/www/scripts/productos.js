var myDB;
var totaltieneono=0;
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
	$("#idFolio").val(sessionStorage.getItem("folio"))
	console.log(sessionStorage.getItem("folio"));
	myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
 const esperar1Seg = () => new Promise(resolve => setTimeout(resolve, 300));
 esperar1Seg()
 .then(() => {
	 var sql="select clientes.nombre||' '||clientes.apellido as nombre,balnearios.nombre as bal from folios inner join clientes on clientes.idRemoto=folios.idCliente inner join balnearios on balnearios.idRemoto=clientes.balneario where folios.id="+$("#idFolio").val();
console.log(sql)
	 myDB.transaction(function(transaction) {
       transaction.executeSql(sql, [], function(tx, results) {
           var len = results.rows.length,i;
                 for (i = 0; i < len; i++) {
									 $("#labelNombre").html(results.rows.item(i).nombre+'')
                   }

   }, null);
   });
 	return esperar1Seg();
 })
 .then(() => {
	 sumatotal($("#idFolio").val())
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
 $("#conteinerproductos").on("click", ".test-popup-link", function(){
   $('.test-popup-link').magnificPopup({
      type: 'image'
     // other options
   });
 });
 $("#btnguardar").click(function (){
	 esperar1Seg()
	 .then(() => {
		 insertaproductos($("#idFolio").val(),$("#idProducto").val(),$("#txtcantidad").val(),$("#precio").val());
		 return esperar1Seg();
	 })
});

$("#selectCategorias").change(function(){
	subcategorias($(this).val());
	cargaproductos($(this).val(),0,"")
})
$("#selectSubcategoria").change(function(){
	cargaproductos($("#selectCategorias").val(),$(this).val(),"")
})
$("#btnbuscacodigo").click(function(){
if ($("#txtbuscacodigo").val() != "") {
	cargaproductos(0,0,$("#txtbuscacodigo").val())
	$("#txtbuscacodigo").val("")
}else{
	console.log("SIN BUSQUEDA");
}

	
});
$("#txtcantidad").keyup(function(){
	var cantidadpedido=$(this).val();
	if($(this).val()<0){$(this).val("")
}else{
	cantidadpedido=Math.trunc($(this).val());
	$(this).val(cantidadpedido);

}
});
$("#btnpendiente").click(function(){
	if(totaltieneono==0){
		esperar1Seg()
	  .then(() => {
			myDB.transaction(function(transaction) {
		 var executeQuery = 'DELETE FROM "folios" WHERE id ='+$("#idFolio").val();
						console.log(executeQuery)
					 transaction.executeSql(executeQuery, function(tx, result) {
						 },
							 function(error) {

							 });
			 });

			return esperar1Seg();
		})
		.then(() => {
			console.log("NO TIENE")
			setTimeout('window.location = "menu.html"', 1000)
			return esperar1Seg();

		})

	}else{
		console.log("SI TIENE")
		setTimeout('window.location = "menu.html"', 1000)
	}

});
 function insertaproductos(folio,idProducto,cantidad,precio){
	 if(parseInt($("#ocultocantidad").val()) >0){
		 if(cantidad==0){
			 myDB.transaction(function(transaction) {
		 var executeQuery = 'DELETE FROM ventaproductos WHERE idProducto= "'+idProducto+'" and foliolocal="'+folio+'"';
		 console.log(executeQuery )
					 transaction.executeSql(executeQuery, function(tx, result) {
						 },
							 function(error) {

							 });
			 });

		 }else{
			 myDB.transaction(function(transaction) {
		 var executeQuery = 'UPDATE "ventaproductos" SET "cantidad"="'+cantidad+'" WHERE "idProducto"="'+idProducto+'" and foliolocal="'+folio+'"';
					 transaction.executeSql(executeQuery, function(tx, result) {
						 },
							 function(error) {

							 });
			 });

		 }

	 }else{
		 myDB.transaction(function(transaction) {
	  var executeQuery = 'INSERT INTO "ventaproductos"("foliolocal","idRemoto","idProducto","cantidad","precio","precioFinal") VALUES ("'+folio+'","0","'+idProducto+'","'+cantidad+'","'+precio+'","'+precio+'")';
	  			transaction.executeSql(executeQuery, function(tx, result) {
	  				},
	  					function(error) {

	  					});
	  	});
	 }
	 $("#txtcantidad").val("")
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
									 $("#labeltotal").html("$"+total);
									 $("#ocultocantidad").val(cantidad)

	 }, null);
	 });
 }
 function sumatotal(folio){
	myDB.transaction(function(transaction) {
			transaction.executeSql('SELECT sum(cantidad*precio) as total FROM ventaproductos where foliolocal='+folio, [], function(tx, results) {
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
									totaltieneono=total;
									$("#Sumatotal").html("$"+total);
									if(total==0){
										$('#continuaroculto').hide();
									}else{
										$('#continuaroculto').show();
									}

	}, null);
	});
 }
 function subcategorias(idcategoria){
	 console.log(idcategoria)
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

 function cargaproductos(categoria,subcategoria,codigo){
	 console.log("Asi llega :"+codigo)
	 codigo=codigo.toLowerCase()
	 console.log("Asi lo busco :"+codigo)
	 var sql="SELECT * FROM productos where estado=1";

	 if(categoria>0){sql='SELECT * FROM productos where idcategoria="'+categoria+'" and estado=1'}
 		if(subcategoria>0&&categoria>0){sql='SELECT * FROM productos where idsubcategoria="'+subcategoria+'" and estado=1'}
	 if(codigo!=""){sql='SELECT * FROM productos where codigo="'+codigo+'" or (nombre like "%'+codigo+'%") and estado=1'}
	 console.log(sql)
	 myDB.transaction(function(transaction) {
			 transaction.executeSql(sql, [], function(tx, results) {
					 var len = results.rows.length,i;
					 var html ='';
								 for (i = 0; i < len; i++) {
									 html=html+'<div class="row g-3"><div class="col-6"><img class="test-popup-link" data-mfp-src="'+results.rows.item(i).imagen+'" src="'+results.rows.item(i).imagen+'" width="40" height="40"></div><div class="col-6"><p>'+results.rows.item(i).nombre+'</p></div><div class="col-6" style="padding-top: 4%"><p>Precio: <b>$'+results.rows.item(i).venta+'</b></p></div><div class="col-6"><a class="btn m-1 btn-creative btn-md btn-success btnagrega" data-nombre="'+results.rows.item(i).nombre+'" data-precio="'+results.rows.item(i).venta+'" data-idproducto="'+results.rows.item(i).idRemoto+'" data-bs-toggle="modal" data-bs-target="#bootstrapBasicModal" href="#"><span class="fas fa-plus"></span> Agregar</a></div><hr></div>';
									 }
									 $("#conteinerproductos").html(html);
	 }, null);
	 });
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
