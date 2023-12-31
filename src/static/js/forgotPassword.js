const form = document.getElementById('forgot-password-form');

form.addEventListener('submit', function(event) {
    event.preventDefault();


    const email = document.getElementById('email').value;

    if (email === "" ) {
        alert("Please fill in every field");
        return;
    }

    fetch("http://localhost:3000/api/authentication/forgot-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username:email
        })
    }).then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                alert("Send failed: " + data.message);
                throw new Error(data.message);
            });
        }
        return response.json();
    })
        .then(data => {
            alert("Send request successful");
            console.log(data);
            window.location.href = '/view/home';
        })
        .catch(err => {
            alert("Send failed: " + err.message);
        });
});

