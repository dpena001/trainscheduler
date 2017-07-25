// Initialize Firebase

  var config = {
    apiKey: "AIzaSyBAclaI-hl1qJ6C-aaZNKOI-WWCwIj24fQ",
    authDomain: "trainscheduler-f4225.firebaseapp.com",
    databaseURL: "https://trainscheduler-f4225.firebaseio.com",
    projectId: "trainscheduler-f4225",
    storageBucket: "trainscheduler-f4225.appspot.com",
    messagingSenderId: "1026064172898"
  };

  // Create a variable to reference the database

  firebase.initializeApp(config);

  // Assign the reference to the database to a variable named 'database'


  var database = firebase.database();


// --------------------------------------------------------------

database.ref().orderByChild("Destination").on("child_added", function(childsnapshot) {

            TrainName = childsnapshot.child("TrainName").val();
            Destination = childsnapshot.child("Destination").val();
            frecuency = childsnapshot.child("frecuency").val();
            firstTrainTime = childsnapshot.child("Firsttraintime").val();
            var firsttime = moment(firstTrainTime,"HH:mm");
 
            var pretime = moment(); 
            pretime.set(firebase.database.ServerValue.TIMESTAMP);
            var now = moment(pretime,"HH:mm");
            var differencem = now.diff(firsttime,"minutes");

            if (differencem >= 0){
              var minutesaway = frecuency - (differencem % frecuency);
              var nextarrival = moment().add(minutesaway,'m').format("hh:mm A");

            } else{

              var minutesaway = firsttime.diff(now,"minutes")+1;
              var nextarrival = moment(firsttime).format("hh:mm A");
            };
            
            $("tbody").append('<tr><td class = "updated" id="TrainName">'+TrainName+'</td><td class = "updated" id= "Destination">'+Destination+'</td><td class = "updated" id = "frecuency">'
            +frecuency+'</td><td>'+nextarrival+'</td><td>'+minutesaway+'</td><td class = "checkinput"><input type="checkbox" class="chkbox" name="rbtn" value ="'+childsnapshot.key+'"></td></tr>');

});


 function displaystrain(database){

      database.ref().orderByChild("Destination").once('value').then( function(snapshot) {

            snapshot.forEach(function(childSnapshot){

            TrainName = childSnapshot.val().TrainName;
           // console.log(TrainName);
            Destination = childSnapshot.val().Destination;
           // console.log(Destination);
            frecuency = childSnapshot.val().frecuency;
           // console.log(Destination);
            firstTrainTime = childSnapshot.val().Firsttraintime;
            var firsttime = moment(firstTrainTime,"HH:mm");
            
            var pretime = moment(); 
            //parse string
            pretime.set(firebase.database.ServerValue.TIMESTAMP);
            //console.log(pretime);
            var now = moment(pretime,"HH:mm");
            var differencem = now.diff(firsttime,"minutes");

            if (differencem >= 0){
              var minutesaway = frecuency - (differencem % frecuency);
              var nextarrival = moment().add(minutesaway,'m').format("hh:mm A");

            } else{

              var minutesaway = firsttime.diff(now,"minutes")+1;
              var nextarrival = moment(firsttime).format("hh:mm A");
            };
            
           $("tbody").append('<tr><td class = "updated" id="TrainName">'+TrainName+'</td><td class = "updated" id= "Destination">'+Destination+'</td><td class = "updated" id = "frecuency">'
            +frecuency+'</td><td>'+nextarrival+'</td><td>'+minutesaway+'</td><td class = "checkinput"><input type="checkbox" class="chkbox" name="rbtn" value ="'+childSnapshot.key+'"></td></tr>');
     });

 });

}


$(".update").on("click",function(event) {
  event.preventDefault();

    var key = "";
    var kvalo = "";
 
    $("tbody tr").each(function (index){

        $(this).children("td").each(function (index2){

              if ( index2 === 5){

                  if($(this).find("input.chkbox").is(':checked')) {
                  key = $(this).find("input.chkbox").val();  
                    $(this).parents("tr").find("td.updated").each(function(){
                       value = $(this).html();
                       $(this).html('<input type="text" class="form-control '+key+'" id="TrainName" value="'+value+'"">');
                    });
                    $(this).parents("tr").find("td.checkinput").each(function(){
                       value = $(this).html();
                       $(this).html('<a href="" class="updating" value ="'+key+'"><img src="assets/images/update.png" width="30" height="30" alt="Update">');
                    });
                 } 
              }
          });
 
      });

    $(".updating").on("click",function(event) {
         
           event.preventDefault();
     
            key = $(this).attr("value");
            console.log(key);
            console.log($(this).attr("class"));
            console.log($(this).parents("tr"));

          $(this).parents("tr").find("input").each(function(index3){

                  console.log(index3+" "+$(this).val());

                if (index3 === 0){
                  TrainName = $(this).val();
                  console.log(TrainName);
                }
                if (index3 === 1){
                  Destination = $(this).val();
                }
                if (index3 === 2){
                  frecuency = $(this).val();
                }
             });
             database.ref().child(key).update({
             TrainName: TrainName,
             Destination: Destination,
             frecuency: frecuency
             });

            $("tbody").empty();
            displaystrain(database);  
    });         

});







$(".remove").on("click",function(event) {
    event.preventDefault();

    var key = "";
 
    $("tbody tr").each(function (index){

    //   console.log(index);
    
        $(this).children("td").each(function (index2){

      //        console.log("celdas:"+index2);

              if ( index2 === 5){

                  if($(this).find("input.chkbox").is(':checked')) {
                      key = $(this).find("input.chkbox").val();
                      console.log(key);
                        database.ref().child(key).remove();
                 } 
              }
          });
                     
     });
  $("tbody").empty();
   displaystrain(database);
});





// --------------------------------------------------------------

// Whenever a user clicks the submit-bid button
$(".btn-submit").on("click", function(event) {
  // Prevent form from submitting
    event.preventDefault();

  // Get the input values

        var TrainName= $("#TrainName_inp").val().trim();
        var Destination = $("#Destination_inp").val().trim();
        //takes the input val from #firstTrainTime parses it out as HH:mm and then formats it as a unix time stamp
        var Firsttraintime = $("#Firsttraintime_inp").val().trim();
        var frecuency = $("#frecuency_inp").val().trim();

        console.log("Train Name: "+TrainName);
        console.log("Destination: "+Destination);

    // Save the new price in Firebase

        database.ref().push({
            TrainName: TrainName,
            Destination: Destination,
            Firsttraintime: Firsttraintime,
            frecuency: frecuency,
            recordDate: firebase.database.ServerValue.TIMESTAMP
        });

        $("#TrainName_inp").val("");
        $("#Destination_inp").val("");
        $("#Firsttraintime_inp").val("");
        $("#frecuency_inp").val("");
 })
 
 setInterval(function () {
        $("tbody").empty();
       displaystrain(database);
    },60000);