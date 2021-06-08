-- Report Accept Procedure
---------------------------------
DROP PROCEDURE IF EXISTS AcceptReport;
DELIMITER //
CREATE PROCEDURE `AcceptReport`(IN in_uid VARCHAR(30), IN in_number INT, IN in_wid INT)
BEGIN
  DECLARE Ptag VARCHAR (4);
  DECLARE Pdate DATETIME;
  DECLARE Pspos INT;
  DECLARE Pepos INT;

  SET Ptag = (
    SELECT Rtag
    FROM REPORT
    WHERE Uid = in_uid AND Snumber = in_number AND Wid = in_wid );

  SET Pdate = (
    SELECT Rdate
    FROM REPORT
    WHERE Uid = in_uid AND Snumber = in_number AND Wid = in_wid);
  SET Pspos = (
    SELECT Rspos
    FROM REPORT
    WHERE Uid = in_uid AND Snumber = in_number AND Wid = in_wid);
  SET Pepos = (
    SELECT Repos
    FROM REPORT
    WHERE Uid = in_uid AND Snumber = in_number AND Wid = in_wid);

  UPDATE WORD SET Wtag = Ptag, Wspos = Pspos, Wepos = Pepos  WHERE Uid = in_uid AND Snumber = in_number AND Wid = in_wid;
  UPDATE SENTENCE SET Sdate = Pdate WHERE Uid = in_uid AND Snumber = in_number;

  UPDATE REPORT SET Rstate = 2 WHERE Uid = in_uid AND Snumber = in_number AND Wid = in_wid;
END //
DELIMITER ;
