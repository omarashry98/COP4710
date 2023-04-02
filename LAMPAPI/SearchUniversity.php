<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $name = "";

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	} else {

        $stmt = $conn->prepare("SELECT ID, name, description, num_students, latitude, longitude FROM Universities WHERE Name = ?");
        $stmt->bind_param("s", $inData["name"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
		{
            returnWithInfo($row['ID'], $row['name'], $row['description'], $row['num_students'], $row['latitude'], $row['longitude']);
        } else {
           returnWithError("No records found");
           http_response_code(404); // not found
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
		$retValue = '{"id":0,"name":"","description":"","num_students":"","latitude":"","longitude":"","error":"'.$err.'"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $id, $name, $description, $num_students, $latitude, $longitude)
    {
        $retValue = '{"id":' . $id . ',"name":"' . $name . '","description":"'. $description .'","num_students":"'. $num_students .'","latitude":"'. $latitude .'","longitude":"'.$longitude.'","error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>