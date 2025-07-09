const form = document.forms[0];
const avatarInput = form.avatar;

// Display file name after upload
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  const nameContainer = document.querySelector(".file-name");

  // Check file size
  if (file.size > 500 * 1000) {
    nameContainer.innerHTML = "Image is too large";
    avatarInput.value = "";
    return;
  }

  nameContainer.innerHTML = file.name;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    document.querySelector(".user__image").src = reader.result;
  };
});

// Prevent "Enter" key from submitting
form.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
  }
  return;
});

form.addEventListener("submit", (event) => handleSubmit(event));

function handleSubmit(event) {
  event.preventDefault();

  // Check empty inputs
  for (let input of form.elements) {
    if (input.type === "submit") continue;
    if (input.value.length <= 0) return;
  }

  const data = new FormData(form);
  const fullName = data.get("full-name");
  const email = data.get("email");
  const githubUserName = data.get("github-username");

  document.querySelector(".user-email").innerHTML = email;

  const generateTicket = async () => {
    dayjs.extend(window.dayjs_plugin_localizedFormat);
    const date = dayjs().format("ll");
    const { region, country } = await fetchLocationData();

    const ticket = document.querySelector(".ticket");
    ticket.querySelector(".date_and_location small").innerHTML = `${date.concat(
      " / ",
      region,
      " ",
      country
    )}`;
    ticket.querySelector(".user__name").innerHTML = fullName;
    ticket.querySelector(".user__github-username small").innerHTML = "@".concat(
      githubUserName
    );
    ticket.querySelector(".ticket-id").innerHTML = "#".concat(
      Math.random().toString(8).slice(2, 7)
    );
  };
  generateTicket();
  renderTicket();
}

async function fetchLocationData() {
  const res = await fetch(
    "https://geo.ipify.org/api/v2/country?apiKey=at_xbdYLEdJPnEgU5v3cpIihpm1Tojem"
  );
  const data = await res.json();
  const { location } = data;
  const { region, country } = location;
  return { region, country };
}

function renderTicket() {
  document.querySelector(".primary-header").classList.add("hidden");
  document.querySelector(".secondary-header").classList.remove("hidden");
  document.querySelector("form").classList.add("hidden");
  document.getElementById("ticket").classList.remove("hidden");
}
