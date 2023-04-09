<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    // Get the input data
    $event_id = $inData["eventid"];
    $user_id = $inData["userid"];
    $rating = $inData["rating"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
        http_response_code(500);
	} else {
        // Check if the user has already rated the event
        $stmt = $conn->prepare("SELECT * FROM Event_Ratings WHERE event_id = ? AND user_id = ?");
        $stmt->bind_param("ii", $event_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Update the rating
            $stmt = $conn->prepare("UPDATE Event_Ratings SET rating = ? WHERE event_id = ? AND user_id = ?");
            $stmt->bind_param("iii", $rating, $event_id, $user_id);
            $stmt->execute();
            $conn->close();
            returnWithInfo($event_id, $user_id, $rating);
        } else {
            // Insert a new rating
            $stmt = $conn->prepare("INSERT INTO Event_Ratings (event_id, user_id, rating) VALUES (?, ?, ?)");
            $stmt->bind_param("iii", $event_id, $user_id, $rating);
            $stmt->execute();
            $conn->close();
            returnWithInfo($event_id, $user_id, $rating);
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
		$retValue = '{"event_id":0,"user_id":0,"rating":0,"error":"'.$err.'"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $event_id, $user_id, $rating )
    {
        $retValue = '{"event_id":' . $event_id . ',"user_id":' . $user_id . ',"rating":' . $rating . ',"error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>