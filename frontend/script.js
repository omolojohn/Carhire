const carList = document.getElementById("car-list");
const carSelect = document.getElementById("car");
const bookingForm = document.getElementById("booking-form");
const bookingList = document.getElementById("booking-list");

let bookings = [];
let cars = [];

// Fetch cars
fetch("http://localhost:3000/cars")
  .then(res => res.json())
  .then(data => {
    cars = data;
    displayCars(data);
    populateSelect(data);
  });

// Display cars
function displayCars(cars) {
  carList.innerHTML = "";
  cars.forEach(car => {
    const card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
      <img src="${car.image}" alt="${car.make} ${car.model}">
      <h3>${car.make} ${car.model}</h3>
      <p>Price per day: KSh ${car.price}</p>
    `;
    carList.appendChild(card);
  });
}

// Populate select options
function populateSelect(cars) {
  carSelect.innerHTML = "";
  cars.forEach(car => {
    const option = document.createElement("option");
    option.value = car.id;
    option.textContent = `${car.make} ${car.model} - KSh ${car.price}/day`;
    carSelect.appendChild(option);
  });
}

// Handle booking
bookingForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const carId = parseInt(carSelect.value, 10);
  const days = parseInt(document.getElementById("days").value, 10);

  const car = cars.find(c => c.id === carId);

  if (!car || isNaN(days)) {
    alert("Please enter valid booking details.");
    return;
  }

  const pricePerDay = Number(car.price);
  const total = days * pricePerDay;

  const booking = {
    id: Date.now(),
    name,
    email,
    car: `${car.make} ${car.model}`,
    days,
    total
  };

  bookings.push(booking);
  renderBookings();
  bookingForm.reset();
});

// Render bookings
function renderBookings() {
  bookingList.innerHTML = "";
  bookings.forEach(b => {
    const li = document.createElement("li");
    li.className = "booking-item";
    li.innerHTML = `
      <strong>${b.name}</strong> booked 
      <em>${b.car}</em> for ${b.days} days 
      (Total: KSh ${b.total})
      <br>
      <button onclick="deleteBooking(${b.id})">Cancel</button>
      <button onclick="updateBooking(${b.id})">Update</button>
    `;
    bookingList.appendChild(li);
  });
}

// Delete booking
function deleteBooking(id) {
  bookings = bookings.filter(b => b.id !== id);
  renderBookings();
}

// Update booking
function updateBooking(id) {
  const newDays = prompt("Enter new number of days:");
  if (newDays && !isNaN(newDays)) {
    bookings = bookings.map(b => {
      if (b.id === id) {
        const car = cars.find(c => `${c.make} ${c.model}` === b.car);
        const pricePerDay = Number(car.price);
        return {
          ...b,
          days: parseInt(newDays, 10),
          total: pricePerDay * parseInt(newDays, 10)
        };
      }
      return b;
    });
    renderBookings();
  }
}
