-- USERS - AFTER INSERT
-- When a new client or barber is created, provision their status
DROP TRIGGER IF EXISTS trg_users_after_insert;

CREATE TRIGGER trg_users_after_insert AFTER
INSERT
    ON users FOR EACH ROW BEGIN IF NEW.role_id = 1 THEN
INSERT INTO
    client_status (client_id, current_status)
VALUES
    (NEW.id, 'default');

ELSEIF NEW.role_id = 2 THEN
INSERT INTO
    barber_status (staff_id, current_status)
VALUES
    (NEW.id, 'inactive');

END IF;

END;

-- CLIENT STATUS - BEFORE INSERT
-- Only users with role 'client' can have a client status
DROP TRIGGER IF EXISTS trg_client_status_before_insert;

CREATE TRIGGER trg_client_status_before_insert BEFORE
INSERT
    ON client_status FOR EACH ROW BEGIN DECLARE v_role_id INT DEFAULT NULL;

SELECT
    role_id INTO v_role_id
FROM
    users
WHERE
    id = NEW.client_id
LIMIT
    1;

IF v_role_id IS NULL
OR v_role_id != 1 THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Only users with role client can have a client status';

END IF;

END;

-- BARBER STATUS - BEFORE INSERT
-- Only users with role 'barber' can have a barber status
DROP TRIGGER IF EXISTS trg_barber_status_before_insert;

CREATE TRIGGER trg_barber_status_before_insert BEFORE
INSERT
    ON barber_status FOR EACH ROW BEGIN DECLARE v_role_id INT DEFAULT NULL;

SELECT
    role_id INTO v_role_id
FROM
    users
WHERE
    id = NEW.staff_id
LIMIT
    1;

IF v_role_id IS NULL
OR v_role_id != 2 THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Only users with role barber can have a barber status';

END IF;

END;

-- STAFF ASSIGNMENTS - BEFORE INSERT
-- Only barbers and assistants can be assigned to a barbershop
DROP TRIGGER IF EXISTS trg_staff_assignments_before_insert;

CREATE TRIGGER trg_staff_assignments_before_insert BEFORE
INSERT
    ON staff_assignments FOR EACH ROW BEGIN DECLARE v_role_id INT DEFAULT NULL;

SELECT
    role_id INTO v_role_id
FROM
    users
WHERE
    id = NEW.staff_id
LIMIT
    1;

IF v_role_id NOT IN(2, 3) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Only barbers and assistants can be assigned to a barbershop';

END IF;

END;

-- CLIENT GROUPS - BEFORE INSERT
-- The group leader must be a client
DROP TRIGGER IF EXISTS trg_client_groups_before_insert;

CREATE TRIGGER trg_client_groups_before_insert BEFORE
INSERT
    ON client_groups FOR EACH ROW BEGIN DECLARE v_role_id INT DEFAULT NULL;

SELECT
    role_id INTO v_role_id
FROM
    users
WHERE
    id = NEW.leader_id
LIMIT
    1;

IF v_role_id IS NULL
OR v_role_id != 1 THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Group leader must be a client';

END IF;

END;
