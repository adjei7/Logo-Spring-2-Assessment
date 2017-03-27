/*
function doGet() {
  return HtmlService.createTemplateFromFile('Index3')
      .evaluate()
      .setTitle('Movement Quiz')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}
*/

function doGet(e) {
  Logger.log( Utilities.jsonStringify(e) );
  if (!e.parameter.page) {
    // When no specific page requested, return "home page"
    return HtmlService.createTemplateFromFile('Index3')
      .evaluate()
      .setTitle('Spring 2 Assessment')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  }
  // else, use page parameter to pick an html file from the script
  return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate();
}

function getScriptUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}

function getPrevAnswers(page,student) {
  //var page = 1; //testing
  Logger.log(student);
  if (student) {
   var user = ContactsApp.getContactsByName(student)[0].getEmails()[0].getAddress();
  } else {
   var user = Session.getActiveUser().getEmail();
  }
  Logger.log(user);
  var algAnswers;
  var codeAnswers;
  var spreadsheet = SpreadsheetApp.openById("1f-tBD5hqvlPIafzYQeH4YZD6vrHj9DVIZCfA5dslCjw");
  var sheet = spreadsheet.getSheetByName("Sheet1");
  var data = sheet.getDataRange().getValues();
  var location = nameLocation(data, user);
  Logger.log(location);
  var pageLocation = (page*2)+3;
  codeAnswers = data[location][pageLocation+1];
  Logger.log(codeAnswers);
  
  algAnswers = data[location][pageLocation];
  Logger.log(algAnswers);
  if (algAnswers && algAnswers.length >1) {
    var answersArray = algAnswers.split(',');
    Logger.log(answersArray);
    var twoAnswers = [answersArray,codeAnswers]; 
    return twoAnswers;
  } else {
    Logger.log("No Answers");
    var twoAnswers = [false,codeAnswers];
    return twoAnswers;
  }

}

function getInfo(student) {
  
  //var url = SitesApp.getActivePage().getUrl();
  var user = Session.getActiveUser().getEmail();
  //var info = [url,user];
  var spreadsheet = SpreadsheetApp.openById("1hU5NqS_zDjaVsCVULg0gYaYHhPYbk2umOGRZyDp_GcA");
  var dataSheet = spreadsheet.getSheetByName("Year 7&8 Data");
  var templateSheet = spreadsheet.getSheetByName("Attainment Template");
  var studentData = dataSheet.getDataRange().getValues();
  var templateSheet = spreadsheet.getSheetByName("Attainment Template");
  var templateData = templateSheet.getDataRange().getValues();
  var studentEmail = Session.getActiveUser().getEmail();//will make this whatever the currently logged in student is but for now test email.
  if (studentEmail=="~~~~~~~~~") { //myemail address kowusu
    Logger.log("i'm the student");
    try {
      studentEmail = ContactsApp.getContactsByName(student)[0].getEmails()[0].getAddress();
      Logger.log(studentEmail);
    }
    catch(err) {
      var results = false;
      return results;
    }
  }
  var row = getStudentRow(studentEmail, studentData);
  Logger.log(row);
  var columns = getColumns(templateData);
  Logger.log(columns);
  var results = getResults(row, columns, studentData, templateData);
  return results;
}

function getUser() {
  var user = Session.getActiveUser().getEmail();
  return user;
}

function getContacts() {
  var contacts = ContactsApp.getContacts();
  var names = [];
  contacts.forEach(function(contact) {
      names.push(contact.getFullName());
    });
  //Logger.log(names);
  return(names);
}

function getStudentRow(studentEmail, studentData) {
  var email = studentEmail;
  var data = studentData;
  var row;
  for ( row = 0; row<studentData.length; row++) {
    //Logger.log(studentData[row][0]);
    if (studentData[row][0]==studentEmail) {
      break;
    }     
  }
  Logger.log(row);
  return row;
}

function getColumns(templateData){
  var columns = [];
  for (var i = 0; i<templateData.length; i++) {
    columns[i] = templateData[i][2]-1;
  }
  Logger.log(columns);
  return columns;
}

function getResults(row, columns, studentData, templateData) {
  Logger.log('in get results');
  var rRow = row;
  var rColumns = columns;
  var rData = studentData;
  var tData = templateData;
  var resultsData = [];
  for (var i=0; i < rColumns.length; i++) {
    Logger.log(templateData[i][0]);
    Logger.log(studentData[rRow][rColumns[i]]);
    if (studentData[rRow][rColumns[i]] == 1) {
      var rowData = [templateData[i][0],studentData[rRow][rColumns[i]]];
      } else {
      var rowData = [templateData[i][1],studentData[rRow][rColumns[i]]];
         }
    resultsData.push(rowData);
     
  }
  Logger.log(resultsData);
  return resultsData;

}

function sendOrderAnswer(answer) {
  Logger.log(answer);
  /*
  var strippedAnswer = [];
  for (var i=0; i<answer; i++) {
    if (answer[i] != null) {
      strippedAnswer.push
    } 
  }
  */
}

function sendAnswer(answer, page, code) {
   var user = getUser();
  Logger.log(user);
  Logger.log(answer);
  //var answer = [];
  //for (var i=0; i<sortedArray.length; i++) {
  //   answer.push(sortedArray[i][1]);
  //}
  //Logger.log(answer);
  var answerString = answer.toString();
  Logger.log(answerString);
  var spreadsheet = SpreadsheetApp.openById("1f-tBD5hqvlPIafzYQeH4YZD6vrHj9DVIZCfA5dslCjw");
  var sheet = spreadsheet.getSheetByName("Sheet1");
  var data = sheet.getDataRange().getValues();
  var location = nameLocation(data, user);
  Logger.log(location);
  writeAnswer(answerString, location, sheet, page, code);
}

function writeAnswer(answer, location, sheet, page, code) {
  if (page==1) {
    var answerCell = sheet.getRange(location+1, 6);
    var codeCell = sheet.getRange(location+1, 7);
  } else if (page==2) {
    var answerCell = sheet.getRange(location+1, 8);
    var codeCell = sheet.getRange(location+1, 9);
  } else if (page==3) {
    var answerCell = sheet.getRange(location+1, 10);
    var codeCell = sheet.getRange(location+1, 11);
  } else if (page==4) {
    var answerCell = sheet.getRange(location+1, 12);
    var codeCell = sheet.getRange(location+1, 13);
  } else if (page==5) {
    var answerCell = sheet.getRange(location+1, 14);
    var codeCell = sheet.getRange(location+1, 15);
  } else if (page==6) {
    var answerCell = sheet.getRange(location+1, 16);
    var codeCell = sheet.getRange(location+1, 17);
  } else if (page==7) {
    var answerCell = sheet.getRange(location+1, 18);
    var codeCell = sheet.getRange(location+1, 19);
  }
  answerCell.setValue(answer);
  codeCell.setValue(code);
}

function nameLocation(allData, username) {
  Logger.log("in last location");
  var Location;
  var found = false;
  for(var i = 0; (i < allData.length) && (found==false); i++){
    if(allData[i][0] == username){
      Location = i;
      found = true;
    }
  }
  //Logger.log(attemptLocation);
  //var lastLocation = attemptLocation[attemptLocation.length-1];
  Logger.log(Location);
  return Location;
}

function cartesian() {
    var r = [], arg = arguments, max = arg.length-1;
    function helper(arr, i) {
        for (var j=0, l=arg[i].length; j<l; j++) {
            var a = arr.slice(0); // clone arr
            a.push(arg[i][j]);
            if (i==max)
                r.push(a);
            else
                helper(a, i+1);
        }
    }
    helper([], 0);
    return r;
}

function thing() {
   Logger.log(cartesian([9,13], [4,5,11,12,19,20], [1,6,14,17,23], [4,5,11,12,19,20], [1,6,14,17,23], [4,5,11,12,19,20], 
                        [1,6,14,17,23], [4,5,11,12,19,20], [1,6,14,17,23], [4,5,11,12,19,20], [1,6,14,17,23], [10]));
}

function marking() {
   var spreadsheet = SpreadsheetApp.openById("1f-tBD5hqvlPIafzYQeH4YZD6vrHj9DVIZCfA5dslCjw");
   var sheet = spreadsheet.getSheetByName("Sheet1");
   var data = sheet.getDataRange().getValues();
   var answerSpreadsheet = SpreadsheetApp.openById("1LB5gsv2kvjnO6A1tPvR-xGRTJxs5AoKSq87krzO7G8g");
   var answerSheet = answerSpreadsheet.getSheetByName("question1 answer log");
   var answerData = answerSheet.getDataRange().getValues();
   var firstBatchAnswers = answerData.slice(0,172790);
   
   //Logger.log(firstBatchAnswers);
  //var arrayData = JSON.parse("[" + data[1][5] + "]");
  //var numArrayData = arrayData.map(String);
  var numArrayData = data[11][5].toString();
  //Logger.log(numArrayData+ typeof numArrayData);
  
  //Logger.log(answerData[0] + typeof answerData[0]);
   var answerColumn = 5;
   //var location = firstBatchAnswers.indexOf(data[3][5]);
   //var location = answerData[0].indexOf(numArrayData);
  //Logger.log(firstBatchAnswers.length);
  var location;
  for (var i=0; i<firstBatchAnswers.length-1; i++) {
    location = i;
    if (firstBatchAnswers[i] == numArrayData) 
       break;
    
    
  }
  Logger.log(location);
  //for (i=0; i<data.length; i++) {
  //   var studentanswer = data[1][answerColumn];
     
     
 // }
}