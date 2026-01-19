/* ================= REGISTRATION FORM ================= */

const gymForm = document.getElementById("gymForm");

if (gymForm) {
  gymForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const location = document.getElementById("location").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message");

    if (age < 10 || age > 80) {
      message.textContent = "Age must be between 10 and 80.";
      message.style.color = "red";
      return;
    }

    if (!gender) {
      message.textContent = "Please select gender.";
      message.style.color = "red";
      return;
    }

    const userData = { name, age, gender, location, email, phone };
    localStorage.setItem("gymUser", JSON.stringify(userData));

    message.textContent = "Registration successful!";
    message.style.color = "lightgreen";

    setTimeout(() => {
      message.textContent = "";
    }, 3000);

    this.reset();
  });
}

/* ================= BMI CALCULATOR ================= */

function calculateBMI() {
  const weight = document.getElementById("weight")?.value;
  const height = document.getElementById("height")?.value / 100;
  const result = document.getElementById("bmiResult");

  if (!weight || !height) {
    result.textContent = "Please enter valid values";
    return;
  }

  const bmi = (weight / (height * height)).toFixed(2);
  let category = "";

  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  result.textContent = `Your BMI is ${bmi} (${category})`;
}

/* ================= NAVBAR TOGGLE ================= */

function toggleMenu() {
  const navMenu = document.getElementById("navMenu");
  if (navMenu) {
    navMenu.classList.toggle("show");
  }
}

/* ================= FITNESS CALCULATOR ================= */

function calculateFitness() {
  const age = document.getElementById("fcAge")?.value;
  const weight = document.getElementById("fcWeight")?.value;
  const height = document.getElementById("fcHeight")?.value;
  const gender = document.getElementById("fcGender")?.value;
  const activity = document.getElementById("fcActivity")?.value;

  if (!age || !weight || !height || !gender || !activity) {
    alert("Please fill all fields");
    return;
  }

  const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
  let bmiStatus = "";

  if (bmi < 18.5) bmiStatus = "Underweight";
  else if (bmi < 25) bmiStatus = "Normal";
  else if (bmi < 30) bmiStatus = "Overweight";
  else bmiStatus = "Obese";

  let bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const calories = Math.round(bmr * activity);

  let bodyType =
    bmi < 18.5 ? "Ectomorph" : bmi < 25 ? "Mesomorph" : "Endomorph";

  document.getElementById("fcBMI").textContent = `BMI: ${bmi} (${bmiStatus})`;
  document.getElementById("fcBMR").textContent = `BMR: ${Math.round(bmr)} kcal/day`;
  document.getElementById("fcCalories").textContent = `Daily Calories Needed: ${calories} kcal`;
  document.getElementById("fcBodyType").textContent = `Body Type: ${bodyType}`;
}

/* ================= CONTACT FORM ================= */

function submitContact(e) {
  e.preventDefault();

  const name = document.getElementById("cName").value.trim();
  const email = document.getElementById("cEmail").value.trim();
  const subject = document.getElementById("cSubject").value.trim();
  const message = document.getElementById("cMessage").value.trim();
  const status = document.getElementById("contactStatus");

  if (!name || !email || !subject || !message) {
    status.textContent = "Please fill all fields.";
    status.style.color = "red";
    return;
  }

  const contactData = { name, email, subject, message };
  localStorage.setItem("contactMessage", JSON.stringify(contactData));

  status.textContent = "Message sent successfully! We will contact you soon.";
  status.style.color = "lightgreen";

  setTimeout(() => {
    status.textContent = "";
  }, 3000);

  e.target.reset();
}

/* ================= SCROLL REVEAL ================= */

const revealElements = document.querySelectorAll(".fade-up");

window.addEventListener("scroll", () => {
  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("show");
    }
  });
});
