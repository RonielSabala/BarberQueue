-- ROLES
CREATE TABLE
    roles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        role_name ENUM('client', 'barber', 'assistant', 'admin') NOT NULL
    );

-- USERS
CREATE TABLE
    users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        role_id INT NOT NULL,
        username VARCHAR(30) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles (id)
    );

-- BARBERSHOPS
CREATE TABLE
    barbershops (
        id INT PRIMARY KEY AUTO_INCREMENT,
        barbershop_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        barbershop_address TEXT NOT NULL,
        photo_url TEXT NOT NULL,
        opens_at TIME NOT NULL,
        closes_at TIME NOT NULL,
        capacity INT DEFAULT 1,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- BARBERSHOP PHOTOS
CREATE TABLE
    barbershop_photos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        barbershop_id INT NOT NULL,
        photo_url TEXT NOT NULL,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id) ON DELETE CASCADE
    );

-- CLIENT STATUS
CREATE TABLE
    client_status (
        user_id INT PRIMARY KEY,
        current_status ENUM('default', 'at_barbershop', 'on_queue', 'waiting', 'in_service', 'attended', 'paid') NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- BARBER STATUS
CREATE TABLE
    barber_status (
        staff_id INT PRIMARY KEY,
        current_status ENUM('active', 'inactive', 'resting') NOT NULL,
        is_accepting BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (staff_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- STAFF ASSIGNMENTS
CREATE TABLE
    staff_assignments (
        staff_id INT NOT NULL,
        barbershop_id INT NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        PRIMARY KEY (staff_id, barbershop_id),
        FOREIGN KEY (staff_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id) ON DELETE CASCADE
    );

-- WORKING DAYS
CREATE TABLE
    working_days (
        id INT PRIMARY KEY AUTO_INCREMENT,
        staff_id INT NOT NULL,
        day_of_week TINYINT NOT NULL COMMENT '1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun',
        FOREIGN KEY (staff_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- CLIENT GROUPS
CREATE TABLE
    client_groups (
        id INT PRIMARY KEY AUTO_INCREMENT,
        leader_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (leader_id) REFERENCES users (id)
    );

-- TURNS
CREATE TABLE
    turns (
        id INT PRIMARY KEY AUTO_INCREMENT,
        barbershop_id INT NOT NULL,
        client_id INT NOT NULL,
        group_id INT NULL,
        barber_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        attended_at TIMESTAMP NULL,
        finished_at TIMESTAMP NULL,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES users (id),
        FOREIGN KEY (group_id) REFERENCES client_groups (id),
        FOREIGN KEY (barber_id) REFERENCES users (id)
    );

-- BARBERSHOP REVIEWS
CREATE TABLE
    barbershop_reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        barbershop_id INT NOT NULL,
        rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id) ON DELETE CASCADE
    );

-- BARBER REVIEWS
CREATE TABLE
    barber_reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        client_id INT NOT NULL,
        barber_id INT NOT NULL,
        rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (barber_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- INDEXES
-- users
CREATE INDEX idx_users_role_id ON users (role_id);

CREATE INDEX idx_users_email ON users (email);

-- barbershops
CREATE INDEX idx_barbershops_is_active ON barbershops (is_active);

-- barbershop_photos
CREATE INDEX idx_barbershop_photos_barbershop_id ON barbershop_photos (barbershop_id);

-- client_status
CREATE INDEX idx_client_status_status ON client_status (current_status);

-- barber_status
CREATE INDEX idx_barber_status_status ON barber_status (current_status);

-- staff_assignments
CREATE INDEX idx_staff_assignments_barbershop_id ON staff_assignments (barbershop_id);

-- working_days
CREATE INDEX idx_working_days_day_of_week ON working_days (day_of_week);

CREATE INDEX idx_working_days_employee_day ON working_days (staff_id, day_of_week);

-- client_groups
CREATE INDEX idx_client_groups_leader_id ON client_groups (leader_id);

-- turns
CREATE INDEX idx_turns_barbershop_id ON turns (barbershop_id);

CREATE INDEX idx_turns_barber_id ON turns (barber_id);

CREATE INDEX idx_turns_group_id ON turns (group_id);

CREATE INDEX idx_turns_created_at ON turns (created_at);

CREATE INDEX idx_turns_client_created ON turns (client_id, created_at);

CREATE INDEX idx_turns_barbershop_barber ON turns (barbershop_id, barber_id);

CREATE INDEX idx_turns_barbershop_created ON turns (barbershop_id, created_at);

-- barbershop_reviews
CREATE INDEX idx_barbershop_reviews_user_id ON barbershop_reviews (user_id);

CREATE INDEX idx_barbershop_reviews_shop_rating ON barbershop_reviews (barbershop_id, rating, created_at);

-- barber_reviews
CREATE INDEX idx_barber_reviews_client_id ON barber_reviews (client_id);

CREATE INDEX idx_barber_reviews_barber_rating ON barber_reviews (barber_id, rating, created_at);
