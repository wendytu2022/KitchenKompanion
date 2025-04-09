window.onload = function () {
  // Get the modal
  var addMemberModal = document.getElementById("add-member-modal");

  // Get the add-member button that opens the modal
  var addMemberBtn = document.getElementById("add-member-button");

  // <---------------- ADD MEMBER MODAL FUNCTIONALITY ------------------>
  // Member modal close button
  var closeMemberModal = addMemberModal.querySelector(".close");

  // Open modals
  addMemberBtn.onclick = function () {
    addMemberModal.style.display = "block";
  };

  // Close modals on 'x' click
  closeMemberModal.onclick = function () {
    addMemberModal.style.display = "none";
  };

  // Close modals if clicking outside
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
};
