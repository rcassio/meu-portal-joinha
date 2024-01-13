import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/LikesPortal.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0x6BA431f58aDe66FD7eb120015E2c48125DDdFC46";
  /**
   * Cria uma variável para referenciar o conteúdo ABI!
   */
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Garanta que possua a Metamask instalada!");
        return;
      } else {
        console.log("Temos o objeto ethereum", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Encontrada a conta autorizada:", account);
        setCurrentAccount(account)
      } else {
        console.log("Nenhuma conta autorizada foi encontrada")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implemente aqui o seu método connectWallet
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask não encontrada!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const like = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        //const provider = new ethers.providers.Web3Provider(ethereum);
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const likePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count;
        count = await likePortalContract.getTotalLikes(0);
        console.log("Recuperado o número de joinhas...", count);

        const likeTxn = await likePortalContract.like(0);
        console.log("Minerando um novo joinha...", likeTxn.hash);
        await likeTxn.wait();
        count = await likePortalContract.getTotalLikes(0);
        console.log("Total de joinhas atualizado...", count);

      } else {
        console.log("Objeto Ethereum não encontrado!");
      }
    } catch (error) {
      console.log(error)
    }
  }

useEffect(() => {
  checkIfWalletIsConnected();
}, [])



return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Olá Pessoal!
        </div>

        <div className="bio">
        Eu sou o Cassio e já trabalhei com música, sabia? Legal, né? Conecte sua carteira  Ethereum wallet e me manda um joinha!
        </div>

        <button className="likeButton" onClick={like}>
          Mandar Joinha 🌟
        </button>
        {/*
        * Se não existir currentAccount, apresente este botão
        */}
        {!currentAccount && (
          <button className="likeButton" onClick={connectWallet}>
            Conectar carteira
          </button>
        )}
      </div>
      
    </div>
  );
}