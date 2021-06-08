-- Return user input sentence with named entities from SENTENCE table
-----------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS F_PrintOriginSentence;
DELIMITER //
CREATE FUNCTION `F_PrintOriginSentence`(in_uid VARCHAR(30), in_number INT ) RETURNS VARCHAR(512)
BEGIN
   DECLARE out_result VARCHAR(512);
   DECLARE i INT;
   DECLARE max_id INT;
   DECLARE temp_word VARCHAR(512);
   DECLARE temp_before VARCHAR(512);
   DECLARE temp_inter VARCHAR(512);
   DECLARE temp_after VARCHAR(512);
   DECLARE temp_spos INT;
   DECLARE temp_word_length INT;
   DECLARE temp_tag_length INT;
   DECLARE temp_tag VARCHAR(4);
   DECLARE s_num INT;

   SET s_num = 0;
   SET i = 0;
   SELECT MAX(Wid)
   INTO max_id 
   FROM WORD 
   WHERE Uid = in_uid AND Snumber = in_number;

   SET out_result = "";

   WHILE i <= max_id DO
      SELECT Wtag INTO temp_tag FROM WORD WHERE Uid = in_uid AND Snumber = in_number AND Wid = i;
      SELECT Wform INTO temp_word FROM WORD WHERE Uid = in_uid AND Snumber = in_number AND Wid = i;

      IF(temp_tag <> "O") THEN
         SELECT Wspos, Wepos - Wspos, CHAR_LENGTH(Wform) INTO temp_spos, temp_tag_length, temp_word_length FROM WORD WHERE Uid = in_uid AND Snumber = in_number AND Wid = i;
         SET temp_before = LEFT(temp_word, temp_spos - s_num);
         SET temp_inter = SUBSTRING(temp_word, temp_spos - s_num + 1, temp_tag_length);
         SET temp_after = RIGHT(temp_word, temp_word_length - temp_tag_length);
         SET temp_word = CONCAT(temp_before, "[", temp_inter, ":", temp_tag, "]", temp_after);
      END IF;
      SET out_result = CONCAT(out_result, " ", temp_word);
      SELECT s_num + CHAR_LENGTH(Wform) + 1 INTO s_num FROM WORD WHERE Uid = in_uid AND Snumber = in_number AND Wid = i;
      SET i = i + 1;
   END WHILE;
   RETURN out_result;
END //
DELIMITER ;


-- Return user reported sentence with named entities from SENTENCE and REPORT table
------------------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS F_PrintReportSentence;
DELIMITER //
CREATE FUNCTION `F_PrintReportSentence`(in_uid VARCHAR(30), in_number INT) RETURNS VARCHAR(512)
BEGIN
   DECLARE out_result VARCHAR(512);
   DECLARE i INT;
   DECLARE max_id INT;
   DECLARE temp_word VARCHAR(512);
   DECLARE temp_before VARCHAR(512);
   DECLARE temp_inter VARCHAR(512);
   DECLARE temp_after VARCHAR(512);
   DECLARE temp_spos INT;
   DECLARE temp_word_length INT;
   DECLARE temp_tag_length INT;
   DECLARE temp_tag VARCHAR(4);
   DECLARE s_num INT;
   DECLARE report_id INT;

   SET s_num = 0;
   SET i = 0;
   SELECT MAX(Wid) INTO max_id FROM WORD WHERE Uid = in_uid AND Snumber = in_number;
   SELECT Wid INTO report_id FROM REPORT WHERE Uid = in_uid AND Snumber = in_number AND Rstate = 0;

   SET out_result = "";

   WHILE i <= max_id DO
      SELECT Wform INTO temp_word FROM WORD WHERE Uid = in_uid AND Snumber = in_number AND Wid = i;

      IF(i = report_id) THEN
         SELECT Rtag INTO temp_tag FROM REPORT WHERE Uid = in_uid AND Snumber = in_number AND Wid = i;
      ELSE
         SELECT Wtag INTO temp_tag FROM WORD WHERE Uid = in_uid AND Snumber = in_number AND Wid = i;
      END IF;

      IF(temp_tag <> "O") THEN
         IF(i = report_id) THEN
            SELECT Rspos, Repos - Rspos, CHAR_LENGTH(Wform) INTO temp_spos, temp_tag_length, temp_word_length FROM WORD NATURAL JOIN REPORT WHERE Uid = in_uid AND Snumber = in_number AND Wid = i;
         ELSE
            SELECT Wspos, Wepos - Wspos, CHAR_LENGTH(Wform) INTO temp_spos, temp_tag_length, temp_word_length FROM WORD WHERE Uid = in_uid AND Snumber = in_number AND Wid = i;
         END IF;

         SET temp_before = LEFT(temp_word, temp_spos - s_num);
         SET temp_inter = SUBSTRING(temp_word, temp_spos - s_num + 1, temp_tag_length);
         SET temp_after = RIGHT(temp_word, temp_word_length - temp_tag_length);
         SET temp_word = CONCAT(temp_before, "[", temp_inter, ":", temp_tag, "]", temp_after);
      END IF;
      SET out_result = CONCAT(out_result, " ", temp_word);
      SELECT s_num + CHAR_LENGTH(Wform) + 1 INTO s_num FROM WORD WHERE Uid = in_uid AND Snumber = in_number AND Wid = i;
      SET i = i + 1;
   END WHILE;
   RETURN out_result;
END //
DELIMITER ;
