<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $id = 0;
    $fullName = "";
	$userlevel = "";

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	} else {

        $stmt = $conn->prepare("SELECT ID, full_name, userlevel FROM Users WHERE Email = ? AND Password = ?");
		$stmt->bind_param("ss", $inData["username"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['full_name'], $row['ID'], $row['userlevel'] );
		}
		else
		{
			returnWithError("No Records Found");
			http_response_code(404);

		}

		$stmt->close();
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
		$retValue = '{"id":0,"fullname":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $fullName, $id, $userlevel )
    {
        $retValue = '{"id":' . $id . ',"fullName":"' . $fullName . '","userlevel":"' . $userlevel . '","error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>