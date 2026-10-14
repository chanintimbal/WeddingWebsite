document.addEventListener('DOMContentLoaded', () => {
    
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
        if (!passwordInput) return;
        if (passwordInput.value === correctPassword) {
            localStorage.setItem("wedding_unlocked", "true");
            document.body.classList.add("unlocked");
            setTimeout(() => {
                if (lockScreen) lockScreen.style.display = "none";
            }, 500);
        } else {
            if (errorMessage) errorMessage.textContent = "Incorrect password. Please try again.";
            passwordInput.value = "";
            passwordInput.focus();
        }
    }

    if (unlockBtn) unlockBtn.addEventListener("click", checkPassword);
    if (passwordInput) {
        passwordInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                checkPassword();
            }
        });
    }

    const btnSearch = document.getElementById('btn-search');
    const lookupContainer = document.getElementById('lookup-container');
    const form = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('btn-submit');
    const guestSearchInput = document.getElementById('guest-search');
    const suggestionsList = document.getElementById('custom-suggestions');
    const welcomeMessage = document.getElementById('welcome-message');
    const searchError = document.getElementById('search-error');

    const ACCESS_KEY = "85d159eb-a672-4718-bd55-7fafcb6b0395"; 
    let officialGuestList = [];
    let confirmedGuestName = "";

    if (guestSearchInput || btnSearch || form) {
        
        fetch('guests.txt')
            .then(response => {
                if (!response.ok) throw new Error("Could not find or load guests.txt file.");
                return response.text();
            })
            .then(textData => {
                officialGuestList = textData.split('\n')
                    .map(name => name.trim())
                    .filter(name => name.length > 0);
            })
            .catch(error => {
                console.error("Error loading guest list:", error);
                if (searchError) searchError.textContent = "Unable to verify guest names at this moment.";
            });

        if (guestSearchInput && suggestionsList) {
            guestSearchInput.addEventListener('input', () => {
                const query = guestSearchInput.value.trim().toLowerCase();
                suggestionsList.innerHTML = "";

                if (query.length < 1) {
                    suggestionsList.classList.add('hidden');
                    return;
                }

                const filteredGuests = officialGuestList.filter(guest => 
                    guest.toLowerCase().includes(query)
                );

                if (filteredGuests.length > 0) {
                    filteredGuests.forEach(guest => {
                        const li = document.createElement('li');
                        li.textContent = guest;
                        
                        li.addEventListener('click', () => {
                            guestSearchInput.value = guest;
                            suggestionsList.classList.add('hidden');
                        });
                        
                        suggestionsList.appendChild(li);
                    });
                    suggestionsList.classList.remove('hidden');
                } else {
                    suggestionsList.classList.add('hidden');
                }
            });

            document.addEventListener('click', (e) => {
                if (!guestSearchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
                    suggestionsList.classList.add('hidden');
                }
            });
        }

        if (btnSearch) {
            btnSearch.addEventListener('click', () => {
                const typedName = guestSearchInput ? guestSearchInput.value.trim() : "";

                if (!typedName) {
                    if (searchError) searchError.textContent = "Please enter your name.";
                    return;
                }

                const matchedGuest = officialGuestList.find(
                    guest => guest.toLowerCase() === typedName.toLowerCase()
                );

                if (matchedGuest) {
                    if (searchError) searchError.textContent = "";
                    confirmedGuestName = matchedGuest; 
                    if (lookupContainer) lookupContainer.classList.add('hidden');
                    if (form) form.classList.remove('hidden');
                    if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${matchedGuest}!`;
                } else {
                    if (searchError) searchError.textContent = "We couldn't find that name on the guest list. Please check your spelling or choose from the options.";
                }
            });
        }

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const formData = new FormData(form);
                formData.append("access_key", ACCESS_KEY);
                formData.append("Guest Name", confirmedGuestName);

                const originalText = submitBtn ? submitBtn.textContent : "Submit RSVP";
                if (submitBtn) {
                    submitBtn.textContent = "Sending...";
                    submitBtn.disabled = true;
                }

                try {
                    const response = await fetch("https://web3forms.com", {
                        method: "POST",
                        body: formData
                    });

                    if (response.ok) {
                        form.innerHTML = `<h3 style="font-family: 'Pinyon Script', serif; font-size: 50px; text-align: center; margin-bottom: 10px;">Thank You!</h3><p style="font-family: 'Cormorant Upright', serif; font-size: 20px; text-align: center;">Your RSVP submission has been recorded successfully.</p>`;
                    } else {
                        const data = await response.json();
                        alert("Error: " + data.message);
                    }
                } catch (error) {
                    alert("Something went wrong. Please try again.");
                } finally {
                    if (form.querySelector('button[type="submit"]') && submitBtn) {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                }
            });
        }
    }
});
