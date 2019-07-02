<?php

require_once 'connection.php';

$conn = connect('crud');

$stm = $conn->prepare("SELECT * FROM users");

$stm->execute();

$result = $stm->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($result);