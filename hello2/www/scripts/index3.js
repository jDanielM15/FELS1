/* global BTPrinter */
var strPrinter =	"";
var myDB;
var texto="Hola MUndo";
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
function mensaje(parametro){
	$.ajax({
method: "GET",
url: "http://192.168.1.72/felsweb/fels/json/datos.php?dato=usuarios",
async: true,
}).done(function(data) {

});
}

function onDeviceReady() {
mensaje();
	console.log('onDeviceReady()');

	//var myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});

 myDB = window.sqlitePlugin.openDatabase({name: "db.db", location: 'default'});


	myDB.transaction(function(transaction) {
    transaction.executeSql('CREATE TABLE IF NOT EXISTS Impresora (id	INTEGER,nombre	TEXT,PRIMARY KEY("id" AUTOINCREMENT))', [],
        function(tx, result) {
          //  alert("Table created successfully");
						window.plugins.toast.showLongBottom('Table created successfully');
        },
        function(error) {
					window.plugins.toast.showLongBottom('Error occurred while creating the table.');
          //  alert("Error occurred while creating the table.");
        });
});

var title = "BlueTooth Printer";
var desc = "BlueTooth Printer";
myDB.transaction(function(transaction) {
    var executeQuery = "INSERT INTO Impresora ('nombre') VALUES ('Inserta1')";
    transaction.executeSql(executeQuery, function(tx, result) {
            //alert('Inserted');
						window.plugins.toast.showLongBottom('Inserted');
        },
        function(error) {
					window.plugins.toast.showLongBottom('Error occurred');
          //  alert('Error occurred');
        });
});
/*
myDB.transaction(function(transaction) {
		transaction.executeSql('SELECT * FROM codesundar', [], function(tx, results) {
				var len = results.rows.length,
						i;
				//$("#rowCount").append(len);

				for (i = 0; i < len; i++) {
					strPrinter=results.rows.item(i).title;
					console.log(results.rows.item(i).title)
						console.log("<tr><td>" + results.rows.item(i).id + "</td><td>" +results.rows.item(i).title + "</td><td>" + results.rows.item(i).desc + "</td></tr>");
				}


		}, null);
}); */
myDB.transaction(function(transaction) {

		transaction.executeSql('SELECT * FROM Impresora', [], function(tx, results) {
				var len = results.rows.length,i;
				//$("#rowCount").append(len);
	console.log("CORRE fuera")
				for (i = 0; i < len; i++) {
				//	strPrinter=results.rows.item(i).title;
				console.log("CORRE")
					console.log(results.rows.item(i).nombre+' '+results.rows.item(i).id)
					//	console.log("<tr><td>" + results.rows.item(i).id + "</td><td>" +results.rows.item(i).title + "</td><td>" + results.rows.item(i).desc + "</td></tr>");
				}


		}, null);
});

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
