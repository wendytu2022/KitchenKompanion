// Get the modal
var addMemberModal = document.getElementById("add-member-modal");

// Get the modal
var addAllergyModal = document.getElementById("add-allergy-modal");

// Get the add-member button that opens the modal
var addMemberBtn = document.getElementById("add-member-button");

// Get the add-allergy button that opens the modal
var addAllergyBtn = document.getElementById("add-allergy-button");

// <---------------- ADD MEMBER MODAL FUNCTIONALITY ------------------>
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
document.getElementById("add-member").onclick = function () {
  //First things first, we need our text:
  var name = document.getElementById("name-text").value; //.value gets input values
  var allergies = document.getElementById("allergies-text").value;

  var newMember =
    '<div class="member"><div class="profile-pic"></div><div class="user-info"><h3 class="member-name">' +
    name +
    '</h3><p class="member-allergies">Allergies: ' +
    allergies +
    "</p></div></div>";

  addMemberModal.style.display = "none";
  //Now use appendChild and add it to the list!
  document.getElementById("member-list").innerHTML += newMember;
};

// <---------------- END OF ADD MEMBER MODAL FUNCTIONALITY ------------------>

// <---------------- ADD ALLERGY MODAL FUNCTIONALITY ------------------>
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
addAllergyBtn.onclick = function () {
  addAllergyModal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == addAllergyModal) {
    addAllergyModal.style.display = "none";
  }
};

//Defining a listener for our button, specifically, an onclick handler
document.getElementById("add-allergy").onclick = function () {
  //First things first, we need our text:
  var text = document.getElementById("allergy-text").value; //.value gets input values

  //Now construct a quick list element
  var newAllergy = '<div class="allergy">' + text + "</div>";

  addAllergyModal.style.display = "none";
  //Now use appendChild and add it to the list!
  document.getElementById("allergy-list").innerHTML += newAllergy;
};
