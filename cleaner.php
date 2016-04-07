<?php
//Cleaner File ensures that the Chat SQL table does not get oversized

require("../include/utility.php");
$dbconn = connectToDB();

$query  = "SELECT COUNT(*) FROM Chat;";
$result = $dbconn->query($query);
if (!$result) {
    logMsgAndDie('Select command failed:1');
}
if ($myrow = $result->fetch_row()) {
    if ($myrow[0] > 50) {
        $query  = "DELETE FROM Chat ORDER BY id LIMIT 1;";
        $result = $dbconn->query($query);
        if (!$result) {
            logMsgAndDie('Select command failed:2');
        }
        
    }
}
?>