<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $id = 0;
    $fullName = "";
    $email = "";

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	} else {

        $stmt = $conn->prepare("SELECT ID FROM Users WHERE Email = ?");
        $stmt->bind_param("s", $inData["email"]);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            returnWithError("Email already exists");
            http_response_code(400);
        } else {
            $stmt = $conn->prepare("INSERT INTO Users (Name, Email, Password, UniversityID, RsoID, UserLevelID) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssiis", $inData["fullname"], $inData["email"], $inData["password"], $inData["universityid"], $inData["rsolevel"], $inData["userlevel"]);
            $stmt->execute();
            $stmt->close();

            $id = $conn->insert_id;
            if ($id) {
                returnWithInfo($inData["fullname"], $inData["email"], $id);
            } else {
                returnWithError("Insert operation failed");
                http_response_code(500);
            }
        }

		$conn->close();
    }

    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"fullname":"","email":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $fullName, $email, $id)
    {
        $retValue = '{"id":' . $id . ',"fullName":"' . $fullName . '","email":"'. $email .'","error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>