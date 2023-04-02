<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $event_name = $inData['event_name'];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	} else {

        $stmt = $conn->prepare("SELECT id, name, category, description, date, location, latitude, longitude, contact_phone, contact_email, event_type, rso_id, admin_id, start_time, end_time, university_id FROM Events where name = ?");
        $stmt->bind_param("s", $event_name);
        $stmt->execute();
        $result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
		{
            returnWithInfo($row['id'], $row['name'], $row['category'], $row['description'], $row['date'], $row['location'], $row['latitude'], $row['longitude'], $row['contact_phone'], $row['contact_email'], $row['event_type'], $row['rso_id'], $row['admin_id'], $row['start_time'], $row['end_time'], $row['university_id']);
        } else {
           returnWithError("No Event associated with that name.");
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
        $retValue = '{"id":0,"name":"","category":"","description":"","date":"","location":"","latitude":"","longitude":"","contact_phone":"","contact_email":"","event_type":"","rso_id":"","admin_id":"","start_time":"","end_time":"","university_id":"","error":"'.$err.'"}';

        sendResultInfoAsJson( $retValue );
    }

    function returnWithInfo( $id, $name, $category, $description, $date, $location, $latitude, $longitude, $contact_phone, $contact_email, $event_type, $rso_id, $admin_id, $start_time, $end_time, $university_id)
    {
        $retValue = '{"id":' . $id . ',"name":"' . $name . '","category":"'. $category .'","description":"'. $description .'","date":"'. $date .'","location":"'.$location.'","latitude":"'.$latitude.'","longitude":"'.$longitude.'","contact_phone":"'.$contact_phone.'","contact_email":"'.$contact_email.'","event_type":"'.$event_type.'","rso_id":"'.$rso_id.'","admin_id":"'.$admin_id.'","start_time":"'.$start_time.'","end_time":"'.$end_time.'","university_id":"'.$university_id.'","error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>