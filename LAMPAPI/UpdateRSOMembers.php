<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $rso_id = $inData["rso_id"];
    $ids = $inData["ids"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	} else {

        $uniqueViolation = false;
        foreach ($ids as $id) 
        {
            $stmt = $conn->prepare("INSERT INTO RSO_Members (rso_id, user_id) VALUES (?, ?)");

            try {
                $stmt->bind_param("ii", $rso_id, $id);
                $stmt->execute();
            } catch (mysqli_sql_exception $e) {
                // Catch unique key violation error
                if ($e->getCode() == 1062) {
                    $uniqueViolation = true;
                }
            }
        }

        $conn->close();
        if ($uniqueViolation) {
            returnWithError("Duplicate entry");
        } else {
            returnWithInfo();
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
		$retValue = '{"error":"'. $err .'"}';

		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo()
    {
        $retValue = '{"error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>