// General React components
import React, { Component } from 'react';

// General function libraries
import * as index from '../../index.js';
import * as constants from '../../constants/constants.js';
import './transactions.scss';

import { Loader } from '../loader/loader.jsx';

import { startTxInputs, signContractInputs } from "./transactionsHelper.js";

class TxRow extends Component {
    state = {
        isExpanded: false
    }

    render() {
        const {
            txHash,
            to,
            amount,
            complete,
            from,
            threshold,
            numSigs
        } = this.props.data;

        return (

            <tr className="transactionRow" onClick={() => this.setState({ isExpanded: !this.state.isExpanded })}>
                <td className="transactionHash">{txHash.substring(0, 15) + "..."}</td>
                <td className="transactionTo">{to.substring(0, 15) + "..."}</td>
                <td className="transactionAmount">{amount / Math.pow(10, 18)} Eth</td>
                {complete ?
                    <td className="transactionStatus">Done</td>
                    : <td className="transactionStatus">Pending</td>}

                {this.state.isExpanded &&
                    <td className="composition">
                        <p>Transaction Hash: {txHash}</p>
                        <p>From: {from}</p>
                        <p>To: {to}</p>
                        <a href={"https://rinkeby.etherscan.io/tx/" + txHash} className="linkBtn" target="_blank" rel="noopener noreferrer">View on Etherscan</a>
                        {(complete) ?
                            <p id="status">Tx has been sent</p> :
                            <div>
                                <p>Number of Signatures: {numSigs}/{threshold}</p>
                                <button onClick={() => this.props.signTx()} className="signBtn">Sign Transaction</button>

                                <p id="status"></p>
                            </div>}
                    </td>}
            </tr>
        );
    }
}

export default class Transactions extends Component {
    state = {
        exchangeAmt: "",
        address: "",
        loading: false,
        hash: "",
        errorMsg: "",
        loadTitle: "",
        txLink: "",
        successType: "",
        msg: "",
        pending: []
    }

    constructor() {
        super();

        this.handleExchangeAmt = this.handleExchangeAmt.bind(this);
        this.handleAddress = this.handleAddress.bind(this);
    }

    async componentDidMount() {
        const pending = await index.contract.methods.getTransactions().call();
        this.setState({ pending: pending });
    }

    handleCloseLoad = () => {
        this.setState({
            loading: false,
            hash: "",
            errorMsg: "",
            loadTitle: "",
            txLink: "",
            successType: "",
            msg: ""
        });
    }

    render() {
        const {
            loading,
            hash,
            errorMsg,
            successType,
            pending,
            address,
            loadTitle,
            exchangeAmt,
            msg,
            txLink
        } = this.state;

        return (
            <div className="main">
                {loading && <Loader
                    hash={hash}
                    close={this.handleCloseLoad}
                    errorMsg={errorMsg}
                    title={loadTitle}
                    toAddress={address}
                    amount={exchangeAmt}
                    link={txLink}
                    msg={msg}
                    successType={successType}
                />}
                <div className="mainBlueBox">
                    <div id="pending">

                        <h1 className="transactionTitle">Transactions</h1>
                        <table className="transactionTable">
                            <tbody>
                                <tr className="headingRow">
                                    <th className="transactionHash">Tx Hash</th>
                                    <th className="transactionTo">To</th>
                                    <th className="transactionAmount">Amount</th>
                                    <th className="transactionStatus">Status</th>
                                </tr>
                                {pending.map((tx, index) => {
                                    return (<TxRow key={index} data={tx} signTx={() => this.signContract(index)} />)
                                })}

                            </tbody>
                        </table>

                    </div>
                    <h1 className="newTrans">New Transaction</h1>
                    <div className="startTrans">
                        <input type="text" className="address" placeholder="Send to Address"

                            value={this.state.address} onChange={this.handleAddress} />
                        <input type="number" className="exchangeAmt" placeholder="Transaction amount (Eth)"
                            value={this.state.exchangeAmt} onChange={this.handleExchangeAmt} />

                        <p className="connected" id="status"></p>
                        <a className="startBtn" onClick={this.startTransaction} href="!#">Start Transaction</a>
                        <p className="connected" id="message"></p>
                    </div>
                </div>
            </div>
        );
    }

    handleExchangeAmt = (event) => {
        this.setState({
            exchangeAmt: event.target.value
        });
    }

    handleAddress = (event) => {
        this.setState({
            address: event.target.value
        })
    }

    startTransaction = async () => {
        this.setState({ loading: true });

        const userAddress = (await constants.magic.user.getMetadata()).publicAddress;
        const { exchangeAmt, address } = this.state;
        const threshold = 3;

        const tmp = await startTxInputs(exchangeAmt, address, async (amt) => {
            return await index.contract.methods.setupTransaction(address, threshold, amt).call({
                from: userAddress,
                value: amt
            });
        });

        if (tmp !== "") {
            this.setState({
                loadTitle: "Unable to start transaction",
                errorMsg: tmp
            });
            return;
        }

        var txnHash;

        const transactAmt = index.web3.utils.toWei(exchangeAmt, "ether");

        try {
            await index.contract.methods.setupTransaction(address, threshold, transactAmt).send({
                from: userAddress,
                gas: 1500000,
                gasPrice: '30000000000',
                value: transactAmt
            })
                .on('transactionHash', (hash) => {
                    txnHash = hash;
                    this.setState({ hash: hash });
                });

            await index.contract.methods.setHash(txnHash).send({
                from: userAddress,
                gas: 1500000,
                gasPrice: '30000000000'
            });
        } catch (err) {
            this.setState({
                loadTitle: "Unable to start transaction",
                errorMsg: err
            });
            return;
        }

        const link = "https://rinkeby.etherscan.io/tx/" + txnHash;

        this.setState({
            successType: "start",
            txLink: link
        });
    }

    signContract = async (i) => {
        this.setState({ loading: true });

        const userAddress = (await constants.magic.user.getMetadata()).publicAddress;
        let msg = "";

        const tmp = await signContractInputs(async () => {
            return await index.contract.methods.signTransaction(i).call({
                from: userAddress
            });
        });


        if (tmp !== "") {
            this.setState({
                loadTitle: "Unable to sign transaction",
                errorMsg: tmp
            });
            return;
        }

        try {
            await index.contract.methods.signTransaction(i).send({
                from: userAddress,
                gas: 1500000,
                gasPrice: '3000000000000'
            })
                .on('transactionHash', (hash) =>
                    this.setState({ hash: hash }))

                .on('receipt', (rec) => {
                    if (rec.events.transactionOccured != null) {
                        msg = "Transaction completed";
                    }
                });
        } catch (err) {
            this.setState({
                loadTitle: "Unable to sign transaction",
                errorMsg: err
            });
            return;
        }

        this.setState({
            successType: "sign",
            hash: this.state.pending[i].txHash,
            msg: msg
        });
    }
}
