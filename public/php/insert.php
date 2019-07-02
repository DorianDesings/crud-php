<?php

require_once 'connection.php';

$conn = connect('crud');

if(!empty($_POST)){
    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $email = $_POST['email'];
}

$stm = $conn->prepare("INSERT INTO users VALUES(NULL, '$name', '$surname', '$email')");

$stm->execute();

if($stm->rowCount()==1){
    echo "ok";
}else{
    echo "error";
}