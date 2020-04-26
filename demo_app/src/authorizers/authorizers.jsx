import React, { Component } from 'react';

import * as handle from '../phantom.js';
import '../main.css';
import './authorizers.css';

class Deploy extends Component {
    render() {
        return (
            <div className="main">
                <div className="bigBlock">
                    <a className="otherBtn" onClick={handle.deploying} href="!#">Deploy Contract</a>
                    <div>
                        <input type="text" id="contractAdd" placeholder="Enter existing contract address" />
                        <a className="otherBtn" onClick={handle.contractConnect} href="!#">Connect to Contract</a>
                    </div>
                </div>
            </div>
        );
    }
}

class Vault extends Component {
    render() {
        return (
            <div className="main">
                <div className="bigBlock">
                    <div id="pending">
                        <h1 className="head_boxPD">Pending Transactions</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th >Tx Hash</th>
                                    <th >To</th>
                                    <th >Amount</th>
                                </tr>
                            </thead>
                            <tbody id="list">

                            </tbody>
                        </table>
                    </div>

                    <a className="signTran" onClick={this.signPendingTx} href="!#">Sign Transaction</a>
                    <div className="compBox" id="compositionTx"></div>
                </div>
            </div>
        );
    }
}

export {
    Deploy,
    Vault
};
