from flask import Flask, jsonify, request
from flask_cors import CORS

import mysql.connector

app = Flask(__name__)
cors = CORS(app)


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


# Configuration de la base de données

mydb = mysql.connector.connect(
  host="unixshell.hetic.glassworks.tech",
  port=27116,
  user="student",
  password="Tk0Uc2o2mwqcnIA",
  database="sakila"
)
cursor = mydb.cursor()

# Endpoint pour récupérer les films triés et paginés
@app.route('/films')
def get_films():
    # Récupérer les paramètres de requête
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    sort_by = request.args.get('sort_by', 'title')
    sort_dir = request.args.get('sort_dir', 'asc')
    offset = (page - 1) * per_page

    # Construire la requête SQL pour récupérer les films triés et paginés
    query = f"SELECT title, release_year FROM film ORDER BY {sort_by} {sort_dir} LIMIT {offset}, {per_page};"
    cursor.execute(query)
    output = []
    for (title, release_year) in cursor:
        output.append({'title': title, 'release_year': release_year})

    # Récupérer le nombre total de films pour construire les liens de pagination
    query = "SELECT COUNT(*) FROM film"
    cursor.execute(query)
    total_films = cursor.fetchone()[0]
    total_pages = (total_films // per_page) + (1 if total_films % per_page != 0 else 0)

    # Construire la réponse JSON avec les données triées et paginées
    response = {
        'data': output,
        'total_films': total_films,
        'total_pages': total_pages,
        'current_page': page,
        'per_page': per_page,
        'sort_by': sort_by,
        'sort_dir': sort_dir
    }
    return jsonify(response)






if __name__ == '__main__':
    app.run(debug=True,port=53000)
