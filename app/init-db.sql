-- Exécuter dans Azure SQL → Query Editor

CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(200) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT GETDATE()
);

-- Données de test
INSERT INTO users (name, email) VALUES ('Mostafa', 'mostafa@demo.com');
INSERT INTO users (name, email) VALUES ('Ahmed', 'ahmed@demo.com');

SELECT * FROM users;
