$(function() {

    const BASE_URL = 'http://127.0.0.1:8000'

    $('#registerBtn').on('click', async function (event) {
        event.preventDefault();

        const userData = {
            email: $('#email').val(),
            fullname: $('#fullname').val(),
            password1: $('#password1').val(),
            password2: $('#password2').val()
        }

        const response = await axios.post(`${BASE_URL}/users/register`, userData);
        
        const redirectURL = response.request.responseURL;
        window.location = redirectURL;
    })

    $('#loginBtn').on('click', async function (event) {
        event.preventDefault();

        const userData = {
            email: $('#email').val(),
            password: $('#password').val()
        }

        const response = await axios.post(`${BASE_URL}/users/login`, userData)

        const redirectURL = response.request.responseURL;
        window.location = redirectURL;
    })

    $('#logoutBtn').on('click', async function (event) {
        event.preventDefault();

        const response = await axios.post(`${BASE_URL}/users/logout`, userData=null)

        const redirectURL = response.request.responseURL;
        window.location = redirectURL;
    })
})