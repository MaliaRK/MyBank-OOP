#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
console.log(chalk.bold.underline.bgYellowBright.magenta("\n\t!---WELCOME TO MY BANK APPLICATION---!"));
const accounts = {};
class Bank {
    owner;
    CNIC;
    contactNumber;
    address;
    accountNumber;
    account;
    constructor(owner, CNIC, contactNumber, address) {
        this.owner = owner;
        this.CNIC = CNIC;
        this.contactNumber = contactNumber;
        this.address = address;
        this.accountNumber = this.generateAccountNumber();
        this.account = new Account(this.accountNumber);
    }
    generateAccountNumber(value) {
        const min = 1;
        const max = 10 ** 14;
        const accountNumber = Math.floor(Math.random() * (max - min) + min);
        console.log("\nAuto generated account number: ", chalk.underline(accountNumber));
        return accountNumber;
    }
    reActivation(value) {
        console.log(value === this.accountNumber
            ? chalk.italic.greenBright("\nYour account is verified and activated now!\n")
            : chalk.italic.redBright("\nverification failed.\n"));
    }
}
class Account {
    balance = 0;
    accountNumber;
    transactions = [];
    constructor(accountNumber) {
        this.accountNumber = accountNumber;
    }
    deposit(amount) {
        this.balance += amount;
        console.log(chalk.italic.greenBright("\nDeposited Amount: "), amount, chalk.italic.yellowBright("\nYour Account Balance is: "), this.balance);
        this.addTransctions("deposit", amount);
    }
    withdraw(amount) {
        if (amount > this.balance) {
            console.log(chalk.italic.redBright("\nInsufficient Balance"));
        }
        else {
            this.balance -= amount;
            console.log(chalk.italic.greenBright("\nWithdrawal Amount: "), amount, chalk.italic.yellowBright("\nYour Account Balance is: "), this.balance);
            this.addTransctions("withdraw", amount);
        }
    }
    balanceInquiry() {
        console.log(chalk.italic.yellowBright("\nYour Account Balance is: "), this.balance);
    }
    sendMoney(amount) {
        if (amount > this.balance) {
            console.log(chalk.italic.redBright("\nInsufficient Balance"));
        }
        else {
            this.balance -= amount;
            console.log(chalk.italic.greenBright("\nTransfered Amount: "), amount, chalk.italic.blueBright("\nMoney transfered successfully!"), chalk.italic.yellowBright("\nYour Account Balance is: "), this.balance);
            this.addTransctions("Send Money", amount);
        }
    }
    billsPayment(amount) {
        if (amount > this.balance) {
            console.log(chalk.italic.redBright("\nInsufficient Balance"));
        }
        else {
            this.balance -= amount;
            console.log(chalk.italic.greenBright("\nBill Amount: "), amount, chalk.italic.blueBright("\nBill paid successfully!"), chalk.italic.yellowBright("\nYour Account Balance is: "), this.balance);
            this.addTransctions("Bill Payment", amount);
        }
    }
    addTransctions(type, amount) {
        const date = new Date().toLocaleString();
        this.transactions.push({ date, type, amount });
    }
    viewTransactionHistory(value) {
        if (this.transactions.length === 0) {
            console.log(chalk.italic.redBright("\nNo Transactions found."));
        }
        else {
            console.log(chalk.bold.underline.yellowBright("\n\tTransaction History:\n"));
            this.transactions.forEach((transaction) => {
                console.log(chalk.italic.gray(`Date: ${transaction.date}\nType: ${transaction.type}\nAmount: ${transaction.amount}\n`));
            });
        }
    }
}
function bankServices() {
    console.log("\n");
    inquirer
        .prompt({
        message: "How can I help you?",
        type: "list",
        name: "service",
        choices: [
            "Account Open",
            "Account Re-active",
            "Deposit",
            "Withdraw",
            "Balance Inquiry",
            "Send Money",
            "Bills Payment",
            "View Transaction History",
            "Exit",
        ],
    })
        .then((answer) => {
        handleUser(answer.service);
    });
}
function handleUser(choice) {
    switch (choice) {
        case "Account Open":
            accountOpen();
            break;
        case "Account Re-active":
            accountReActive();
            break;
        case "Deposit":
            deposit();
            break;
        case "Withdraw":
            withdraw();
            break;
        case "Balance Inquiry":
            balanceInquiry();
            break;
        case "Send Money":
            transfer();
            break;
        case "Bills Payment":
            billsPayment();
            break;
        case "View Transaction History":
            viewTransactionHistory();
            break;
        case "Exit":
            console.log(chalk.bold.yellowBright("\n ***Thank You for using our services!*** "));
            break;
        default:
            break;
    }
}
function accountOpen() {
    console.log(chalk.italic.blueBright("\nSure! I need your details.\n"));
    inquirer
        .prompt([
        {
            message: "Enter Your Name: ",
            type: "input",
            name: "owner",
            validate: (input) => input !== "" || "name can't be empty",
        },
        {
            message: "Enter Your CNIC: ",
            type: "input",
            name: "CNIC",
            validate: (input) => {
                return isNaN(Number(input)) ? "Only numbers are allowed" : true;
            },
        },
        {
            message: "Enter Your Contact Number: ",
            type: "input",
            name: "contactNumber",
            validate: (input) => {
                return isNaN(Number(input)) ? "Only numbers are allowed" : true;
            },
        },
        {
            message: "Enter Your Address: ",
            type: "input",
            name: "address",
        },
    ])
        .then((answer) => {
        const myBank = new Bank(answer.owner, answer.CNIC, answer.contactNumber, answer.address);
        accounts[myBank.accountNumber] = myBank;
        console.log(chalk.italic.blueBright(`\nYour account has been opened...\nHere are your Account details:\n`));
        console.log(myBank);
        bankServices();
    });
}
function accountReActive() {
    console.log(chalk.italic.blueBright("\nSure! I required some verifications.\n"));
    inquirer
        .prompt([
        {
            message: "Please verify Alloted Account Number: ",
            type: "input",
            name: "accountNumber",
        },
    ])
        .then((answer) => {
        const accountNumber = Number(answer.accountNumber);
        const account = accounts[accountNumber];
        if (account) {
            account.reActivation(accountNumber);
        }
        else {
            console.log(chalk.italic.redBright("\nAccount not found.\t(Please enter a valid account number)"));
        }
        bankServices();
    });
}
function getAccountAndAmountFromUser() {
    return inquirer
        .prompt([
        {
            message: "Enter your account number: ",
            type: "input",
            name: "accountNumber",
        },
        {
            message: "Enter amount: ",
            type: "input",
            name: "amount",
        },
    ])
        .then((answer) => {
        const accountNumber = Number(answer.accountNumber);
        const account = accounts[accountNumber]?.account;
        const amount = Number(answer.amount);
        if (!account) {
            console.log(chalk.italic.redBright("\nAccount not found.\t(Please enter a valid account number)"));
        }
        return { account, amount };
    });
}
function getAccountFromUser() {
    return inquirer
        .prompt([
        {
            message: "Enter your account number: ",
            type: "input",
            name: "accountNumber",
        },
    ])
        .then((answer) => {
        const accountNumber = Number(answer.accountNumber);
        const account = accounts[accountNumber]?.account;
        if (!account) {
            console.log(chalk.italic.redBright("\nAccount not found.\t(Please enter a valid account number)"));
        }
        return account;
    });
}
function deposit() {
    getAccountAndAmountFromUser().then(({ account, amount }) => {
        if (account) {
            account.deposit(amount);
        }
        bankServices();
    });
}
function withdraw() {
    getAccountAndAmountFromUser().then(({ account, amount }) => {
        if (account) {
            account.withdraw(amount);
        }
        bankServices();
    });
}
function balanceInquiry() {
    getAccountFromUser().then((account) => {
        if (account) {
            account.balanceInquiry();
        }
        bankServices();
    });
}
function transfer() {
    inquirer
        .prompt([
        {
            message: "Add beneficiary account number:  (Make sure you enter a valid beneficiary A/C) ",
            type: "input",
            name: "beneficiary",
            validate: (input) => {
                return isNaN(Number(input)) ? "Only numbers are allowed" : true;
            },
        },
        {
            message: "Enter your account number: ",
            type: "input",
            name: "accountNumber",
        },
        {
            message: "Enter amount: ",
            type: "input",
            name: "amount",
        },
    ])
        .then((answer) => {
        const accountNumber = Number(answer.accountNumber);
        const account = accounts[accountNumber]?.account;
        const amount = Number(answer.amount);
        if (account) {
            account.sendMoney(amount);
        }
        else {
            console.log(chalk.italic.redBright("\nAccount not found.\t(Please enter a valid account number)"));
        }
        bankServices();
    });
}
function billsPayment() {
    inquirer
        .prompt([
        {
            message: "Select Company: ",
            type: "list",
            name: "company",
            choices: ["K-Electric", "SSGC", "Water", "Ptcl"],
        },
    ])
        .then(() => {
        return getAccountAndAmountFromUser();
    })
        .then(({ account, amount }) => {
        if (account) {
            account.billsPayment(amount);
        }
        bankServices();
    });
}
function viewTransactionHistory() {
    getAccountFromUser().then((account) => {
        if (account) {
            account.viewTransactionHistory();
        }
        bankServices();
    });
}
bankServices();
