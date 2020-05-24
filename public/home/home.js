$.get("/getUserdata").done(data => {
    $("#username").text(data.response.username)
    $("#email").text(data.response.email)
})

