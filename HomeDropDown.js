// Variable to track the currently open dropdown
var openDropdown = null;

// Event listener for mouseover on card1 blue
document.querySelector(".card1.blue").addEventListener("mouseover", function() {
    isCard1BlueHovered = true;
});

// Event listener for mouseout on card1 blue
document.querySelector(".card1.blue").addEventListener("mouseout", function(event) {
    var relatedTarget = event.relatedTarget || event.toElement;
    if (!this.contains(relatedTarget)) {
        isCard1BlueHovered = false;
        hideDropdownMenus();
    }
});

// Event listener for mouseout on dropdown menus
var dropdowns = document.getElementsByClassName("dropdown-content");
for (var i = 0; i < dropdowns.length; i++) {
    dropdowns[i].addEventListener("mouseout", function(event) {
        var relatedTarget = event.relatedTarget || event.toElement;
        if (!isCard1BlueHovered && !this.contains(relatedTarget)) {
            hideDropdownMenus();
        }
    });
}

// Function to hide all dropdown menus
function hideDropdownMenus() {
    for (var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].classList.remove("show");
    }
    openDropdown = null;
}

// Function to toggle the visibility of the dropdown menu
function toggleDropdown(iconNumber) {
    var dropdown = document.getElementById("dropdown-" + iconNumber);
    if (dropdown === openDropdown) {
        dropdown.classList.remove("show");
        openDropdown = null;
    } else {
        hideDropdownMenus();
        dropdown.classList.add("show");
        openDropdown = dropdown;
    }
}