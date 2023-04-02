<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $name = $inData['name'];
    $category = $inData['category'];
    $description = $inData['description'];
    $date = $inData['date'];
    $location = $inData['location'];
    $latitude = $inData['latitude'];
    $longitude = $inData['longitude'];
    $contact_phone = $inData['contact_phone'];
    $contact_email = $inData['contact_email'];
    $event_type = $inData['event_type'];
    $rso_id = $inData['rso_id'];
    $admin_id = $inData['admin_id'];
    $start_time = $inData['start_time'];
    $end_time = $inData['end_time'];
    $university_id = $inData['university_id'];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	} else {
        // Check if there are any events at the same location and time
        $stmt = $conn->prepare("SELECT id FROM Events WHERE location = ? AND start_time = ? AND end_time = ?");
        $stmt->bind_param("sss", $location, $start_time, $end_time);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            returnWithError("There is already an event at this location and time.");
            http_response_code(409); // Conflict
            $conn->close();
            exit();
        }
       
        // Check if event is public without RSO
        if ($event_type === "public" && !$rso_id) {
            // TODO: Implement event approval by super admin
            // For now, return an error and prevent insertion
            returnWithError("Public events without an RSO must be approved by the super admin.");
            http_response_code(403); // Forbidden
            $conn->close();
            exit();
        }

        // Insert the event into the database
        $stmt = $conn->prepare("INSERT INTO Events (name, category, description, date, location, latitude, longitude, contact_phone, contact_email, event_type, rso_id, admin_id, start_time, end_time, university_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssssssiissi", $name, $category, $description, $date, $location, $latitude, $longitude, $contact_phone, $contact_email, $event_type, $rso_id, $admin_id, $start_time, $end_time, $university_id);
        $stmt->execute();
        $id = $stmt->insert_id;
        $conn->close();
        returnWithInfo($id, $name);
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
		$retValue = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $id, $name)
    {
        $retValue = '{"id":' . $id . ',"name":"'.$name.'","error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>
