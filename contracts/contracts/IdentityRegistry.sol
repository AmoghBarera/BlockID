// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract IdentityRegistry is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    enum IdentityStatus {
        None,
        Registered,
        PendingVerification,
        Verified,
        Rejected,
        Suspended,
        Revoked
    }

    struct IdentityRecord {
        address wallet;
        string did;
        string metadataCID;
        string proofHash;
        uint256 registeredAt;
        uint256 updatedAt;
        IdentityStatus status;
        bool exists;
    }

    struct VerificationEntry {
        address verifier;
        bool approved;
        string remarks;
        uint256 timestamp;
    }

    mapping(address => string) public walletToDid;
    mapping(string => IdentityRecord) private identities;
    mapping(string => VerificationEntry[]) private verificationHistory;

    event IdentityRegistered(address indexed wallet, string indexed did, string metadataCID, string proofHash);
    event IdentityUpdated(string indexed did, string metadataCID, string proofHash, uint256 timestamp);
    event VerificationRequested(string indexed did, uint256 timestamp);
    event IdentityVerified(string indexed did, address indexed verifier, bool approved, string remarks, uint256 timestamp);
    event IdentityRevoked(string indexed did, address indexed actor, uint256 timestamp);
    event IdentityRestored(string indexed did, address indexed actor, uint256 timestamp);

    error IdentityAlreadyExists();
    error IdentityNotFound();
    error InvalidStatus();
    error UnauthorizedWallet();

    constructor(address defaultAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(ADMIN_ROLE, defaultAdmin);
    }

    modifier onlyRegisteredWallet(string memory did) {
        if (!identities[did].exists) revert IdentityNotFound();
        if (identities[did].wallet != msg.sender && !hasRole(ADMIN_ROLE, msg.sender)) revert UnauthorizedWallet();
        _;
    }

    function registerIdentity(
        string calldata did,
        string calldata metadataCID,
        string calldata proofHash
    ) external {
        if (bytes(walletToDid[msg.sender]).length != 0 || identities[did].exists) revert IdentityAlreadyExists();

        identities[did] = IdentityRecord({
            wallet: msg.sender,
            did: did,
            metadataCID: metadataCID,
            proofHash: proofHash,
            registeredAt: block.timestamp,
            updatedAt: block.timestamp,
            status: IdentityStatus.Registered,
            exists: true
        });

        walletToDid[msg.sender] = did;
        emit IdentityRegistered(msg.sender, did, metadataCID, proofHash);
    }

    function requestVerification(string calldata did) external onlyRegisteredWallet(did) {
        IdentityRecord storage record = identities[did];
        if (record.status == IdentityStatus.Revoked) revert InvalidStatus();

        record.status = IdentityStatus.PendingVerification;
        record.updatedAt = block.timestamp;
        emit VerificationRequested(did, block.timestamp);
    }

    function verifyIdentity(
        string calldata did,
        bool approved,
        string calldata remarks
    ) external onlyRole(VERIFIER_ROLE) {
        IdentityRecord storage record = identities[did];
        if (!record.exists) revert IdentityNotFound();
        if (
            record.status != IdentityStatus.PendingVerification &&
            record.status != IdentityStatus.Registered &&
            record.status != IdentityStatus.Rejected
        ) revert InvalidStatus();

        record.status = approved ? IdentityStatus.Verified : IdentityStatus.Rejected;
        record.updatedAt = block.timestamp;
        verificationHistory[did].push(VerificationEntry(msg.sender, approved, remarks, block.timestamp));

        emit IdentityVerified(did, msg.sender, approved, remarks, block.timestamp);
    }

    function updateIdentity(
        string calldata did,
        string calldata metadataCID,
        string calldata proofHash
    ) external onlyRegisteredWallet(did) {
        IdentityRecord storage record = identities[did];
        if (record.status == IdentityStatus.Revoked || record.status == IdentityStatus.Suspended) revert InvalidStatus();

        record.metadataCID = metadataCID;
        record.proofHash = proofHash;
        record.updatedAt = block.timestamp;
        if (record.status == IdentityStatus.Verified) {
            record.status = IdentityStatus.PendingVerification;
        }

        emit IdentityUpdated(did, metadataCID, proofHash, block.timestamp);
    }

    function suspendIdentity(string calldata did) external onlyRole(ADMIN_ROLE) {
        IdentityRecord storage record = identities[did];
        if (!record.exists) revert IdentityNotFound();
        if (record.status == IdentityStatus.Revoked) revert InvalidStatus();

        record.status = IdentityStatus.Suspended;
        record.updatedAt = block.timestamp;
        emit IdentityRevoked(did, msg.sender, block.timestamp);
    }

    function restoreIdentity(string calldata did) external onlyRole(ADMIN_ROLE) {
        IdentityRecord storage record = identities[did];
        if (!record.exists) revert IdentityNotFound();
        if (record.status != IdentityStatus.Suspended) revert InvalidStatus();

        record.status = IdentityStatus.Verified;
        record.updatedAt = block.timestamp;
        emit IdentityRestored(did, msg.sender, block.timestamp);
    }

    function revokeIdentity(string calldata did) external onlyRole(ADMIN_ROLE) {
        IdentityRecord storage record = identities[did];
        if (!record.exists) revert IdentityNotFound();

        record.status = IdentityStatus.Revoked;
        record.updatedAt = block.timestamp;
        emit IdentityRevoked(did, msg.sender, block.timestamp);
    }

    function getIdentity(string calldata did) external view returns (IdentityRecord memory) {
        if (!identities[did].exists) revert IdentityNotFound();
        return identities[did];
    }

    function getVerificationHistory(string calldata did) external view returns (VerificationEntry[] memory) {
        if (!identities[did].exists) revert IdentityNotFound();
        return verificationHistory[did];
    }

    function grantVerifierRole(address verifier) external onlyRole(ADMIN_ROLE) {
        _grantRole(VERIFIER_ROLE, verifier);
    }

    function revokeVerifierRole(address verifier) external onlyRole(ADMIN_ROLE) {
        _revokeRole(VERIFIER_ROLE, verifier);
    }
}
