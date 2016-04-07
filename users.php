<?php
require ("../include/utility.php");

$dbconn = connectToDB();
$function = $_POST['function'];
$name = $_POST['name'];
$out=array();

switch ($function)
  {
case 'add':
  $query = "insert into Chatusers (name) values ('$name');";
  logMsg($query);
  $result1 = $dbconn->query($query);
  if (!$result1){logMsgAndDie('Select command failed:');}else{logMsg('insert successful');}

case 'print':
  $query = "SELECT * FROM Chatusers;";
  logMsg($query);
  $result2 = $dbconn->query($query);
  if (!$result2){logMsgAndDie('Select command failed:');}else{logMsg('insert successful');}
  while ($myrow = $result2->fetch_row())
    {
    $curtime = strtotime(date("Y-m-d H:i:s", strtotime('-25 seconds', time())));
    if (strtotime($myrow[1]) < $curtime)
      {
      $searchrow = $myrow[0];
      $query = "DELETE FROM Chatusers WHERE name=$searchrow;";
      logMsg($query);
      $result3 = $dbconn->query($query);
      
      }
      $outstring=sprintf("<li>%s</li>", $myrow[0]);
      $out['text'] .= $outstring;
    }

case 'update':
  $query = "UPDATE Chatusers SET seen=NOW() WHERE name=$name";
  }

echo json_encode($out);
?>
