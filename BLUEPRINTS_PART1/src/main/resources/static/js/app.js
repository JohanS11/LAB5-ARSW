$("#bttnSubmit").click(function(){
    console.log("a");
    var aut = $("#nameValue").val();
    path="blueprints/"+ aut;
    var URLactual = window.location;
    console.log(URLactual+path);
    $("#authorLabel").html(aut+"'s blueprints:");
});

/*var findAuthor = (function() {

   function doMap(blueprints){
        return blueprints.map(function(x){
            name: x.name,
            points: x.points.length
        })
   }
   function doTable(blueprints){
        var author = blueprints[0].author;
        blueprints = doMap(blueprints);

        })
   }
   var search = function(author){
        apidata.getBluePrintsByAuthor(author,doTable)
   }

})*/




