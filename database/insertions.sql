SET
    FOREIGN_KEY_CHECKS = 0;

-- ROLES
INSERT INTO
    roles (id, role_name)
VALUES
    (1, 'client'),
    (2, 'barber'),
    (3, 'assistant'),
    (4, 'admin');

-- USERS
-- IDs 1    -> admin
-- IDs 2-3  -> assistants
-- IDs 4-8  -> barbers
-- IDs 9-18 -> clients
INSERT INTO
    users (id, role_id, username, email, phone, user_address, password_hash)
VALUES
    -- Admin
    (
        1,
        4,
        'admin_juan',
        'admin@barbershop.com',
        '8091234567',
        'Calle El Conde 1, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    -- Assistants
    (
        2,
        3,
        'asistente_maria',
        'maria@barbershop.com',
        '8092345678',
        'Av. Independencia 45, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    (
        3,
        3,
        'asistente_pedro',
        'pedro@barbershop.com',
        '8093456789',
        'Calle Las Damas 12, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    -- Barbers
    (
        4,
        2,
        'barber_carlos',
        'carlos@barbershop.com',
        '8094567890',
        'Av. Duarte 78, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    (
        5,
        2,
        'barber_luis',
        'luis@barbershop.com',
        '8095678901',
        'Calle Hostos 23, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    (
        6,
        2,
        'barber_miguel',
        'miguel@barbershop.com',
        '8096789012',
        'Av. Mella 56, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    (
        7,
        2,
        'barber_ramon',
        'ramon@barbershop.com',
        '8097890123',
        'Calle Padre Billini 9, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    (
        8,
        2,
        'barber_felix',
        'felix@barbershop.com',
        '8098901234',
        'Av. 27 de Febrero 101, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    -- Clients
    (
        9,
        1,
        'cliente_andres',
        'andres@gmail.com',
        '8091111111',
        'Calle 5 #12, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    (
        10,
        1,
        'cliente_sofia',
        'sofia@gmail.com',
        '8092222222',
        'Av. Luperón 34, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    (
        11,
        1,
        'cliente_jose',
        'jose@gmail.com',
        '8093333333',
        'Calle Restoration 7, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    (
        12,
        1,
        'cliente_ana',
        'ana@gmail.com',
        '8094444444',
        'Av. Lincoln 88, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    (
        13,
        1,
        'cliente_rafael',
        'rafael@gmail.com',
        '8095555555',
        'Calle Beller 15, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    (
        14,
        1,
        'cliente_diana',
        'diana@gmail.com',
        '8096666666',
        'Av. Tiradentes 22, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    (
        15,
        1,
        'cliente_marcos',
        'marcos@gmail.com',
        '8097777777',
        'Calle Mercedes 3, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    (
        16,
        1,
        'cliente_laura',
        'laura@gmail.com',
        '8098888888',
        'Av. Sarasota 67, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    (
        17,
        1,
        'cliente_victor',
        'victor@gmail.com',
        '8099999999',
        'Calle Pasteur 41, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    ),
    (
        18,
        1,
        'cliente_paola',
        'paola@gmail.com',
        '8090000000',
        'Av. Churchill 19, Santo Domingo',
        '$2b$10$KIX9M5K1z3hQkP0V2xYzUOqrZcM9VJkLm8nWpXvYsD3gT6bN4eA1C'
    );

-- BARBERSHOPS
INSERT INTO
    barbershops (
        id,
        barbershop_name,
        email,
        phone,
        barbershop_address,
        photo_url,
        open_at,
        close_at,
        max_concurrent_clients,
        is_active
    )
VALUES
    (
        1,
        'BarberKing Santo Domingo',
        'info@barberking.com',
        '8091234000',
        'Av. Duarte 100, Santo Domingo',
        'https://placehold.co/600x400?text=BarberKing',
        '08:00:00',
        '20:00:00',
        3,
        TRUE
    ),
    (
        2,
        'The Gentleman Cut',
        'info@gentlemancut.com',
        '8092345000',
        'Calle El Conde 55, Zona Colonial',
        'https://placehold.co/600x400?text=GentlemanCut',
        '09:00:00',
        '19:00:00',
        2,
        TRUE
    ),
    (
        3,
        'Elite Barbers',
        'info@elitebarbers.com',
        '8093456000',
        'Av. Winston Churchill 300, Piantini',
        'https://placehold.co/600x400?text=EliteBarbers',
        '07:00:00',
        '21:00:00',
        4,
        TRUE
    );

-- BARBERSHOP PHOTOS
INSERT INTO
    barbershop_photos (barbershop_id, photo_url)
VALUES
    (1, 'https://placehold.co/800x600?text=BarberKing+Interior'),
    (1, 'https://placehold.co/800x600?text=BarberKing+Sillas'),
    (1, 'https://placehold.co/800x600?text=BarberKing+Fachada'),
    (2, 'https://placehold.co/800x600?text=GentlemanCut+Interior'),
    (2, 'https://placehold.co/800x600?text=GentlemanCut+Sillas'),
    (3, 'https://placehold.co/800x600?text=EliteBarbers+Interior'),
    (3, 'https://placehold.co/800x600?text=EliteBarbers+Lounge'),
    (3, 'https://placehold.co/800x600?text=EliteBarbers+Productos');

-- EMPLOYEE    -> BARBERSHOPS
-- Barbers 4-5 -> Barbershop 1
-- Barbers 6-7 -> Barbershop 2
-- Barber  8   -> Barbershop 3
-- Assistants 2-3 cover two barbershops each
INSERT INTO
    employee_barbershops (employee_id, barbershop_id, start_time, end_time)
VALUES
    (4, 1, '08:00:00', '16:00:00'),
    (5, 1, '12:00:00', '20:00:00'),
    (6, 2, '09:00:00', '17:00:00'),
    (7, 2, '11:00:00', '19:00:00'),
    (8, 3, '07:00:00', '15:00:00'),
    -- A barber who covers two barbershops
    (4, 3, '16:30:00', '21:00:00'),
    -- Assistants
    (2, 1, '08:00:00', '20:00:00'),
    (3, 2, '09:00:00', '19:00:00'),
    (3, 3, '07:00:00', '21:00:00');

-- WORKING DAYS
-- day_of_week: 1=Lunes ... 7=Domingo
INSERT INTO
    working_days (employee_id, day_of_week)
VALUES
    -- Barber Carlos (4): Lun-Vie
    (4, 1),
    (4, 2),
    (4, 3),
    (4, 4),
    (4, 5),
    -- Barber Luis (5): Mar-Sab
    (5, 2),
    (5, 3),
    (5, 4),
    (5, 5),
    (5, 6),
    -- Barber Miguel (6): Lun-Sab
    (6, 1),
    (6, 2),
    (6, 3),
    (6, 4),
    (6, 5),
    (6, 6),
    -- Barber Ramon (7): Mie-Dom
    (7, 3),
    (7, 4),
    (7, 5),
    (7, 6),
    (7, 7),
    -- Barber Felix (8): Lun-Vie
    (8, 1),
    (8, 2),
    (8, 3),
    (8, 4),
    (8, 5),
    -- Assistants
    (2, 1),
    (2, 2),
    (2, 3),
    (2, 4),
    (2, 5),
    (2, 6),
    (3, 1),
    (3, 2),
    (3, 3),
    (3, 4),
    (3, 5),
    (3, 6),
    (3, 7);

-- CLIENT STATUS
INSERT INTO
    client_status (client_id, client_status)
VALUES
    (9, 'default'),
    (10, 'on_queue'),
    (11, 'in_service'),
    (12, 'attended'),
    (13, 'paid'),
    (14, 'waiting'),
    (15, 'default'),
    (16, 'on_barbershop'),
    (17, 'default'),
    (18, 'on_queue');

-- BARBER STATUS
INSERT INTO
    barber_status (barber_id, barber_status)
VALUES
    (4, 'active'),
    (5, 'resting'),
    (6, 'active'),
    (7, 'inactive'),
    (8, 'active');

-- CLIENT GROUPS
INSERT INTO
    client_groups (id, leader_id)
VALUES
    (1, 9),
    (2, 13);

-- CLIENT TURNS
INSERT INTO
    client_turns (barbershop_id, client_id, group_id, barber_id, created_at, attended_at, finished_at)
VALUES
    -- Turnos completados (attended + finished)
    (1, 9, NULL, 4, '2025-02-15 09:00:00', '2025-02-15 09:10:00', '2025-02-15 09:35:00'),
    (1, 10, NULL, 5, '2025-02-15 09:05:00', '2025-02-15 09:20:00', '2025-02-15 09:50:00'),
    (2, 11, NULL, 6, '2025-02-16 10:00:00', '2025-02-16 10:05:00', '2025-02-16 10:30:00'),
    (2, 12, NULL, 7, '2025-02-16 10:30:00', '2025-02-16 10:45:00', '2025-02-16 11:10:00'),
    (3, 13, 1, 8, '2025-02-17 08:00:00', '2025-02-17 08:10:00', '2025-02-17 08:40:00'),
    (3, 14, 1, 8, '2025-02-17 08:00:00', '2025-02-17 08:45:00', '2025-02-17 09:15:00'),
    -- Turno en curso (attended pero sin finished)
    (1, 15, NULL, 4, NOW() - INTERVAL 15 MINUTE, NOW() - INTERVAL 5 MINUTE, NULL),
    (2, 16, NULL, 6, NOW() - INTERVAL 20 MINUTE, NOW() - INTERVAL 2 MINUTE, NULL),
    -- Turnos en cola (sin attended ni finished)
    (1, 17, NULL, NULL, NOW() - INTERVAL 10 MINUTE, NULL, NULL),
    (1, 18, NULL, NULL, NOW() - INTERVAL 5 MINUTE, NULL, NULL),
    -- Grupo en cola
    (3, 9, 2, NULL, NOW() - INTERVAL 8 MINUTE, NULL, NULL),
    (3, 13, 2, NULL, NOW() - INTERVAL 8 MINUTE, NULL, NULL);

-- BARBERSHOP REVIEWS
INSERT INTO
    barbershop_reviews (user_id, barbershop_id, rating, content)
VALUES
    (9, 1, 5, 'Excelente servicio, el lugar siempre limpio y el ambiente genial.'),
    (10, 1, 4, 'Muy buena atención, solo un poco de espera al principio.'),
    (11, 2, 5, 'La mejor barbería de la Zona Colonial, super recomendada.'),
    (12, 2, 3, 'Buen corte pero el local es pequeño y se llena rápido.'),
    (13, 3, 5, 'Elite de verdad, ambiente premium y barberos muy profesionales.'),
    (14, 3, 4, 'Muy buena experiencia, precios justos para la calidad.'),
    (15, 1, 4, 'Buen servicio, volveré sin duda.'),
    (16, 2, 5, 'Me encantó, encontré mi barbería fija.');

-- BARBER REVIEWS
INSERT INTO
    barber_reviews (client_id, barber_id, rating, content)
VALUES
    (9, 4, 5, 'Carlos es un crack, me dejó el fade perfecto.'),
    (10, 5, 4, 'Luis muy detallista, quedé satisfecho con el resultado.'),
    (11, 6, 5, 'Miguel tiene manos de artista, 100% recomendado.'),
    (12, 7, 3, 'Ramón es bueno pero se tardó más de lo esperado.'),
    (13, 8, 5, 'Félix es el mejor barbero que he tenido, un nivel diferente.'),
    (14, 8, 5, 'Increíble trabajo, se nota la experiencia.'),
    (15, 4, 4, 'Carlos siempre constante, buen corte como siempre.'),
    (16, 6, 5, 'Miguel muy profesional y rápido, sin sacrificar calidad.');

SET
    FOREIGN_KEY_CHECKS = 1;
