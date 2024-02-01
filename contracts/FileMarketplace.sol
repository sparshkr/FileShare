// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract FileMarketplace {
    // File struct
    struct File {
        uint256 id;
        uint256 price;
        address author;
        address[] buyers;
        string title;
        string link;
    }
    // array that stores all files
    File[] public files;
    // stores all files URLs

    // events
    event FileListed(uint256 indexed id, string title, uint256 price);
    event FileSold(uint256 indexed id, address buyer);

    modifier isAuthor(uint256 _id) {
        require(
            msg.sender == files[_id].author,
            "You are not the author of this file"
        );
        _;
    }

    modifier isNotAuthor(uint256 _id) {
        require(
            msg.sender != files[_id].author,
            "You are the author of this file"
        );
        _;
    }

    modifier fileExists(uint256 _id) {
        require(files.length >= _id, "The file does not exist");
        _;
    }
    // checks if msg.sender is included in buyers list of file _id
    modifier isBuyer(uint256 _id) {
        require(files[_id].buyers.length > 0, "The file has no buyers");

        bool userIsBuyer = false;
        for (uint256 x = 0; x < files[_id].buyers.length; x++) {
            if (files[_id].buyers[x] == msg.sender) {
                // console.log("Found buyer: ", files[_id].buyers[x]);
                userIsBuyer = true;
            }
        }
        require(userIsBuyer, "You do not own this file.");
        _;
    }

    // checks if msg.sender is included in buyers list of file _id
    modifier isNotBuyer(uint256 _id) {
        require(files[_id].buyers.length > 0, "The file has no buyers");

        bool userIsNotBuyer = true;
        for (uint256 x = 0; x < files[_id].buyers.length; x++) {
            if (files[_id].buyers[x] == msg.sender) {
                // console.log("Found buyer: ", files[_id].buyers[x]);
                userIsNotBuyer = false;
            }
        }
        require(userIsNotBuyer, "You already own this file");
        _;
    }

    function listFile(
        string memory _title,
        uint256 _price,
        string memory _arweaveURI
    ) public {
        // save file info to files array
        File memory file;

        file.id = files.length;
        // save price and other info to file struct
        file.price = _price;
        file.author = msg.sender;
        file.title = _title;
        file.link = _arweaveURI;
        // create array to store buyers and
        // include the author
        address[] memory buyers = new address[](1);
        buyers[0] = msg.sender;
        // save buyers to file struct
        file.buyers = buyers;
        // save to list of files
        files.push(file);

        // save the file's arweave URI in private mapping
        // console.log("Listing file with id", file.id);

        emit FileListed(file.id, _title, _price);
    }

    function buyFile(
        uint256 _id
    ) external payable fileExists(_id) isNotAuthor(_id) isNotBuyer(_id) {
        // Convert msg.value to gwei
        uint256 pricePaid = msg.value * 10 ** 9;

        // Check if user sent enough funds
        require(pricePaid >= files[_id].price, "Not enough funds");

        // Transfer funds to the author
        address payable receiver = payable(files[_id].author);
        (bool sent, ) = receiver.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        // Add sender to buyers array
        files[_id].buyers.push(msg.sender);

        emit FileSold(_id, msg.sender);
    }

    function getFiles() public view returns (File[] memory) {
        return files;
    }

    // function getOwnedFiles() public view returns (File[] memory) {
    //     uint256 resCount = 0;

    //     for (uint256 i = 0; i < files.length; i++) {
    //         if (files[i].author == msg.sender) {
    //             resCount++;
    //         }
    //     }
    //     File[] memory ownedFiles;
    //     for (uint256 x = 0; x < files.length; x++) {
    //         if (files[x].author == msg.sender) {
    //             // ownedFiles[x] = files[x];
    //             ownedFiles.push(files[x]);
    //         }
    //     }
    //     return ownedFiles;
    // }
    function getOwnedFiles() public view returns (File[] memory) {
        uint256 resCount = 0;

        for (uint256 i = 0; i < files.length; i++) {
            if (files[i].author == msg.sender) {
                resCount++;
            }
        }

        File[] memory ownedFiles = new File[](resCount);

        uint256 index = 0;
        for (uint256 x = 0; x < files.length; x++) {
            if (files[x].author == msg.sender) {
                ownedFiles[index] = files[x];
                index++;
            }
        }

        return ownedFiles;
    }

    function getBoughtFiles() public view returns (File[] memory) {
        uint64 resCount = 0;

        for (uint256 i = 0; i < files.length; i++) {
            if (files[i].buyers.length > 0) {
                for (uint256 x = 0; x < files[i].buyers.length; x++) {
                    if (files[i].buyers[x] == msg.sender) {
                        resCount++;
                    }
                }
            }
        }

        require(resCount > 0, "You bought no files");

        File[] memory boughtFiles = new File[](resCount);
        uint256 index = 0;
        for (uint256 j = 0; j < files.length; j++) {
            if (files[j].buyers.length > 0) {
                for (uint256 v = 0; v < files[j].buyers.length; v++) {
                    if (files[j].buyers[v] == msg.sender) {
                        boughtFiles[index] = files[j];
                        index++;
                    }
                }
            }
        }
        return boughtFiles;
    }
}
