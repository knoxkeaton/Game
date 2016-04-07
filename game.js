console.log("Script Active");
$.mobile.changePage("#logoutpage", {
  transition: "slide"
});

// Ensure https in use
if (location.protocol == 'http:')
  location.href = location.href.replace(/^http:/, 'https:')



//Variables========================================================|
var user = ""; //stores the current user
var instruct = false; //stores if the user is an instructor



$("#login").submit(function(e) {
  e.preventDefault();
});
$("#newaccount").submit(function(e) {
  e.preventDefault();
});

//keeps track of send requests/instances
var sendRunning = false;

//Holds the entered password to use for server authentication
var passholder = "";

//Listen for enter key in the chatbox to send a message
$('#inputtext').keydown(function(event) {
  var keypressed = event.keyCode || event.which;
  if (keypressed == 13 && !sendRunning) {
    $('#labelbox').html("Name: " + user + "</br> Press enter to send");
    sendChat($("#inputtext").val());
    $('#inputtext').val('');
  }
});

// Validate Email
function emailval(email) {
  // Check the email address
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
}

// Validate Password
function passval(pass) {
  // Check the password Requirements (1 symbol, 1 letter, 1 number, longer than 6)
  if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/.test(pass)) {
    return true;
  }
  return false;
}


//Prevent Access to chat and game pages unless logged in

$.mobile.hashListeningEnabled = false;
$.mobile.pushStateEnabled = false;
$(document).on("pageshow", "#chatpage", function() {
  if (!user) window.location = "index.html";
});
$(document).on("pageshow", "#gamepage", function() {
  if (!user) window.location = "index.html";
});

// Logs in the given account and checks if it exists
function login(form) {
  if (!emailval(form.email.value)) {
    $('#poperror').html("This is not a valid email");
    $('#badlogin').popup("open");
    return false;
  }
  if (!passval(form.pass.value)) {
    $('#poperror').html("This is not a valid password");
    $('#badlogin').popup("open");
    return false;
  }
  $.ajax({
    type: "POST",
    url: "process.php",
    data: {
      'function': 'login',
      'user': form.email.value,
      'pass': form.pass.value
    },
    dataType: "json",
    success: function(data) {
      if (data.text) {
        user = data.text;
        if (data.instr == "1") {
          $('#gametitle').html("Welcome Instructor " + user);
          instruct = true;
        } else {
          $('#gametitle').html("Welcome " + user);
          $('#instructbutton').hide();
        }
        $.mobile.changePage("#gamepage", {
          transition: "fade"
        });
        console.log("User set. Starting Game.")
        updateChat();
        refreshfunc();
      } else {
        $('#poperror').html("Sorry, this login information is not correct!");
        $('#badlogin').popup("open");
        console.log("Login Error");
      }
    }
  });
}


function logout() {
  user = null;
}



//make a new account function
function newaccount(form) {
  var fname = form.fname.value;
  var lname = form.lname.value;
  var email = form.nemail.value;
  var pass = form.passnew.value;
  var cpass = form.pconfirm.value;
  alert("ER");
  //check for empty fields
  if (!email || !pass || !fname || !lname || !cpass) {
    $('#poperror').html("Please fill out all fields");
    $('#badlogin').popup("open");
    return;
  }
  if (!emailval(email)) {
    $('#poperror').html("Invalid Email");
    $('#badlogin').popup("open");
    return;
  }
  if (!passval(pass)) {
    $('#poperror').html("This is not a valid password");
    $('#badlogin').popup("open");
    return;
  }
  // Check if passwords match
  if (pass != cpass) {
    $('#poperror').html("The passwords don't match");
    $('#badlogin').popup("open");
    return;
  }
  $.ajax({
    type: "POST",
    url: "process.php",
    data: {
      'function': 'checkuser',
      'user': email
    },
    dataType: "json",
    success: function(data) {
      if (data.error) {
        $('#poperror').html("This Username is taken");
        $('#badlogin').popup("open");
        return;
      }
    }
  });
  $.ajax({
    type: "POST",
    url: "process.php",
    data: {
      'function': 'create',
      'user': email,
      'pass': pass,
      'instruct': form.isinstruct.value
    },
    dataType: "json",
    success: function(data) {
      if (data.text) {
        $('#poperror').html("Account Created!");
        $('#badlogin').popup("open");
        console.log("Account Added");
      }
    }
  });
}

//Page Swipe listeners
$('#gamepage').on("swipeleft", function() {
  $.mobile.changePage("#chatpage", {
    transition: "slide"
  });
});
$('#chatpage').on("swiperight", function() {
  $.mobile.changePage("#gamepage", {
    transition: "slide",
    reverse: true
  });
});
$('#gamepage').on("swiperight", function() {
  if (instruct) {
    $.mobile.changePage("#instructpage", {
      transition: "slide",
      reverse: true
    });
  }
});
$('#instructpage').on("swipeleft", function() {
  $.mobile.changePage("#gamepage", {
    transition: "slide"
  });
});

function choose(letter) {
  switch (letter) {
    case 'a':
      console.log('You chose a');
      break;
    case 'b':
      console.log('b');
  }
}

function status() {
  $.ajax({
    type: "POST",
    url: "process.php",
    data: {
      'function': 'status',
      'user': user,
      'pass': passholder
    },
    dataType: "json",
    success: function(data) {
      //These determine if the chat needs to be updated
      if (lastModified == 0) {
        lastModified = data.time;
      }
      if (data.time !== lastModified) {
        updateChat();
        lastModified = data.time;
      }
    }
  });
}

function updateChat() {
  //Bell image animation
  $("#bell").removeClass("spin");
  $('#labelbox').html("Name: " + user + "</br> Press enter to send");
  console.log("Chat Updated");
  var boop = new Audio('data/blip.wav');
  $.ajax({
    type: "POST",
    url: "process.php",
    data: {
      'function': 'update',
      'user': form.email.value,
      'pass': form.pass.value
    },
    dataType: "json",
    success: function(data) {
      $("#messagelist").html(data.text);
      $("#bell").addClass("spin");
      //Plays a fun sound
      boop.play();
      var obj = $('#messagebox ul');
      //Makes the list of messages scroll to bottom on send
      var height = obj[0].scrollHeight;
      obj.scrollTop(height);
    }
  });
  var temp = $("#gametitle").text();
  $('#gametitle').html("New Message!");
  setTimeout(function() {
    $("#gametitle").html(temp);
  }, 3000);
}


//Pushes a "Send" command to process.php and uploads a message as row in table
//The sendRunning bools keeps track of instances of this function
function sendChat(message) {
  if (message != '' && !sendRunning) {
    sendRunning = true;
    console.log("sending message");
    var time = $.now();
    $.ajax({
      type: "POST",
      url: "process.php",
      data: {
        'function': 'send',
        'message': message,
        'name': user,
        'pass': time
      },
      dataType: "json",
      success: function(data) {
        console.log("message sent");
        status();
        //Make sure there is 1 second between every send
        setTimeout(function() {
          sendRunning = false;
        }, 1000);
      }
    });
    $.ajax({
      type: "POST",
      url: "cleaner.php"
    });
    //Enforce max table length
  }
}
//Hold the username that has been entered
//Holds the time of the last sent message
//is used by status() to determine when to update
var lastModified = 0;

var refresh;

//status function runs every 3 seconds
function refreshfunc() {
  if (user) {
    refresh = setInterval(status, 3000);
  }
}
