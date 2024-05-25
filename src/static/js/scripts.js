document.getElementById('addExpenseNoteButton').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Veuillez sélectionner un fichier');
        return;
    }
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('/process', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Assumes you have elements to display the data
            document.getElementById('total').textContent = 'Total: ' + data.total;
            document.getElementById('tva').textContent = 'TVA: ' + data.tva;
            document.getElementById('date').textContent = 'Date: ' + data.date;
            document.getElementById('etablissement').textContent = 'Établissement: ' + data.etablissement;
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
});
