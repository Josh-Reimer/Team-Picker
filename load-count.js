// Add this to count page loads via AJAX
fetch('counter.php')
.catch(error => console.log('Counter update failed:', error));