$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyATIcLgHIImqFvrnMxnp76KFfZ-jKI-V2M",
    authDomain: "traintime-mshaw.firebaseapp.com",
    databaseURL: "https://traintime-mshaw.firebaseio.com",
    projectId: "traintime-mshaw",
    storageBucket: "",
    messagingSenderId: "960411800876"
  };
  firebase.initializeApp(config);

    var database = firebase.database();

    console.log(config.apiKey);

    var trainName = "";
    var trainTime = "";
    var trainFrequency = 0;
    var destination = "";

    $("#submitBtn").on("click", function(event) {
        event.preventDefault();

        var trainName = $("#trainInput").val().trim();
        var destination = $("#destinationInput").val().trim();
        var trainTime = $("#trainTimeInput").val().trim();
        var trainFrequency = $("#frequencyInput").val().trim();

        // var trainTime = moment($("#trainTimeInput").val().trim(), "hh:mm").format("X");


        var newTrain = {
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            trainFrequency: trainFrequency
        };

        database.ref().push(newTrain);

        console.log(newTrain.trainName);
        console.log(newTrain.destination);
        console.log(newTrain.trainTime);
        console.log(newTrain.trainFrequency);

        $("#trainInput").val("");
        $("#destinationInput").val("");
        $("#trainTimeInput").val("");
        $("#frequencyInput").val("");

    })

    database.ref().on("child_added", function(snapshot) {
        console.log(snapshot.val())

        var trainName = snapshot.val().trainName;
        var destination = snapshot.val().destination;
        var trainTime = moment.unix(snapshot.val().trainTime);
        var trainFrequency = snapshot.val().trainFrequency;
        console.log(trainFrequency)

        var firstTimeConverted = moment(trainTime, "hh:mm A").subtract(1, "years");
        console.log(firstTimeconverted);
        var currentTime = moment();
        var diffTime = moment().diff(moment(firstTimeConverted, "X"), "minutes");
        var tRemainder = diffTime % trainFrequency;
        var tMinutesTillTrain = trainFrequency - tRemainder;
        var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");

        if (trainTime > currentTime) {
            diffTime = moment(trainTime).diff(moment(currentTime, "X"), "minutes");
            tMinutesTillTrain = diffTime;
            nextTrain = moment.unix(snapshot.val().trainTime).format("hh:mm A");
        }

        $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
            trainFrequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");
    })

    function error(errorObject) {
        console.log("Errors: " + errorObject.code);
    }
})