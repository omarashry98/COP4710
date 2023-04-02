<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $name = $inData['name'];
    $description = $inData['description'];
    $university_id = $inData['university_id'];
    $admin_id = $inData['admin_id'];
    $status = $inData['status'];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
        http_response_code(500); // Server Error
	} else {
        // Check if RSO already exists
        $stmt = $conn->prepare("SELECT id FROM RSO WHERE name = ?");
        $stmt->bind_param("s", $name);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            returnWithError("RSO already exists.");
            http_response_code(409); // Conflict
        } else {
            // Check if the RSO admin is affiliated with the same university as rso
            $stmt = $conn->prepare("SELECT university_id from Users where id = ?");
            $stmt->bind_param("i", $admin_id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                if ($row['university_id'] != $university_id) {
                    returnWithError("Admin is not affiliated with the same university as the RSO.");
                    http_response_code(401); // Unauthorized
                } else {
                    // Insert the new RSO
                    $stmt = $conn->prepare("INSERT INTO RSO (name, description, university_id, admin_id, status) VALUES (?, ?, ?, ?, ?)");
                    $stmt->bind_param("ssids", $name, $description, $university_id, $admin_id, $status);
                    $stmt->execute();
    
                    $id = $stmt->insert_id;
    
                    $conn->close();
                    returnWithInfo($id, $name, $university_id, $admin_id, $status);
                }

            } else {
                returnWithError("Admin not found");
                http_response_code(404); // Not found
            }
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
		$retValue = '{"id":0,"name":"","university_id":"","admin_id":"","status":"","error":"'.$err.'"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $id, $name, $university_id, $admin_id, $status)
    {
        $retValue = '{"id":' . $id . ',"name":"'. $name .'","university_id":"'. $university_id .'","admin_id":"'.$admin_id.'","status":"'. $status .'","error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>