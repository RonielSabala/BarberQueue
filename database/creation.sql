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
        email VARCHAR(254) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        photo_url TEXT NULL,
        password_hash VARCHAR(60) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles (id)
    );

-- PASSWORD RESETS
CREATE TABLE
    password_resets (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        reset_code MEDIUMINT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- BARBERSHOPS
CREATE TABLE
    barbershops (
        id INT PRIMARY KEY AUTO_INCREMENT,
        admin_id INT NOT NULL,
        barbershop_name VARCHAR(100) NOT NULL,
        email VARCHAR(254) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        barbershop_address TEXT NOT NULL,
        photo_url TEXT NOT NULL,
        opens_at TIME NOT NULL,
        closes_at TIME NOT NULL,
        capacity TINYINT UNSIGNED NOT NULL,
        is_active BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES users (id) ON DELETE RESTRICT
    );

-- CLIENT STATUS
CREATE TABLE
    client_status (
        client_id INT PRIMARY KEY,
        barbershop_id INT NULL,
        current_status ENUM('default', 'at_barbershop', 'on_queue', 'waiting', 'in_service', 'attended', 'paid') NOT NULL,
        FOREIGN KEY (client_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id) ON DELETE CASCADE
    );

-- BARBER STATUS
CREATE TABLE
    barber_status (
        barber_id INT PRIMARY KEY,
        current_status ENUM('active', 'inactive', 'resting') NOT NULL,
        is_accepting BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (barber_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- BARBER REVIEWS
CREATE TABLE
    barber_reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        client_id INT NOT NULL,
        barber_id INT NOT NULL,
        rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (barber_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- BARBER STATS
CREATE TABLE
    barber_stats (
        barber_id INT PRIMARY KEY,
        avg_service_minutes DECIMAL(10, 4) NULL,
        avg_rating DECIMAL(5, 4) NULL,
        total_attended INT UNSIGNED NOT NULL DEFAULT 0,
        total_reviews INT UNSIGNED NOT NULL DEFAULT 0,
        FOREIGN KEY (barber_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- BARBERSHOP PHOTOS
CREATE TABLE
    barbershop_photos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        barbershop_id INT NOT NULL,
        photo_url TEXT NOT NULL,
        photo_description TEXT NOT NULL,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id) ON DELETE CASCADE
    );

-- BARBERSHOP REVIEWS
CREATE TABLE
    barbershop_reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        client_id INT NOT NULL,
        barbershop_id INT NOT NULL,
        rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id) ON DELETE CASCADE
    );

-- BARBERSHOP STATS
CREATE TABLE
    barbershop_stats (
        barbershop_id INT PRIMARY KEY,
        avg_service_minutes DECIMAL(10, 4) NULL,
        avg_rating DECIMAL(5, 4) NULL,
        total_attended INT UNSIGNED NOT NULL DEFAULT 0,
        total_reviews INT UNSIGNED NOT NULL DEFAULT 0,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id) ON DELETE CASCADE
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
        barbershop_id INT NOT NULL,
        day_of_week TINYINT UNSIGNED NOT NULL COMMENT '1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun',
        FOREIGN KEY (staff_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id) ON DELETE CASCADE
    );

-- CLIENT GROUPS
CREATE TABLE
    client_groups (
        id INT PRIMARY KEY AUTO_INCREMENT,
        leader_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (leader_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- GROUP MEMBERS
CREATE TABLE
    group_members (
        id INT PRIMARY KEY AUTO_INCREMENT,
        group_id INT NOT NULL,
        member_name VARCHAR(30) NOT NULL,
        current_status ENUM('on_queue', 'waiting', 'in_service', 'attended', 'paid') NOT NULL DEFAULT 'on_queue',
        FOREIGN KEY (group_id) REFERENCES client_groups (id) ON DELETE CASCADE
    );

-- TURNS
CREATE TABLE
    turns (
        id INT PRIMARY KEY AUTO_INCREMENT,
        barbershop_id INT NOT NULL,
        client_id INT NULL,
        member_id INT NULL,
        group_id INT NULL,
        barber_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        attended_at TIMESTAMP NULL,
        finished_at TIMESTAMP NULL,
        FOREIGN KEY (barbershop_id) REFERENCES barbershops (id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (member_id) REFERENCES group_members (id) ON DELETE CASCADE,
        FOREIGN KEY (group_id) REFERENCES client_groups (id) ON DELETE CASCADE,
        FOREIGN KEY (barber_id) REFERENCES users (id) ON DELETE CASCADE,
        CONSTRAINT chk_turns_owner CHECK ((client_id IS NOT NULL) <> (member_id IS NOT NULL))
    );

-- INDEXES
-- users
CREATE INDEX idx_users_role_id ON users (role_id);

-- barbershops
CREATE INDEX idx_barbershops_admin_id ON barbershops (admin_id);

CREATE INDEX idx_barbershops_is_active ON barbershops (is_active);

-- client_status
CREATE INDEX idx_client_status_status ON client_status (current_status);

-- barber_status
CREATE INDEX idx_barber_status_status ON barber_status (current_status);

-- barber_reviews
CREATE INDEX idx_barber_reviews_client_id ON barber_reviews (client_id);

CREATE INDEX idx_barber_reviews_barber_rating ON barber_reviews (barber_id, rating, created_at);

-- barbershop_photos
CREATE INDEX idx_barbershop_photos_barbershop_id ON barbershop_photos (barbershop_id);

-- barbershop_reviews
CREATE INDEX idx_barbershop_reviews_user_id ON barbershop_reviews (client_id);

CREATE INDEX idx_barbershop_reviews_shop_rating ON barbershop_reviews (barbershop_id, rating, created_at);

-- staff_assignments
CREATE INDEX idx_staff_assignments_barbershop_id ON staff_assignments (barbershop_id);

-- working_days
CREATE INDEX idx_working_days_employee_day ON working_days (staff_id, day_of_week);

CREATE INDEX idx_working_days_staff_barbershop ON working_days (staff_id, barbershop_id);

-- client_groups
CREATE INDEX idx_client_groups_leader_id ON client_groups (leader_id);

-- group_members
CREATE INDEX idx_group_members_group_id ON group_members (group_id);

-- turns
CREATE INDEX idx_turns_client_id ON turns (client_id);

CREATE INDEX idx_turns_member_id ON turns (member_id);

CREATE INDEX idx_turns_group_id ON turns (group_id);

CREATE INDEX idx_turns_barber_id ON turns (barber_id);

CREATE INDEX idx_turns_client_created ON turns (client_id, created_at);

CREATE INDEX idx_turns_barbershop_barber ON turns (barbershop_id, barber_id);

CREATE INDEX idx_turns_barbershop_created ON turns (barbershop_id, created_at);

CREATE INDEX idx_turns_barbershop_attended ON turns (barbershop_id, attended_at);
