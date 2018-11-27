// Userlist data array for filling in info box
var userListData = [];
var userToVinculate1 = '';
var userToVinculate2 = '';
var userIndividualVinc = '';
var datacasa = 0;

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the user table on initial page load
  populateTable();
  // Username link click
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  // Add User button click
  $('#btnAddUser').on('click', addUser);
  $('#btnAddCasita').on('click',addcasitas);
  $('#btnVincular').on('click',asignarCampingParejas);
  $('#btnReset').on('click',ResetVinculation);
  $('#btnResin').on('click',ResetVinculationInd);
  $('#btnVincin').on('click',asignarCampingIndividual);

  // Delete User link click
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
  // Update Casa para asignar
  $('#userList table tbody').on('click', 'td a.asignacamping', addUserToArrayInv);
  //Add to array vinculation
  $('#userList table tbody').on('click', 'td a.vinculacamping', addUserToArray);
  //Libera Casa de campaña
  $('#userList table tbody').on('click', 'td a.eliminaCamping', LiberaCamping);
  //Actualiza cada segundo
  setInterval(function(){ 
    populateTable();
  }, 1000);
});



// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/users/talentos', function( data ) {
// Stick our user data array into a userlist variable in the global object
    userListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.nombre + '">' + this.nombre + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td>' + (parseInt(this.camping) + 305) + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" camp="'+this.camping+'" rel="' + this._id + '">Borrar</a></td>';
      tableContent += '<td><a href="#" class="asignacamping" camp="'+this.camping+'" nombre="'+this.nombre+'" rel="' + this._id + '">Asignar Camping</a></td>';
      tableContent += '<td><a href="#" class="vinculacamping" camp="'+this.camping+'" nombre="'+this.nombre+'" rel="' + this._id + '">vincular</a></td>';
      tableContent += '<td><a href="#" class="eliminaCamping" camp="'+this.camping+'" nombre= "'+this.nombre+'" id="'+this._id+'">Quitar</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#userList table tbody').html(tableContent);
  });

  $.get("/users/campingcount", function(data, status){
            $('#campingdisp p').text("Camping: "+data);
  }); 
};


// Show User Info
function showUserInfo(event) {

  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve username from link rel attribute
  var thisUserName = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.nombre; }).indexOf(thisUserName);

  // Get our User Object
  var thisUserObject = userListData[arrayPosition];

  //Populate Info Box
  $('#userInfoName').text(thisUserObject.nombre);
  $('#userInfoAge').text(thisUserObject.edad);
  $('#userInfoGender').text(thisUserObject.sexo);
  $('#userInfoLocation').text(thisUserObject.pais);
  $('#userInfoCamping').text('');
  $('#userInfoCamping').text(thisUserObject.camping);

};

// Add User
function addUser(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all user info into one object
    var newUser = {
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'nombre': $('#addUser fieldset input#inputUserFullname').val(),
      'edad': $('#addUser fieldset input#inputUserAge').val(),
      'pais': $('#addUser fieldset input#inputUserLocation').val(),
      'sexo': $('#addUser fieldset input#inputUserGender').val()
    }

    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addUser fieldset input').val('');

        // Update the table
        populateTable();

      }
      else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Rellene todos los campos');
    return false;
  }
};

function addcasitas(event){
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addCasitas input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all user info into one object
    for (var i= 0; i < $('#addCasitas fieldset input#inputnumbercasitas').val(); i++) {
          var newCasita = {
          'numero': i,
          'capacidad': '2',
          'zona': $('#addCasitas fieldset input#inputZona').val(),
          'disponible': 'true'
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
          type: 'POST',
          data: newCasita,
          url: '/users/addcasitas',
          dataType: 'JSON'
        }).done(function( response ) {

          // Check for successful (blank) response
          if (response.msg === '') {

            // Clear the form inputs
            //$('#addCasitas fieldset input').val('');

            // Update the table
            //populateTable();

          }
          else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
            return;
          }
          });
    }
    alert("Casas agregadas");
  }
  else {
    // If errorCount is more than 0, error out
    alert('Rellene todos los campos');
    return false;
  }
};

function asignarCamping(event){
        event.preventDefault();

        // Super basic validation - increase errorCount variable if any fields are blank
        var errorCount = 0;
        var datacasi = getCasa();
        console.log("Numero de casa disponible: "+datacasi);

        var datacamping = {
          'idUser': $(this).attr('rel'),
          'casita': datacasi
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
          type: 'PUT',
          data: datacamping,
          url: '/users/AsignaCamping/'+$(this).attr('rel'),
          dataType: 'JSON'
        }).done(function( response ) {

          // Check for successful (blank) response
          if (response.msg === '') {

            // Clear the form inputs
            //$('#addCasitas fieldset input').val('');

            // Update the table
            //populateTable();
            alert("Camping asignado");
          }
          else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
            return;
          }
          });
};

function addUserToArray(event){
  if (userToVinculate1 === '') {
    userToVinculate1 = $(this).attr('rel');
    $('#campingConpart #per1').text("Compañero 1: "+$(this).attr('nombre'));
  }
  else if(userToVinculate2 === ''){
    userToVinculate2 = $(this).attr('rel');
    $('#campingConpart #per2').text("Compañero 2: "+$(this).attr('nombre'));
  }
};

function addUserToArrayInv(event){
  userIndividualVinc = $(this).attr('rel');
  $('#campingcompindv #pcompart1').text("Nombre para asignar: "+$(this).attr('nombre'));
}

function ResetVinculation(){
  userToVinculate1 = '';
  $('#campingConpart #per1').text('');
  userToVinculate2 = '';
  $('#campingConpart #per2').text('');
  $('#campingConpart fieldset input#inputcasamanual').val('');
}

function ResetVinculationInd(){
  userIndividualVinc = '';
  $('#campingcompindv #pcompart1').text('');
  $('#campingcompindv fieldset input#inputcasaindv').val('');
}

function asignarCampingIndividual(event){
        event.preventDefault();

        if (userIndividualVinc === '') {
          alert("Debes seleccionar a alguien");
          return;
        }

        var errorCount = 0;
        var datacasi = 0;
        $('#campingcompindv input').each(function(index, val) {
          if($(this).val() === '') { errorCount++; }
        });

        // Check and make sure errorCount's still at zero
        if(errorCount === 0) { 
          datacasi = $('#campingcompindv fieldset input#inputcasaindv').val();
          console.log("Numero de casa asignada: "+datacasi);
        }
        else{
          datacasi = getCasa();
          console.log("Numero de casa asignada: "+datacasi);
        }
        

        var datacamping = {
          'idUserone': userIndividualVinc,
          'casita': datacasi
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
          type: 'PUT',
          data: datacamping,
          url: '/users/AsignaCampingIndividual',
          dataType: 'JSON'
        }).done(function( response ) {

          // Check for successful (blank) response
          if (response.msg === '') {

            // Clear the form inputs
            //$('#addCasitas fieldset input').val('');

            // Update the table
            //populateTable();
            alert("Camping asignado: "+datacasi);
            ResetVinculationInd();
          }
          else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
            return;
          }
          });
};

function asignarCampingParejas(event){
        event.preventDefault();

        if (userToVinculate1 === '') {
          alert("Vincula al primer compañero");
          return;
        }
        else if(userToVinculate2 === ''){
          alert("Vincula al segundo compañero");
          return;
        }
        var errorCount = 0;
        var datacasi = 0;
        $('#campingConpart input').each(function(index, val) {
          if($(this).val() === '') { errorCount++; }
        });

        // Check and make sure errorCount's still at zero
        if(errorCount === 0) { 
          datacasi = $('#campingConpart fieldset input#inputcasamanual').val();
          console.log("Numero de casa asignada: "+datacasi);
        }
        else{
          datacasi = getCasa();
          console.log("Numero de casa asignada: "+datacasi);
        }
        

        var datacamping = {
          'idUserone': userToVinculate1,
          'useridtwo': userToVinculate2,
          'casita': datacasi
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
          type: 'PUT',
          data: datacamping,
          url: '/users/AsignaCampingCompartido',
          dataType: 'JSON'
        }).done(function( response ) {

          // Check for successful (blank) response
          if (response.msg === '') {

            // Clear the form inputs
            //$('#addCasitas fieldset input').val('');

            // Update the table
            //populateTable();
            alert("Camping asignado: "+datacasi);
            ResetVinculation();
          }
          else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
            return;
          }
          });
};

function getCasa(){
  var casitadisponible;

  $.ajax({
        type: 'GET', 
        url: '/users/campingdisponible', 
        dataType: 'json',
        async: false,
        success: function (data) { 
            casitadisponible = data.numero;
        }
  });
  console.log("Casita disponible: "+casitadisponible);
  return casitadisponible;
}

function LiberaCamping(event){
  var name = $(this).attr('nombre');
  console.log(name);
  var id = $(this).attr('camp');
  console.log(id)
  if (id === 'undefined') {
    return false

  }
  else{

        var datacamping = {
          'casita': id
        }
    $.ajax({
          type: 'PUT',
          data: datacamping,
          url: '/users/LiberaCamping',
          dataType: 'JSON'
        }).done(function( response ) {

          // Check for successful (blank) response
          if (response.msg === '') {

            // Clear the form inputs
            //$('#addCasitas fieldset input').val('');

            // Update the table
            //populateTable();
            alert("Liberado");
          }
          else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
            return false
          }
    });
  }
}

// Delete User
function deleteUser(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('neta?');

  // Check and make sure the user confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/' + $(this).attr('rel') +'/'+ $(this).attr('camp')
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      populateTable();

    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }

};


