<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $universityid = $inData['universityid'];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	} else {

        $stmt = $conn->prepare("SELECT id, name, category, description, date, location, latitude, longitude, contact_phone, contact_email, event_type, rso_id, admin_id, start_time, end_time, university_id FROM Events where university_id= ? ORDER BY date ASC");
        $stmt->bind_param("i", $universityid);
        $stmt->execute();
        $result = $stmt->get_result();

        $universities = array();

        while ($row = $result->fetch_assoc())
        {
            $universities[] = $row;
        }

        if (count($universities) > 0)
        {
            returnWithInfo($universities);
        } else {
            returnWithError("No universities found.");
            http_response_code(404); // Not Found
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
        $retValue = '{"error":"' . $err . '"}';

        sendResultInfoAsJson( $retValue );
    }

    function returnWithInfo( $universities )
    {
        $retValue = json_encode($universities);
        sendResultInfoAsJson( $retValue );
    }
?>
