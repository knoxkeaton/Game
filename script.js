function show(id) {
    var allDivs = document.getElementsByClassName('content');
    for (var i = 0; i < allDivs.length; i++) {
        allDivs[i].classList.add('hidden');
    }
    document.getElementById(id).classList.remove('hidden');
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function instruct() {
    var key = prompt("Enter instructor key");

    function authorize(status) {
        if (status) {
            alert("OK");
            show('instructframe');

        } else {
            alert("Incorrect key!");
        }
    }
    $.ajax({
        type: 'POST',
        url: 'admin.php',
        data: {
            input: key
        },
        success: function(response) {
            if (response == "pass") {
                $("#pcount").html(response);
            }
            authorize(response);
        }
    });

}

function sound() {
    var audio = new Audio('data/click.wav');
    audio.play();
}

function Chat() {
    this.update = updateChat;
    this.send = sendChat;
    this.getState = getStateOfChat;
}
$('#inputtext').keydown(function (event) {
    var keypressed = event.keyCode || event.which;
    if (keypressed == 13) {
      if(nickname=="")
      {
        nickname=$("#inputtext").val();
        if(nickname == ""){nickname="Guest";}
        document.getElementById("inputheader").innerHTML = "Name: " + nickname + ".  Press enter to send";
         $('#inputtext').val('');
        return;
      }
      document.getElementById("inputheader").innerHTML = "Name: " + nickname + ".  Press enter to send";
        sendChat($("#inputtext").val(),nickname);
        $('#inputtext').val('');
        
       
    }
});

function status(){
  $.ajax({
            url : "status.php",
            success : function (data) {
                filelines=data;
            }
        });
  if(lines==-1){lines=filelines;}
  if(lines==filelines){return false;} else {return true;}
  alert(lines + " " + filelines)
}

function updateChat() {
   if(status())
   {
    $.ajax({
            url : "getchat.php",
            success : function (data) {
                $("#messagelist").html(data);
                var audio = new Audio('data/sound');
                audio.play();
            }
        });
   }
}

function sendChat(message, nickname) { 
  var sendit = nickname+ ": " + message;
  if(message==""){updateChat(); document.getElementById("inputheader").innerHTML ="Refreshed!"; return;}
  var audio = new Audio('data/sound_1.mp3');
	$.ajax({
		type: "POST",
		url: "process.php",
		data: {'input': sendit},
		success: function(data){
      updateChat();
      audio.play();
      lines++;
		}
	});
}
var instance=false;
var nickname = "";
var lines=-1;
var filelines=0;

updateChat();
var refresh;
function refreshfunc() {
    refresh = setInterval(updateChat, 3000);
}
refreshfunc();
getstatus();



  
/*removes data from table if user leaves game early */
/*
window.onbeforeunload = function() {
    return "Hey, you're leaving the site. Bye!";
};*/