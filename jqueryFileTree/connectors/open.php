<?php
echo "<script language=\"JavaScript\">alert(\"ฤใบร\");</script>"; 
$file_handle = fopen("file", "w");
while (!feof($file_handle)) {
   $line = fgets($file_handle);
   echo fwrite($file,"$line");
}
fclose($file_handle);
?>
