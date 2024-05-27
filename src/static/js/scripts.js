function uploadImage() {
    const input = document.getElementById('imageInput');
    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('/predict', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            const resultSection = document.getElementById('resultSection');
            const resultText = document.getElementById('resultText');
            resultText.innerText = data.class;
            resultSection.style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
}
