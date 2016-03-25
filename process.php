<?php
$function = (string)$_POST['input'];
$file = 'chat.txt';

//Keeps length of file under 200 lines
$totalLines = intval(exec("wc -l '$file'"));
if($totalLines>=200)
{
$data = file($file);
unset($data[0]);
file_put_contents($file, $data);
} 

$current = file_get_contents($file);
$current .= "<li>" . strip_tags($function) . "<span>" . date("h:i:sa") . " </span></li>" . "\n";
file_put_contents($file, $current);
?>