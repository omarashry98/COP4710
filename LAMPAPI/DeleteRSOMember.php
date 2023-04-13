<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $user_id = $inData["userid"];
    $rso_name = $inData["rsoname"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
        http_response_code(500);
    }
    else
    {
        // Get the RSO ID from the name
        $stmt = $conn->prepare("SELECT id FROM RSO WHERE name = ?");
        $stmt->bind_param("s", $rso_name);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            returnWithError("RSO not found.");
            http_response_code(404); // Not Found
            $conn->close();
            exit();
        }

        $row = $result->fetch_assoc();
        $rso_id = $row["id"];
        
        // Check if user is an admin for the RSO
        $stmt = $conn->prepare("SELECT * FROM RSO WHERE id = ? AND admin_id = ?");
        $stmt->bind_param("ii", $rso_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            returnWithError("User is an admin for this RSO.");
            http_response_code(403); // Forbidden
            $conn->close();
            exit();
        }

        // Delete the user from the RSO
        $stmt = $conn->prepare("DELETE FROM RSO_Members WHERE rso_id = ? AND user_id = ?");
        $stmt->bind_param("ii", $rso_id, $user_id);
        $stmt->execute();

        $conn->close();
        returnWithInfo("User successfully removed from RSO.");
        
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($info)
    {
        $retValue = '{"info":"' . $info . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
