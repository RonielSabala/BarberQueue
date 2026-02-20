SET
    FOREIGN_KEY_CHECKS = 0;

-- Roles
CREATE TABLE
    roles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        role_name ENUM ('client', 'barber', 'assistant', 'admin') NOT NULL
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
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
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
        FOREIGN KEY (client_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- Barber status [1:N relationship]
CREATE TABLE
    barber_status (
        id INT PRIMARY KEY AUTO_INCREMENT,
        barber_id INT NOT NULL UNIQUE,
        barber_status ENUM ('active', 'inactive', 'resting') NOT NULL,
        FOREIGN KEY (barber_id) REFERENCES users (id) ON DELETE CASCADE
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
        FOREIGN KEY (barber_id) REFERENCES users (id) ON DELETE CASCADE
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
        FOREIGN KEY (barber_id) REFERENCES users (id)
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

-- Users
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_email ON users(email); 

-- Barbershops
CREATE INDEX idx_barbershops_is_active ON barbershops(is_active);

-- Barbershop photos
CREATE INDEX idx_barbershop_photos_barbershop_id ON barbershop_photos(barbershop_id);

-- Barbershop reviews
CREATE INDEX idx_barbershop_reviews_barbershop_id ON barbershop_reviews(barbershop_id);
CREATE INDEX idx_barbershop_reviews_user_id ON barbershop_reviews(user_id);
CREATE INDEX idx_barbershop_reviews_rating ON barbershop_reviews(rating);

-- Employee barbershops
CREATE INDEX idx_employee_barbershops_barbershop_id ON employee_barbershops(barbershop_id);

-- Working days
CREATE INDEX idx_working_days_employee_id ON working_days(employee_id);
CREATE INDEX idx_working_days_day_of_week ON working_days(day_of_week);

-- Composite index to check which days an employee works
CREATE INDEX idx_working_days_employee_day ON working_days(employee_id, day_of_week);

-- Client status
CREATE INDEX idx_client_status_status ON client_status(client_status);

-- Barber status
CREATE INDEX idx_barber_status_status ON barber_status(barber_status);

-- Barber reviews
CREATE INDEX idx_barber_reviews_barber_id ON barber_reviews(barber_id);
CREATE INDEX idx_barber_reviews_client_id ON barber_reviews(client_id);
CREATE INDEX idx_barber_reviews_rating ON barber_reviews(rating);

-- Client turns (most consulted table in the system)
CREATE INDEX idx_client_turns_barbershop_id ON client_turns(barbershop_id);
CREATE INDEX idx_client_turns_client_id ON client_turns(client_id);
CREATE INDEX idx_client_turns_barber_id ON client_turns(barber_id);
CREATE INDEX idx_client_turns_group_id ON client_turns(group_id);
CREATE INDEX idx_client_turns_created_at ON client_turns(created_at);

-- Composite indexes for typical queue/turn queries
CREATE INDEX idx_client_turns_barbershop_created ON client_turns(barbershop_id, created_at);
CREATE INDEX idx_client_turns_barbershop_barber ON client_turns(barbershop_id, barber_id);

-- Client groups
CREATE INDEX idx_client_groups_leader_id ON client_groups(leader_id);