// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockPKR
 * @dev Mock Pakistani Rupee (mPKR) ERC20 token with public faucet for demo purposes
 */
contract MockPKR is ERC20 {
    uint256 public constant FAUCET_AMOUNT = 100_000 * 10**18; // 100,000 mPKR

    constructor() ERC20("Mock Rupee", "mPKR") {}

    /**
     * @dev Public faucet function that mints 100,000 mPKR to the caller
     * This is for demo purposes only - never use in production!
     */
    function faucet() external {
        _mint(msg.sender, FAUCET_AMOUNT);
    }
}
