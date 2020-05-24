$.get("/userElectives").done(data => {
    $("#userElectives").text(data.response)
})