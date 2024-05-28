from flask import Flask, request, jsonify, render_template
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from PIL import Image
import io

app = Flask(__name__)

# Définir le chemin absolu vers le modèle
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'data', 'vgg16_trained_model.h5')

# Chargement du modèle
model = load_model(MODEL_PATH)

# Mapping des classes
class_names = ['crumpled_paper', 'disposable_paper_cups', 'egg_packaging', 'foil', 'glass_bottle', 'plastic_bottle', 'receipt']

@app.route('/')
def home():
    return render_template('front.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    if file:
        # Lire le fichier comme une image
        img = Image.open(io.BytesIO(file.read()))
        # on redimensionne l'image à la taille attendu par le modèle
        img = img.resize((128, 128))
        # on convertit l'image en tableau numpy
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        # Prédiction
        predictions = model.predict(img_array)
        predicted_class = np.argmax(predictions[0])
        predicted_class_name = class_names[predicted_class]

        return jsonify({'class': predicted_class_name})

if __name__ == '__main__':
    app.run(debug=True)
