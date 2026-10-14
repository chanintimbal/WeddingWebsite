document.addEventListener("DOMContentLoaded", () => {
  const correctPassword = "flicker"; 
  
  const lockScreen = document.getElementById("lock-screen");
  const passwordInput = document.getElementById("password-input");
  const unlockBtn = document.getElementById("unlock-btn");
  const errorMessage = document.getElementById("error-message");

  if (localStorage.getItem("wedding_unlocked") === "true") {
    document.body.classList.add("unlocked");
    if (lockScreen) {
      lockScreen.style.display = "none";
    }
  }

  function checkPassword() {
    if (passwordInput.value === correctPassword) {
      localStorage.setItem("wedding_unlocked", "true");
      
      document.body.classList.add("unlocked");
      
      setTimeout(() => {
        lockScreen.style.display = "none";
      }, 500);
    } else {
      errorMessage.textContent = "Incorrect password. Please try again.";
      passwordInput.value = "";
      passwordInput.focus();
    }
  }

  unlockBtn.addEventListener("click", checkPassword);

  passwordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      checkPassword();
    }
  });
});
