-- USERS - AFTER INSERT
-- When a new client or barber is created, provision their status
CREATE TRIGGER trg_users_after_insert AFTER
INSERT
    ON users FOR EACH ROW BEGIN IF NEW.role_id = 1 THEN
INSERT INTO
    client_status (client_id, current_status)
VALUES
    (NEW.id, 'default');

ELSEIF NEW.role_id = 2 THEN
INSERT INTO
    barber_status (barber_id, current_status)
VALUES
    (NEW.id, 'inactive');

-- Provision a new row in the stats table
INSERT INTO
    barber_stats (barber_id)
VALUES
    (NEW.id);

END IF;

END;

-- BARBERSHOPS - AFTER INSERT
-- When a new barbershop is created, provision a new row in the stats table
CREATE TRIGGER trg_barbershops_after_insert AFTER
INSERT
    ON barbershops FOR EACH ROW
INSERT INTO
    barbershop_stats (barbershop_id)
VALUES
    (NEW.id);

-- CLIENT STATUS - BEFORE INSERT
-- Only users with role 'client' can have a client status
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
CREATE TRIGGER trg_barber_status_before_insert BEFORE
INSERT
    ON barber_status FOR EACH ROW BEGIN DECLARE v_role_id INT DEFAULT NULL;

SELECT
    role_id INTO v_role_id
FROM
    users
WHERE
    id = NEW.barber_id
LIMIT
    1;

IF v_role_id IS NULL
OR v_role_id != 2 THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Only users with role barber can have a barber status';

END IF;

END;

-- BARBER REVIEWS - AFTER INSERT
-- When a row is added, recalculate the rating average
CREATE TRIGGER trg_barber_reviews_after_insert AFTER
INSERT
    ON barber_reviews FOR EACH ROW BEGIN
UPDATE barber_stats
SET
    avg_rating = LEAST(
        GREATEST((COALESCE(avg_rating, 0) * total_reviews + NEW.rating) / (total_reviews + 1), 1.0),
        5.0
    ),
    total_reviews = total_reviews + 1
WHERE
    barber_id = NEW.barber_id;

END;

-- BARBER REVIEWS - AFTER DELETE
-- When a row is deleted, recalculate the rating average
CREATE TRIGGER trg_barber_reviews_after_delete AFTER DELETE ON barber_reviews FOR EACH ROW BEGIN
UPDATE barber_stats
SET
    avg_rating = CASE
        WHEN total_reviews > 1 THEN LEAST(GREATEST((avg_rating * total_reviews - OLD.rating) / (total_reviews - 1), 1.0), 5.0)
        ELSE NULL
    END,
    total_reviews = GREATEST(total_reviews - 1, 0)
WHERE
    barber_id = OLD.barber_id;

END;

-- BARBERSHOP REVIEWS - AFTER INSERT
-- When a row is added, recalculate the rating average
CREATE TRIGGER trg_barbershop_reviews_after_insert AFTER
INSERT
    ON barbershop_reviews FOR EACH ROW BEGIN
UPDATE barbershop_stats
SET
    avg_rating = LEAST(
        GREATEST((COALESCE(avg_rating, 0) * total_reviews + NEW.rating) / (total_reviews + 1), 1.0),
        5.0
    ),
    total_reviews = total_reviews + 1
WHERE
    barbershop_id = NEW.barbershop_id;

END;

-- BARBERSHOP REVIEWS - AFTER DELETE
-- When a row is deleted, recalculate the rating average
CREATE TRIGGER trg_barbershop_reviews_after_delete AFTER DELETE ON barbershop_reviews FOR EACH ROW BEGIN
UPDATE barbershop_stats
SET
    avg_rating = CASE
        WHEN total_reviews > 1 THEN LEAST(GREATEST((avg_rating * total_reviews - OLD.rating) / (total_reviews - 1), 1.0), 5.0)
        ELSE NULL
    END,
    total_reviews = GREATEST(total_reviews - 1, 0)
WHERE
    barbershop_id = OLD.barbershop_id;

END;

-- STAFF ASSIGNMENTS - BEFORE INSERT
-- Only barbers and assistants can be assigned to a barbershop
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

-- TURNS - AFTER UPDATE
-- Turns when finished_at is set should update both barber and barbershop stats
CREATE TRIGGER trg_turns_after_update_stats AFTER
UPDATE ON turns FOR EACH ROW BEGIN DECLARE v_duration DECIMAL(6, 1);

IF OLD.finished_at IS NULL
AND NEW.finished_at IS NOT NULL THEN
SET
    v_duration = TIMESTAMPDIFF(SECOND, NEW.attended_at, NEW.finished_at) / 60.0;

-- 1. Update Barber Stats
UPDATE barber_stats
SET
    avg_service_minutes = CASE
        WHEN total_attended = 0 THEN v_duration
        ELSE (avg_service_minutes * total_attended + v_duration) / (total_attended + 1)
    END,
    total_attended = total_attended + 1
WHERE
    barber_id = NEW.barber_id;

-- 2. Update Barbershop Stats
UPDATE barbershop_stats
SET
    avg_service_minutes = CASE
        WHEN total_attended = 0 THEN v_duration
        ELSE (avg_service_minutes * total_attended + v_duration) / (total_attended + 1)
    END,
    total_attended = total_attended + 1
WHERE
    barbershop_id = NEW.barbershop_id;

END IF;

END;
