function evaluate_login() {
    var username = document.getElementById("username");
    var password = document.getElementById("password");

    if (username.value == "housayn" && password.value == "raffea"){
        window.location.href = "home.html"
    }
    else{
        document.getElementById("login-evaluator-text").innerHTML = "Invalid username and/or password<br> (I'm being very vague here on purpose)"
    }
}