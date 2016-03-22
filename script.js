      function show(id) {
        var allDivs = document.getElementsByClassName('content');
            for (var i = 0; i < allDivs.length; i++){
                allDivs[i].classList.add('hidden');
            }
        document.getElementById(id).classList.remove('hidden');
      }
      function instruct() {
        var key=prompt("Enter instructor key");
        function authorize(status)
        {
            if(status){
                alert("OK");
                show('instructframe');
                
            } else {
                alert("Incorrect key!");
            }
        }
        $.ajax({  
            type: 'POST',  
            url: 'admin.php', 
            data: { input: key},
            success: function(response) {
                if(response=="pass"){
                $("#pcount").html(response);}
                authorize(response);
            }
        });
      
     }
     function sound(){
       var audio = new Audio('data/click.wav');
       audio.play();
     }
/*removes data from table if user leaves game early */
/*
window.onbeforeunload = function() {
    return "Hey, you're leaving the site. Bye!";
};*/
