<?php
    $inData = getRequestInfo();

    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $event_id = $inData["eventid"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4710");
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
        http_response_code(500);
    } else {
        $stmt = $conn->prepare("SELECT AVG(rating) AS avg_rating FROM Event_Ratings WHERE event_id = ?");
        $stmt->bind_param("i", $event_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if ($row["avg_rating"] === NULL) {
            returnWithError("No ratings found for the specified event.");
            http_response_code(404);
        } else {
            $avg_rating = $row["avg_rating"];
            $conn->close();
            returnWithInfo($avg_rating);
        }
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
        $retValue = '{"avg_rating":0,"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($avg_rating)
    {
        $retValue = '{"avg_rating":' . $avg_rating . ',"error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
