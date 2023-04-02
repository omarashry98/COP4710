<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	} else {

        $stmt = $conn->prepare("SELECT id, name, latitude, longitude FROM Universities");
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
            http_response_code(404); // Unauthorized
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
