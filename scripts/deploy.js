
const main = async () => {
    let provider = ethers.getDefaultProvider();
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await provider.getBalance(deployer.address);
  
    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());
  
    const Token = await hre.ethers.deployContract("LikesPortal");
    const portal = await Token.waitForDeployment();
  
    console.log("LikesPortal address: ", portal.target);

    //await portal.addContent(
    //    "https://youtu.be/LLfG5qnaJZU?si=-ul80jTy_jPETliM",
    //    ["DAO", "SMART_CONTRACT"]
    //);

    //let likeCounts = await portal.getTotalLikes(0);
    //console.log(`Total de Likes: ${likeCounts}`);
  };
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });