document.addEventListener('DOMContentLoaded', () => {
    const btnSearch = document.getElementById('btn-search');
    const lookupContainer = document.getElementById('lookup-container');
    const form = document.getElementById('rsvp-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const guestSearchInput = document.getElementById('guest-search');
    const guestDatalist = document.getElementById('guest-choices');
    const welcomeMessage = document.getElementById('welcome-message');
    const searchError = document.getElementById('search-error');

    const ACCESS_KEY = "85d159eb-a672-4718-bd55-7fafcb6b0395"; 
    let officialGuestList = [];
    let confirmedGuestName = "";

    fetch('guests.txt')
        .then(response => {
            if (!response.ok) throw new Error("Could not load the guest list file.");
            return response.text();
        })
        .then(textData => {
            officialGuestList = textData.split(\(/\r\)?\n/)
                .map(name => name.trim())
                .filter(name => name.length > 0);

            officialGuestList.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                guestDatalist.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error loading guest list:", error);
            searchError.textContent = "System error: Unable to verify your name right now.";
        });

    btnSearch.addEventListener('click', () => {
        const typedName = guestSearchInput.value.trim();

        const matchedGuest = officialGuestList.find(
            guest => guest.toLowerCase() === typedName.toLowerCase()
        );

        if (matchedGuest) {
            searchError.textContent = "";
            confirmedGuestName = matchedGuest; 
            lookupContainer.classList.add('hidden');
            form.classList.remove('hidden');
            welcomeMessage.textContent = `Welcome, ${matchedGuest}!`;
        } else {
            searchError.textContent = "We couldn't find that name on the guest list. Please select your name from the options or check your spelling.";
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        formData.append("access_key", ACCESS_KEY);
        formData.append("Guest Name", confirmedGuestName);

        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        try {
            const response = await fetch("https://web3forms.com", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                form.innerHTML = `<h3 style="font-family: 'Pinyon Script', serif; font-size: 50px; text-align: center; margin-bottom: 10px;">Thank You!</h3><p style="font-family: 'Cormorant Upright', serif; font-size: 20px; text-align: center;">Your RSVP submission has been recorded successfully.</p>`;
            } else {
                alert("Error: " + data.message);
            }

        } catch (error) {
            alert("Something went wrong. Please try again.");
        } finally {
            if (form.querySelector('button[type="submit"]')) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });
});
