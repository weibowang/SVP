<?php

// list all files in the files directory
foreach(glob("../../files/inheritance/*.json") as $filename){
  $name = preg_split("/\//",$filename);
  $name = preg_split("/\.json/", $name[4]);
  echo "<div class='file'>" .  $name[0] . "</div>";
}