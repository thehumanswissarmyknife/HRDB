$.get("http://localhost:3000/positions", function(data) {


    for(i = 0; i < data.count; i++) {
        var thisLevel = data.positions[i].level;
        var thisTitle = data.positions[i].title.toLowerCase().replace(/\s+/g, '');
        var thisId = data.positions[i]._id;
        var nextPositions = data.positions[i].nextPositions;


        // if there is no box for this level yet, create it
        if(!$("#"+data.positions[i].level).length){
            $("#levels").append("<div class='hr-level col-xs-12' id='"+ thisLevel +"'></div>");
            //get into the level div and add a div for the level-title
            $("#" + thisLevel).append("<div class='level-title' id='"+ thisLevel +"-title'></div>");
            $("#" + thisLevel +"-title").html(thisLevel);
            $("#" + thisLevel +"-title").css({float: 'left'});
            $("#" + thisLevel).append("<div class='level-positions' id='"+ thisLevel +"-positions'></div>");      
        }

        $("#" + thisLevel + "-positions").append("<div class='position-box' id='" + thisId+ "'></div>");

        // this is the small box for the dragging and dropping - comment, if no longer needed
        $("#" + thisId).append("<div class='subtractor' id='sub-" + thisId + "'>+</div>");


        $("#" + thisId).append("<div class='position-title' id='" + thisId + "-title-box'></div>");
        $("#" + thisId+ "-title-box").html(data.positions[i].title);
        $("#" + thisId).append("<div class='position-skill-box' id='" + thisId + "-skill-box'></div>");
        $("#" + thisId).append("<div class='position-comp-box' id='" + thisId + "-comp-box'></div>");
        



        if($("#" + thisLevel + "-positions").children().length > 3) {
            $("#"+ thisLevel).css("height", 300);
        }
    }

// when hovering over any position-box
    $(".position-box").hover(
        function() {
            // get the details for this position
            $.ajax({
                url: '/positions/'+ $(this).attr('id'),
                type: 'get',
                dataType: 'json',// mongod is expecting the parameter name to be called "jsonp"
                success: function (data) {
                    // when you have the details, get the next positions and save them to a local variable
                    var nextPositions = data.positions.nextPositions;

                    // dim out all position boxes
                    $(".position-box").fadeTo(0, 0.2);

                    // undim the current position
                    $("#"+ data.positions._id).fadeTo(0, 1);

                    // go through all nextPosition boxes and undim them as well
                    for(j = 0; j < nextPositions.length; j++) {
                        $("#" + nextPositions[j]).fadeTo(0, 1); 
                        $("#" + nextPositions[j]).css("background-color", "yellow");

                        // display the div with the delta on all skillcomps
                        $("#" + nextPositions[j]).append("<div class='skillcomp' id='sc-"+nextPositions[j]+"'>&nbsp</div>");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('error', errorThrown);
                }
            });
            }, function() {
                // when not hovering any more, undim all 
                $(".position-box").fadeTo(0, 1);
                $(".position-box").css("background-color", "white");
                $(".skillcomp").remove();
        }
    );


          

    
    
}, "json");


$( function() {
    $( ".subtractor" ).draggable({ revert: "valid" });
 
    $( ".position-box" ).droppable({
      classes: {
        "ui-droppable-active": "ui-state-active",
        "ui-droppable-hover": "ui-state-hover"
      },
      drop: function( event, ui ) {
        // do some ajax to add the dropped id to the dropping id as nextPositions
        var nextPos = $(this).attr("id");             
        var currPos = $(ui.draggable).attr("id").substr(4, 25);

          $.ajax({
              url: '/positions/'.concat(currPos),
              dataType: 'json',
              type: 'patch',
              contentType: 'application/json',
              data: JSON.stringify( { "nextPositions": nextPos} ),
              success: function( data, textStatus, jQxhr ){
                  $("#" + nextPos).toggle( "highlight" );
                  $("#" + nextPos).toggle( "highlight" );
              },
              error: function( jqXhr, textStatus, errorThrown ){
                  console.log( errorThrown );
              }
          });

      }
    });




} );

$(function(){
    

});






