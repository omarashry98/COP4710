<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $name
    $category
    $description
    $date
    $location
    $latitude
    $longitude
    $contact_phone
    $contact_email
    $event_type
    $rso_id
    $admin_id
    $start_time

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	} else {
       // Check if university already exists
       $stmt = $conn->prepare("SELECT id FROM Universities WHERE name = ?");
       $stmt->bind_param("s", $name);
       $stmt->execute();
       $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            returnWithError("University already exists.");
        } else {
            $stmt = $conn->prepare("INSERT INTO Universities (name, description, num_students, latitude, longitude) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("ssidd", $name, $description, $num_students, $latitude, $longitude);
            $stmt->execute();

            $id = $stmt->insert_id;

            $conn->close();
            returnWithInfo($id, $name);
        }
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
		$retValue = '{"id":0,"university_name":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $id, $name)
    {
        $retValue = '{"id":' . $id . ',"university_name":"' . $name . '","error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>