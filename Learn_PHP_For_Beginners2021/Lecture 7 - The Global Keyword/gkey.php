<!DOCTYPE html>
<html>
<body>

<?php
$x = 30;
$y = 20;


function test1() {
     global $x, $y;
	 $y = $x + $y;
}

/*
function test1() {
     $GLOBALS['y'] = $GLOBALS['x'] + $GLOBALS['y'];
}
*/

test1(); // Execute Function
echo $y; // Output Value of Variable y

?>

</body>
</html>