window.addEventListener('load', () => {
  clearfields("app.js");
});
var names_textarea = document.getElementById("names");
var team_divs = document.getElementsByClassName("team_divs");
//is a list^
var warning_popup = document.getElementById("warning-popup");
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
names_textarea.style.height = 0;
names_textarea.style.height = names_textarea.scrollHeight + "px";

function open_name_editor(){
  let edit_popup = document.getElementById("edit-popup");
  let name_editor = document.getElementById("name-editor");
  edit_popup.classList.add('show-editor')
  save_regen_button = document.getElementById("save-regenerate-button");
  //display original names in textarea editor
  name_editor.value = originalNames.join("\n") + "\n";
  
  save_regen_button.onclick = function(){
    edit_popup.classList.remove('show-editor');
    warning_popup.classList.remove('show-warning');
    //  *** update original names and run pick teams function ***
    if (name_editor.value.replace(/[\r\n]+/g, '').trim() !== ""){   //checking the name editor textarea for empty content such as only whitespace or only newlines
      clearfields("name-editor");
      names_textarea.value = name_editor.value; //assigning the names textarea (the little one) the value of the name editor only if the input is clean
      getTeams(); //starting getteams operation. getteams reads the little textarea and cleans its contents before sending them to pickteams
    } else {
     clearfields('name-editor');
     //clearing the textarea (the little one) if there is no actual names or non-whitespace content in the textarea
    }
  }
}

function clearfields(origin) {
  if(origin == "textarea" && originalNames != null){
    let warning_popup = document.getElementById("warning-popup");
    let clear_button = document.getElementById("clear-button");
    let cancel_button = document.getElementById("cancel-button");
    let edit_button = document.getElementById("edit-button")
    edit_button.onclick = function(){
      open_name_editor();
    }
    warning_popup.classList.add('show-warning');  //show warning popup
    names_textarea.blur();
    clear_button.onclick = function() {
        while (team_divs.length != 0) {
    team_divs[0].remove();
  }
  names_textarea.value = '';
  originalNames = null; // Reset originalNames when clearing fields
  names_textarea.style.height = 0;
  names_textarea.style.height = names_textarea.scrollHeight + "px";
  warning_popup.classList.remove("show-warning");
      }
    cancel_button.onclick = function(){
      warning_popup.classList.remove("show-warning");
    }
  } else {
    names_textarea.value = '';
    names_textarea.style.height = 0;
    names_textarea.style.height = names_textarea.scrollHeight + "px";
    originalNames = null;
    while (team_divs.length != 0) {
      team_divs[0].remove();  //clearing the div where the second team would be
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
    originalNames = names_textarea.value.split('\n')
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
  
  // Display the teams
  names_textarea.insertAdjacentHTML("afterend", getTeamsHTML(teams.slice(1)));

  // Update textarea with first team
  let textarea_output_string = teams[0].join("\n");
  names_textarea.value = textarea_output_string;
  names_textarea.setAttribute("style", "height:" + (names_textarea.scrollHeight) + "px;overflow-y:hidden;");
  shrink(names_textarea);
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
