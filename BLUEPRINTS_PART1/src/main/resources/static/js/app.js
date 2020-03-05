var services = (function () {
    var selectedBlueprint = "";

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

    var blueprintGet = function () {
        var getPromise = $.get("http://localhost:8080/blueprints/" + selectedBlueprint.author);

        getPromise.then(
            function (data) {

                llenaTabla(data)
            },
            function () {
                document.getElementById("authorsNameLabel").innerHTML = selectedBp.author;
                $("#blueprintTable tbody").empty();
                document.getElementById("labelUserPoints").innerHTML = 0;
                console.log('get failed')
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
                console.info('Delete OK');
            },
            function () {
                console.info('Delete NOK');
            }
        );

        return deletePromise;
    }

    function funcione() {
        var aut = $("#nameValue").val();
        $("#authorLabel").text(aut + "'s blueprints:");
        apidata.getBlueprintsByAuthor(aut, llenaTabla)
    }

    function searchAuthorByName(name, author) {

        selectedBlueprint = apidata.getBlueprintsByNameAndAuthor(name, author, dibujar)
    }

    return {
        funcione: funcione,
        searchAuthorByName: searchAuthorByName,
        blueprintDelete: blueprintDelete,
        blueprintPut:blueprintPut,
    }

})();



