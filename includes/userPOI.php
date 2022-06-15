<?php
    include_once 'dbh.php';

    $namn = $_POST['namn'];
    $latitude = $_POST['permaLatitude'];
    $longitude = $_POST['permaLongitude'];
    $typ = $_POST['typPOI'];

    $sql = "INSERT INTO `userpoi` (`namn`, `latitude`, `longitude`, `typ`) VALUES ('$namn', '$latitude', '$longitude', '$typ');";
    $result = mysqli_query($conn, $sql);

    header("Location: ../index.html?signup=greatSuccess");