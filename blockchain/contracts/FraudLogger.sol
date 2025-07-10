// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FraudLogger {
    event FraudLogged(
        string txId,
        string user,
        uint amount,
        string reason,
        bool isFraud
    );

    function logFraud(
        string memory txId,
        string memory user,
        uint amount,
        string memory reason,
        bool isFraud
    ) public {
        emit FraudLogged(txId, user, amount, reason, isFraud);
    }
}
