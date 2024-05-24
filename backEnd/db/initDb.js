require("dotenv").config();

const getPool = require("./getPool");

// Función que crea las tablas en la base de datos.
const createTables = async () => {
  // Tratamos de obtener un pool de conexiones.
  const pool = await getPool();

  try {
    console.log("Borrando tablas si existen...");

    // Borrar tablas si existen
    await pool.query("DROP TABLE IF EXISTS appointments");
    await pool.query("DROP TABLE IF EXISTS users");

    console.log("Creando tablas...");

    // Crear tabla users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL
      )
    `);

    // Crear tabla appointments
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        date DATETIME NOT NULL,
        status VARCHAR(50) DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log("¡Tablas creadas correctamente!");

    // Al terminar de insertar las tablas cerramos el proceso con código 0 indicando que todo ha ido bien.
    process.exit(0);
  } catch (err) {
    console.error("Error al crear las tablas:", err);

    // Cerramos el proceso indicando que ha habido algún error con el código 1.
    process.exit(1);
  }
};

// Llamamos a la función que se encarga de crear las tablas.
createTables();
