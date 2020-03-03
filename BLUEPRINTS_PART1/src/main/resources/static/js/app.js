var services  = (function(){
    function doMap(blueprints) {
        return blueprints.map( function(bp){
            return{
                bpname: bp.name,
                points: bp.points.length
            }
        })
    }

    function sumaPuntos(blueprints){
        return blueprints.reduce(function(total,num){
            return total + num.points;
        },0);
    }

    function llenaTabla(blueprints) {
        var autor = blueprints[0].author;
        blueprints = doMap(blueprints);
        $("#bpTable").empty();
        blueprints.map(function(bp){
            var fila =  "<tr> <td>" + bp.bpname + "</td> <td>" + bp.points +"</td> <td>" + '<button type="button" onclick="services.searchAuthorByName(\'' + bp.bpname + '\',\'' + autor +'\')"> Open </button></td></tr>';
            $("#bpTable").append(fila);
        })
        var resultado = sumaPuntos(blueprints);
        $("#totalPoints").text("la suma de puntos da " + resultado);


    }

    function dibujar(blueprint){
        console.log(blueprint);
        $("#currentBlueprint").text("The current Blueprint is: " + blueprint.name)
        var can = document.getElementById("myCanvas");
        var lapiz = can.getContext("2d");
        lapiz.clearRect(0,0,can.width,can.height);
        lapiz.beginPath();
        var punto = blueprint.points[0];

        lapiz.moveTo(punto.x,punto.y);
        blueprint.points.map(function(p){
            lapiz.lineTo(p.x,p.y)
            },1
        )
        lapiz.stroke();

    }

    function funcione(){
        var aut = $("#nameValue").val();
        $("#authorLabel").text(aut+"'s blueprints:");
        apimock.getBlueprintsByAuthor(aut,llenaTabla)
    }
    function searchAuthorByName(name,author) {
        apimock.getBlueprintsByNameAndAuthor(name,author,dibujar)
    }
    return {
        funcione:funcione,
        searchAuthorByName:searchAuthorByName,
    }

})();



