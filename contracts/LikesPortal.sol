// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract LikesPortal {
    
    struct Content {
        string url;
        string[] labels;
        uint totalLikes;
    }

    mapping (uint => Content) web3Contents;
    mapping (uint => address[]) whoLikes;
    uint nextContentId;

    constructor() {
        console.log("Deploy do contrato feito com sucesso!");
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

    function listContent(uint contentId) public view {
        console.log("Lista de quem gostou do conteudo %s", web3Contents[contentId].url);
        address[] memory lista = whoLikes[contentId]; 
        for(uint i=0; i < lista.length; i++) {
            console.log(
                "indice: %d do endereco %s deu um joinha no conteudo",
                i, 
                lista[i]
            );
        }
    }

    function like(uint contentId) public {
        web3Contents[contentId].totalLikes++;
        whoLikes[contentId].push(msg.sender); 
        console.log("%s deu joinha para o conteudo %s", msg.sender, web3Contents[contentId].url);
    }

    function getTotalLikes(uint contentId) public view returns(uint256) {
        console.log("Temos um total de %d joinhas para o conteudo %s", 
            web3Contents[contentId].totalLikes, 
            web3Contents[contentId].url
        );
        return web3Contents[contentId].totalLikes;
    }

}