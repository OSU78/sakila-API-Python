from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
cors = CORS(app)

@app.before_request
def before_request():
    # Initialiser la connexion à la base de données
    app.config['mydb'] = mysql.connector.connect(
        host="unixshell.hetic.glassworks.tech",
        port=27116,
        user="student",
        password="Tk0Uc2o2mwqcnIA",
        database="sakila"
    )

@app.after_request
def after_request(response):
    # Fermer la connexion à la base de données après chaque requête
    mydb = app.config.get('mydb')
    if mydb is not None:
        mydb.close()

    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Endpoint pour récupérer les films triés et paginés
@app.route('/films')
def get_films():
    mydb = app.config.get('mydb')
    cursor = mydb.cursor()

    # Récupérer les paramètres de requête
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    sort_by = request.args.get('sort_by', 'title')
    sort_dir = request.args.get('sort_dir', 'asc')
    offset = (page - 1) * per_page

    # Construire la requête SQL pour récupérer les films triés et paginés
    query = f"""
        SELECT film.title AS title,
            film.rental_rate AS rental_rate,
            film.rating AS rating,
            category.name AS category_name,
            COUNT(rental.rental_id) AS rental_count
        FROM film
        INNER JOIN film_category ON film.film_id = film_category.film_id
        INNER JOIN category ON film_category.category_id = category.category_id
        INNER JOIN inventory ON film.film_id = inventory.film_id
        INNER JOIN rental ON inventory.inventory_id = rental.inventory_id
        GROUP BY film.film_id, category.name
        ORDER BY {sort_by} {sort_dir}
        LIMIT {offset}, {per_page}"""
    cursor.execute(query)
    output = []
    for (title, rental_rate, rating, category_name, rental_count) in cursor:
        output.append({
            'title': title,
            'rental_rate': rental_rate,
            'rating': rating,
            'category_name': category_name,
            'rental_count': rental_count
        })

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
        'sort_dir': sort_dir,
        'offset' : offset,
        
    }
    return jsonify(response)
