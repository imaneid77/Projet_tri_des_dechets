from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
import pytesseract
from PIL import Image
import re

app = Flask(__name__)

def extract_information(text):
    total = re.search(r'Total\s*:\s*(\d+,\d{2})', text)
    tva = re.search(r'TVA\s*:\s*(\d+,\d{2})', text)
    date = re.search(r'Date\s*:\s*(\d{2}/\d{2}/\d{4})', text)
    etablissement = re.search(r'Établissement\s*:\s*(.*)', text)

    return {
        'total': total.group(1) if total else 'Non trouvé',
        'tva': tva.group(1) if tva else 'Non trouvé',
        'date': date.group(1) if date else 'Non trouvé',
        'etablissement': etablissement.group(1) if etablissement else 'Non trouvé'
    }

@app.route('/')
def index():
    return render_template('front.html')

@app.route('/process', methods=['POST'])
def process_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    filename = secure_filename(file.filename)
    file.save(filename)

    text = pytesseract.image_to_string(Image.open(filename), lang='eng')
    data = extract_information(text)

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
