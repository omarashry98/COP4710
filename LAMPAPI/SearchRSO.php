<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
        http_response_code(500); // Server Error
	} else {

        $stmt = $conn->prepare("SELECT id, name, description, university_id, admin_id, status FROM RSO WHERE Name = ?");
        $stmt->bind_param("s", $inData["name"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
		{
            returnWithInfo($row['id'], $row['name'], $row['description'], $row['university_id'], $row['admin_id'], $row['status']);
        } else {
           returnWithError("No RSO associated with that name.");
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
		$retValue = '{"id":0,"name":"","description":"","university_id":"","admin_id":"","status":"","error":"'.$err.'"}';

		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $id, $name, $description, $universityid, $admin_id, $status)
    {
        $retValue = '{"id":' . $id . ',"name":"' . $name . '","description":"'. $description .'","university_id":"'. $universityid .'","admin_id":"'. $admin_id .'","status":"'.$status.'","error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>