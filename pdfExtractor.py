import PyPDF2
import spacy
from transformers import pipeline
import yaml

# Carga el modelo de lenguaje de spaCy
nlp = spacy.load("es_core_news_md")

# Función para extraer texto de un PDF
def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text()
    return text

# Función para dividir el texto en fragmentos pequeños (oraciones)
def split_text_into_fragments(text, fragment_size=3):
    doc = nlp(text)
    sentences = [sent.text for sent in doc.sents]
    fragments = [' '.join(sentences[i:i+fragment_size]) for i in range(0, len(sentences), fragment_size)]
    return fragments

# Extraer y dividir el texto en fragmentos pequeños
pdf_path = 'ARBOLESYEJES.pdf'
pdf_text = extract_text_from_pdf(pdf_path)
fragments = split_text_into_fragments(pdf_text)

print(f"Fragmentos extraídos:\n{fragments}")

# Cargar un pipeline de clasificación basado en BERT preentrenado (ajusta el modelo si lo necesitas)
classifier = pipeline('zero-shot-classification', model='nlptown/bert-base-multilingual-uncased-sentiment')

# Intenciones conocidas (puedes expandir esta lista con las intenciones del chatbot)
intents = ["consultar_diametro_eje", "consultar_longitud_eje", "consultar_material_eje", "otros"]

# Clasificar cada fragmento en una intención
def classify_fragments(fragments, intents):
    classified_fragments = []
    for fragment in fragments:
        result = classifier(fragment, intents)
        # Obtener la intención más probable
        intent = result['labels'][0]
        classified_fragments.append((fragment, intent))
    return classified_fragments

classified_fragments = classify_fragments(fragments, intents)

# Mostrar fragmentos clasificados por intención
for fragment, intent in classified_fragments:
    print(f"\nFragmento: {fragment}\nIntención detectada: {intent}")

# Función para generar el archivo nlu.yml basado en los fragmentos clasificados
def generate_nlu_yaml_from_fragments(classified_fragments):
    nlu_data = {"version": "2.0", "nlu": []}
    intent_examples = {}

    # Agrupar fragmentos por intención
    for fragment, intent in classified_fragments:
        if intent not in intent_examples:
            intent_examples[intent] = []
        intent_examples[intent].append(fragment)

    # Formatear para Rasa
    for intent, examples in intent_examples.items():
        intent_data = {
            "intent": intent,
            "examples": "\n".join([f"  - {example}" for example in examples])
        }
        nlu_data["nlu"].append(intent_data)

    # Guardar en el archivo nlu.yml
    with open("nlu.yml", "w", encoding='utf-8') as file:
        yaml.dump(nlu_data, file, allow_unicode=True, sort_keys=False)

generate_nlu_yaml_from_fragments(classified_fragments)