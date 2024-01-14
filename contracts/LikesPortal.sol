// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract LikesPortal {
    
    struct Like {
        address liker;
        uint256 timestamp;
        string message;
    }

    struct Content {
        string url;
        string[] labels;
        uint256 totalLikes;
    }

    mapping (uint256 => Content) web3Contents;
    mapping (uint256 => Like[]) whoLikes;
    mapping (address => uint256) lastLikedAt;
    uint256 nextContentId;

    uint256 private seed;

    event NewLike(address indexed from, uint256 timestamp, string message);

    constructor() payable {
        console.log("Deploy do contrato feito com sucesso!");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function addContent(string memory _url, string[] memory _labels) public {
        web3Contents[nextContentId].url = _url;
        web3Contents[nextContentId].labels = _labels;
        console.log("%s adicionou o conteudo %s com o codigo: %d", 
            msg.sender, 
            _url,
            nextContentId
        );
        nextContentId++;
    }

    function listContent(uint256 contentId) public view returns (Like[] memory) {
        console.log(".......... listContent ..........");
        console.log("Lista de quem gostou do conteudo %s", web3Contents[contentId].url);
        Like[] memory lista = whoLikes[contentId]; 
        console.log("tamanho de: %d", lista.length);
        for(uint i=0; i < lista.length; i++) {
            console.log(
                "indice: %d do endereco %s deu um joinha no conteudo",
                i, 
                lista[i].liker
            );
        }
        return lista;
    }

    function like(uint256 contentId) public {
        console.log(".......... like ..........");
        require (lastLikedAt[msg.sender] + 30 seconds < block.timestamp, "Espere 30 segundos para o proximo joinha!!!");
        lastLikedAt[msg.sender] = block.timestamp;

        web3Contents[contentId].totalLikes++;
        Like memory _like = Like(msg.sender, block.timestamp, web3Contents[contentId].url);
        whoLikes[contentId].push(_like); 

        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("# randomico gerado: %d", seed);

        if (seed <= 50) {
            console.log("%s ganhou!", msg.sender);
        }

        uint256 prizeAmount = 0.0001 ether;
        require(
            prizeAmount <= address(this).balance,
            "Tentando sacar mais dinheiro que o contrato possui."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Falhou em sacar dinheiro do contrato.");

        emit NewLike(_like.liker, _like.timestamp, web3Contents[contentId].url);
    }

    function getTotalLikes(uint256 contentId) public view returns(uint256) {
        console.log(".......... getTotalLikes ..........");
        console.log("Temos um total de %d joinhas para o conteudo %s", 
            web3Contents[contentId].totalLikes, 
            web3Contents[contentId].url
        );
        return web3Contents[contentId].totalLikes;
    }

}