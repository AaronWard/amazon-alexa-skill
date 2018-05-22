var Alexa = require('alexa-sdk');
var https = require('https');
// var request = require('request');


exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'LaunchRequest': function () {
    this.emit('GetBusses');
  },
  'GetAstros': function() {
    getAstrosHttp((data) => {
      var outputSpeech = `There are currently ${data.people.length} astronauts in space. `;
      for (var i=0;i<data.people.length;i++){
        if (i === 0) {
          //first record
          outputSpeech = outputSpeech + 'Their names are: ' + data.people[i].name + ', '
        } else if (i === data.people.length-1) {
          //last record
          outputSpeech = outputSpeech + 'and ' + data.people[i].name + '.'
        } else {
          //middle record(s)
          outputSpeech = outputSpeech + data.people[i].name + ', '
        }
      }
      this.emit(':tell', outputSpeech);
  });
  },
  'GetBusses' : function() {
    var responseString = '';
    var mythis = this;

    // var options = {
    //   url: 'https://data.dublinked.ie',
    //   path: '/cgi-bin/rtpi/realtimebusinformation?stopid=4619&format=json',
    //   method : 'GET',
    //   strictSSL: false
    // };

    https.get('https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid=4619&format=json', (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);

      res.on('data', (d) => {
        responseString += d;
      });

      res.on('end', function(res) {

        var message = responseString.results[0].route + " to " + body.results[0].destination + " due now\n";



        const speechOutput = message; 
        // var body = JSON.parse(responseString);
        // //numberofresults will return as 0 if it past half 11
        // if(body.numberofresults === 0){
        //     message = "It's too late for busses mate";
        // }
        // else{
        //     var resultCount = 0;
        //     //Display all the bus routes and due times available
        //     for( var i in body.results){
        //         if(body.results[i].route == "25A" || body.results[i].route == "25B" ){
        //             //If the bus is due now, dont display "due in due minutes"
        //             if(body.results[i].duetime === "Due"){
        //                 message +=  body.results[i].route + " to " + body.results[i].destination + " due now\n";
                        
        //             }
        //             //Stop 1 minute appearing as "1 minutes"
        //             else if(body.results[i].duetime === "1"){
        //                 message +=  body.results[i].route + " to " + body.results[i].destination + " due in " + body.results[i].duetime 
        //                 + " minute\n";
        //             }
        //             else{
        //                 message +=  body.results[i].route + " to " + body.results[i].destination + " due in " + body.results[i].duetime 
        //                 + " minutes\n";
        //             }
        //             resultCount++;
        //         }
        //     }
        //     //Check if there is not times available
        //     if(resultCount === 0){
        //         message = "There is no times available";
        //     }
        // }
        // speechOutput = message;




        mythis.emit(':tell', 'Here are busses coming soon: '+ speechOutput);
      });
    }).on('error', (e) => {
      console.error(e);
    });
  },
  'AMAZON.HelpIntent': function () {
      this.emit(':ask', "What can I help you with?", "How can I help?");
  },
  'AMAZON.CancelIntent': function () {
      this.emit(':tell', "Okay!");
  },
  'AMAZON.StopIntent': function () {
      this.emit(':tell', "Goodbye!");
  }
};







/******************************************************************************* */

function getAstrosHttp(callback) {
  //http://api.open-notify.org/astros.json
  var options = {
    host: 'api.open-notify.org',
    port: 80,
    path: '/astros.json',
    method: 'GET'
  };

  var req = http.request(options, res => {
      res.setEncoding('utf8');
      var returnData = "";

      res.on('data', chunk => {
          returnData = returnData + chunk;
      });

      res.on('end', () => {
        var result = JSON.parse(returnData);
        callback(result);
      });
  });
  req.end();
}

function getBusTimes(callback){
  // var options = {
  //   url: 'https://data.dublinked.ie',
  //   path: '/cgi-bin/rtpi/realtimebusinformation?stopid=4619&format=json',
  //   port: 80,
  //   method : 'GET'
  //   // strictSSL: false
  // }; 
  // var message = ""

  // request(options, function(error, response, body) {
  //   if(error){
  //       console.log(error);
  //   }
  //   else{
  //       body = JSON.parse(body);
  //       //numberofresults will return as 0 if it past half 11
  //       if(body.numberofresults === 0){
  //           message = "It's too late for busses mate";
  //       }
  //       else{
  //           var resultCount = 0;
  //           //Display all the bus routes and due times available
  //           for( var i in body.results){
  //               if(body.results[i].route == '25A' || body.results[i].route == '25B'){
  //                   //If the bus is due now, dont display "due in due minutes"
  //                   if(body.results[i].duetime === "Due"){
  //                       message +=  body.results[i].route + " to " + body.results[i].destination + " due now\n";
  //                   }
  //                   //Stop 1 minute appearing as "1 minutes"
  //                   else if(body.results[i].duetime === "1"){
  //                       message +=  body.results[i].route + " to " + body.results[i].destination + " due in " + body.results[i].duetime 
  //                       + " minute\n";
  //                   }
  //                   else{
  //                       message +=  body.results[i].route + " to " + body.results[i].destination + " due in " + body.results[i].duetime 
  //                       + " minutes\n";
  //                   }
  //                   resultCount++;
  //               }
  //           }
  //           //Check if there is not times available
  //           if(resultCount === 0){
  //               message = "Sorry, but there are no times available.";
  //           }     
  //       } 
  //     }
  //     // return("message");        
  // });
  // return(message);        


  // var req = http.request(options, res => {
  //     res.setEncoding('utf8');
  //     var returnData = "";

  //     res.on('data', chunk => {
  //         returnData = returnData + chunk;
  //     });

  //     res.on('end', () => {
  //       var result = JSON.parse(returnData);
  //       callback(result);
  //     });
  // });
  // req.end();
}