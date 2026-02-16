DROP DATABASE IF EXISTS barberqueue_db;
CREATE DATABASE barberqueue_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE barberqueue_db;

SET FOREIGN_KEY_CHECKS=0;

-- USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    phone VARCHAR(30),
    address VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ROLES
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) UNIQUE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE user_roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY(user_id, role_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

-- BARBERSHOPS
CREATE TABLE barbershops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120),
    phone VARCHAR(40),
    address VARCHAR(255),
    open_at TIME,
    close_at TIME,
    current_clients INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE barbershop_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barbershop_id INT NOT NULL,
    photo_url TEXT NOT NULL,
    FOREIGN KEY(barbershop_id) REFERENCES barbershops(id)
) ENGINE=InnoDB;

-- EMPLOYEES
CREATE TABLE employees (
    user_id INT PRIMARY KEY,
    photo_url TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE employee_barbershops (
    employee_id INT,
    barbershop_id INT,
    start_time TIME,
    end_time TIME,
    PRIMARY KEY(employee_id, barbershop_id),
    FOREIGN KEY(employee_id) REFERENCES employees(user_id),
    FOREIGN KEY(barbershop_id) REFERENCES barbershops(id)
) ENGINE=InnoDB;

CREATE TABLE working_days (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    day_of_week TINYINT NOT NULL,
    FOREIGN KEY(employee_id) REFERENCES employees(user_id)
) ENGINE=InnoDB;

-- BARBERS
CREATE TABLE barber_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE barbers (
    employee_id INT PRIMARY KEY,
    status_id INT,
    FOREIGN KEY(employee_id) REFERENCES employees(user_id),
    FOREIGN KEY(status_id) REFERENCES barber_status(id)
) ENGINE=InnoDB;

-- CLIENT GROUPS
CREATE TABLE client_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    leader_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(leader_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE group_members (
    group_id INT,
    client_id INT,
    PRIMARY KEY(group_id, client_id),
    FOREIGN KEY(group_id) REFERENCES client_groups(id),
    FOREIGN KEY(client_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- TURN STATUS
CREATE TABLE turn_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) NOT NULL
) ENGINE=InnoDB;

-- TURNS
CREATE TABLE turns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    group_id INT,
    barber_id INT,
    barbershop_id INT,
    status_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attended_at TIMESTAMP NULL,
    finished_at TIMESTAMP NULL,
    FOREIGN KEY(client_id) REFERENCES users(id),
    FOREIGN KEY(group_id) REFERENCES client_groups(id),
    FOREIGN KEY(barber_id) REFERENCES barbers(employee_id),
    FOREIGN KEY(barbershop_id) REFERENCES barbershops(id),
    FOREIGN KEY(status_id) REFERENCES turn_status(id)
) ENGINE=InnoDB;

-- CLIENT BARBER PREFERENCES
CREATE TABLE client_barber_preferences (
    client_id INT,
    barber_id INT,
    PRIMARY KEY(client_id, barber_id),
    FOREIGN KEY(client_id) REFERENCES users(id),
    FOREIGN KEY(barber_id) REFERENCES barbers(employee_id)
) ENGINE=InnoDB;

-- REVIEWS
CREATE TABLE barber_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    barber_id INT,
    rating INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(client_id) REFERENCES users(id),
    FOREIGN KEY(barber_id) REFERENCES barbers(employee_id)
) ENGINE=InnoDB;

CREATE TABLE barbershop_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    barbershop_id INT,
    rating INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(client_id) REFERENCES users(id),
    FOREIGN KEY(barbershop_id) REFERENCES barbershops(id)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS=1;
