const loginBtn = document.getElementById("login");
const registerBtn = document.getElementById("register");
const container = document.getElementById("container");

registerBtn.addEventListener('click', ()=> {
    container.classList.add("active");
});
loginBtn.addEventListener('click', ()=> {
    container.classList.remove("active");
});