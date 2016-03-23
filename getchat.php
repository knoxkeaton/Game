<?php
$data = array_slice(file('chat.txt'), -15);
echo implode($data);
?>