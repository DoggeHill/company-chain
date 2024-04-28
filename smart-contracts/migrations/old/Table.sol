// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <=0.8.25;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {TablelandDeployments} from "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import {SQLHelpers} from "@tableland/evm/contracts/utils/SQLHelpers.sol";

contract Table is ERC721Holder {
    // Store relevant table info
    uint256 private _tableId; // Unique table ID
    string private constant _TABLE_PREFIX = "my_table"; // Custom table prefix

    // Creates a simple table with an `id` and `val` column
    function createTable() public payable {
      _tableId = TablelandDeployments.get().create(
           msg.sender,
            SQLHelpers.toCreateFromSchema(
              "id integer primary key," // Notice the trailing comma
              "val text",
              _TABLE_PREFIX
            )
        );
    }

    // Let anyone insert into the table
    function insertIntoTable(uint256 id, string memory val) external {
        TablelandDeployments.get().mutate(
              msg.sender, // Table owner, i.e., this contract
            _tableId,
            SQLHelpers.toInsert(
                _TABLE_PREFIX,
                _tableId,
                "id,val",
                string.concat(
                    Strings.toString(id), // Convert to a string
                    ",",
                    SQLHelpers.quote(val) // Wrap strings in single quotes with the `quote` method
                )
            )
        );
    }

    // Update only the row that the caller inserted
    function updateTable(uint256 id, string memory val) external {
        // Set the values to update
        string memory setters = string.concat("val=", SQLHelpers.quote(val));
        // Specify filters for which row to update
        string memory filters = string.concat(
            "id=",
            Strings.toString(id)
        );
        // Mutate a row at `id` with a new `val`
        TablelandDeployments.get().mutate(
            address(this),
            _tableId,
            SQLHelpers.toUpdate(_TABLE_PREFIX, _tableId, setters, filters)
        );
    }

    // Delete a row from the table by ID
    function deleteFromTable(uint256 id) external {
        // Specify filters for which row to delete
        string memory filters = string.concat(
            "id=",
            Strings.toString(id)
        );
        // Mutate a row at `id`
        TablelandDeployments.get().mutate(
            address(this),
            _tableId,
            SQLHelpers.toDelete(_TABLE_PREFIX, _tableId, filters)
        );
    }

    // Set the ACL controller to enable row-level writes with dynamic policies
    function setAccessControl(address controller) external {
        TablelandDeployments.get().setController(
            address(this), // Table owner, i.e., this contract
            _tableId,
            controller // Set the controller address—a separate controller contract
        );
    }

    // Return the table ID
    function getTableId() external view returns (uint256) {
        return _tableId;
    }

    // Return the table name
    function getTableName() external view returns (string memory) {
        return SQLHelpers.toNameFromId(_TABLE_PREFIX, _tableId);
    }
}
