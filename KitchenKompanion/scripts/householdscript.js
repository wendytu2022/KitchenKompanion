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

  // add default members' allergies to localstorage
  localStorage.setItem(
    "member_allergens",
    JSON.stringify(["Peanuts", "Shellfish", "Milk"])
  );

  document
    .getElementById("allergen-form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form from refreshing the page

      var name = document.getElementById("name-text").value; //.value gets input values
      const selectedAllergens = [];
      const checkboxes = document.querySelectorAll(
        'input[name="allergen"]:checked'
      );

      checkboxes.forEach((checkbox) => {
        selectedAllergens.push(checkbox.value);
      });

      var newMember =
        '<div class="member"><div class="profile-pic"></div><div class="user-info"><h3 class="member-name">' +
        name +
        '</h3><p class="member-allergies">Allergies: ' +
        selectedAllergens.join(", ") +
        "</p></div></div>";

      addMemberModal.style.display = "none";
      //Now use appendChild and add it to the list!
      document.getElementById("member-list").innerHTML += newMember;

      // get previous array of allergens
      var currAllergens = JSON.parse(localStorage.getItem("member_allergens"));
      var updatedAllergens = currAllergens.concat;
      selectedAllergens;
      localStorage.setItem(
        "member_allergens",
        JSON.stringify(updatedAllergens)
      );
      // alert("Selected allergens saved: " + selectedAllergens.join(", "));
    });
};
