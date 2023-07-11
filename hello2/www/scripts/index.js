var myDB;
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
	myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
 const esperar1Seg = () => new Promise(resolve => setTimeout(resolve, 500));
esperar1Seg()
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

 $('#btnInicia').click(function(){

	 myDB.transaction(function(transaction) {
			 transaction.executeSql('select * from usuarios', [], function(tx, results) {
					 var len = results.rows.length,i;
							 if(len==0){
								 window.location = "config.html";

							 }else{
								 myDB.transaction(function(transaction) {
										transaction.executeSql("select * from usuarios where user ='"+$("#txtuser").val()+"' and contra='"+$("#txtcontra").val()+"'", [], function(tx, results) {
												var len = results.rows.length,i;
														if(len==1){
															for (i = 0; i < len; i++) {
																sessionStorage.setItem("idUsuario",results.rows.item(i).idPrincipal);
																	}
															esperar1Seg()
															.then(() => {
																myDB.transaction(function(transaction) {
															      transaction.executeSql('select foliocel from idcelular', [], function(tx, results) {
															          var len = results.rows.length,i;

															                for (i = 0; i < len; i++) {

																								sessionStorage.setItem("idDispositivo",results.rows.item(i).foliocel);
																								console.log("CREA SESSION ID "+results.rows.item(i).foliocel)
																							}

															  }, null);
															  });
																return esperar1Seg();
															})
															.then(() => {
																myDB.transaction(function(transaction) {
															      transaction.executeSql('select * from impresora', [], function(tx, results) {
															          var len = results.rows.length,i;

															                for (i = 0; i < len; i++) {
																								sessionStorage.setItem("impresora",results.rows.item(i).impresora);
																								console.log("CREA SESSION IMPRESORA "+results.rows.item(i).impresora)
																							}

															  }, null);
															  });
																return esperar1Seg();
															})
															.then(() => {
																setTimeout('window.location = "menu.html"', 1000)

															})


														}else{
															window.plugins.toast.showLongBottom('Credenciales Incorrectas');
														}
							}, null);
								});
							 }
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
