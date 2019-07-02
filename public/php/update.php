<?php

require_once 'connection.php';

$conn = connect('crud');

if(!empty($_POST)){
    $id = $_POST['id'];
    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $email = $_POST['email'];
}

$stm = $conn->prepare("UPDATE users SET name = '$name', surname= '$surname', email='$email' WHERE id=$id");

$stm->execute();

if($stm->rowCount()==1){
    echo "ok";
}else{
    echo "error";
}