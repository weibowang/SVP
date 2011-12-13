<?php

// list all files in the files directory
$curr_name = $_GET['dir'];
$our_path = "../jsFile/" . $curr_name;
//foreach(glob($our_path) as $filename){
//  $name = preg_split("/\//",$filename);
//  echo "<div class='file2'>" .  $name[3] . "</div>";
//}
$fh = fopen("$our_path", "r");
while(true)
{
	$line = fgets($fh);
	if($line == null)break;
//	echo $line; echo'<br/>';
//	echo strip_tags($line, '<script>');echo'<br/>';
 //  echo strip_tags($line);
 echo htmlentities($line); echo'<br/>';
}