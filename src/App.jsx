import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/LikesPortal.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allLikes, setAllLikes] = useState([]);
  const contractAddress = "0xBeaE980e0869F62eEd6f22a0efb339EA5eD8DE78";
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
        setCurrentAccount(account);
        listContent();
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


  /*
   * Método para consultar todos os tchauzinhos do contrato
   */
  const listContent = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const likePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Chama o método listContent do contrato inteligente
         */
        const lista = await likePortalContract.listContent(0);

        /*
         * Apenas precisamos do endereço, data/horário, e mensagem na nossa tela, então vamos selecioná-los
         */
        const likesCleaned = lista.map(like => {
          return {
            address: like.liker,
            timestamp: new Date(Number(like.timestamp)*1000),
            message: like.message + " recebeu um joinha!!!"
          };
        });


        /*
         * Armazenando os dados
         */
        setAllLikes(likesCleaned);
      } else {
        console.log("Objeto Ethereum não existe!")
      }
    } catch (error) {
      console.log(error);
    }
  }


useEffect( async () => {
  checkIfWalletIsConnected();

  let likePortalContract;

  const onNewLike = (from, timestamp, message) => {
    console.log("NewLike", from, timestamp, message);
    setAllLikes(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(Number(timestamp) * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    likePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    likePortalContract.on("NewLike", onNewLike);
  }

  return () => {
    if (likePortalContract) {
      likePortalContract.off("NewLike", onNewLike);
    }
  };
}, [])



return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Olá Pessoal!
        </div>

        <div className="bio">
        Eu sou o Cassio e já assisti o conteúdo do link https://youtu.be/LLfG5qnaJZU?si=-ul80jTy_jPETliM sobre DAO e gostei muito! Conecte sua carteira Ethereum wallet e manda o seu like se gostou também!
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

        {allLikes.map((like, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Endereço: {like.address}</div>
              <div>Data/Horário: {like.timestamp.toString()}</div>
              <div>Mensagem: {like.message}</div>
            </div>)
        })}

      </div>
      
    </div>
  );
}