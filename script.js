const { mainFunction } = require("./index");

document.getElementById('subtitleForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    console.log(username)
    await mainFunction(username)
})