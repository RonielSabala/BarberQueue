DELIMITER $$

-- USERS — AFTER INSERT
-- When a user is created, automatically create their status based on role:
--   role 1 (client) → client_status  = 'default'
--   role 2 (barber) → barber_status  = 'inactive'

CREATE TRIGGER trg_users_after_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.role_id = 1 THEN
        INSERT INTO client_status (client_id, client_status)
        VALUES (NEW.id, 'default');

    ELSEIF NEW.role_id = 2 THEN
        INSERT INTO barber_status (barber_id, barber_status)
        VALUES (NEW.id, 'inactive');
    END IF;
END$$


-- USERS — BEFORE DELETE
-- If the deleted user is the leader of any active group:
--   - Reassign the oldest active member as the new leader
--   - If no members remain, delete the group
--     (trg_client_groups_after_delete will clean up the turns)

CREATE TRIGGER trg_users_before_delete
BEFORE DELETE ON users
FOR EACH ROW
BEGIN
    DECLARE v_group_id   INT DEFAULT NULL;
    DECLARE v_new_leader INT DEFAULT NULL;

    SELECT id INTO v_group_id
    FROM client_groups
    WHERE leader_id = OLD.id
    LIMIT 1;

    IF v_group_id IS NOT NULL THEN

        SELECT ct.client_id INTO v_new_leader
        FROM client_turns ct
        WHERE ct.group_id    = v_group_id
          AND ct.client_id   != OLD.id
          AND ct.finished_at IS NULL
        ORDER BY ct.created_at ASC
        LIMIT 1;

        IF v_new_leader IS NOT NULL THEN
            UPDATE client_groups
            SET leader_id = v_new_leader
            WHERE id = v_group_id;
        ELSE
            -- No remaining members → delete group
            DELETE FROM client_groups WHERE id = v_group_id;
        END IF;

    END IF;
END$$


-- BARBERSHOP_REVIEWS — BEFORE INSERT
-- 1. Rating must be between 1 and 5
-- 2. Only clients (role 1) can leave reviews
-- 3. The client must have at least one completed turn at that barbershop
-- 4. A client cannot review the same barbershop twice

CREATE TRIGGER trg_barbershop_reviews_before_insert
BEFORE INSERT ON barbershop_reviews
FOR EACH ROW
BEGIN
    DECLARE v_role_id INT DEFAULT NULL;
    DECLARE v_has_turn INT DEFAULT 0;
    DECLARE v_has_review INT DEFAULT 0;

    IF NEW.rating < 1 OR NEW.rating > 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Rating must be between 1 and 5';
    END IF;

    SELECT role_id INTO v_role_id
    FROM users
    WHERE id = NEW.user_id
    LIMIT 1;

    IF v_role_id IS NULL OR v_role_id != 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Only clients can leave barbershop reviews';
    END IF;

    SELECT COUNT(*) INTO v_has_turn
    FROM client_turns
    WHERE client_id     = NEW.user_id
      AND barbershop_id = NEW.barbershop_id
      AND finished_at IS NOT NULL;

    IF v_has_turn = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Client must have completed a turn at this barbershop before reviewing';
    END IF;

    SELECT COUNT(*) INTO v_has_review
    FROM barbershop_reviews
    WHERE user_id       = NEW.user_id
      AND barbershop_id = NEW.barbershop_id;

    IF v_has_review > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Client has already reviewed this barbershop';
    END IF;
END$$


-- BARBER_REVIEWS — BEFORE INSERT
-- 1. Rating must be between 1 and 5
-- 2. Only clients (role 1) can leave reviews
-- 3. The client must have been attended by that barber
-- 4. A client cannot review the same barber twice

CREATE TRIGGER trg_barber_reviews_before_insert
BEFORE INSERT ON barber_reviews
FOR EACH ROW
BEGIN
    DECLARE v_role_id INT DEFAULT NULL;
    DECLARE v_has_turn INT DEFAULT 0;
    DECLARE v_has_review INT DEFAULT 0;

    IF NEW.rating < 1 OR NEW.rating > 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Rating must be between 1 and 5';
    END IF;

    SELECT role_id INTO v_role_id
    FROM users
    WHERE id = NEW.client_id
    LIMIT 1;

    IF v_role_id IS NULL OR v_role_id != 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Only clients can leave barber reviews';
    END IF;

    SELECT COUNT(*) INTO v_has_turn
    FROM client_turns
    WHERE client_id  = NEW.client_id
      AND barber_id  = NEW.barber_id
      AND finished_at IS NOT NULL;

    IF v_has_turn = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Client must have completed a turn with this barber before reviewing';
    END IF;

    SELECT COUNT(*) INTO v_has_review
    FROM barber_reviews
    WHERE client_id = NEW.client_id
      AND barber_id = NEW.barber_id;

    IF v_has_review > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Client has already reviewed this barber';
    END IF;
END$$


-- EMPLOYEE_BARBERSHOPS — BEFORE INSERT
-- Only barbers (role 2) and assistants (role 3) can be assigned

CREATE TRIGGER trg_employee_barbershops_before_insert
BEFORE INSERT ON employee_barbershops
FOR EACH ROW
BEGIN
    DECLARE v_role_id INT DEFAULT NULL;

    SELECT role_id INTO v_role_id
    FROM users
    WHERE id = NEW.employee_id
    LIMIT 1;

    IF v_role_id NOT IN (2, 3) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Only barbers and assistants can be assigned to a barbershop';
    END IF;
END$$


-- BARBER_STATUS — BEFORE INSERT
-- Validate that the user has barber role (role 2)

CREATE TRIGGER trg_barber_status_before_insert
BEFORE INSERT ON barber_status
FOR EACH ROW
BEGIN
    DECLARE v_role_id INT DEFAULT NULL;

    SELECT role_id INTO v_role_id
    FROM users
    WHERE id = NEW.barber_id
    LIMIT 1;

    IF v_role_id IS NULL OR v_role_id != 2 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Only users with role barber can have a barber status';
    END IF;
END$$


-- CLIENT_STATUS — BEFORE INSERT
-- Validate that the user has client role (role 1)

CREATE TRIGGER trg_client_status_before_insert
BEFORE INSERT ON client_status
FOR EACH ROW
BEGIN
    DECLARE v_role_id INT DEFAULT NULL;

    SELECT role_id INTO v_role_id
    FROM users
    WHERE id = NEW.client_id
    LIMIT 1;

    IF v_role_id IS NULL OR v_role_id != 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Only users with role client can have a client status';
    END IF;
END$$


-- CLIENT_TURNS — BEFORE INSERT
-- Validate that the group does not exceed 6 active members

CREATE TRIGGER trg_client_turns_before_insert
BEFORE INSERT ON client_turns
FOR EACH ROW
BEGIN
    DECLARE v_group_size INT DEFAULT 0;

    IF NEW.group_id IS NOT NULL THEN
        SELECT COUNT(*) INTO v_group_size
        FROM client_turns
        WHERE group_id   = NEW.group_id
          AND finished_at IS NULL;

        IF v_group_size >= 6 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Group cannot have more than 6 active members';
        END IF;
    END IF;
END$$


-- CLIENT_TURNS — BEFORE UPDATE
-- The app only updates barber_id. The trigger handles the rest:
--
--  barber_id assigned for the first time
--    → attended_at  = NOW()
--    → client_status = 'in_service'
--    → barber_status = 'active'
--
--  barber_id removed (set to NULL)
--    → finished_at  = NOW()
--    → client_status = 'attended'
--    → barber_status = 'resting' (if no other active turns exist)

CREATE TRIGGER trg_client_turns_before_update
BEFORE UPDATE ON client_turns
FOR EACH ROW
BEGIN
    DECLARE v_active_turns INT DEFAULT 0;

    IF NEW.barber_id IS NOT NULL AND OLD.barber_id IS NULL THEN

        SET NEW.attended_at = NOW();

        UPDATE client_status
        SET client_status = 'in_service'
        WHERE client_id = NEW.client_id;

        UPDATE barber_status
        SET barber_status = 'active'
        WHERE barber_id = NEW.barber_id;

    ELSEIF NEW.barber_id IS NULL AND OLD.barber_id IS NOT NULL THEN

        SET NEW.finished_at = NOW();

        UPDATE client_status
        SET client_status = 'attended'
        WHERE client_id = NEW.client_id;

        SELECT COUNT(*) INTO v_active_turns
        FROM client_turns
        WHERE barber_id  = OLD.barber_id
          AND finished_at IS NULL
          AND id != OLD.id;

        IF v_active_turns = 0 THEN
            UPDATE barber_status
            SET barber_status = 'resting'
            WHERE barber_id = OLD.barber_id;
        END IF;

    END IF;
END$$


-- CLIENT_GROUPS — BEFORE INSERT
-- Validate that leader_id is a client (role 1)

CREATE TRIGGER trg_client_groups_before_insert
BEFORE INSERT ON client_groups
FOR EACH ROW
BEGIN
    DECLARE v_role_id INT DEFAULT NULL;

    SELECT role_id INTO v_role_id
    FROM users
    WHERE id = NEW.leader_id
    LIMIT 1;

    IF v_role_id IS NULL OR v_role_id != 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Group leader must be a client';
    END IF;
END$$


-- CLIENT_GROUPS — AFTER DELETE
-- When a group is deleted:
--   1. Mark all active group turns as finished
--   2. Reset client_status to 'default' for those clients

CREATE TRIGGER trg_client_groups_after_delete
AFTER DELETE ON client_groups
FOR EACH ROW
BEGIN
    UPDATE client_turns
    SET finished_at = NOW()
    WHERE group_id   = OLD.id
      AND finished_at IS NULL;

    UPDATE client_status cs
    INNER JOIN client_turns ct
        ON ct.client_id = cs.client_id
    SET cs.client_status = 'default'
    WHERE ct.group_id = OLD.id;
END$$

DELIMITER ;
