<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $email = "";

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	} else {

        $stmt = $conn->prepare("SELECT ID, full_name, email, userlevel, university_id FROM Users WHERE Email = ?");
        $stmt->bind_param("s", $inData["email"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
		{
            returnWithInfo($row['full_name'], $row['email'], $row['ID'], $row['userlevel'], $row['university_id']);
        } else {
           returnWithError("No user associated with that email.");
           http_response_code(404); // Not found
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
		$retValue = '{"id":0,"fullName":"","email":"","userlevel":"","university_id":"","error":"'. $err .'"}';

		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $fullName, $email, $id, $userlevel, $universityid)
    {
        $retValue = '{"id":' . $id . ',"fullName":"' . $fullName . '","email":"'. $email .'","userlevel":"'. $userlevel .'","university_id":"'. $universityid .'","error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>