<?php
//DATABASE CONNECTION VARIABLES
$servername = "localhost";
$username = "root";
$password = "test2";
$dbname = "mywebsite";


//form VARIABLES
$fname = val($_POST["fname"]);
$lname = val($_POST["lname"]);
$email = val($_POST["email"]);
$id = val($_POST["id"]);

//VALIDATION
function val($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// UPDATE USERS TABLE WITH new values
$sql = "UPDATE users SET firstname='$fname', lastname='$lname', email='$email' WHERE id='$id'";

//Redirect user back to main page
if ($conn->query($sql) === TRUE) {
    header("location:delete.php?message=success&id=". $id);
} else {
    echo "Error deleting record: " . $conn->error;
}

//Close Database connection
$conn->close();
?>