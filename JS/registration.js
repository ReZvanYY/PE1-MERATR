const mainContainer = document.querySelector(".registration-main-container");

const formContainer = document.createElement("section");
formContainer.className = "registration-form-container";

const heading = document.createElement("h1");
heading.textContent = "REGISTRATION";
heading.className = "registration-page-heading";
mainContainer.appendChild(heading);

const form = document.createElement("form");
form.action = "register";
form.id = "registrationForm";
form.className = "registration-form";
formContainer.appendChild(form);

const registerLogo = document.createElement('img');
registerLogo.src = "https://i.imghippo.com/files/orvl6337mAc.png";
registerLogo.alt = "Register Page foodie heaven logo, on a sage green background."
registerLogo.className = "register-logo";
formContainer.appendChild(registerLogo)

const inputFields = [
  { label: "NAME", type: "text", placeholder: "NAME", id: "name" },
  {
    label: "EMAIL",
    type: "email",
    placeholder: "example@stud.noroff.no",
    id: "email",
  },
  {
    label: "PASSWORD",
    type: "password",
    placeholder: "ENTER WANTED PASSWORD",
    id: "password",
  },
  {
    label: "CONFIRM PASSWORD",
    type: "password",
    placeholder: "CONFIRM PASSWORD",
    id: "confirmPassword",
  },
];

inputFields.forEach((field) => {
  const formGroup = document.createElement("div");
  formGroup.className = "registration-form-group";

  const label = document.createElement("label");
  label.setAttribute("for", field.id);
  label.textContent = field.label;
  label.className = "registration-label";
  formGroup.appendChild(label);

  const input = document.createElement("input");
  input.type = field.type;
  input.placeholder = field.placeholder;
  input.id = field.id;
  input.className = "registration-form-inputfield";
  input.required = true;
  formGroup.appendChild(input);

  form.appendChild(formGroup);
});

const registrationButton = document.createElement("button");
registrationButton.className = "registration-button";
registrationButton.textContent = "REGISTER";
form.appendChild(registrationButton);

formContainer.appendChild(form);
mainContainer.appendChild(formContainer);

const registerationAPI = "https://v2.api.noroff.dev/auth/register";
const loginAPI = "https://v2.api.noroff.dev/auth/register";

const errorElement = document.createElement("div");
errorElement.className = "error-message";
formContainer.appendChild(errorElement);

const successElement = document.createElement("div");
successElement.className = "success-message";
formContainer.appendChild(successElement);

function emailValidation(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  errorElement.textContent = "";
  errorElement.style.color = "";
  successElement.textContent = "";

  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;
  const userName = email.split("@")[0];

  if (!email) {
    errorElement.textContent = "Please enter a valid E-Mail";
    errorElement.style.color = "red";
    return;
  }

  if (!emailValidation(email)) {
    errorElement.textContent = "Please enter a valid E-Mail";
    errorElement.style.color = "red";
    return;
  }
  if (password !== confirmPassword) {
    errorElement.textContent = "Passwords do not match";
    errorElement.style.color = "red";
    return;
  }

  const registerData = {
    name: userName,
    email,
    password,
    confirmPassword,
  };

  fetch(registerationAPI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registerData),
  })
    .then(async (response) => {
      if (!response.ok) {
        const result = await response.json();
        console.log(result);
        console.error("ERROR Response", result);
        throw new Error(
          result.message ||
            "registration failed. Please check your input and try again.");
      }
      return result;
    })
    .then(() => {
    return fetch(loginAPI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    })
    .then ((res) => res.json())
    .then ((loginData) =>{
      localStorage.setItem("authKey", loginData.data.accessToken);
      localStorage.setItem("userName", loginData.data.name);
      successElement.textContent = "Register and login is successfully"
      successElement.style.color = "black";
      form.reset();
      window.location.href = "../index.html";
    })
    .catch((error) => {
      errorElement.textContent = error.message;
      errorElement.style.color = "red";
    });
  });