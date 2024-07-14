const baseURL = 'http://localhost:3000/pups';
let filterGoodDogs = false;

document.addEventListener('DOMContentLoaded', () => {
  const dogBar = document.getElementById('dog-bar');
  const dogInfo = document.getElementById('dog-info');
  const goodDogFilterBtn = document.getElementById('good-dog-filter');

  // Fetch all pups and add them to the dog bar
  fetchPups();

  // Toggle filter button text and reload pups accordingly
  goodDogFilterBtn.addEventListener('click', () => {
    filterGoodDogs = !filterGoodDogs;
    goodDogFilterBtn.textContent = `Filter good dogs: ${filterGoodDogs ? 'ON' : 'OFF'}`;
    fetchPups();
  });

  // Function to fetch pups from the server
  function fetchPups() {
    fetch(baseURL)
      .then(response => response.json())
      .then(pups => {
        dogBar.innerHTML = ''; // Clear dog bar

        pups.forEach(pup => {
          if (!filterGoodDogs || pup.isGoodDog) {
            renderPup(pup);
          }
        });
      });
  }

  // Function to render a single pup in the dog bar
  function renderPup(pup) {
    const pupSpan = document.createElement('span');
    pupSpan.textContent = pup.name;
    pupSpan.addEventListener('click', () => showPupInfo(pup));
    dogBar.appendChild(pupSpan);
  }

  // Function to show pup info in the dog info section
  function showPupInfo(pup) {
    const dogInfoContainer = document.getElementById('dog-info');
    dogInfoContainer.innerHTML = ''; // Clear previous info

    const dogImage = document.createElement('img');
    dogImage.src = pup.image;
    dogImage.alt = pup.name;
    dogInfoContainer.appendChild(dogImage);

    const dogName = document.createElement('h2');
    dogName.textContent = pup.name;
    dogInfoContainer.appendChild(dogName);

    const toggleButton = document.createElement('button');
    toggleButton.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
    toggleButton.addEventListener('click', () => toggleGoodDog(pup));
    dogInfoContainer.appendChild(toggleButton);
  }

  // Function to toggle pup's isGoodDog status
  function toggleGoodDog(pup) {
    pup.isGoodDog = !pup.isGoodDog;
    fetch(`${baseURL}/${pup.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isGoodDog: pup.isGoodDog
      })
    })
    .then(response => response.json())
    .then(updatedPup => {
      showPupInfo(updatedPup);
      fetchPups(); // Refresh dog bar with updated data
    });
  }
});
