<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    // Get the input data
    $event_id = $inData["eventid"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
        http_response_code(500);
	} else {
        // Fetch all comments for the event
        $stmt = $conn->prepare("SELECT id, user_id, content, timestamp FROM Comments WHERE event_id = ?");
        $stmt->bind_param("i", $event_id);
        $stmt->execute();
        $result = $stmt->get_result();

        // Construct an array of comments
        $comments = array();
        while ($row = $result->fetch_assoc()) {
            $comments[] = array(
                "id" => $row["id"],
                "user_id" => $row["user_id"],
                "content" => $row["content"],
                "timestamp" => $row["timestamp"]
            );
        }

        $conn->close();
        returnWithInfo($comments);
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
		$retValue = '{"error":"'.$err.'"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $comments )
    {
        $retValue = json_encode($comments);
        sendResultInfoAsJson($retValue);
    }
?>