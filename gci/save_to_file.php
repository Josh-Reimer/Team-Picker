<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the content from the textarea
    $text = $_POST['textarea_content'];

    // Specify the file where the content will be saved
   
    $file = __DIR__ . "/../output.txt"; // Use absolute path
    // Open the file and write the content
    file_put_contents($file, $text."\n--END--\n",FILE_APPEND);

}
?>
