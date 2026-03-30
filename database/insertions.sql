-- ROLES
INSERT INTO
    roles (id, role_name)
VALUES
    (1, 'client'),
    (2, 'barber'),
    (3, 'assistant'),
    (4, 'admin');

-- USERS
INSERT INTO
    users (id, role_id, username, email, phone, password_hash)
VALUES
    -- Admin
    (
        1,
        4,
        'admin_juan',
        'admin@barbershop.com',
        '8091234567',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    -- Assistants
    (
        2,
        3,
        'asistente_maria',
        'maria@barbershop.com',
        '8092345678',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        3,
        3,
        'asistente_pedro',
        'pedro@barbershop.com',
        '8093456789',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    -- Barbers
    (
        4,
        2,
        'barber_carlos',
        'carlos@barbershop.com',
        '8094567890',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        5,
        2,
        'barber_luis',
        'luis@barbershop.com',
        '8095678901',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        6,
        2,
        'barber_miguel',
        'miguel@barbershop.com',
        '8096789012',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        7,
        2,
        'barber_ramon',
        'ramon@barbershop.com',
        '8097890123',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        8,
        2,
        'barber_felix',
        'felix@barbershop.com',
        '8098901234',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    -- Clients
    (
        9,
        1,
        'cliente_andres',
        'andres@gmail.com',
        '8091111111',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        10,
        1,
        'cliente_sofia',
        'sofia@gmail.com',
        '8092222222',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        11,
        1,
        'cliente_jose',
        'jose@gmail.com',
        '8093333333',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        12,
        1,
        'cliente_ana',
        'ana@gmail.com',
        '8094444444',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        13,
        1,
        'cliente_rafael',
        'rafael@gmail.com',
        '8095555555',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        14,
        1,
        'cliente_diana',
        'diana@gmail.com',
        '8096666666',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        15,
        1,
        'cliente_marcos',
        'marcos@gmail.com',
        '8097777777',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        16,
        1,
        'cliente_laura',
        'laura@gmail.com',
        '8098888888',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        17,
        1,
        'cliente_victor',
        'victor@gmail.com',
        '8099999999',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        18,
        1,
        'cliente_paola',
        'paola@gmail.com',
        '8090000000',
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
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
        opens_at,
        closes_at,
        capacity,
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

-- CLIENT STATUS OVERRIDES
UPDATE client_status
SET
    current_status = 'on_queue'
WHERE
    user_id = 10;

UPDATE client_status
SET
    current_status = 'in_service'
WHERE
    user_id = 11;

UPDATE client_status
SET
    current_status = 'attended'
WHERE
    user_id = 12;

UPDATE client_status
SET
    current_status = 'paid'
WHERE
    user_id = 13;

UPDATE client_status
SET
    current_status = 'waiting'
WHERE
    user_id = 14;

UPDATE client_status
SET
    current_status = 'at_barbershop'
WHERE
    user_id = 16;

UPDATE client_status
SET
    current_status = 'on_queue'
WHERE
    user_id = 18;

-- BARBER STATUS OVERRIDES
UPDATE barber_status
SET
    current_status = 'active'
WHERE
    staff_id = 4;

UPDATE barber_status
SET
    current_status = 'resting'
WHERE
    staff_id = 5;

UPDATE barber_status
SET
    current_status = 'active'
WHERE
    staff_id = 6;

UPDATE barber_status
SET
    current_status = 'active'
WHERE
    staff_id = 8;

-- STAFF ASSIGNMENTS
INSERT INTO
    staff_assignments (staff_id, barbershop_id, start_time, end_time)
VALUES
    -- Maria
    (2, 1, '08:00:00', '17:00:00'),
    (2, 2, '08:30:00', '17:30:00'),
    -- Pedro
    (3, 2, '09:00:00', '18:00:00'),
    (3, 3, '09:25:00', '18:25:00'),
    -- Carlos
    (4, 3, '10:00:00', '19:00:00'),
    -- Luis
    (5, 3, '08:00:00', '17:00:00'),
    (5, 1, '08:30:00', '17:30:00'),
    -- Miguel
    (6, 2, '09:00:00', '18:00:00'),
    (6, 3, '09:00:00', '18:00:00'),
    -- Ramon
    (7, 3, '10:00:00', '19:00:00'),
    (7, 1, '10:00:00', '19:00:00'),
    -- Felix
    (8, 1, '08:00:00', '17:00:00');

-- WORKING DAYS
INSERT INTO
    working_days (staff_id, barbershop_id, day_of_week)
VALUES
    -- Maria
    (2, 1, 1),
    (2, 1, 2),
    (2, 1, 3),
    (2, 1, 4),
    (2, 2, 5),
    (2, 2, 6),
    -- Pedro
    (3, 2, 1),
    (3, 2, 2),
    (3, 2, 3),
    (3, 2, 4),
    (3, 3, 5),
    (3, 3, 6),
    (3, 3, 7),
    -- Carlos
    (4, 3, 1),
    (4, 3, 2),
    (4, 3, 3),
    (4, 3, 4),
    (4, 3, 5),
    -- Luis
    (5, 3, 2),
    (5, 3, 3),
    (5, 1, 4),
    (5, 1, 5),
    (5, 1, 6),
    -- Miguel
    (6, 2, 1),
    (6, 2, 2),
    (6, 2, 3),
    (6, 3, 4),
    (6, 3, 5),
    (6, 3, 6),
    -- Ramon
    (7, 3, 3),
    (7, 3, 4),
    (7, 3, 5),
    (7, 1, 6),
    (7, 1, 7),
    -- Felix
    (8, 1, 1),
    (8, 1, 2),
    (8, 1, 3),
    (8, 1, 4),
    (8, 1, 5);

-- CLIENT GROUPS
INSERT INTO
    client_groups (id, leader_id)
VALUES
    (1, 13),
    (2, 9);

-- TURNS
-- Historical completed turns are inserted directly with explicit timestamps.
INSERT INTO
    turns (barbershop_id, client_id, group_id, barber_id, created_at, attended_at, finished_at)
VALUES
    -- Past completed turns
    (1, 9, NULL, 4, '2026-03-05 09:00:00', '2026-03-05 09:10:00', '2026-03-05 09:35:00'),
    (1, 10, NULL, 5, '2026-03-05 09:05:00', '2026-03-05 09:20:00', '2026-03-05 09:50:00'),
    (2, 11, NULL, 6, '2026-03-06 10:00:00', '2026-03-06 10:05:00', '2026-03-06 10:30:00'),
    (2, 12, NULL, 7, '2026-03-06 10:30:00', '2026-03-06 10:45:00', '2026-03-06 11:10:00'),
    (3, 13, 1, 8, '2026-03-07 08:00:00', '2026-03-07 08:10:00', '2026-03-07 08:40:00'),
    (3, 14, 1, 8, '2026-03-07 08:00:00', '2026-03-07 08:45:00', '2026-03-07 09:15:00'),
    (1, 15, NULL, 4, '2026-03-08 10:00:00', '2026-03-08 10:10:00', '2026-03-08 10:40:00'),
    (2, 16, NULL, 6, '2026-03-08 11:00:00', '2026-03-08 11:10:00', '2026-03-08 11:45:00'),
    -- Currently in service
    (1, 15, NULL, 4, NOW() - INTERVAL 15 MINUTE, NOW() - INTERVAL 5 MINUTE, NULL),
    (2, 16, NULL, 6, NOW() - INTERVAL 20 MINUTE, NOW() - INTERVAL 2 MINUTE, NULL),
    -- Waiting in queue
    (1, 17, NULL, NULL, NOW() - INTERVAL 10 MINUTE, NULL, NULL),
    (1, 18, NULL, NULL, NOW() - INTERVAL 5 MINUTE, NULL, NULL),
    (3, 9, 2, NULL, NOW() - INTERVAL 8 MINUTE, NULL, NULL),
    (3, 13, 2, NULL, NOW() - INTERVAL 8 MINUTE, NULL, NULL);

-- BARBERSHOP REVIEWS
INSERT INTO
    barbershop_reviews (client_id, barbershop_id, rating, content)
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
