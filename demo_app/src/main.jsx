// import React from 'react';
import React, { Component } from 'react';
import * as handle from './phantom.js';
import './main.css';

class Main extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <head>
                        <script>
                            fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');
                            web3 = new Web3(fmPhantom.getProvider());
                         </script>

                    </head>
                    <div>
                        <h1 id="main">Fortmatic Whitelabel SDK Sign-in</h1>
                        <p id="status"></p>
                        <div>
                            <input type="text" id="user-email" placeholder="Enter your email" />
                            <button onClick={handle.handleLoginWithMagicLink}>Login via Magic Link</button>
                            <button onClick={handle.handleLogout}>Logout</button>
                        </div>

                        <div>
                            <button onClick={handle.handleGetMetadata}>Get Metadata</button>
                            <button onClick={handle.handleIsLoggedIn}>Check Login Status</button>
                        </div>

                        <button onClick={handle.deploying}>Deploy Contract</button>
                        
                        <div>
                            <input type="text" id="contractAdd" placeholder="Contract Address" />
                            <button onClick={handle.contractConnect}>Connect to Contract</button>
                        </div>

                        <div>
                            <input type="text" id="sendAddress" placeholder="Send to Address" />
                            <input type="number" id="exchangeAmt" placeholder="Transaction amount" />
                            <input type="number" id="threshold" placeholder="Threshold" />
                            <button onClick={handle.setupTransaction}>Start Transaction</button>
                        </div>

                        <div>
                            <input type="text" id="address" placeholder="Enter Address" />
                            <button onClick={handle.addToWhiteList}>Add Address to the Whitelist</button>
                        </div>

                        <button onClick={handle.signContract}>Sign Contract</button>

                    </div>
                </header>
            </div>
        );
    }
}

export default Main;