var http = require('http');
var fs = require('fs');
var Busboy = require('busboy');

var port = 8080;





var phoneBookJsonFileName = './contacts.json';
var tempFilesPath = './temp/';
var deleteListFileName = "to_delete.json";

var allContacts = {};

var background  = fs.readFileSync('./background.jpg');
var contactsListBackground = fs.readFileSync('./contacts_list_background.jpg');
var favicon = fs.readFileSync('./favicon.ico');

var IsUnionTempFilesSeted = false;




UnionTempFiles(phoneBookJsonFileName);
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
       
        var phoneBook  = {}
        phoneBook.contacts = allContacts;

        response.end(JSON.stringify(phoneBook));
        return;
      }
      break;
      case '/newcontact':
      {
        OnNewContactPost(request, response);
      }break;
      case '/deletecontact':
      {
        var id = +request.headers.id;
        
        DeleteContact(id);
        response.writeHead(200, {Connection:"close"});
        response.end();

      }break;
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
        contact.id = +value;
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

  busboy.on('finish', function() 
  {
    
    if (contact.Name === null ||
        contact.Phone === null ||
        contact.id === null ||
        contact.Description === null
      )
      {
        console.log("POST. Bad contact:" + contact);
        response.writeHead(400, { Connection: 'close' });
        response.end();
      }
    
    contactJson = JSON.stringify(contact);
    allContacts.push(contact);

    

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
    
    if (!IsUnionTempFilesSeted)
    {
      IsUnionTempFilesSeted = true;
      setTimeout(function()
      {
        UnionTempFiles();
        IsUnionTempFilesSeted = false;
      }, 60000);
    }
  });
  
  request.pipe(busboy);



}






function UnionTempFiles()
{
  var contactsList;
  fs.readdir(tempFilesPath, function(err, items) 
  {
    
    if (err != null)
    {
      console.log("UnionTempFiles: Error: " + err);
      return;
    }
   

    var phoneBookJson = fs.readFileSync(phoneBookJsonFileName);
    contactsList = JSON.parse(phoneBookJson).contacts;
    if (items.length == 0)
    {
      console.log('UnionTempFiles: temp files not found.');
      DeleteNullContacts(contactsList);
      DeleteContactByDeleteList(contactsList);
      WritePhoneBook(contactsList);
      allContacts = contactsList;
      return;
    }


    console.log("UnionTempFiles: temp files:  " + items);

   
    for (var i=0; i<items.length; i++) 
    {
      var fileContent = fs.readFileSync(tempFilesPath + items[i]);
      if (fileContent == "")
      {
        console.log('UnionTempFiles: empty file ' + items[i]);
        continue;
      }
      var contact = {};
      if (!IsJsonString(fileContent, contact))
      {
        console.log('UnionTempFiles: bad json. Filename: ' + items[i]);
        
      }
      else
      {
        contactsList.push(contact.value);
      }

    }


    

    DeleteNullContacts(contactsList);
    DeleteContactByDeleteList(contactsList);



    WritePhoneBook(contactsList);

    for (var i=0; i<items.length; i++) 
    {
      fs.unlink(tempFilesPath + items[i], function(err){
        if (err != null) 
        {
          console.log('UnionTempFiles: unlinc error:' + err);
        }});
    }
    allContacts = contactsList;
    
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






function DeleteContact(id)
{
  for (var i  = 0; i < allContacts.length; i++)
  {
    if (+(allContacts[i].id) == +id)
    {
      
      allContacts.splice(i, 1);
    }
  }

  fs.readdir(tempFilesPath, function(err, items)
  {
    if (err != null)
    {
      console.log('DeleteContact: Error: ' + err);
    }


    var str = '' + id + '.json';
    var ind = items.indexOf(str);
    var deleteList = {}; 
    if (ind = -1)
    {
     
      if (fs.existsSync(deleteListFileName))
      {
        var fileContent = fs.readFileSync(deleteListFileName);
        if (!IsJsonString(fileContent, deleteList))
        {
          fs.unlink(deleteListFileName, function(err){
            if (err != null) 
            {
              console.log('DeleteContact: unlinc error:' + err);
            }});
        }

        deleteList = deleteList.value;
       
      }else
      {
        deleteList.items = [];

      }
      deleteList.items.push(id);
      fileContent = JSON.stringify(deleteList);
      fs.writeFile(deleteListFileName, fileContent, function(err)
      {
        if (err != null)
        {
          console.log("DeleteContact: error: "+ err);
        }
      });  

      return;
    }else
    {

    fs.unlink(tempFilesPath + items[ind], function(err){
      if (err != null) 
      {
        console.log('DeleteContact: unlinc error:' + err);
      }});
    }

    if (!IsUnionTempFilesSeted)
    {
      IsUnionTempFilesSeted = true;
      setTimeout(function()
      {
        UnionTempFiles();
        IsUnionTempFilesSeted = false;
      }, 60000);
    }
  });
  
}




function DeleteContactByDeleteList(contactsList)
{
  if (fs.existsSync(deleteListFileName))
    {
      var fileContent = fs.readFileSync(deleteListFileName);
      var deleteList = {};
      if (IsJsonString(fileContent, deleteList))
      {
        deleteList = deleteList.value.items; 
        for (var i = 0; i < deleteList.length; i++)
        {
          DeleteContactById(contactsList, deleteList[i]);
        }

      }
      else
      {
        console.log('DeleteContactByDeleteList: error: bad json');
      }
      fs.unlink(deleteListFileName, function(err){
        if (err != null) 
        {
          console.log('DeleteContactByDeleteList: unlinc error:' + err);
        }});
    }
}



function DeleteContactById(contactsList, id)
{
  if (contactsList == null || contactsList == undefined)
  {
    console.log("DeleteContactById: bad contactsList: " + contactsList);
    return;

  }

  for (var i = 0; i < contactsList.length; i++)
  {
    if (contactsList[i].id == id)
    {
      contactsList.splice(i,1);
      return;

    }
  }
  console.log("DeleteContactById: contact not found:" + id);

}




function DeleteNullContacts(contactsList)
{
  var i = 0;
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
}



function WritePhoneBook(contactsList)
{
  var phoneBook = {};
  phoneBook.contacts = contactsList;
  var phoneBookJson = JSON.stringify(phoneBook);
  fs.writeFile(phoneBookJsonFileName, phoneBookJson, function(err){
    if (err != null)
    {
      console.log("WritePhoneBook: error: "+ err);
    }
  });
}
