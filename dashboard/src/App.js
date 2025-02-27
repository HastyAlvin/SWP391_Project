// filepath: /src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AddProduct from './dashboard/view/seller/AddProduct';

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/add-product" component={AddProduct} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;