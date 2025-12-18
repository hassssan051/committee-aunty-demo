// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./QametiCommittee.sol";

/**
 * @title QametiHub
 * @dev Factory contract for creating and managing QametiCommittee instances
 */
contract QametiHub {
    address public immutable admin;
    address public immutable tokenAddress;
    
    // Array to track all created committees
    address[] public committees;
    
    // Mapping from creator to their committees
    mapping(address => address[]) public creatorCommittees;

    // Events
    event CommitteeCreated(
        address indexed committeeAddress,
        address indexed creator,
        address[] participants,
        uint256 amountPerRound,
        uint256 roundDuration
    );

    /**
     * @dev Constructor
     * @param _tokenAddress Address of the MockPKR token contract
     * @param _admin Address that will receive fees from all committees
     */
    constructor(address _tokenAddress, address _admin) {
        tokenAddress = _tokenAddress;
        admin = _admin;
    }

    /**
     * @dev Creates a new QametiCommittee contract
     * @param _participants Array of participant addresses
     * @param _amountPerRound Amount each participant must contribute per round
     * @param _roundDuration Duration of each round in seconds
     * @return committeeAddress Address of the newly created committee
     */
    function createCommittee(
        address[] memory _participants,
        uint256 _amountPerRound,
        uint256 _roundDuration
    ) external returns (address committeeAddress) {
        // Deploy new committee
        QametiCommittee newCommittee = new QametiCommittee(
            tokenAddress,
            _participants,
            _amountPerRound,
            _roundDuration,
            admin
        );

        committeeAddress = address(newCommittee);

        // Track the committee
        committees.push(committeeAddress);
        creatorCommittees[msg.sender].push(committeeAddress);

        emit CommitteeCreated(
            committeeAddress,
            msg.sender,
            _participants,
            _amountPerRound,
            _roundDuration
        );

        return committeeAddress;
    }

    /**
     * @dev Get all committees created through this hub
     */
    function getAllCommittees() external view returns (address[] memory) {
        return committees;
    }

    /**
     * @dev Get all committees created by a specific address
     */
    function getCommitteesByCreator(address _creator) external view returns (address[] memory) {
        return creatorCommittees[_creator];
    }

    /**
     * @dev Get the total number of committees
     */
    function getCommitteesCount() external view returns (uint256) {
        return committees.length;
    }
}
