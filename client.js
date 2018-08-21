

var PhoneBook = {};
var FocusedContact = null;
var EditableContact = null; 

PhoneBook.contacts = [];




Init();







function Init()
{
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost:8080/contacts.json', true);
    
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
      var button = document.getElementById('acсeptButton');
      button.innerText = 'New';
      button.onclick = New;
      button = document.getElementById('deleteButton');
      button.onclick = Delete;

      document.getElementById('inputName').value = '';
      document.getElementById('inputPhone').value = '';
      document.getElementById('inputDescription').value = '';
      
    }




}



function New()
{
    
    var nameEdit = document.getElementById('inputName');
    var phoneEdit = document.getElementById('inputPhone');
    var descriptionEdit = document.getElementById('inputDescription');
    if(nameEdit.value == '' || phoneEdit.value.search(phoneEdit.pattern) == -1)
    {
        return;
    }
       
    var contact = {};
    contact.Name = nameEdit.value;
    contact.Phone = phoneEdit.value;
    contact.Description = descriptionEdit.value;
    contact.id = +GetFreeId();
    if (typeof(contact.id) != 'number' )
    {
        alert(typeof(contact.id));
    }
    PhoneBook.contacts.push(contact);

    SendContactFormToServer(contact.id);
    
    var contactsList = document.getElementById('contacts-list');
   
    PrintContact(contactsList, contact);

    nameEdit.value = "";
    phoneEdit.value = "";
    descriptionEdit.value = "";
    AddOnclickEventToContacts();

} 






function EditBegin()
{
    if (FocusedContact == null)
        return;
    EditableContact = FocusedContact; 
    FocusedContact = null;

    var buttonAccept = document.getElementById('acсeptButton');
    buttonAccept.onclick = EditAccept; 
    buttonAccept.innerText = 'Accept';
    
    var buttonErase = document.getElementById('eraseButton');
    buttonErase.onclick = EditCancel;
    buttonErase.innerText = 'Cancel';

    var contactElem = document.getElementById('contact ' + EditableContact.id);
    contactElem.style.backgroundColor = "royalblue";

    document.getElementById('inputName').value = EditableContact.Name;
    document.getElementById('inputPhone').value = EditableContact.Phone;
    document.getElementById('inputDescription').value = EditableContact.Description;

}



function EditAccept()
{
    var nameEdit = document.getElementById('inputName');
    var phoneEdit = document.getElementById('inputPhone');
    if(nameEdit.value == '' || phoneEdit.value.search(phoneEdit.pattern) == -1)
    {
        return;
    }
       

    Delete(null, EditableContact);
    EditableContact = null;

    New();    

    EditEnd();
}




function EditCancel()
{
    document.getElementById('contact ' + EditableContact.id).style.backgroundColor = "";
    EditableContact = null;
    EditEnd();

}


function EditEnd()
{
    var buttonAccept = document.getElementById('acсeptButton');
    buttonAccept.onclick = New; 
    buttonAccept.innerText = 'New';
    
    var buttonErase = document.getElementById('eraseButton');
    buttonErase.onclick ='';
    buttonErase.innerText = 'Erase';

}




function Delete(mouseEvent, contactToDelete)
{
    if (contactToDelete != null && contactToDelete != undefined)
    {
        var deletingContact = contactToDelete; 
    }
    else
    if (FocusedContact != null)
    {
        var deletingContact = FocusedContact;
        FocusedContact = null;
    }
    else
    {
        return;
    }

    var contact = document.getElementById('contact ' + deletingContact.id);

    contact.outerHTML = ""; 
    var contactHr = document.getElementById('hr'+deletingContact.id);
    contactHr.outerHTML = "";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8080/deletecontact', true);
    
    xhr.setRequestHeader('id', deletingContact.id);
    xhr.send();

    PhoneBook.contacts.splice(PhoneBook.contacts.indexOf(deletingContact),1);

    
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
        

        
        for (var i = 0; i < PhoneBook.contacts.length; i++)
            {
                var contact = PhoneBook.contacts[i];
                
                PrintContact(contactsList, contact);

            }
        AddOnclickEventToContacts();
        
    }
}


function Contact_OnClick(event)
{

    var elem = document.getElementById(this.id);
    var button = document.getElementById('acсeptButton');

   
    var id = +elem.id.split(' ')[1];

    if (FocusedContact != null)
    {
        var focusedElement = document.getElementById('contact ' + FocusedContact.id);
        focusedElement.style.backgroundColor = '';

    }

    if (FocusedContact != null && FocusedContact.id == id)
    {
        
        if (EditableContact == null)
        {

            button.innerText = 'New';
            button.onclick =New;
        }
        FocusedContact = null;
        return;
    }

    
    if (EditableContact != null && EditableContact.id == id)
    {
        FocusedContact = null;
        return;
    }


    elem.style.backgroundColor = 'grey';

    


    for (var i = 0; i< PhoneBook.contacts.length; i++)
    {
        if (PhoneBook.contacts[i].id == id)
        {
            FocusedContact = PhoneBook.contacts[i];
        }
    }

    if (EditableContact == null)
    {
        button.innerText = 'Edit'
        button.onclick = EditBegin;
    }

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



function SendContactFormToServer(id)
{
    var formData = new FormData(document.forms.contact);

    formData.append("id", id);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/newcontact");
    xhr.send(formData);
}



function PrintContact(contactsList, contact)
{
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
    contactHtml += '<hr color=#00008B id="hr'+contact.id+'">\r\n';
   
    contactsList.innerHTML += contactHtml; 
    //contact.onclick = Contact_OnClick;
}




function GetFreeId()
{
    if (PhoneBook.contacts == null || PhoneBook.contacts.length == 0)
    {
        return 0;
    }
    var i = 0; 
    while (IsIdExists(i))
    {
        i++;
    }
    return i;
}



function IsIdExists(id)
{
    for(var i = 0; i < PhoneBook.contacts.length;i++ )
    {
        if (PhoneBook.contacts[i].id == id)
        {
            return true;
        }
    }
    return false;
}