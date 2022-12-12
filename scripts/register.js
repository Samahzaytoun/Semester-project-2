function handleRegister(event) {
  event.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (!email.includes("@stud.noroff.no")) {
    alert("Please use your stud.noroff.no email address");
    return;
  }

  request
    .post("https://api.noroff.dev/api/v1/auction/auth/register", {
      name: name,
      email: email,
      password: password,
    })
    .then((res) => {
      alert("User created successfully");
      window.location.href = "login.html";
    })
    .catch((e) => {
      if (e.errors) {
        for (let key in e.errors) {
          alert(e.errors[key].message);
        }
      }
    });
}
