import json

# Data pertanyaan dan jawaban dari file teks
data_file = 'data.txt'

# Membaca data dari file teks
with open(data_file, 'r', encoding='utf-8') as file:
    lines = file.readlines()

questions = []
current_question = None
options = []

# Memproses setiap baris dari file teks
for line in lines:
    line = line.strip()

    if line and line[0].isdigit() and '.' in line:
        # Mendeteksi nomor pertanyaan baru
        if current_question:
            current_question['options'] = options
            questions.append(current_question)
            options = []
        question_number, question_text = line.split('.', 1)
        current_question = {"id": int(question_number.strip()), "question": question_text.strip(), "options": []}
    elif line:
        # Mendeteksi pilihan jawaban
        options.append(line.strip())

# Menambahkan pertanyaan terakhir ke daftar
if current_question:
    current_question['options'] = options
    questions.append(current_question)

# Mengkonversi ke JSON
json_data = json.dumps(questions, indent=2, ensure_ascii=False)

# Menyimpan data JSON ke file
output_file = 'questions.json'
with open(output_file, 'w', encoding='utf-8') as json_file:
    json_file.write(json_data)

print(f"Data berhasil dikonversi ke JSON. Simpan di: {output_file}")