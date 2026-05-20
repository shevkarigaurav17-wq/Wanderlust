(() => {
  "use strict";

  // Fetch all forms
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();