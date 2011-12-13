

<?php


$fileName = $_GET['fname'];
echo "FILE URL:";
echo "<br>";
echo "C:/lamp/apache2/htdocs/". substr($fileName,6);
echo "<br>";
echo "<br>";
$fh = fopen("$fileName", "r");
while(true)
{
	$line = fgets($fh);
	if($line == null)break;
//	echo $line; echo'<br/>';
//	echo strip_tags($line, '<script>');echo'<br/>';
 //  echo strip_tags($line);
 echo htmlentities($line); echo'<br/>';
}



?>



