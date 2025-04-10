window.onload = function () {
  // Get the modal
  var addAllergyModal = document.getElementById("add-allergy-modal");

  // Get the add-allergy button that opens the modal
  var addAllergyBtn = document.getElementById("add-allergy-button");

  // Allergy modal close button
  var closeAllergyModal = addAllergyModal.querySelector(".close");

  // Open modals
  addAllergyBtn.onclick = function () {
    addAllergyModal.style.display = "block";
  };

  // Close modals on 'x' click
  closeAllergyModal.onclick = function () {
    addAllergyModal.style.display = "none";
  };

  // Close modals if clicking outside
  window.onclick = function (event) {
    if (event.target == addAllergyModal) {
      addAllergyModal.style.display = "none";
    }
  };

  //Defining a listener for our button, specifically, an onclick handler
  document.getElementById("add-allergy").onclick = function () {
    //First things first, we need our text:
    var newAllergy = document.getElementById("allergy-text").value; //.value gets input values

    addAllergyModal.style.display = "none";
    //Now use appendChild and add it to the list!
    document.getElementById("allergy").innerHTML += ", " + newAllergy;
  };
};
