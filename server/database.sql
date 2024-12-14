CREATE DATABASE recipes_web_app;

CREATE TABLE saved_recipes (
    id SERIAL PRIMARY KEY,
    recipe_id TEXT NOT NULL,
    user_id INT REFERENCES users(id)
    CONSTRAINT UNIQUE (recipe_id, user_id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(150) NOT NULL
);