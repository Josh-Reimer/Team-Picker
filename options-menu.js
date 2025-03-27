var popup_controls = document.getElementById("popup_controls");
      var button = document.getElementById("options");
      var span = document.getElementById("close");
      button.onclick = function() {
        popup_controls.classList.add('show-modal');
        //this line displays the modal
        //or in other words, the popup
      }
      span.onclick = function() {
        //the span element contains an X for
        //the user to click on to close the modal
        check_radio_buttons();
        popup_controls.classList.remove('show-modal');
      }
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == popup_controls) {
          check_radio_buttons();
          popup_controls.classList.remove('show-modal');
        }
      }
      var radio_button1 = document.getElementById("rbutton1");
      var radio_button2 = document.getElementById("rbutton2");
      var radio_button3 = document.getElementById("rbutton3");
      radio_button1.oninput = function() {
        slider.value = 2;
        slider_value.innerHTML = this.value;
      }
      radio_button2.oninput = function() {
        slider.value = 3;
        slider_value.innerHTML = this.value;
      }
      radio_button3.oninput = function() {
        slider.value = 4;
        slider_value.innerHTML = this.value;
      }
  
      var slider = document.getElementById("teams_slider");
      var slider_value = document.getElementById("slider_value");
      slider_value.innerHTML = slider.value;
     
      slider.oninput = function() {
        number_of_teams = this.value;
        slider_value.innerHTML = this.value;
        if (this.value == "2") {
          radio_button1.checked = true;
        } else if (this.value == "3") {
          radio_button2.checked = true;
        } else if (this.value == "4") {
          radio_button3.checked = true;
        } else {
          radio_button1.checked = false;
          radio_button2.checked = false;
          radio_button3.checked = false;
        }
      }
      var number_of_teams;
      function check_radio_buttons() {
        //this function checks the number of
        //teams option for the selected
        //radio button and assigns the
        //number_of_teams variable the correct
        //number for use in teampicker.js
        if (radio_button1.checked) {
          number_of_teams = 2;
        } else if (radio_button2.checked) {
          number_of_teams = 3;
        } else if (radio_button3.checked) {
          number_of_teams = 4;
        }
  
      }