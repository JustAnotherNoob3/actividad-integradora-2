function sendToCart(cart, id) {
    console.log(id);
    console.log(cart);
    fetch(`/api/carts/${cart}/products/${id}`, {
        method: 'POST',
    }).then(async (data) => {
        if (data.status >= 400 && data.status < 500) {
            Swal.fire({
                title: "Error",
                text: (await data.json()).error,
                allowOutsideClick: false
            })
        } else {
            Swal.fire({
                title: "Success!",
                text: "Successfully added the product!",
                allowOutsideClick: false
            })
        }
    });
}
function logout() {
    fetch("/api/sessions/logout", {
        method: "GET"
    }).then((res) => {
        if (res.status === 200) {
            window.location.replace("/");
        }
    })
}