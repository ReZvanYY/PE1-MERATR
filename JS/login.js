const mainContainer = document.querySelector(".login-main-container");

const formContainer = document.createElement("section");
formContainer.className = "login-form-container";

const heading = document.createElement("h1");
heading.textContent = "LOG IN";
heading.className = "login-page-heading";
mainContainer.appendChild(heading);

const logInLogo = document.createElement('img');
logInLogo.src = "https://i.imghippo.com/files/orvl6337mAc.png";
logInLogo.alt = "Log in Page foodie heaven logo, on a sage green background."
logInLogo.className = "log-in-logo";
formContainer.appendChild(logInLogo)

const form = document.createElement("form");
form.action = "login";
form.id = "loginForm";
form.className = "login-form";
formContainer.appendChild(form);


const inputFields = [
  {
    label: "EMAIL",
    type: "email",
    placeholder: "example@stud.noroff.no",
    id: "email",
  },
  {
    label: "PASSWORD",
    type: "password",
    placeholder: "ENTER PASSWORD",
    id: "password",
  },
];

inputFields.forEach((field) => {
  const formGroup = document.createElement("div");
  formGroup.className = "login-form-group";

  const label = document.createElement("label");
  label.setAttribute("for", field.id);
  label.textContent = field.label;
  label.className = "login-label";
  formGroup.appendChild(label);

  const input = document.createElement("input");
  input.type = field.type;
  input.placeholder = field.placeholder;
  input.id = field.id;
  input.className = "login-form-inputfield";
  input.required = true;
  formGroup.appendChild(input);

  form.appendChild(formGroup);
});

const loginButton = document.createElement("button");
loginButton.className = "login-button";
loginButton.type = "submit";
loginButton.textContent = "LOG IN";
form.appendChild(loginButton);

mainContainer.appendChild(formContainer);

const signInAPIUrl = "https://v2.api.noroff.dev/auth/login";

const errorElement = document.createElement("div");
errorElement.className = "error-message";
formContainer.appendChild(errorElement);

function emailValidation(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  errorElement.textContent = "";

  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;

  if (!email) {
    errorElement.style.color = "red";
    errorElement.textContent = "Please enter your E-mail";
    return;
  }
  if (!emailValidation(email)) {
    errorElement.style.color = "red";
    errorElement.textContent = "Please enter a valid email";
    return;
  }
  if (!password) {
    errorElement.style.color = "red";
    errorElement.textContent = "Please enter your password!";
    return;
  }

  const logInData = {
    email,
    password,
  };

  fetch(signInAPIUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logInData),
  })
    .then(async (response) => {
      const result = await response.json();
      if (!response.ok) {
        console.error("ERROR Response", result);
        throw new Error(result.message || "Log in failed.");
      }
      return result;
    })
    .then((data) => {
      localStorage.setItem("authKey", data.data.accessToken);
      localStorage.setItem("userName", data.data.name);
      form.reset();
      window.location.href = "../index.html";
    })
    .catch((error) => {
      errorElement.textContent = error.message;
      errorElement.style.color = "red";
    });
});
