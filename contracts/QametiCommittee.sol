// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title QametiCommittee
 * @dev A ROSCA (Rotating Savings and Credit Association) smart contract
 * Participants contribute a fixed amount each round, and one participant receives the pot each round
 */
contract QametiCommittee {
    using SafeERC20 for IERC20;

    // State variables
    IERC20 public immutable token;
    address[] public participants;
    uint256 public immutable amountPerRound;
    uint256 public immutable roundDuration;
    uint256 public currentRound;
    uint256 public roundStartTime;
    address public immutable admin;

    // Tracks whether a participant has paid for a specific round
    mapping(uint256 => mapping(address => bool)) public hasPaid;
    
    // Tracks if a participant has already received their payout
    mapping(address => bool) public hasReceivedPayout;

    // Events
    event Contribution(address indexed participant, uint256 round, uint256 amount);
    event PotDistributed(uint256 round, address indexed winner, uint256 amount, uint256 fee);
    event RoundAdvanced(uint256 newRound, uint256 startTime);
    event CommitteeCompleted(); // Emitted when the last round finishes

    // Errors
    error NotParticipant();
    error AlreadyPaid();
    error NotAllPaid();
    error RoundNotComplete();
    error InvalidParticipants();
    error TransferFailed();
    error CommitteeComplete(); // Reverts when committee has finished all rounds

    /**
     * @dev Constructor to initialize the committee
     * @param _token Address of the ERC20 token to use
     * @param _participants Array of participant addresses
     * @param _amountPerRound Amount each participant must contribute per round
     * @param _roundDuration Duration of each round in seconds
     * @param _admin Address to receive the admin fee
     */
    constructor(
        address _token,
        address[] memory _participants,
        uint256 _amountPerRound,
        uint256 _roundDuration,
        address _admin
    ) {
        if (_participants.length == 0) revert InvalidParticipants();
        
        token = IERC20(_token);
        participants = _participants;
        amountPerRound = _amountPerRound;
        roundDuration = _roundDuration;
        admin = _admin;
        currentRound = 1;
        roundStartTime = block.timestamp;
    }

    /**
     * @dev Allows participants to contribute their share for the current round
     */
    function contribute() external {
        // Prevent paying if committee has already completed all rounds
        if (currentRound > participants.length) revert CommitteeComplete();
        
        if (!isParticipant(msg.sender)) revert NotParticipant();
        if (hasPaid[currentRound][msg.sender]) revert AlreadyPaid();

        hasPaid[currentRound][msg.sender] = true;
        token.safeTransferFrom(msg.sender, address(this), amountPerRound);

        emit Contribution(msg.sender, currentRound, amountPerRound);
    }

    /**
     * @dev Distributes the pot to the winner of the current round
     * Can only be called after all participants have paid and round duration has passed
     */
    function distributePot() external {
        // Prevent distributing if committee has already completed
        if (currentRound > participants.length) revert CommitteeComplete();
        
        if (!allParticipantsPaid()) revert NotAllPaid();
        if (block.timestamp < roundStartTime + roundDuration) revert RoundNotComplete();

        uint256 totalPot = amountPerRound * participants.length;
        uint256 fee = (totalPot * 5) / 1000; // 0.5% fee
        uint256 remainingPot = totalPot - fee;

        // Safety check to avoid out-of-bounds (shouldn't trigger due to earlier check)
        if (currentRound - 1 >= participants.length) revert CommitteeComplete();
        address winner = participants[currentRound - 1];
        hasReceivedPayout[winner] = true;

        // Transfer fee to admin first, then the remaining pot
        token.safeTransfer(admin, fee);
        token.safeTransfer(winner, remainingPot);

        emit PotDistributed(currentRound, winner, remainingPot, fee);

        // Advance to next round
        currentRound++;
        roundStartTime = block.timestamp;

        // Emit completion event if we've passed the last round
        if (currentRound > participants.length) {
            emit CommitteeCompleted();
        } else {
            emit RoundAdvanced(currentRound, roundStartTime);
        }
    }

    /**
     * @dev Check if all participants have paid for the current round
     */
    function allParticipantsPaid() public view returns (bool) {
        for (uint256 i = 0; i < participants.length; i++) {
            if (!hasPaid[currentRound][participants[i]]) {
                return false;
            }
        }
        return true;
    }

    /**
     * @dev Check if an address is a participant
     */
    function isParticipant(address _address) public view returns (bool) {
        for (uint256 i = 0; i < participants.length; i++) {
            if (participants[i] == _address) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Get the number of participants
     */
    function getParticipantsCount() external view returns (uint256) {
        return participants.length;
    }

    /**
     * @dev Get all participants
     */
    function getParticipants() external view returns (address[] memory) {
        return participants;
    }

    /**
     * @dev Get the current round winner address
     */
    function getCurrentWinner() external view returns (address) {
        if (currentRound > participants.length) {
            return address(0); // Committee completed
        }
        return participants[currentRound - 1];
    }

    /**
     * @dev Get committee info
     */
    function getCommitteeInfo() external view returns (
        uint256 _currentRound,
        uint256 _totalRounds,
        uint256 _amountPerRound,
        uint256 _roundDuration,
        uint256 _roundStartTime,
        bool _allPaid
    ) {
        return (
            currentRound,
            participants.length,
            amountPerRound,
            roundDuration,
            roundStartTime,
            allParticipantsPaid()
        );
    }
}
