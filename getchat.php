<?php
//$data = array_slice(file('chat.txt'), -15);
//echo implode($data); 
$data = file_get_contents('chat.txt');
echo $data;
?>