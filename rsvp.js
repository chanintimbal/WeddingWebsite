document.addEventListener('DOMContentLoaded', () => {
    const btnSearch = document.getElementById('btn-search');
    const lookupContainer = document.getElementById('lookup-container');
    const rsvpForm = document.getElementById('rsvp-form');
    const guestSearchInput = document.getElementById('guest-search');
    const guestDatalist = document.getElementById('guest-choices');
    const welcomeMessage = document.getElementById('welcome-message');
    const searchError = document.getElementById('search-error');

    let officialGuestList = [];

    fetch('guests.txt')
        .then(response => {
            if (!response.ok) throw new Error("Could not load the guest list file.");
            return response.text();
        })
        .then(textData => {
            officialGuestList = textData.split('\n')
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
            lookupContainer.classList.add('hidden');
            rsvpForm.classList.remove('hidden');
            welcomeMessage.textContent = `Welcome, ${matchedGuest}!`;
        } else {
            searchError.textContent = "We couldn't find that name on the guest list. Please select your name from the options or check your spelling.";
        }
    });
});
