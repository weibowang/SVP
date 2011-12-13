<?php

// list all files in the files directory
$curr_name = $_GET['dir'];
$our_path = "../jsFile/" . $curr_name . "/*";
foreach(glob($our_path) as $filename){
  $name = preg_split("/\//",$filename);
  echo "<div class='file2'>" .  $name[3] . "</div>";
}