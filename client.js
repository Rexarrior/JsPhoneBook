







function Init()
{
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost:8080/contacts', true);
    
    xhr.send();
    
    xhr.onreadystatechange = function() {

      if (this.readyState != 4) return;
    
      
    
      if (this.status != 200) {
       
        alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
        return;
      }

      if (this.responseText != null)
      {
         var json = JSON.parse(this.responseText);
         PhoneBook.contacts = json.contacts;
          }
      Update();
      var button = document.getElementById('aceptButton');
      button.innerText = 'New';
      button.onclick = New;
      
    }




}



function New()
{
    var nameEdit = document.getElementById('inputName');
    var phoneEdit = document.getElementById('inputPhone');
    var descriptionEdit = document.getElementById('inputDescription');

    
    



    var contact = {};
    contact.Name = nameEdit.value;
    contact.Phone = phoneEdit.value;
    contact.Description = descriptionEdit.value;
    contact.id = PhoneBook.contacts.length ;
    PhoneBook.contacts.push(contact);

    var contactsList = document.getElementById('contacts-list');
    alert(contact.id);
    var contactHtml = '<div class="contact"  id="contact ' + contact.id +  '">\r\n';
    contactHtml += '<p>';
    contactHtml += 'Name: ' +  contact.Name + '<br>'; 
    contactHtml += 'Phone: ' +  contact.Phone + '</p>\r\n'; 
    if (contact.Description.length > 0)
    {
        contactHtml += '<p class="contact-description">Description: ' + 
        contact.Description + '<br></p>\r\n'; 

    }
    contactHtml += '</div>\r\n';
    contactHtml += '<hr color=#00008B>\r\n';
   
    contactsList.innerHTML += contactHtml; 
    contact.onclick = Contact_OnClick;

    nameEdit.value = "";
    phoneEdit.value = "";
    descriptionEdit.value = "";
    AddOnclickEventToContacts();
} 



function Edit()
{

}




function Delete()
{

}



function Search()
{

}




function Update() 
{
    if (PhoneBook.contacts != null && PhoneBook.contacts != undefined)
    {
        var contactsList = document.getElementById('contacts-list'); 
        if (contactsList == null )
        {
            return;
        }
        if (PhoneBook == undefined || PhoneBook.contacts == null)
        {
            return;
        }
        
        var contactsListHtml = '';

        
        for (var i = 0; i < PhoneBook.contacts.length; i++)
            {
                var contact = PhoneBook.contacts[i];
                
                var contactHtml = '<div class="contact"  id="contact ' + contact.id +  '">\r\n';
                contactHtml += '<p>';
                contactHtml += 'Name: ' +  contact.Name + '<br>'; 
                contactHtml += 'Phone: ' +  contact.Phone + '</p>\r\n'; 
                if (contact.Description.length > 0)
                {
                    contactHtml += '<p class="contact-description">Description: ' + 
                    contact.Description + '<br></p>\r\n'; 

                }
                contactHtml += '</div>\r\n';
                contactHtml += '<hr color=#00008B>\r\n';
               
                contactsListHtml += contactHtml; 

            }
        contactsList.innerHTML = contactsListHtml;
        AddOnclickEventToContacts();
        
    }
}


function Contact_OnClick(event)
{

    var elem = document.getElementById(this.id);
    var button = document.getElementById('aceptButton');

    if (elem.style.backgroundColor == 'grey')
    {
        elem.style.backgroundColor = '';
        FocusedContact = null; 
        button.innerText = 'New';
        button.onclick =New;
        return;
    }

    elem.style.backgroundColor = 'grey';
    var id = +elem.id.split(' ')[1];
    for (var i = 0; i< PhoneBook.contacts.length; i++)
    {
        if (PhoneBook.contacts[i].id != id)
        {
            var anotherElem = document.getElementById('contact ' + PhoneBook.contacts[i].id);
            anotherElem.style.backgroundColor = ''; 
        }
        else
        {
            FocusedContact = PhoneBook.contacts[i];
        }
    }

    button.innerText = 'Edit'
    button.onclick = Edit;

}





function AddOnclickEventToContacts()
{
    for (var i = 0; i < PhoneBook.contacts.length; i++)
    {
        var elem = document.getElementById('contact ' + PhoneBook.contacts[i].id);
        elem.onclick = Contact_OnClick;
        if (elem.style.backgroundColor == 'grey')
        {
            elem.style.backgroundColor = '';
        }
    }
    FocusedContact = null;
}


var PhoneBook = {};
var FocusedContact = null;
PhoneBook.contacts = [];
Init();