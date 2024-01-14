const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const likesContract = await hre.ethers.deployContract("LikesPortal", {value: hre.ethers.parseEther('0.1')});
    await likesContract.waitForDeployment();
    console.log("Contract deployed to:", likesContract.target);
    console.log("Contract deployed by:", owner.address);

    let contractBalance = await hre.ethers.provider.getBalance(likesContract.target);
    console.log("Saldo do contrato:", hre.ethers.formatEther(contractBalance));

    await likesContract.addContent(
        "https://youtu.be/LLfG5qnaJZU?si=-ul80jTy_jPETliM",
        ["DAO", "SMART_CONTRACT"]
    );

    let likeCounts;
    likeCounts = await likesContract.getTotalLikes(0);

    let likeTxn = await likesContract.like(0);
    await likeTxn.wait();

    likeCounts = await likesContract.getTotalLikes(0);

    likeTxn = await likesContract.connect(randomPerson).like(0);
    await likeTxn.wait();

    likeCounts = await likesContract.getTotalLikes(0);

    contractBalance = await hre.ethers.provider.getBalance(likesContract.target);
    console.log("Saldo do contrato:", hre.ethers.formatEther(contractBalance));

    await likesContract.listContent(0);

    // Testando cooldown
    likeTxn = await likesContract.like(0);
    await likeTxn.wait();

};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});