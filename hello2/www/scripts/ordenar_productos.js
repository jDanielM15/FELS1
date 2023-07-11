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
 const esperar1Seg = () => new Promise(resolve => setTimeout(resolve, 300));
 esperar1Seg()
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
                                    html=html+'<div class="row g-3"><div class="col-6"><img class="test-popup-link" data-mfp-src="'+results.rows.item(i).imagen+'" src="'+results.rows.item(i).imagen+'" width="40" height="40"></div><div class="col-6"><p>'+results.rows.item(i).nombre+'</p></div><div class="col-6" style="padding-top: 4%"><p>Precio: <b>$'+results.rows.item(i).venta+'</b></p></div><div class="col-6"><a class="btn m-1 btn-creative btn-md btn-success btnagrega" data-nombre="'+results.rows.item(i).nombre+'" data-precio="'+results.rows.item(i).venta+'" data-idproducto="'+results.rows.item(i).idRemoto+'" data-bs-toggle="modal" data-bs-target="#bootstrapBasicModall" href="#"><span class="fas fa-plus"></span> Agregar</a></div><hr></div>';
                                    }
                                    $("#conteinerproductos").html(html);
    }, null);
    });
}

//Arrastrar
var table = document.getElementById("table");
    var rows = table.getElementsByTagName("tr");

    // Guardar las posiciones iniciales en localStorage
    for (var i = 0; i < rows.length; i++) {
        var positionCell = rows[i].querySelector(".position");
        var elementId = "element-" + i;
        positionCell.textContent = i + 1;
        rows[i].id = elementId;
        localStorage.setItem(elementId, i);
    }

    // Agregar los eventos de arrastrar y soltar a las filas
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        row.draggable = true;
        row.addEventListener("dragstart", handleDragStart, false);
        row.addEventListener("dragover", handleDragOver, false);
        row.addEventListener("dragenter", handleDragEnter, false);
        row.addEventListener("dragleave", handleDragLeave, false);
        row.addEventListener("drop", handleDrop, false);
        row.addEventListener("dragend", handleDragEnd, false);
    }

    function handleDragStart(event) {
        event.preventDefault();
        var dragData = {
            id: event.target.id,
            index: getIndex(event.target)
        };
        cordova.plugins.NativeDragDrop.startDrag(dragData, function() {
            // Drag started
        }, function(error) {
            console.error(error);
        });
    }

    function handleDragOver(event) {
        event.preventDefault();
        cordova.plugins.NativeDragDrop.dragOver(null, function() {
            // Drag over
        }, function(error) {
            console.error(error);
        });
    }

    function handleDragEnter(event) {
        event.preventDefault();
        cordova.plugins.NativeDragDrop.dragEnter(null, function() {
            // Drag enter
        }, function(error) {
            console.error(error);
        });
    }

    function handleDragLeave(event) {
        event.preventDefault();
        cordova.plugins.NativeDragDrop.dragLeave(null, function() {
            // Drag leave
        }, function(error) {
            console.error(error);
        });
    }

    function handleDrop(event) {
        event.preventDefault();
        var dropData = {
            id: event.target.id,
            index: getIndex(event.target)
        };
        cordova.plugins.NativeDragDrop.drop(dropData, function() {
            // Drop
            updatePositions();
            savePositions();
        }, function(error) {
            console.error(error);
        });
    }

    function handleDragEnd(event) {
        event.preventDefault();
        cordova.plugins.NativeDragDrop.endDrag(null, function() {
            // Drag ended
        }, function(error) {
            console.error(error);
        });
    }

    function updatePositions() {
        var rows = table.getElementsByTagName("tr");
        for (var i = 0; i < rows.length; i++) {
            var positionCell = rows[i].querySelector(".position");
            positionCell.textContent = i + 1;
        }
    }

    function getIndex(element) {
        var rows = table.getElementsByTagName("tr");
        for (var i = 0; i < rows.length; i++) {
            if (rows[i] === element) {
                return i;
            }
        }
        return -1;
    }

    function savePositions() {
        var rows = table.getElementsByTagName("tr");
        for (var i = 0; i < rows.length; i++) {
            var elementId = rows[i].id;
            var position = i;
            localStorage.setItem(elementId, position);
        }
    }

}

/* Initialize app */
app.initialize();