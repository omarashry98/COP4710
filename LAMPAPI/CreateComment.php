<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    // Get the input data
    $event_id = $inData["eventid"];
    $user_id = $inData["userid"];
    $content = $inData["content"];
    $timestamp = date("Y-m-d H:i:s");

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
        http_response_code(500);
	} else {
        // Check if a comment with the given event ID and user ID already exists
        $stmt = $conn->prepare("SELECT id FROM Comments WHERE event_id = ? AND user_id = ?");
        $stmt->bind_param("ii", $event_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Update the existing comment
            $stmt = $conn->prepare("UPDATE Comments SET content = ?, timestamp = ? WHERE event_id = ? AND user_id = ?");
            $stmt->bind_param("ssii", $content, $timestamp, $event_id, $user_id);
            $stmt->execute();
            $id = $result->fetch_assoc()["id"];
        } else {
            // Insert the comment into the database
            $stmt = $conn->prepare("INSERT INTO Comments (event_id, user_id, content, timestamp) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("iiss", $event_id, $user_id, $content, $timestamp);
            $stmt->execute();
            $id = $stmt->insert_id;
        }

        $conn->close();
        returnWithInfo($id, $timestamp);
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
		$retValue = '{"id":0,"timestamp":"","error":"'.$err.'"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $id, $timestamp )
    {
        $retValue = '{"id":' . $id . ',"timestamp":"' . $timestamp . '","error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>