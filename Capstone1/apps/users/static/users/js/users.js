$(async function() {

    // axios.defaults.xsrfHeaderName = "X-CSRFToken";
    // axios.defaults.withCredentials = true;
    const BASE_URL = 'http://127.0.0.1:8000';
    const csrftoken = Cookies.get('csrftoken');

    $('#registerBtn').on('click', async function (event) {
        event.preventDefault();

        const userData = {
            email: $('#email').val(),
            fullname: $('#fullname').val(),
            password1: $('#password1').val(),
            password2: $('#password2').val()
        }

        const response = await axios.post(`${BASE_URL}/register`, userData, {headers: {'X-CSRFToken': csrftoken}});
        
        const redirectURL = response.request.responseURL;
        window.location = redirectURL;
    })


    $('#loginBtn').on('click', async function (event) {
        event.preventDefault();

        const userData = {
            email: $('#email').val(),
            password: $('#password').val()
        }

        const response = await axios.post(`${BASE_URL}/login`, userData, {headers: {'X-CSRFToken': csrftoken}})

        const redirectURL = response.request.responseURL;
        window.location = redirectURL;
    })

    // $('#loginBtnGoogle').on('click', async function (event) {
    //     event.preventDefault();

    //     const userData = {
    //         email: $('#email').val(),
    //         password: $('#password').val()
    //     }

    //     const response = await axios.post(`${BASE_URL}/accounts/login/`, userData, {headers: {'X-CSRFToken': csrftoken}})

    //     const redirectURL = response.request.responseURL;
    //     window.location = redirectURL;
    // })

    
    // $('#logoutBtn').on('click', async function (event) {
    //     event.preventDefault();

    //     const response = await axios.post(`${BASE_URL}/logout`, userData=null, {headers: {'X-CSRFToken': csrftoken}})

    //     const redirectURL = response.request.responseURL;
    //     window.location = redirectURL;
    // })
})