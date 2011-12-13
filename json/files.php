<?php

// list all files in the files directory
foreach(glob("../jsFile/*") as $filename){
  $name = preg_split("/\//",$filename);
	$name = preg_split("/\.js/", $name[2]);
  echo "<div class='file'>" .  $name[0] . "</div>";
}

