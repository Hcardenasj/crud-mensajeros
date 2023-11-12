CREATE DATABASE mensajeros;

USE mensajeros;

CREATE TABLE mensajero(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre varchar (50)  NOT NULL,
    identificacion varchar (50)  NOT NULL,
    telefono int (12)  NOT NULL,
    edad int (4)  NOT NULL,
    vehiculo varchar (20)  NOT NULL
);

SELECT * FROM mensajero;