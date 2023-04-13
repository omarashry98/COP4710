<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        $stmt = $conn->prepare("SELECT * FROM RSO_Members WHERE rso_id = ? AND user_id = ?");
        $stmt->bind_param("ii", $inData["rso_id"], $inData["user_id"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            returnWithInfo($row['id'], $row['rso_id'], $row['user_id']);
        } else {
            returnWithError("User is not a member of the specified RSO.");
            http_response_code(404); // Not found
        }

        $conn->close();
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
        $retValue = '{"id":0,"rso_id":0,"user_id":0,"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($id, $rso_id, $user_id)
    {
        $retValue = '{"id":' . $id . ',"rso_id":' . $rso_id . ',"user_id":' . $user_id . ',"error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
