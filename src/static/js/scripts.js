function uploadImage() {
    const input = document.getElementById('imageInput');
    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    // on affiche l'image sélectionnée
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.getElementById('uploadedImage');
        img.src = e.target.result;
        img.style.display = 'block';
    }
    reader.readAsDataURL(file);

    // On envoie l'image au serveur pour la classification
    fetch('/predict', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            const resultText = document.getElementById('resultText');
            const resultSection = document.getElementById('resultSection');
            const trashImage = document.getElementById('trashImage');

            let message = '';
            let trashImageUrl = '';

            switch(data.class) {
                case 'crumpled_paper':
                    message = "Ne jette plus tes boulettes de papiers sur tes camarades de classe ! Applique les bons gestes et jette le dans la poubelle jaune !";
                    trashImageUrl = '/static/images/Poubelle-jaune.png';
                    break;
                case 'disposable_paper_cups':
                    message = "Tu as finis ta boisson ! Ne laisse pas trainer ton gobelet. Applique les bons gestes et jette le dans la poubelle jaune !";
                    trashImageUrl = '/static/images/Poubelle-jaune.png';
                    break;
                case 'egg_packaging':
                    message = "C’est bien tu as fait le plein de protéines en terminant ta boîte d’œufs ! Maintenant, applique les bons gestes et jette l’emballage dans la poubelle jaune !";
                    trashImageUrl = '/static/images/Poubelle-jaune.png';
                    break;
                case 'foil':
                    message = "Le papier aluminium… Mmm on rappelle que ce n’est pas ce qui a de meilleur pour la santé. Mais si tu t’obstines a en utiliser, au moins, applique les bons gestes et jette le dans la poubelle jaune !";
                    trashImageUrl = '/static/images/Poubelle-jaune.png';
                    break;
                case 'glass_bottle':
                    message = "Tu as finis ta boisson ! Ne laisse pas trainer ta bouteille. Applique les bons gestes ! Trouve le conteneur en verre le plus proche de chez toi et jette ta bouteille là-bas.";
                    trashImageUrl = '/static/images/conteneur_verre.png';
                    break;
                case 'plastic_bottle':
                    message = "Tu as finis ta boisson ! Ne laisse pas trainer ton gobelet. Applique les bons gestes et jette le dans la poubelle jaune !";
                    trashImageUrl = '/static/images/Poubelle-jaune.png';
                    break;
                case 'receipt':
                    message = "Tu as fini de faire tes courses ! Le frigo est enfin rempli ! Ne jette pas ton ticket de caisse sur le trottoir du voisin ! Applique les bons gestes et jette le dans la poubelle jaune !";
                    trashImageUrl = '/static/images/Poubelle-jaune.png';
                    break;

                default:
                    message = "Type de déchet non reconnu.";
                    trashImageUrl = '';
                    break;
            }

            resultText.innerText = `${data.class}: ${message}`;
            trashImage.src = trashImageUrl;
            trashImage.style.display = trashImageUrl ? 'inline' : 'none';
            resultSection.style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
}
