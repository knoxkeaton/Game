<?php
$function = (string)$_POST['input'];
$file = 'chat.txt';

/*
$totalLines = intval(exec("wc -l '$file'"));
if($totalLines>=16)
{
$data = file($file);
unset($data[0]);
file_put_contents($file, $data);
} */

$current = file_get_contents($file);
$current .= "<li>" . $function . "</li>" . "\n";
file_put_contents($file, $current);
?>