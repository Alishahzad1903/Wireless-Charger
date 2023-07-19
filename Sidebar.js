function changeColor(element) {
    // Get all buttons
    var buttons = document.getElementsByClassName('btn-link');

    // Remove the active-icon class from all buttons
    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        var icon = button.getElementsByTagName('i')[0];
        icon.classList.remove('active-icon');
    }

    // Add the active-icon class to the clicked button
    var icon = element.getElementsByTagName('i')[0];
    icon.classList.add('active-icon');
  }