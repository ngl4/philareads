from api.models import db, User, Quiz
import pytest
import pdb
from flask import current_app, json

API_PREFIX = "/api"


def setup():
    current_app.config["SECRET_KEY"] = "secret_key"


sample_book_json = """

{
    "name": "Cracking the OLD PM interview",
    "author": "smart pm",
    "grade": "Intermediate",
    "year": 2018,
    "cover_url": "https://cloudflare.com/images/crackingpm.png",
    "reader_url": "https://onlinereader.com/books/crackingpm.pdf",
    "published": true
}

"""

sample_good_json = """
{
    "name": "Gatsby Quiz",
    "book_id": 1,
    "questions": [
        {
            "text": "Who is gatsby?",
            "options": ["A person", "A cow", "A dog"],
            "correct_option": "A person"
        },
        {
            "text": "Who is dogsby?",
            "options": ["A person", "A rat", "A dog"],
            "correct_option": "A dog"
        },
        {
            "text": "Who is cowsby?",
            "options": ["A person", "A cow", "A dog"],
            "correct_option": "A cow"
        }
    ],
    "published": true
} """


sample_bad_json_data = """
{
  "namee": "Gatsby Quiz",
  "questions": [
        {
            "text": "Who is gatsby?",
            "options": ["A person", "A cow", "A dog"]
        },
        {
            "text": "Who is dogsby?",
            "options": ["A person", "A rat", "A dog"]
        },
        {
            "text": "Who is cowsby?",
            "options": ["A person", "A cow", "A dog"]
        }
    ]
} """


def test_create_valid_quiz(client):
    # create a new admin user and use its credentials for all subsequent requests
    user = User(name="admin", password="password123", username="test1@gmail.com")
    user.is_admin = True

    db.session.add(user)
    db.session.commit()

    login_res = client.post(
        API_PREFIX + "/login",
        data=json.dumps(
            dict(name="admin", password="password123", username="test1@gmail.com")
        ),
        content_type="application/json",
    )
    auth_token = login_res.json["result"]["auth_token"]
    client.set_cookie("localhost", "jwt", auth_token)

    client.post(
        API_PREFIX + "/book", data=sample_book_json, content_type="application/json"
    )
    # pdb.set_trace()
    res = client.post(
        API_PREFIX + "/quiz", data=sample_good_json, content_type="application/json"
    )
    #
    db_quiz = Quiz.query.filter_by(name="Gatsby Quiz")
    assert not (db_quiz is None)
    assert res.status_code == 200


def test_create_invalid_quiz(client):
    begin_num_quizzes = len(Quiz.query.all())
    res = client.post(
        API_PREFIX + "/quiz", data=sample_bad_json_data, content_type="application/json"
    )

    assert (
        len(Quiz.query.all()) == begin_num_quizzes
    )  # no data should have been created
    assert res.status_code == 422
