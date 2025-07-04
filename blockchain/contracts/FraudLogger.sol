// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FraudLogger {
    event FraudLogged(string txId, bool isFraud);

    function logFraud(string memory txId, bool isFraud) public {
        emit FraudLogged(txId, isFraud);
    }
}
