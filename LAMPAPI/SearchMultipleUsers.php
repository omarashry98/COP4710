<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $emails = $inData["emails"];
    $ids = array();

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	} else {

        $stmt = $conn->prepare("SELECT ID, email FROM Users WHERE Email = ?");
        $stmt->bind_param("s", $email);
        
        foreach ($emails as $email) {
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $ids[] = $row["ID"];
            } else {
                returnWithError("No user associated with the email: " . $email);
                http_response_code(404); // Not found
                $conn->close();
                exit();
            }
        }

        $conn->close();
        returnWithIds($ids);
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
		$retValue = '{"ids":[],"error":"'. $err .'"}';

		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithIds( $ids )
    {
        $retValue = '{"ids":' . json_encode($ids) . ',"error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>