document.addEventListener("DOMContentLoaded", () => {
  const correctHash = "e18dff93da444b37348a79b4d3d5e6c5b4aa0881b94a41911c867bc45fffbe5f"; 
  
  const lockScreen = document.getElementById("lock-screen");
  const passwordInput = document.getElementById("password-input");
  const unlockBtn = document.getElementById("unlock-btn");
  const errorMessage = document.getElementById("error-message");

  async function hashPassword(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function checkPassword() {
    const inputHash = await hashPassword(passwordInput.value);
    
    if (inputHash === correctHash) {
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
