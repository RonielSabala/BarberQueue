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
    users (id, role_id, username, email, phone, photo_url, password_hash)
VALUES
    (
        1,
        4,
        'Rafael Almonte',
        'rafael.almonte@gmail.com',
        '8091234501',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        2,
        4,
        'Argenis Guerrero',
        'argenis.guerrero@gmail.com',
        '8092234502',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        3,
        4,
        'Erickson Lebron',
        'erickson.lebron@gmail.com',
        '8293234503',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        4,
        3,
        'Frankie Jimenez',
        'frankie.jimenez@gmail.com',
        '8094234504',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        5,
        3,
        'Camilo Castillo',
        'camilo.castillo@gmail.com',
        '8095234505',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        6,
        3,
        'Ricardo Feliz',
        'ricardo.feliz@gmail.com',
        '8096234506',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        7,
        3,
        'Omar Castillo',
        'omar.castillo@gmail.com',
        '8097234507',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        8,
        2,
        'Gabriel Duarte',
        'gabriel.duarte@gmail.com',
        '8098234508',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        9,
        2,
        'Tony Reyes',
        'tony.reyes@gmail.com',
        '8099234509',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        10,
        2,
        'Albert Jimenez',
        'albert.jimenez@gmail.com',
        '8091334510',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        11,
        2,
        'Manuel Rodriguez',
        'manuel.rodriguez@gmail.com',
        '8091434511',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        12,
        2,
        'Fidel Reyes',
        'fidel.reyes@gmail.com',
        '8091534512',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        13,
        2,
        'Angel Hernandez',
        'angel.hernandez@gmail.com',
        '8091634513',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        14,
        2,
        'Rainier Garcia',
        'rainier.garcia@gmail.com',
        '8091734514',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        15,
        2,
        'Justin Mercedes',
        'justin.mercedes@gmail.com',
        '8091834515',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        16,
        1,
        'Francisco Garcia',
        'francisco.garcia@gmail.com',
        '8091914516',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        17,
        1,
        'Felix Mercedes',
        'felix.mercedes@gmail.com',
        '8092014517',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        18,
        1,
        'Anderson Ozoria',
        'anderson.ozoria@gmail.com',
        '8092114518',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        19,
        1,
        'Elido Rosario',
        'elido.rosario@gmail.com',
        '8092214519',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        20,
        1,
        'Jairo Moreno',
        'jairo.moreno@gmail.com',
        '8092314520',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        21,
        1,
        'Rafi Castillo',
        'rafi.castillo@gmail.com',
        '8092414521',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        22,
        1,
        'Jeffry Diaz',
        'jeffry.diaz@gmail.com',
        '8092514522',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        23,
        1,
        'Jose Duarte',
        'jose.duarte@gmail.com',
        '8092614523',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        24,
        1,
        'Arturo Rodriguez',
        'arturo.rodriguez@gmail.com',
        '8092714524',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        25,
        1,
        'Angelo Ozorio',
        'angelo.ozorio@gmail.com',
        '8092814525',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        26,
        1,
        'Milandel Paulino',
        'milandel.paulino@gmail.com',
        '8092914526',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        27,
        1,
        'Stalin Nunez',
        'stalin.nunez@gmail.com',
        '8093014527',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        28,
        1,
        'Yibran Diaz',
        'yibran.diaz@gmail.com',
        '8093114528',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        29,
        1,
        'Juan Carlos Lebron',
        'juancarlos.lebron@gmail.com',
        '8093214529',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        30,
        1,
        'Alvaro Castillo',
        'alvaro.castillo@gmail.com',
        '8093314530',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        31,
        3,
        'Wilbert Rosario',
        'wilbert.rosario@gmail.com',
        '8094000031',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        32,
        3,
        'Junior Hernandez',
        'junior.hernandez@gmail.com',
        '8094000032',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        33,
        2,
        'Rolando Batista',
        'rolando.batista@gmail.com',
        '8094000033',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        34,
        1,
        'Darwin Soto',
        'darwin.soto@gmail.com',
        '8094000034',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        35,
        1,
        'Willy Perez',
        'willy.perez@gmail.com',
        '8094000035',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        36,
        1,
        'Ezequiel Marte',
        'ezequiel.marte@gmail.com',
        '8094000036',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        37,
        1,
        'Isaias Reyes',
        'isaias.reyes@gmail.com',
        '8094000037',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        38,
        1,
        'Brayan Santos',
        'brayan.santos@gmail.com',
        '8094000038',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        39,
        1,
        'Leonel Diaz',
        'leonel.diaz@gmail.com',
        '8094000039',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        40,
        1,
        'Cristian Feliz',
        'cristian.feliz@gmail.com',
        '8094000040',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        41,
        1,
        'Hector Rodriguez',
        'hector.rodriguez@gmail.com',
        '8094000041',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        42,
        1,
        'Nelson Guerrero',
        'nelson.guerrero@gmail.com',
        '8094000042',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        43,
        1,
        'Deivis Almonte',
        'deivis.almonte@gmail.com',
        '8094000043',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        44,
        2,
        'Andy Rodriguez',
        'andy.rodriguez@gmail.com',
        '8094000044',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        45,
        2,
        'Winderson Baez',
        'winderson.baez@gmail.com',
        '8094000045',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        46,
        2,
        'Jesus Espinal',
        'jesus.espinal@gmail.com',
        '8094000046',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        47,
        1,
        'Yoelvis Taveras',
        'yoelvis.taveras@gmail.com',
        '8094000047',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        48,
        1,
        'Kelvin Pichardo',
        'kelvin.pichardo@gmail.com',
        '8094000048',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        49,
        1,
        'Edinson Vargas',
        'edinson.vargas@gmail.com',
        '8094000049',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        50,
        1,
        'Rumaldo Cespedes',
        'rumaldo.cespedes@gmail.com',
        '8094000050',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        51,
        1,
        'Leandro Encarnacion',
        'leandro.encarnacion@gmail.com',
        '8094000051',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        52,
        1,
        'Darlin Zabala',
        'darlin.zabala@gmail.com',
        '8094000052',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        53,
        1,
        'Wilkin Aquino',
        'wilkin.aquino@gmail.com',
        '8094000053',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        54,
        1,
        'Fiordaliza Mena',
        'fiordaliza.mena@gmail.com',
        '8094000054',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        55,
        1,
        'Jeisson Corporan',
        'jeisson.corporan@gmail.com',
        '8094000055',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        56,
        1,
        'Eldris Montero',
        'eldris.montero@gmail.com',
        '8094000056',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        57,
        1,
        'Radhamés Peguero',
        'radha.peguero@gmail.com',
        '8094000057',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        58,
        1,
        'Wascar Disla',
        'wascar.disla@gmail.com',
        '8094000058',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        59,
        1,
        'Jeudy Acosta',
        'jeudy.acosta@gmail.com',
        '8094000059',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        60,
        1,
        'Reinaldo Toribio',
        'reinaldo.toribio@gmail.com',
        '8094000060',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        61,
        1,
        'Bienvenido Liriano',
        'bienvenido.liriano@gmail.com',
        '8094000061',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        62,
        1,
        'Daneury Mateo',
        'daneury.mateo@gmail.com',
        '8094000062',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        63,
        1,
        'Kelvis Santana',
        'kelvis.santana@gmail.com',
        '8094000063',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        64,
        1,
        'Yoneiris Valdez',
        'yoneiris.valdez@gmail.com',
        '8094000064',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        65,
        1,
        'Milciades Ferreras',
        'milciades.ferreras@gmail.com',
        '8094000065',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    ),
    (
        66,
        1,
        'Adonis Peña',
        'adonis.pena@gmail.com',
        '8094000066',
        NULL,
        '$2y$12$msKYqQ3ucmZ1CpU8BRa.UOBz01XLRcb1hghOZsbxBMqZn7kCoOlku'
    );

-- BARBERSHOPS
INSERT INTO
    barbershops (
        id,
        admin_id,
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
        1,
        'MickyCutz Studio',
        'info@mickycutz.com',
        '8295326523',
        'Bloque 11, Los Alcarrizos, Santo Domingo Oeste',
        'https://ecdn6.globalso.com/upload/p/1112/image_other/2025-08/62.png',
        '08:00:00',
        '21:00:00',
        5,
        1
    ),
    (
        2,
        1,
        'Barbas VIP',
        'info@barbasvip.com',
        '8097874089',
        'Av. 27 de Febrero 305, Santo Domingo',
        'https://i.pinimg.com/1200x/4b/ed/f4/4bedf486651777b858e8451751d6dccd.jpg',
        '09:00:00',
        '20:00:00',
        3,
        1
    ),
    (
        3,
        2,
        'Luimbert Style',
        'info@luimbertstyle.com',
        '8095451724',
        ' Calle Duarte 88, Santiago de los Caballeros',
        'https://i.pinimg.com/736x/f6/98/04/f6980453f740b9f027a6bd5fd1d4bb03.jpg',
        '08:30:00',
        '22:00:00',
        4,
        1
    ),
    (
        4,
        2,
        'Anton Barber',
        'info@antonbarber.com',
        '8298735683',
        ' Av. Independencia 210, Santo Domingo',
        'https://i.pinimg.com/1200x/aa/df/b6/aadfb66c6719348e074fbe65e2e62fe3.jpg',
        '09:00:00',
        '20:30:00',
        4,
        1
    ),
    (
        5,
        3,
        'GS Hairdresser',
        'info@gshairdresser.com',
        '8293756100',
        'Calle El Conde 33, Zona Colonial',
        'https://i.pinimg.com/1200x/30/43/75/304375762ead09e02dafaee62dbb685d.jpg',
        '08:00:00',
        '22:00:00',
        8,
        1
    ),
    (
        6,
        3,
        'The Doctor Barber Room',
        'info@thedoctorbarber.com',
        '8494709917',
        'Av. Abraham Lincoln 405, Naco',
        'https://i.pinimg.com/1200x/57/e1/df/57e1df4861f5b229da01c6b6bfe1d44d.jpg',
        '07:00:00',
        '21:00:00',
        3,
        1
    );

-- CLIENT STATUS OVERRIDES
UPDATE client_status cs
JOIN (
    SELECT
        16 AS client_id,
        1 AS barbershop_id,
        'paid' AS current_status
    UNION ALL
    SELECT
        17,
        2,
        'paid'
    UNION ALL
    SELECT
        18,
        3,
        'attended'
    UNION ALL
    SELECT
        19,
        1,
        'attended'
    UNION ALL
    SELECT
        20,
        NULL,
        'default'
    UNION ALL
    SELECT
        21,
        3,
        'attended'
    UNION ALL
    SELECT
        22,
        4,
        'attended'
    UNION ALL
    SELECT
        23,
        4,
        'attended'
    UNION ALL
    SELECT
        24,
        5,
        'attended'
    UNION ALL
    SELECT
        25,
        6,
        'attended'
    UNION ALL
    SELECT
        26,
        NULL,
        'default'
    UNION ALL
    SELECT
        27,
        3,
        'attended'
    UNION ALL
    SELECT
        28,
        3,
        'attended'
    UNION ALL
    SELECT
        29,
        1,
        'attended'
    UNION ALL
    SELECT
        30,
        3,
        'attended'
    UNION ALL
    SELECT
        34,
        NULL,
        'default'
    UNION ALL
    SELECT
        35,
        NULL,
        'default'
    UNION ALL
    SELECT
        36,
        NULL,
        'default'
    UNION ALL
    SELECT
        37,
        1,
        'attended'
    UNION ALL
    SELECT
        38,
        1,
        'attended'
    UNION ALL
    SELECT
        39,
        1,
        'attended'
    UNION ALL
    SELECT
        40,
        1,
        'attended'
    UNION ALL
    SELECT
        41,
        2,
        'attended'
    UNION ALL
    SELECT
        42,
        2,
        'attended'
    UNION ALL
    SELECT
        43,
        4,
        'attended'
    UNION ALL
    SELECT
        47,
        NULL,
        'default'
    UNION ALL
    SELECT
        48,
        3,
        'in_service'
    UNION ALL
    SELECT
        49,
        3,
        'on_queue'
    UNION ALL
    SELECT
        50,
        3,
        'attended'
    UNION ALL
    SELECT
        51,
        3,
        'attended'
    UNION ALL
    SELECT
        52,
        5,
        'attended'
    UNION ALL
    SELECT
        53,
        NULL,
        'default'
    UNION ALL
    SELECT
        54,
        5,
        'at_barbershop'
    UNION ALL
    SELECT
        55,
        5,
        'attended'
    UNION ALL
    SELECT
        56,
        5,
        'attended'
    UNION ALL
    SELECT
        57,
        NULL,
        'default'
    UNION ALL
    SELECT
        58,
        4,
        'attended'
    UNION ALL
    SELECT
        59,
        6,
        'attended'
    UNION ALL
    SELECT
        60,
        NULL,
        'default'
    UNION ALL
    SELECT
        61,
        NULL,
        'default'
    UNION ALL
    SELECT
        62,
        NULL,
        'default'
    UNION ALL
    SELECT
        63,
        NULL,
        'default'
    UNION ALL
    SELECT
        64,
        NULL,
        'default'
    UNION ALL
    SELECT
        65,
        NULL,
        'default'
    UNION ALL
    SELECT
        66,
        NULL,
        'default'
) v ON cs.client_id = v.client_id
SET
    cs.barbershop_id = v.barbershop_id,
    cs.current_status = v.current_status;

-- BARBER STATUS
UPDATE barber_status bs
JOIN (
    SELECT
        8 AS barber_id,
        'active' AS current_status,
        1 AS is_accepting
    UNION ALL
    SELECT
        9,
        'active',
        1
    UNION ALL
    SELECT
        10,
        'active',
        1
    UNION ALL
    SELECT
        11,
        'active',
        1
    UNION ALL
    SELECT
        12,
        'active',
        1
    UNION ALL
    SELECT
        13,
        'active',
        1
    UNION ALL
    SELECT
        14,
        'active',
        1
    UNION ALL
    SELECT
        15,
        'active',
        1
    UNION ALL
    SELECT
        33,
        'active',
        1
    UNION ALL
    SELECT
        44,
        'inactive',
        0
    UNION ALL
    SELECT
        45,
        'active',
        1
    UNION ALL
    SELECT
        46,
        'active',
        1
) v ON bs.barber_id = v.barber_id
SET
    bs.current_status = v.current_status,
    bs.is_accepting = v.is_accepting;

-- BARBER REVIEWS
INSERT INTO
    barber_reviews (client_id, barber_id, rating, content, created_at)
VALUES
    (18, 12, 5, '11/10. Sin fallos', '2026-04-22 23:46:43'),
    (21, 12, 5, 'El mejor papá', '2026-04-22 23:47:11'),
    (18, 11, 5, 'Muy duro', '2026-04-23 02:10:19'),
    (21, 12, 5, 'El mejor del mundo', '2026-04-23 02:13:20'),
    (37, 8, 4, 'Muy buen trato la recomiendo 100%', '2026-04-23 14:09:32'),
    (38, 8, 5, 'No hay fallo', '2026-04-23 14:14:10'),
    (
        39,
        45,
        3,
        'Winderson es bueno la verdad, pero le recomiendo que hable menos y rinda más. Buen corte gracias',
        '2026-04-23 14:17:43'
    ),
    (
        40,
        45,
        4,
        'Fue mi primera vez que fuy y me gustó, todo bien. Lo recomiendo',
        '2026-04-23 14:19:01'
    ),
    (43, 33, 5, 'Rolando, el mejor!', '2026-04-23 14:21:36'),
    (41, 10, 5, 'Sin duda volvería 1000 veces', '2026-04-23 14:22:49'),
    (43, 10, 5, 'Buen muchacho muy sano excelente manos', '2026-04-23 14:23:48'),
    (47, 9, 5, 'Duro, el muchacho no le bajes manito', '2026-04-23 14:26:58'),
    (42, 9, 5, 'El mejor papá', '2026-04-23 14:29:20'),
    (52, 46, 4, 'Duro', '2026-04-23 14:49:10'),
    (55, 11, 5, 'Mi barbero es el final', '2026-04-23 14:51:39'),
    (56, 14, 5, 'Siempre complacido', '2026-04-23 14:54:03'),
    (58, 13, 5, 'Los mejores del país en servicio?', '2026-04-23 15:06:25'),
    (25, 15, 5, 'The best', '2026-04-23 15:08:32'),
    (
        59,
        14,
        5,
        'Excelente trato y calidad en el corte muy buena experiencia',
        '2026-04-23 15:13:03'
    );

-- BARBERSHOP REVIEWS
INSERT INTO
    barbershop_reviews (client_id, barbershop_id, rating, content, created_at)
VALUES
    (
        37,
        1,
        4,
        'Excelente servicio y calidad en los cortes. Desde que ingresas a la barbería se siente la calidad , profesionalismo y buen ambiente, lo recomiendo al 100%',
        '2026-04-23 14:12:24'
    ),
    (38, 2, 5, 'La mejor peluquería del mundo mundial!!!!', '2026-04-23 14:14:53'),
    (
        43,
        3,
        4,
        'Dios bendiga cada persona de este negocio familiar, se distingue en todo su calidad de servicio',
        '2026-04-23 14:25:29'
    ),
    (
        52,
        4,
        5,
        'Excelente, nunca me puedo quejar, un buen ambiente, con un personal muy preparado y capacitado',
        '2026-04-23 14:50:05'
    ),
    (
        56,
        5,
        5,
        'Cómo siempre, el final, pelan bacanisimo, y a buen precio.',
        '2026-04-23 14:55:36'
    ),
    (58, 6, 5, 'Buen servicio 100000/10', '2026-04-23 15:04:57');

-- BARBERSHOP PHOTOS
INSERT INTO
    barbershop_photos (barbershop_id, photo_url, photo_description)
VALUES
    (1, 'https://placehold.co/800x600?text=BarberKing+Interior', 'Fade clásico'),
    (2, 'https://placehold.co/800x600?text=BarberKing+Sillas', 'Corte moderno'),
    (3, 'https://placehold.co/800x600?text=BarberKing+Fachada', 'Barba y perfilado'),
    (4, 'https://placehold.co/800x600?text=GentlemanCut+Interior', 'Fade clásico'),
    (5, 'https://placehold.co/800x600?text=GentlemanCut+Sillas', 'Corte moderno'),
    (6, 'https://placehold.co/800x600?text=EliteBarbers+Interior', 'Fade clásico');

-- STAFF ASSIGNMENTS
INSERT INTO
    staff_assignments (staff_id, barbershop_id, start_time, end_time)
VALUES
    (4, 1, '08:00:00', '21:00:00'),
    (5, 2, '09:00:00', '20:00:00'),
    (6, 3, '09:00:00', '22:00:00'),
    (7, 4, '09:00:00', '20:00:00'),
    (8, 1, '09:00:00', '21:00:00'),
    (9, 1, '08:00:00', '21:00:00'),
    (9, 4, '15:00:00', '20:00:00'),
    (10, 2, '09:00:00', '20:00:00'),
    (11, 3, '09:00:00', '22:00:00'),
    (11, 5, '09:00:00', '22:00:00'),
    (12, 3, '09:00:00', '22:00:00'),
    (13, 4, '09:00:00', '20:30:00'),
    (14, 5, '08:00:00', '16:00:00'),
    (14, 6, '17:00:00', '21:00:00'),
    (15, 6, '09:00:00', '21:00:00'),
    (31, 5, '08:00:00', '19:00:00'),
    (32, 6, '07:00:00', '21:00:00'),
    (33, 4, '09:00:00', '20:00:00'),
    (44, 4, '09:00:00', '20:00:00'),
    (45, 1, '09:00:00', '20:00:00'),
    (46, 5, '09:00:00', '22:00:00');

-- WORKING DAYS
INSERT INTO
    working_days (staff_id, barbershop_id, day_of_week)
VALUES
    (4, 1, 1),
    (4, 1, 2),
    (4, 1, 3),
    (4, 1, 4),
    (4, 1, 5),
    (5, 2, 1),
    (5, 2, 2),
    (5, 2, 3),
    (5, 2, 4),
    (5, 2, 5),
    (6, 3, 1),
    (6, 3, 2),
    (6, 3, 3),
    (6, 3, 4),
    (6, 3, 5),
    (6, 3, 6),
    (7, 4, 1),
    (7, 4, 2),
    (7, 4, 3),
    (7, 4, 4),
    (7, 4, 5),
    (8, 1, 1),
    (8, 1, 2),
    (8, 1, 3),
    (8, 1, 4),
    (8, 1, 5),
    (9, 1, 1),
    (9, 1, 2),
    (9, 1, 3),
    (9, 1, 4),
    (9, 1, 5),
    (9, 4, 6),
    (9, 4, 7),
    (10, 2, 1),
    (10, 2, 2),
    (10, 2, 3),
    (10, 2, 4),
    (10, 2, 5),
    (11, 3, 1),
    (11, 3, 2),
    (11, 3, 3),
    (11, 3, 4),
    (11, 3, 5),
    (11, 5, 6),
    (11, 5, 7),
    (12, 3, 1),
    (12, 3, 2),
    (12, 3, 3),
    (12, 3, 4),
    (12, 3, 5),
    (12, 3, 6),
    (13, 4, 1),
    (13, 4, 2),
    (13, 4, 3),
    (13, 4, 4),
    (13, 4, 5),
    (14, 5, 1),
    (14, 5, 2),
    (14, 5, 3),
    (14, 5, 4),
    (14, 5, 5),
    (14, 6, 1),
    (14, 6, 2),
    (14, 6, 3),
    (15, 6, 1),
    (15, 6, 2),
    (15, 6, 3),
    (15, 6, 4),
    (15, 6, 5),
    (31, 5, 1),
    (31, 5, 2),
    (31, 5, 3),
    (31, 5, 4),
    (31, 5, 5),
    (32, 6, 1),
    (32, 6, 2),
    (32, 6, 3),
    (32, 6, 4),
    (32, 6, 5),
    (33, 4, 1),
    (33, 4, 2),
    (33, 4, 3),
    (33, 4, 4),
    (33, 4, 5),
    (33, 4, 6),
    (44, 4, 1),
    (44, 4, 2),
    (44, 4, 3),
    (44, 4, 4),
    (44, 4, 5),
    (45, 1, 1),
    (45, 1, 2),
    (45, 1, 3),
    (45, 1, 4),
    (45, 1, 5),
    (45, 1, 6),
    (46, 5, 1),
    (46, 5, 2),
    (46, 5, 3),
    (46, 5, 4),
    (46, 5, 5);

-- CLIENT GROUPS
INSERT INTO
    client_groups (id, leader_id)
VALUES
    (1, 55),
    (2, 56);

-- GROUP MEMBERS
INSERT INTO
    group_members (id, group_id, member_name, current_status)
VALUES
    (1, 1, 'josue martinez', 'attended'),
    (2, 2, 'Eliezer Bueno', 'attended');

-- TURNS
INSERT INTO
    turns (
        id,
        barbershop_id,
        client_id,
        member_id,
        group_id,
        barber_id,
        created_at,
        attended_at,
        finished_at
    )
VALUES
    (1, 3, 18, NULL, NULL, 12, '2026-04-22 23:24:43', '2026-04-22 23:24:43', NULL),
    (2, 1, 19, NULL, NULL, 9, '2026-04-22 23:25:49', '2026-04-22 23:25:49', NULL),
    (3, 3, 21, NULL, NULL, 12, '2026-04-22 23:30:37', '2026-04-22 23:45:39', NULL),
    (4, 4, 22, NULL, NULL, 13, '2026-04-22 23:31:07', '2026-04-22 23:31:07', NULL),
    (5, 4, 23, NULL, NULL, 9, '2026-04-22 23:33:14', '2026-04-22 23:33:14', NULL),
    (6, 5, 24, NULL, NULL, 14, '2026-04-22 23:33:59', '2026-04-22 23:33:59', NULL),
    (7, 1, 29, NULL, NULL, 9, '2026-04-22 23:36:25', '2026-04-22 23:40:21', NULL),
    (8, 3, 28, NULL, NULL, 11, '2026-04-23 00:48:46', '2026-04-23 00:48:46', NULL),
    (9, 3, 30, NULL, NULL, 11, '2026-04-23 00:49:20', '2026-04-23 01:15:45', NULL),
    (10, 3, 27, NULL, NULL, 12, '2026-04-23 00:51:56', '2026-04-23 00:51:56', NULL),
    (11, 1, 37, NULL, NULL, 8, '2026-04-23 13:56:48', '2026-04-23 13:56:48', NULL),
    (12, 1, 38, NULL, NULL, 8, '2026-04-23 13:57:47', '2026-04-23 14:07:52', NULL),
    (13, 1, 39, NULL, NULL, 45, '2026-04-23 13:59:08', '2026-04-23 13:59:08', NULL),
    (14, 1, 40, NULL, NULL, 45, '2026-04-23 13:59:54', '2026-04-23 14:08:10', NULL),
    (15, 2, 41, NULL, NULL, 10, '2026-04-23 14:05:14', '2026-04-23 14:05:14', NULL),
    (16, 2, 42, NULL, NULL, 10, '2026-04-23 14:05:52', '2026-04-23 14:22:01', NULL),
    (17, 4, 43, NULL, NULL, 33, '2026-04-23 14:07:08', '2026-04-23 14:07:08', NULL),
    (18, 3, 48, NULL, NULL, 12, '2026-04-23 14:32:52', '2026-04-23 14:32:52', NULL),
    (19, 3, 49, NULL, NULL, 12, '2026-04-23 14:33:43', NULL, NULL),
    (20, 3, 50, NULL, NULL, 11, '2026-04-23 14:34:43', '2026-04-23 14:34:43', NULL),
    (21, 3, 51, NULL, NULL, 11, '2026-04-23 14:35:13', '2026-04-23 14:50:33', NULL),
    (22, 5, 52, NULL, NULL, 46, '2026-04-23 14:37:46', '2026-04-23 14:37:46', NULL),
    (23, 5, 55, NULL, 1, 11, '2026-04-23 14:45:45', '2026-04-23 14:45:45', NULL),
    (24, 5, NULL, 1, 1, 11, '2026-04-23 14:45:45', '2026-04-23 14:50:40', NULL),
    (25, 5, 56, NULL, 2, 14, '2026-04-23 14:47:59', '2026-04-23 14:47:59', NULL),
    (26, 5, NULL, 2, 2, 14, '2026-04-23 14:47:59', '2026-04-23 14:52:48', NULL),
    (27, 4, 58, NULL, NULL, 13, '2026-04-23 15:04:10', '2026-04-23 15:04:10', NULL),
    (28, 6, 59, NULL, NULL, 14, '2026-04-23 15:09:56', '2026-04-23 15:09:56', NULL),
    (29, 6, 25, NULL, NULL, 15, '2026-04-23 15:10:52', '2026-04-23 15:10:52', NULL);

-- UPDATE COMPLETED TURNS TO TRIGGER STATS CALCULATION
UPDATE turns t
JOIN (
    SELECT
        1 id,
        '2026-04-22 23:45:39' finished_at
    UNION ALL
    SELECT
        2,
        '2026-04-22 23:40:21'
    UNION ALL
    SELECT
        3,
        '2026-04-22 23:45:43'
    UNION ALL
    SELECT
        4,
        '2026-04-22 23:42:07'
    UNION ALL
    SELECT
        5,
        '2026-04-22 23:40:36'
    UNION ALL
    SELECT
        6,
        '2026-04-22 23:42:19'
    UNION ALL
    SELECT
        7,
        '2026-04-22 23:57:06'
    UNION ALL
    SELECT
        8,
        '2026-04-23 01:15:45'
    UNION ALL
    SELECT
        9,
        '2026-04-23 01:15:47'
    UNION ALL
    SELECT
        10,
        '2026-04-23 01:16:34'
    UNION ALL
    SELECT
        11,
        '2026-04-23 14:07:52'
    UNION ALL
    SELECT
        12,
        '2026-04-23 14:12:50'
    UNION ALL
    SELECT
        13,
        '2026-04-23 14:08:10'
    UNION ALL
    SELECT
        14,
        '2026-04-23 14:15:24'
    UNION ALL
    SELECT
        15,
        '2026-04-23 14:22:01'
    UNION ALL
    SELECT
        16,
        '2026-04-23 14:22:04'
    UNION ALL
    SELECT
        17,
        '2026-04-23 14:20:24'
    UNION ALL
    SELECT
        20,
        '2026-04-23 14:50:33'
    UNION ALL
    SELECT
        21,
        '2026-04-23 14:50:38'
    UNION ALL
    SELECT
        22,
        '2026-04-23 14:48:35'
    UNION ALL
    SELECT
        23,
        '2026-04-23 14:50:40'
    UNION ALL
    SELECT
        24,
        '2026-04-23 14:52:25'
    UNION ALL
    SELECT
        25,
        '2026-04-23 14:52:48'
    UNION ALL
    SELECT
        26,
        '2026-04-23 14:54:33'
    UNION ALL
    SELECT
        27,
        '2026-04-23 15:05:53'
    UNION ALL
    SELECT
        28,
        '2026-04-23 15:12:15'
    UNION ALL
    SELECT
        29,
        '2026-04-23 15:11:05'
) v ON t.id = v.id
SET
    t.finished_at = v.finished_at;
