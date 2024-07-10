function addVisit(){
    const url = "https://us-central1-k-thoughts-db.cloudfunctions.net/addVisit";

    // Making the POST request
    fetch(url, {
        method: 'POST', // Specify the method
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            visitOn: "",
        }
    })
    .then(response => response.json()) // Parse the JSON from the response
    .then(data => {
        console.log('Success:', data); // Handle the response data
    })
    .catch((error) => {
        console.error('Error:', error); // Handle any errors
    });
}