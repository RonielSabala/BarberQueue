-- USERS - AFTER INSERT
DROP TRIGGER IF EXISTS trg_users_after_insert;

CREATE TRIGGER trg_users_after_insert AFTER
INSERT
    ON users FOR EACH ROW BEGIN
    -- role 1 (client)
    IF NEW.role_id = 1 THEN
INSERT INTO
    client_status (user_id, current_status)
VALUES
    (NEW.id, 'default');

-- role 2 (barber)
ELSEIF NEW.role_id = 2 THEN
INSERT INTO
    barber_status (staff_id, current_status)
VALUES
    (NEW.id, 'inactive');

END IF;

END;

-- USERS - BEFORE DELETE
DROP TRIGGER IF EXISTS trg_users_before_delete;

CREATE TRIGGER trg_users_before_delete BEFORE DELETE ON users FOR EACH ROW BEGIN DECLARE v_group_id INT DEFAULT NULL;

DECLARE v_new_leader INT DEFAULT NULL;

SELECT
    id INTO v_group_id
FROM
    client_groups
WHERE
    leader_id = OLD.id
LIMIT
    1;

IF v_group_id IS NOT NULL THEN
SELECT
    t.client_id INTO v_new_leader
FROM
    turns t
WHERE
    t.group_id = v_group_id
    AND t.client_id != OLD.id
    AND t.finished_at IS NULL
ORDER BY
    t.created_at ASC
LIMIT
    1;

IF v_new_leader IS NOT NULL THEN
UPDATE client_groups
SET
    leader_id = v_new_leader
WHERE
    id = v_group_id;

ELSE
-- No remaining members, delete group
DELETE FROM client_groups
WHERE
    id = v_group_id;

END IF;

END IF;

END;

-- BARBERSHOP_REVIEWS - BEFORE INSERT
DROP TRIGGER IF EXISTS trg_barbershop_reviews_before_insert;

CREATE TRIGGER trg_barbershop_reviews_before_insert BEFORE
INSERT
    ON barbershop_reviews FOR EACH ROW BEGIN DECLARE v_role_id INT DEFAULT NULL;

DECLARE v_has_turn INT DEFAULT 0;

DECLARE v_has_review INT DEFAULT 0;

-- 1) rating range
IF NEW.rating < 1
OR NEW.rating > 5 THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Rating must be between 1 and 5';

END IF;

-- 2) only clients can leave reviews
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

-- 3) must have at least one completed turn at that barbershop
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

-- 4) cannot review same barbershop twice
SELECT
    COUNT(*) INTO v_has_review
FROM
    barbershop_reviews
WHERE
    user_id = NEW.user_id
    AND barbershop_id = NEW.barbershop_id;

IF v_has_review > 0 THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Client has already reviewed this barbershop';

END IF;

END;

-- BARBER_REVIEWS - BEFORE INSERT
DROP TRIGGER IF EXISTS trg_barber_reviews_before_insert;

CREATE TRIGGER trg_barber_reviews_before_insert BEFORE
INSERT
    ON barber_reviews FOR EACH ROW BEGIN DECLARE v_role_id INT DEFAULT NULL;

DECLARE v_has_turn INT DEFAULT 0;

DECLARE v_has_review INT DEFAULT 0;

-- 1) rating range
IF NEW.rating < 1
OR NEW.rating > 5 THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Rating must be between 1 and 5';

END IF;

-- 2) only clients can leave reviews
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

-- 3) client must have been attended by that barber
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

-- 4) cannot review same barber twice
SELECT
    COUNT(*) INTO v_has_review
FROM
    barber_reviews
WHERE
    client_id = NEW.client_id
    AND barber_id = NEW.barber_id;

IF v_has_review > 0 THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Client has already reviewed this barber';

END IF;

END;

-- STAFF_ASSIGNMENTS - BEFORE INSERT
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

-- Only barbers and assistants can be assigned
IF v_role_id NOT IN(2, 3) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Only barbers and assistants can be assigned to a barbershop';

END IF;

END;

-- BARBER_STATUS - BEFORE INSERT
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

-- CLIENT_STATUS - BEFORE INSERT
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

-- TURNS - BEFORE INSERT
DROP TRIGGER IF EXISTS trg_turns_before_insert;

CREATE TRIGGER trg_turns_before_insert BEFORE
INSERT
    ON turns FOR EACH ROW BEGIN DECLARE v_group_size INT DEFAULT 0;

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

END;

-- TURNS - BEFORE UPDATE
DROP TRIGGER IF EXISTS trg_turns_before_update;

CREATE TRIGGER trg_turns_before_update BEFORE
UPDATE ON turns FOR EACH ROW BEGIN DECLARE v_active_turns INT DEFAULT 0;

-- barber_id assigned for the first time
IF NEW.barber_id IS NOT NULL
AND OLD.barber_id IS NULL THEN
SET
    NEW.attended_at = NOW();

UPDATE client_status
SET
    current_status = 'in_service'
WHERE
    user_id = NEW.client_id;

UPDATE barber_status
SET
    current_status = 'active'
WHERE
    user_id = NEW.barber_id;

-- barber_id removed
ELSEIF NEW.barber_id IS NULL
AND OLD.barber_id IS NOT NULL THEN
SET
    NEW.finished_at = NOW();

UPDATE client_status
SET
    current_status = 'attended'
WHERE
    user_id = NEW.client_id;

SELECT
    COUNT(*) INTO v_active_turns
FROM
    turns
WHERE
    barber_id = OLD.barber_id
    AND finished_at IS NULL
    AND id != OLD.id;

IF v_active_turns = 0 THEN
UPDATE barber_status
SET
    current_status = 'resting'
WHERE
    user_id = OLD.barber_id;

END IF;

END IF;

END;

-- CLIENT_GROUPS - BEFORE INSERT
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

-- CLIENT_GROUPS - AFTER DELETE
DROP TRIGGER IF EXISTS trg_client_groups_after_delete;

CREATE TRIGGER trg_client_groups_after_delete AFTER DELETE ON client_groups FOR EACH ROW BEGIN
-- 1) Mark all active group turns as finished
UPDATE turns
SET
    finished_at = NOW()
WHERE
    group_id = OLD.id
    AND finished_at IS NULL;

-- 2) Reset client_status to 'default' for those clients
UPDATE client_status cs
INNER JOIN turns t ON t.client_id = cs.user_id
SET
    cs.current_status = 'default'
WHERE
    t.group_id = OLD.id;

END;
