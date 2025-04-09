// Get the modal
var addMemberModal = document.getElementById("add-watcher-modal");

// Get the add-member button that opens the modal
var addMemberBtn = document.getElementById("add-watcher-button");

// <---------------- ADD WATCHER MODAL FUNCTIONALITY ------------------>
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
addMemberBtn.onclick = function () {
  addMemberModal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == addMemberModal) {
    addMemberModal.style.display = "none";
  }
};

//Defining a listener for our button, specifically, an onclick handler
document.getElementById("add-watcher").onclick = function () {
  //First things first, we need our text:
  var name = document.getElementById("name-text").value; //.value gets input values
  var relationship = document.getElementById("relationship-text").value;

  var newMember =
    '<div class="watcher"><div class="profile-pic"></div><div class="user-info"><h3 class="member-name">' +
    name +
    '</h3><p class="member-allergies">' +
    relationship +
    "</p></div></div>";

  addMemberModal.style.display = "none";
  //Now use appendChild and add it to the list!
  document.getElementById("watcher-list").innerHTML += newMember;
};
