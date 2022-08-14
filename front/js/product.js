/** Récupération ID du produit */
let params = new URLSearchParams(document.location.search);
let id = params.get("id");

/** Fonction pour récupérer les données du produit */
fetch(`http://localhost:3000/api/products/${id}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (productData) {
        fillProduct(productData);

        // Changer le titre de la page par le nom du produit
        document.title = productData.name;

        /**  Au clic du bouton "Ajouter au panier", le produit s'ajoute*/
        productToCart = document.getElementById('addToCart');

        productToCart.addEventListener("click", function () {
            selectedProduct();
        });
    }
    )
    .catch(function (error) {
        console.log('fetch error', error);
        setTimeout(function () {
            alert("Ce produit n'existe plus");
            window.location.replace("index.html");
        })
    });


/** Fonction pour remplir les données dans la fiche produit */
function fillProduct(product) {

    // Elements de la page à remplir
    const productImgContainer = document.querySelector('.item__img');
    const productName = document.getElementById('title');
    const productPrice = document.getElementById('price');
    const productDescription = document.getElementById('description');

    //pour les images
    const productImg = document.createElement('img')
    productImg.setAttribute('src', product.imageUrl)
    productImg.setAttribute('alt', product.altTxt)
    productImgContainer.appendChild(productImg)

    //pour le texte
    productName.innerHTML = product.name;
    productPrice.innerHTML = product.price;
    productDescription.innerHTML = product.description;

    //pour les couleurs
    for (const color of product.colors) {
        productColorSelector = document.getElementById('colors')
        colorSelector = document.createElement('option')
        colorSelector.innerHTML = color
        colorSelector.setAttribute('value', color)
        productColorSelector.appendChild(colorSelector)
    }
}

function addToCart(selectedOptions) {
    let cart = JSON.parse(localStorage.getItem("productToCart"));

    if (cart) {
        let cartStorageUpdate = false
        for (let product of cart) {
            if (product.color === selectedOptions.color && product.id === selectedOptions.id) {
                product.quantity += selectedOptions.quantity
                cartStorageUpdate = true
            }
        }
        if (!cartStorageUpdate) {
            cart.push(selectedOptions);
        }
    } else {
        cart = [];
        cart.push(selectedOptions);
    }

    localStorage.setItem("productToCart", JSON.stringify(cart));
}

function selectedProduct() {
    var selectedColor = document.getElementById("colors").value
    var selectedQuantity = document.getElementById("quantity").value

    let selectedOptions = {
        id: id,
        color: selectedColor,
        quantity: parseInt(selectedQuantity),
    }

    console.log(selectedOptions)

    // si couleur ou quantité bien rempli, on ajoute au panier sinon alerte
    if (selectedColor != "--SVP, choisissez une couleur --" && selectedQuantity != "0") {
        addToCart(selectedOptions)
        alert("Produit ajouté au panier !")
    } else {
        alert("Veuillez sélectionner une couleur et/ou une quantité")
    }

}


