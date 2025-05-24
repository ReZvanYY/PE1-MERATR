const mainContainer = document.querySelector(".registration-main-container");

const formContainer = document.createElement("section");
formContainer.className = "registration-form-container";

const heading = document.createElement("h1");
heading.textContent = "registration";
heading.className = "registration-page-heading";
mainContainer.appendChild(heading);

const form = document.createElement("form");
form.action = "register";
form.id = "registrationForm";
form.className = "registration-form";
formContainer.appendChild(form);

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

const applicationProgrammingInterface =
  "https://v2.api.noroff.dev/auth/register";

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

function passwordValidation(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
}

//needed to create an basic authorization key, using email and name to not give away any sensitive information//
function generateAuthorizationKey(email, password) {
  const data = email + password;
  return btoa(data);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  errorElement.textContent = "";
  successElement.textContent = "";

  //only allows first name//
  const username = form.name.value.trim();
  const constantEmail = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;
  const authorazationKey = generateAuthorazationKey(constantEmail, username);

  if (!constantEmail) {
    errorElement.textContent = "Please enter a valid E-Mail";
    errorElement.style.color = "red";
    return;
  }

  if (!emailValidation(constantEmail)) {
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
    name: username,
    email: constantEmail,
    password: password,
    confirmPassword: confirmPassword,
  };

  fetch(applicationProgrammingInterface, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registerData),
  })
    .then(async (response) => {
      if (!response.ok) {
        const failuredata = await response.json();
        console.log(failuredata);
        console.error("ERROR Response", failuredata);
        throw new Error(
          failuredata.message ||
            "Registration failed. Please check your input and try again."
        );
      }
      return response.json();
    })
    .then((data) => {
      successElement.textContent = "registration Successfull!";
      successElement.style.color = "lightgreen";
      errorElement.textContent = "";
      localStorage.setItem("authorazationKey", authorazationKey);
      form.reset();
    })
    .catch((error) => {
      errorElement.textContent =
        error.message ||
        "Registration failed. Please check your input and try again.";
      errorElement.style.color = "red";
      successElement.textContent = "";
    });
});
