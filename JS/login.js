const mainContainer = document.querySelector(".login-main-container");

const formContainer = document.createElement("section");
formContainer.className = "login-form-container";

const heading = document.createElement("h1");
heading.textContent = "LOG IN";
heading.className = "login-page-heading";
mainContainer.appendChild(heading);

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

const successElement = document.createElement("div");
successElement.className = "success-message";
formContainer.appendChild(successElement);

function emailValidation(email) {
  const emailRegex = /^[^\s@]+@stud\.noroff\.no$/;
  return emailRegex.test(email);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  successElement.textContent = "";
  errorElement.textContent = "";

  const constantEmail = form.email.value.trim().toLowerCase();
  const password = form.password.value;

  if (!constantEmail) {
    errorElement.style.color = "red";
    errorElement.textContent = "Please enter your E-mail";
    return;
  }
  if (!emailValidation(constantEmail)) {
    errorElement.style.color = "red";
    errorElement.textContent = "Please enter @stud.noroff.no E-Mail";
    return;
  }
  if (!password) {
    errorElement.style.color = "red";
    errorElement.textContent = "Please enter your password!";
    return;
  }

  const logInData = {
    email: constantEmail,
    password: password,
  };

  fetch(signInAPIUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logInData),
  })
    .then(async (response) => {
      if (!response.ok) {
        const results = await response.json();
        console.error("ERROR Response", results);
        throw new Error(results.message || "Log in failed.");
      }
      return await response.json();
    })
    .then((data) => {
      successElement.textContent = "Log in Successful!";
      successElement.style.color = "Black";

      localStorage.setItem("authorizationKey", data.authorizationKey);
      localStorage.setItem("user", JSON.stringify(data.data));

      window.location.href = "../index.html";
    })
    .catch((error) => {
      errorElement.textContent = error.message;
      errorElement.style.color = "red";
    });
});
