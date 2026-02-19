SET
    FOREIGN_KEY_CHECKS = 0;

-- Roles
CREATE TABLE
    roles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        role_name ENUM ('client', 'barber', 'assistant', 'admin') NOT NULL,
    );

-- Users
CREATE TABLE
    users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        role_id INT NOT NULL,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        phone VARCHAR(15),
        user_address VARCHAR(255),
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles (id)
    );

-- Barbershops
CREATE TABLE
    barbershops (
        id INT PRIMARY KEY AUTO_INCREMENT,
        barbershop_name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        barbershop_address VARCHAR(255) NOT NULL,
        photo_url TEXT NOT NULL,
        open_at TIME NOT NULL,
        close_at TIME NOT NULL,
        max_concurrent_clients INT DEFAULT 1,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    );

-- Barbershop photos [1:N relationship]
CREATE TABLE
    barbershop_photos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        barbershop_id INT NOT NULL,
        photo_url TEXT NOT NULL,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id) ON DELETE CASCADE
    );

-- Barbershop reviews [1:N relationship]
CREATE TABLE
    barbershop_reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        barbershop_id INT NOT NULL,
        rating TINYINT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id) ON DELETE CASCADE
    );

-- Employees can work on multiple barbershops [M:N relationship]
CREATE TABLE
    employee_barbershops (
        employee_id INT NOT NULL,
        barbershop_id INT NOT NULL,
        start_time TIME,
        end_time TIME,
        PRIMARY KEY (employee_id, barbershop_id),
        FOREIGN KEY (employee_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id) ON DELETE CASCADE
    );

-- Employees can work on different days at different barbershops (1:N relationship)
CREATE TABLE
    working_days (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_id INT NOT NULL,
        day_of_week TINYINT NOT NULL,
        FOREIGN KEY (employee_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- Client status [1:N relationship]
CREATE TABLE
    client_status (
        id INT PRIMARY KEY AUTO_INCREMENT,
        client_id INT NOT NULL UNIQUE,
        client_status ENUM (
            'default',
            'on_barbershop',
            'on_queue',
            'waiting',
            'in_service',
            'attended',
            'paid'
        ) NOT NULL,
        FOREIGN KEY (client_id) REFERENCES users (id) ON DELETE CASCADE,
    );

-- Barber status [1:N relationship]
CREATE TABLE
    barber_status (
        id INT PRIMARY KEY AUTO_INCREMENT,
        barber_id INT NOT NULL UNIQUE,
        barber_status ENUM ('active', 'inactive', 'resting') NOT NULL,
        FOREIGN KEY (barber_id) REFERENCES users (id) ON DELETE CASCADE,
    );

-- Barber reviews [1:N relationship]
CREATE TABLE
    barber_reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        client_id INT NOT NULL,
        barber_id INT NOT NULL,
        rating TINYINT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (barber_id) REFERENCES users (id) ON DELETE CASCADE,
    );

-- Client turns
CREATE TABLE
    client_turns (
        id INT PRIMARY KEY AUTO_INCREMENT,
        barbershop_id INT NOT NULL,
        client_id INT NOT NULL,
        group_id INT NULL,
        barber_id INT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        attended_at TIMESTAMP NULL,
        finished_at TIMESTAMP NULL,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES users (id),
        FOREIGN KEY (group_id) REFERENCES client_groups (id),
        FOREIGN KEY (barber_id) REFERENCES users (id),
    );

-- Client groups
CREATE TABLE
    client_groups (
        id INT PRIMARY KEY AUTO_INCREMENT,
        leader_id INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (leader_id) REFERENCES users (id)
    );

SET
    FOREIGN_KEY_CHECKS = 1;
