var http = require('http');
var fs = require('fs');
var port = 8080;







var server = http.createServer(OnRequest);
var background  = fs.readFileSync('./background.jpg');
var contactsListBackground = fs.readFileSync('./contacts_list_background.jpg');
var favicon = fs.readFileSync('./favicon.ico');


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
    case '/contacts':
      {
        response.writeHead(200, {'Content-Type': 'text/json;'});

        if (fs.existsSync('contacts.json'))
        {
          var fileContent = fs.readFileSync('contacts.json', 'utf8');
          response.end(fileContent);

        }
        response.end();

      }
      break;
      default:
        {
          response.writeHead(404);
          response.end();
        }
    }
    console.log('returned');
}