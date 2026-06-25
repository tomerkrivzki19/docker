const API_URL = "http://192.168.11.1:3000/api/users";
const loader = document.getElementById("loader");

async function loadUsers() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
      loading = False;
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error, "Error loading users");
  }
}

function renderUser(users) {
  //TAKS display the data to elements:
  const container = document.getElementById("users");

  container.innerHTML = users
    .map(
      (user) => `
        <div>
          <h3>Name: ${user.name}</h3>
          <h3>Email: ${user.email}</h3>
          <h3>Age: ${user.age}</h3>
          <h3>CreatedAt: ${user.createdAt}</h3>
          <button onclick="deleteUser('${user._id}')">🗑️</button> 
        </div>
      `,
    )
    .join("");
}

async function init() {
  loader.classList.remove("hidden");

  const users = await loadUsers();
  console.log(users);
  loader.classList.add("hidden");

  renderUser(users);
}

init();

async function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user ?")) return;

  // console.log("the user iid", id);

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    init();
  } catch (error) {
    console.error(error, "Error deleting users");
  }
}
