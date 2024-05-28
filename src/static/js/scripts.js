function uploadImage() {
    const input = document.getElementById('imageInput');
    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    // Afficher l'image sélectionnée
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.getElementById('uploadedImage');
        img.src = e.target.result;
        img.style.display = 'block';
    }
    reader.readAsDataURL(file);

    // Envoyer l'image au serveur pour la classification
    fetch('/predict', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            const resultText = document.getElementById('resultText');
            resultText.innerText = data.class;
            document.getElementById('resultSection').style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
}
