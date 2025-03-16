window.addEventListener('load', () => {
  clearfields("app.js");
});
var textarea = document.getElementById("names");
var team_divs = document.getElementsByClassName("team_divs");
//is a list^

function pickRandom(argument) {
  if (typeof argument === 'number') {
    return Math.floor(Math.random() * Math.floor(argument)) + 1;
  }
  if (Array.isArray(argument)) {
    return argument[Math.floor(Math.random() * argument.length)];
  }
}

function auto_grow(element) {
  element.style.height = "5px";
  element.style.height = (element.scrollHeight)+"px";
}
textarea.style.height = 0;
textarea.style.height = textarea.scrollHeight + "px";

function clearfields(origin) {
  if(origin === "textarea" && originalNames !== null){
    //show warning
    let warning_popup = document.getElementById("warning-popup");
    let clear_button = document.getElementById("clear-button");
    let cancel_button = document.getElementById("cancel-button");
    warning_popup.classList.add('show-warning');
    textarea.blur();
    clear_button.onclick = function() {
        while (team_divs.length != 0) {
    team_divs[0].remove();
  }
  textarea.value = '';
  originalNames = null; // Reset originalNames when clearing fields
  textarea.style.height = 0;
  textarea.style.height = textarea.scrollHeight + "px";
  warning_popup.classList.remove("show-warning");
      }
    cancel_button.onclick = function(){
      warning_popup.classList.remove("show-warning");
    }
  }
  
}

function shrink(element) {
  element.style.height = 0;
  element.style.height = (element.scrollHeight) + "px";
}

function pickTeams(team_members, number_of_teams) {
  /*
 this team picker works with any number of
 team members
 */
  let teams = [
    //store all teams in this list so I don't need to create arrays based on a arbitrary number
  ];
  let shuffled_members = [];

  let team_members_copy = team_members.slice();
  //making a copy of original array so it doesn't modify the original array

  while (team_members_copy.length != 0) {
    let random_member = pickRandom(team_members_copy);
    shuffled_members.push(random_member);
    team_members_copy.splice(team_members_copy.indexOf(random_member), 1);
  }
  let team_length = shuffled_members.length / number_of_teams;
  for (let i = 0; i < shuffled_members.length; i += team_length) {
    //loop through every nth shuffled member
    //slice shuffled members starting starting
    //at the current index and ending at
    //the current index plus the team length,
    //or, nth shuffled member
    teams.push(shuffled_members.slice(i, i + team_length));
  }

  return teams;
}

var textareaValue;
var originalNames = null; // Store the original list of names
function getTeams() {
  check_radio_buttons();
  
  // If originalNames is null, this is our first run, so store the original names
  if (originalNames === null) {
    originalNames = textarea.value
      .split('\n')
      .filter(line => line.trim() !== '');  // Remove empty lines and whitespace-only lines
  }

  if (originalNames.some(name => name.includes("<") || name.includes(">"))) {
    alert("You cannot use < or > special characters");
    return;
  }

  if (originalNames.length === 0) {
    return; // Exit if no names
  }

  check_radio_buttons();
  if (number_of_teams > originalNames.length) {
    let alert_text = `You cannot split ${originalNames.length} team members into ${number_of_teams} teams`;
    alert(alert_text);
    return;
  }

  // Clear any existing team divs
  while (team_divs.length > 0) {
    team_divs[0].remove();
  }

  // Generate new teams using the original names
  let teams = pickTeams(originalNames, number_of_teams);
  saveToFile(teams);
  
  // Display the teams
  textarea.insertAdjacentHTML("afterend", getTeamsHTML(teams.slice(1)));

  // Update textarea with first team
  let textarea_output_string = teams[0].join("\n");
  textarea.value = textarea_output_string;
  textarea.setAttribute("style", "height:" + (textarea.scrollHeight) + "px;overflow-y:hidden;");
  shrink(textarea);
}

function saveToFile(teamslist) {
    // Get the textarea content
    var textareaContent = teamslist;
    
    // Check if we're online
    if (navigator.onLine) {
        var xhttp = new XMLHttpRequest();
        
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
            }
        };
        
        xhttp.open("POST", "save_to_file.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("textarea_content=" + encodeURIComponent(textareaContent));
    } else {
        // If offline, store in localStorage
        try {
            localStorage.setItem('savedTeams', JSON.stringify(textareaContent));
           
        } catch (e) {
           
        }
    }
}

function getTeamsHTML(teamlist) {
  /*
  this function loops through every list of teams in the list of teams called teamlist.
  it then adds each of those teams to its own div element, basically wraping it with div tags.
  */
  let html = "<div class='team_divs'>";
  for (let i = 0; i < teamlist.length; i++) {
    for (let a = 0; a < teamlist[i].length; a++) {
      html += (teamlist[i][a] + "<br>"); //add names to html
    }
    /*
    if we are at the last team, don't add
    an extra div and br element
    */
    if (i != (teamlist.length-1)) {
      html += "</div><div class='team_divs'>";
    } else {
      html += "</div>";
    }
  }
  return html;
}
