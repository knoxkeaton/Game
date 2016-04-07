<?php
$function = strip_tags($_POST['function']);
require("../include/utility.php");
$dbconn      = connectToDB();
$log         = array();
$log['text'] = "";

if($function != 'create'){
  $user  = strip_tags($_POST['user']);
  $pass  = strip_tags($_POST['pass']);
  $salt1   = "1*h^$";
  $salt2   = ",.';$%^9";
  $encpass = hash('ripemd320', "$salt1$pass$salt2");
  $query = "SELECT user,instructor from GameUsers WHERE user='$user' AND pass='$encpass'";
  logMsg($query);
  $result = $dbconn->query($query);
  if (!$result) {
      logMsgAndDie('Authentication Error');
  }
}



switch ($function) {

    case ('status'):

        $query  = "SELECT * FROM Chat ORDER BY id DESC LIMIT 1;";
        $result = $dbconn->query($query);
        if (!$result) {
            logMsgAndDie('Select command failed:');
        }
        if ($myrow = $result->fetch_row()) {
            $log['time'] = (string) $myrow[3];
        }
        break;

    case ('update'):
        logMsg('update');
        $query  = "select * from Chat;";
        $result = $dbconn->query($query);
        if (!$result) {
            logMsgAndDie('Select command failed:');
        }
        if ($myrow = $result->fetch_row()) {
            do {
                $name      = $myrow[1];
                $message   = $myrow[2];
                $time      = date('H:i:s', strtotime($myrow[4]));
                $log['text'] .= "<li>";
                if($myrow[5]==1) $log['text'] .= "<b>";
                $outstring = sprintf("%s: %s<span>%s</span>", $name, $message, $time);
                $log['text'] .= $outstring;
                if($myrow[5]==1) $log['text'] .= "</b>";
                $log['text'] .="</li>";
            } while ($myrow = $result->fetch_row());
        }
        break;

    case ('send'):

        $message = strip_tags($_POST['message']);
        $name    = strip_tags($_POST['name']);
        $time    = strip_tags($_POST['time']);
        $query   = "insert into Chat (name,message,time) values ('$name','$message','$time');";
        logMsg($query);
        $result = $dbconn->query($query);
        if (!$result) {
            logMsgAndDie('Select command failed:');
        } else {
            logMsg('insert successful');
        }
        break;
    case ('login'):
        $user  = strip_tags($_POST['user']);
        $pass  = strip_tags($_POST['pass']);
        $salt1   = "1*h^$";
        $salt2   = ",.';$%^9";
        $encpass = hash('ripemd320', "$salt1$pass$salt2");
        $query = "SELECT user,instructor from GameUsers WHERE user='$user' AND pass='$encpass'";
        logMsg($query);
        $result = $dbconn->query($query);
        if (!$result) {
            logMsgAndDie('Select command failed:');
        } else {
            logMsg('insert successful');
            $row = $result->fetch_row();
            $log['text'] .= $row[0];
            $log['instr'] .= $row[1];
        }
        break;
    case ('create'):
        $user  = strip_tags($_POST['user']);
        $pass  = strip_tags($_POST['pass']);
        $instr = strip_tags($_POST['instruct']);
        $salt1   = "1*h^$";
        $salt2   = ",.';$%^9";
        $encpass = hash('ripemd320', "$salt1$pass$salt2");
        $query = "INSERT INTO GameUsers (user,pass,instructor) VALUES ('$user','$encpass',$instr)";
        logMsg($query);
        $result = $dbconn->query($query);
        if (!$result) {
            logMsgAndDie('Select command failed:');
        } else {
            logMsg('insert successful');
            $log['text'] .= "Complete";
        }
        break;
    case ('checkuser'):
        $user  = strip_tags($_POST['user']);
        $query = "select user FROM GameUsers where user='$user'";
        logMsg($query);
        $result = $dbconn->query($query);
        if (!$result) {
            logMsgAndDie('Select command failed:');
        } else {
            logMsg('insert successful');
            $myrow=$result->fetch_row();
            if($myrow[0])
            $log['error'] = "exists";
        }

}
echo json_encode($log);
?>
