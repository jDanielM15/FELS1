//sessionStorage.setItem("nombre", "Gonzalo");
//console.log(sessionStorage.getItem("nombre"))
//sessionStorage.removeItem("nombre");
var myDB;
var servidor="sistema.fels.com.mx";
var conn = false;
var myDB;
var folioelimina=0;
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
esperar1Seg()
.then(() => {
myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
return esperar1Seg();

})
.then(() => {
  cargadatos();
	return esperar1Seg();
})

$("#pendientes").on("click", ".btncancela", function(){
  folioelimina=$(this).attr("data-folio");
  Swal.fire({
  icon: 'warning',
  title: '¿Eliminar venta pendiente?',
  confirmButtonText: 'Si'
}).then((result) => {
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {
      esperar1Seg()
      .then(() => {
				var sql1='DELETE FROM "ventaproductos" WHERE foliolocal='+folioelimina;
				console.log(sql1)
        myDB.transaction(function(transaction) {
            transaction.executeSql(sql1, [], function(tx, results) {
            }, null);
        });
        return esperar1Seg();
      })
      .then(() => {
				var sql2='DELETE FROM "folios" WHERE id='+folioelimina;
				console.log(sql2)
        myDB.transaction(function(transaction) {
            transaction.executeSql(sql2, [], function(tx, results) {
            }, null);
        });
      })
      .then(() => {
        cargadatos();
      })
  }
})

});
$("#pendientes").on("click", ".btncontinua", function(){
    folioelimina=$(this).attr("data-folio");
    esperar1Seg()
    .then(() => {
      sessionStorage.setItem("folio", folioelimina);
      return esperar1Seg();
    })
    .then(() => {
        window.location.href = "productos_venta.html";
    })
});
function cargadatos(){
  myDB.transaction(function(transaction) {
      transaction.executeSql('select * from folios inner join clientes on clientes.idRemoto=folios.idCliente where folios.estado=0', [], function(tx, results) {
          var len = results.rows.length,i;
          var html ='';
                for (i = 0; i < len; i++) {
                  html=html+'<div class="container"><div class="row g-3" align="center"><div class="col-8" style="padding-top: 3%"><p>Cliente: <b>'+results.rows.item(i).nombre+' '+results.rows.item(i).apellido+'</b></p></div><div class="col-4"><a class="btn m-1 btn-sm btn-creative btn-success btncontinua"  data-folio="'+results.rows.item(i).id+'" href="#"><span class="fas fa-caret-right"></span>Continuar</a><a class="btn m-1 btn-sm btn-creative btn-danger btncancela" data-folio="'+results.rows.item(i).id+'" href="#" style="width: 100%"><span class="fas fa-eraser"></span>Borrar</a></div><hr></div></div>';
                }
                  $("#pendientes").html(html);
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
