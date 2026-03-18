-- USERS - AFTER INSERT
-- When a new client or barber is created, provision their status
DROP TRIGGER IF EXISTS trg_users_after_insert;

CREATE TRIGGER trg_users_after_insert AFTER
INSERT
    ON users FOR EACH ROW BEGIN IF NEW.role_id = 1 THEN
INSERT INTO
    client_status (user_id, current_status)
VALUES
    (NEW.id, 'default');

ELSEIF NEW.role_id = 2 THEN
INSERT INTO
    barber_status (staff_id, current_status, is_accepting)
VALUES
    (NEW.id, 'inactive', TRUE);

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
    id = NEW.user_id
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

-- TURNS - BEFORE INSERT
-- Two validations:
--   1. A group cannot have more than 6 active members at once.
--   2. If a barber is directly assigned on insert, their queue must be open.
DROP TRIGGER IF EXISTS trg_turns_before_insert;

CREATE TRIGGER trg_turns_before_insert BEFORE
INSERT
    ON turns FOR EACH ROW BEGIN DECLARE v_group_size INT DEFAULT 0;

DECLARE v_is_accepting BOOLEAN DEFAULT TRUE;

-- 1) Group size cap
IF NEW.group_id IS NOT NULL THEN
SELECT
    COUNT(*) INTO v_group_size
FROM
    turns
WHERE
    group_id = NEW.group_id
    AND finished_at IS NULL;

IF v_group_size >= 6 THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Group cannot have more than 6 active members';

END IF;

END IF;

-- 2) Barber accepting check
IF NEW.barber_id IS NOT NULL THEN
SELECT
    is_accepting INTO v_is_accepting
FROM
    barber_status
WHERE
    staff_id = NEW.barber_id
LIMIT
    1;

IF v_is_accepting = FALSE THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'This barber is not accepting new clients';

END IF;

END IF;

END;

-- BARBERSHOP REVIEWS - BEFORE INSERT
-- 1. Only clients can leave reviews.
-- 2. The client must have at least one completed turn at that barbershop.
DROP TRIGGER IF EXISTS trg_barbershop_reviews_before_insert;

CREATE TRIGGER trg_barbershop_reviews_before_insert BEFORE
INSERT
    ON barbershop_reviews FOR EACH ROW BEGIN DECLARE v_role_id INT DEFAULT NULL;

DECLARE v_has_turn INT DEFAULT 0;

-- 1) Only clients can review
SELECT
    role_id INTO v_role_id
FROM
    users
WHERE
    id = NEW.user_id
LIMIT
    1;

IF v_role_id IS NULL
OR v_role_id != 1 THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Only clients can leave barbershop reviews';

END IF;

-- 2) Must have completed at least one turn at this barbershop
SELECT
    COUNT(*) INTO v_has_turn
FROM
    turns
WHERE
    client_id = NEW.user_id
    AND barbershop_id = NEW.barbershop_id
    AND finished_at IS NOT NULL;

IF v_has_turn = 0 THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Client must have completed a turn at this barbershop before reviewing';

END IF;

END;

-- BARBER REVIEWS - BEFORE INSERT
-- 1. Only clients can leave reviews.
-- 2. The client must have at least one completed turn with that barber.
DROP TRIGGER IF EXISTS trg_barber_reviews_before_insert;

CREATE TRIGGER trg_barber_reviews_before_insert BEFORE
INSERT
    ON barber_reviews FOR EACH ROW BEGIN DECLARE v_role_id INT DEFAULT NULL;

DECLARE v_has_turn INT DEFAULT 0;

-- 1) Only clients can review
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
    MESSAGE_TEXT = 'Only clients can leave barber reviews';

END IF;

-- 2) Must have completed at least one turn with this barber
SELECT
    COUNT(*) INTO v_has_turn
FROM
    turns
WHERE
    client_id = NEW.client_id
    AND barber_id = NEW.barber_id
    AND finished_at IS NOT NULL;

IF v_has_turn = 0 THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Client must have completed a turn with this barber before reviewing';

END IF;

END;
