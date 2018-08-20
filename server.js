var http = require('http');
var fs = require('fs');
var Busboy = require('busboy');

var port = 8080;





var phoneBookJsonFileName = './contacts.json';
var tempFilesPath = './temp/';

UnionTempFiles(phoneBookJsonFileName);

var background  = fs.readFileSync('./background.jpg');
var contactsListBackground = fs.readFileSync('./contacts_list_background.jpg');
var favicon = fs.readFileSync('./favicon.ico');






var server = http.createServer(OnRequest);









server.listen(port);
console.log('Server running at http://127.0.0.1:8080/');













function OnRequest(request, response)
{
  console.log('request received:');
  console.log(request.method);
  //console.log(request.headers);
  console.log(request.url);
  switch(request.url)
  {
    case '/':
      {
        var fileContent = fs.readFileSync('./phoneBook.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
        response.end(fileContent);
        
      }break;
    case '/favicon.ico':
    {
      response.writeHead(200, {'Content-Type': 'image/ico; charset=utf8'});
      response.end(favicon);
      
    }break;

    case '/styles.css':
    {
      var fileContent = fs.readFileSync('./styles.css');
      response.writeHead(200, {'Content-Type': 'text/css; charset=utf8'});
      response.end(fileContent);
      
    }break;
    case '/client.js':
    {
      var fileContent = fs.readFileSync('./client.js');
      response.writeHead(200, {'Content-Type': 'text/js; charset=utf8'});
      response.end(fileContent);
      
    }break;
    case '/bootstrap/js/bootstrap.min.js':
    {
      var fileContent = fs.readFileSync('./bootstrap/js/bootstrap.min.js');
      response.writeHead(200, {'Content-Type': 'text/js; charset=utf8'});
      response.end(fileContent);
      
    }break;
    case '/bootstrap/js/bootstrap.min.js.map':
    {
      var fileContent = fs.readFileSync('./bootstrap/js/bootstrap.min.js.map');
      response.writeHead(200, {'Content-Type': 'text/js; charset=utf8'});
      response.end(fileContent);
      
    }break;
    case '/bootstrap/css/bootstrap.min.css':
    {
      var fileContent = fs.readFileSync('./bootstrap/css/bootstrap.min.css');
      response.writeHead(200, {'Content-Type': 'text/css; charset=utf8'});
      response.end(fileContent);
      
    }break;
    case '/bootstrap/css/bootstrap.min.css.map':
    {
      var fileContent = fs.readFileSync('./bootstrap/css/bootstrap.min.css.map');
      response.writeHead(200, {'Content-Type': 'text/css; charset=utf8'});
      response.end(fileContent);
      
    }break;
    case '/background.jpg':
    {
      response.writeHead(200, {'Content-Type': 'image/jpg;'});
      response.end(background);
      
    }break;
    case '/contacts_list_background.jpg':
    {
      response.writeHead(200, {'Content-Type': 'image/jpg;'});
      response.end(contactsListBackground);
      
    }break;
    case '/contacts.json':
      {
        response.writeHead(200, {'Content-Type': 'text/json;'});

        if (fs.existsSync(phoneBookJsonFileName))
        {
          var fileContent = fs.readFileSync(phoneBookJsonFileName, 'utf8');
          response.end(fileContent);

        }
        response.end();

      }
      break;
      case '/newcontact':
      {
         OnNewContactPost(request, response);
      }
      default:
        {
          response.writeHead(404);
          response.end();
        }
    }
    console.log('returned');
}




function OnNewContactPost(request, response)
{
  var contact = {};
  var busboy = new Busboy({ headers: request.headers });
  busboy.on('field', function(fieldname, value, ieldnameTruncated, valueTruncated, transferEncoding, mimeType)
  {
    switch (fieldname )
    {
      case "Name":
      {
        contact.Name = value;
      }break;
      case "Phone":
      {
        contact.Phone = value;
      }break;
      case "Description":
      {
        contact.Description = value;
      }break;
      case "id":
      {
        contact.id = value;
      }break;
      

      default:
      {
        console.log("POST. Bad field name:" + fieldname);
        response.writeHead(400, { Connection: 'close' });
        response.end()
        return;
      }break;
    }
    console.log("POST.Field " + fieldname + " received.");

    

  });

  busboy.on('finish', function() {
    
    if (contact.Name === null ||
        contact.Phone === null ||
        contact.id === null ||
        contact.Description === null
      )
      {
        console.log("POST. Bad contact:" + contact);
        response.writeHead(400, { Connection: 'close' });
        response.end()
      }
    
    contactJson = JSON.stringify(contact);

    

    fs.writeFile(tempFilesPath + contact.id + ".json", contactJson, function(err){
      response.writeHead(200, { Connection: 'close' });
      response.end();
      if (err != null)
      {
        console.log("OnNewContactPost: error: " + err);
      }
    } );
    response.writeHead(200, { Connection: 'close' });
    response.end();
    console.log('POST. finished.')
  });
  
  request.pipe(busboy);



}






function UnionTempFiles()
{

  fs.readdir(tempFilesPath, function(err, items) 
  {
    if (err != null)
    {
      console.log("UnionTempFiles: Error: " + err);
      return;
    }

    if (items.length == 0)
    {
      console.log('UnionTempFiles: temp files not found.');
      return;
    }

    console.log("UnionTempFiles: temp files:  " + items);

    var phoneBookJson = fs.readFileSync(phoneBookJsonFileName);
    var contactsList = JSON.parse(phoneBookJson).contacts;
    for (var i=0; i<items.length; i++) 
    {
      var fileContent = fs.readFileSync(tempFilesPath + items[i]);
      if (fileContent == "")
      {
        console.log('UnionTempFiles: empty file ' + items[i]);
        return;
      }
      var contact = {};
      if (!IsJsonString(fileContent, contact))
      {
        console.log('UnionTempFiles: bad json. Filename: ' + items[i]);
      }
      contactsList.push(contact.value);
    }


    i = 0;
    while (i < contactsList.length)
    {
      if (contactsList[i] == null)
      {
        contactsList.splice(i, 1);
      }
      else
      {
        i++;
      }
    }


    phoneBook = {};
    phoneBook.contacts = contactsList;
    phoneBookJson = JSON.stringify(phoneBook);
    fs.writeFileSync(phoneBookJsonFileName, phoneBookJson);

    for (var i=0; i<items.length; i++) 
    {
      fs.unlink(tempFilesPath + items[i], function(err){
        if (err != null) 
        {
          console.log('unlinc error:' + err);
        }});
    }
    
});
}





function IsJsonString(str, outStr) {
  try {
      outStr.value =  JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;

}


