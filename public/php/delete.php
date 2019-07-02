<?php

require_once 'connection.php';

$conn = connect('crud');

if(!empty($_POST)){
    $id = $_POST['id'];
}

$stm = $conn->prepare("DELETE FROM users WHERE id=$id");

$stm->execute();

if($stm->rowCount()==1){
    echo "ok";
}else{
    echo "error";
}