var services = (function () {
    var api = apiclient;
    var selectedBlueprint = "";
    var aut ="";
    var listaBlueprints="";
    var lockCanvas=true;

    function doMap(blueprints) {
        return blueprints.map(function (bp) {
            return {
                bpname: bp.name,
                points: bp.points.length
            }
        })
    }

    function sumaPuntos(blueprints) {
        return blueprints.reduce(function (total, num) {
            return total + num.points;
        }, 0);
    }

    function llenaTabla(blueprints) {
        var autor = blueprints[0].author;
        blueprints = doMap(blueprints);
        $("#bpTable").empty();
        blueprints.map(function (bp) {
            var fila = "<tr> <td>" + bp.bpname + "</td> <td>" + bp.points + "</td> <td>" + '<button type="button" onclick="services.searchAuthorByName(\'' + bp.bpname + '\',\'' + autor + '\')"> Open </button></td></tr>';
            $("#bpTable").append(fila);
        })
        var resultado = sumaPuntos(blueprints);
        $("#totalPoints").text("la suma de puntos da " + resultado);
    }

    function dibujar(blueprint) {
        $("#currentBlueprint").text("The current Blueprint is: " + blueprint.name)
        var can = document.getElementById("myCanvas");
        var lapiz = can.getContext("2d");
        lapiz.clearRect(0, 0, can.width, can.height);
        lapiz.beginPath();
        var punto = blueprint.points[0];
        console.log(punto);
        lapiz.moveTo(punto.x, punto.y);
        blueprint.points.map(function (p) {
                lapiz.lineTo(p.x, p.y)
            }, 1
        )
        lapiz.stroke();
        selectedBlueprint = blueprint;
        if (window.PointerEvent) {

                can.addEventListener("pointerdown", continueDraw, false);

        } else {
            //Provide fallback for user agents that do not support Pointer Events

                can.addEventListener("mousedown", continueDraw, false);

        }
    }

    function continueDraw(event) {
        if (!lockCanvas) {
            var canvas = document.getElementById('myCanvas');
            var offset = getOffset(canvas);
            if (canvas.getContext) {
                var ctx = canvas.getContext("2d");
                ctx.lineTo(ctx.pageX, ctx.pageY)
                ctx.stroke();
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(event.pageX - offset.left, event.pageY - offset.top, 5, 5);
                selectedBlueprint.points.push({x: event.pageX - offset.left, y: event.pageY - offset.top});
                ctx.lineTo(event.pageX - offset.left, event.pageY - offset.top);
                ctx.stroke();
                console.log(selectedBlueprint)
            }
        }

    }

    function getOffset(obj) {
        var offsetLeft = 0;
        var offsetTop = 0;
        do {
            if (!isNaN(obj.offsetLeft)) {
                offsetLeft += obj.offsetLeft;
            }
            if (!isNaN(obj.offsetTop)) {
                offsetTop += obj.offsetTop;
            }
        } while (obj = obj.offsetParent);
        return {left: offsetLeft, top: offsetTop};
    }

    createBlueprint= function(){
        clearCanvas()
        selectedBlueprint = {
            author: null,
            name: null,
            points: []
        }
        selectedBlueprint.author = document.getElementById("nameValue").value;
        if(aut == null || aut == ""){
            alert('Primero Busca un autor para agregarle el blueprint');
        }
        else{

            selectedBlueprint.name = prompt('Nombre del blueprint: \n tu blueprint se iniciará en x,y = (0,0)');
            selectedBlueprint.points = [{x:0,y:0}];
        }
        blueprintPost().then(blueprintGet).then(function(){
            document.getElementById("currentBlueprint").innerHTML = "Selecciona un blueprint para Dibujar!!";
            lockCanvas=true;
        });

    }

    var blueprintGet = function () {
        var getPromise = $.get("http://localhost:8080/blueprints/" + selectedBlueprint.author);

        getPromise.then(
            function () {
                api.getBlueprintsByAuthor(aut, llenaTabla);
                lockCanvas=false;
            },
            function () {
                $("#bpTable").empty();
                $("#totalPoints").text("la suma de puntos da 0");
                console.log('get failed');
                lockCanvas=true;
                clearCanvas();
            }
        );
        return getPromise;
    }


    var blueprintPut = function (){
        var putPromise = $.ajax({
            url: "/blueprints/"+selectedBlueprint.author+"/"+selectedBlueprint.name,
            type: 'PUT',
            data: JSON.stringify(selectedBlueprint),
            contentType: "application/json"
        });

        putPromise.then(
            function () {
                console.info("OK");
            },
            function () {
                console.info("ERROR");
            }
        );

        putPromise.then(blueprintGet);
    }


    var blueprintDelete = function () {
        var deletePromise = $.ajax({
            url: "/blueprints/" + selectedBlueprint.author + "/" + selectedBlueprint.name,
            type: 'DELETE',
            contentType: "application/json"
        });

        deletePromise.then(
            function () {

                blueprintGet();
                selectedBlueprint="";
                $("#currentBlueprint").text("The current blueprint is:")
                clearCanvas();

            },
            function () {
                console.info('Delete NOK');
            }
        );
    }

    var blueprintPost = function(){
        var postPromise = $.ajax({
            url: "/blueprints",
            type: 'POST',
            data: JSON.stringify(selectedBlueprint),
            contentType: "application/json"
        });

        postPromise.then(
            function(){
                console.info('OK');
            },
            function(){
                console.info('NOK');
            }
        );

        return postPromise;
    }

    function funcione() {
        aut = $("#nameValue").val();
        $("#authorLabel").text(aut + "'s blueprints:");
        if (aut==""| aut== null){
            alert("Ingrese un dato valido");
            $("#bpTable").empty();
            $("#totalPoints").text("la suma de puntos da 0");
            console.log('get failed');
            lockCanvas=true;
            clearCanvas();
        }
        else {
            listaBlueprints = api.getBlueprintsByAuthor(aut, llenaTabla);
        }

    }

    function searchAuthorByName(name, author) {

        selectedBlueprint = api.getBlueprintsByNameAndAuthor(name, author, dibujar)
        lockCanvas=false;
    }

    function clearCanvas() {
        var myCanvas = document.getElementById("myCanvas");
        var ctx = myCanvas.getContext("2d");
        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        lockCanvas=true;
    }

    return {
        funcione: funcione,
        searchAuthorByName: searchAuthorByName,
        blueprintDelete: blueprintDelete,
        blueprintPut:blueprintPut,
        createBlueprint:createBlueprint,
    }

})();



