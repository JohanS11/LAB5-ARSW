$("#bttnSubmit").click(function(){
    console.log("a");
    var aut = $("#nameValue").val();
    path="blueprints/"+ aut;
    var URLactual = window.location;
    console.log(URLactual+path);
    $("#authorLabel").html(aut+"'s blueprints:");
});




