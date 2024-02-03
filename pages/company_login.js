import React, { Component } from "react";
import {
  Button,
  Divider,
  Transition,
  Form,
  Grid,
  Segment,
  Message
} from "semantic-ui-react";
import {Router} from '../../backend/routes'
import web3 from "../../backend/Ethereum/web3";
import Election_Factory from "../../backend/Ethereum/election_factory";
import Cookies from 'js-cookie';
import {Helmet} from 'react-helmet'

class DividerExampleVerticalForm extends Component {
  state = { visible: true, email: ''};
  toggleVisibility = () => this.setState({ visible: !this.state.visible });  
  returnBackImage = () => (
    <div className='login-form'>
    <style JSX>{`
        .login-form {
            width:100vw;
            height:100vh;
            position:absolute; 
            background: url('../../static/blockchain.jpg') no-repeat;
            z-index: -1;
        }
      `}</style>
  </div>
  )
  
  signup = event => {
    const email = document.getElementById('signup_email').value;
    const password = document.getElementById('signup_password').value;
    const repeat_password = document.getElementById('signup_repeat_password').value;
  
    if (password !== repeat_password) {
      alert("Passwords do not match");		
    } else {
      fetch('http://localhost:4000/company/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email:email,password:password})
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === "success") {
          Cookies.set('company_email', encodeURI(data.data.email));                    				                    
          alert("Added!");
          Router.pushRoute(`/company_login`);
        } else {
          alert(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }
  signin = async event => {
    const email = document.getElementById('signin_email').value;
    this.setState({ email: document.getElementById('signin_email').value });
    const password = document.getElementById("signin_password").value;
  
    try {
      const response = await fetch("http://localhost:4000/company/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email:email,password:password})
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const responseObj = await response.json();
  
      if (responseObj.status === "success") {
        Cookies.set('company_id', encodeURI(responseObj.data.id));
        Cookies.set('company_email', encodeURI(responseObj.data.email));
      } else {
        alert(responseObj.message);
      }
  
      const accounts = await web3.eth.getAccounts();
      const summary = await Election_Factory.methods.getDeployedElection(this.state.email).call({ from: accounts[0] });
  
      if (summary[2] === "Create an election.") {
        Router.pushRoute(`/election/create_election`);
      } else {
        Cookies.set('address', summary[0]);
        Router.pushRoute(`/election/${summary[0]}/company_dashboard`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  render() {
    const { visible } = this.state;
    return (
      <div>
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        />
        <Helmet>
            <title>Company Login</title>
        </Helmet>
        <div>
          {this.returnBackImage()}

          <Button.Group style={{ marginLeft: "43%" }}>
            <Button
              primary
              content={visible ? "Sign in" : "Sign Up"}
              onClick={this.toggleVisibility}
            />
          </Button.Group>
          <Divider style={{ zIndex: "-10" }} />
          <Grid className="grid1">
            <Grid.Row>
              <Grid.Column
                width={5}
                style={{ marginLeft: "33%", marginTop: "10%" }}
                verticalAlign="middle"
              >
                <Segment placeholder className="segment">
                  <Transition
                    visible={!this.state.visible}
                    animation="scale"
                    duration={300}
                  >
                    <Form size="large">
                      <h3 style={{ textAlign: "center" }}>Sign in</h3>
                      <Form.Input
                        fluid
                        id="signin_email"
                        icon="user"
                        iconPosition="left"
                        placeholder="Email"
                        style={{ padding: 5 }}
                      />
                      <Form.Input
                        style={{ padding: 5 }}
                        fluid
                        id="signin_password"
                        icon="lock"
                        iconPosition="left"
                        placeholder="Password"
                        type="password"
                      />

                      <Button
                        onClick={this.signin}
                        color="blue"
                        fluid
                        size="large"
                        style={{ marginBottom: 15 }}
                      >
                        Submit
                      </Button>
                    </Form>
                  </Transition>

                  <Transition
                    visible={this.state.visible}
                    animation="scale"
                    duration={300}
                  >
                    <Form size="large">
                      <h3 style={{ textAlign: "center" }}>Sign up</h3>
                      <Form.Input
                        fluid
                        id="signup_email"
                        icon="user"
                        iconPosition="left"
                        placeholder="Email"
                        style={{ padding: 5 }}
                      />
                      <Form.Input
                        style={{ padding: 5 }}
                        fluid
                        id="signup_password"
                        icon="lock"
                        iconPosition="left"
                        placeholder="Password"
                        type="password"
                      />
                      <Form.Input
                        style={{ padding: 5 }}
                        fluid
                        id="signup_repeat_password"
                        icon="lock"
                        iconPosition="left"
                        placeholder="Repeat Password"
                        type="password"
                      />
                      <Button
                        onClick={this.signup}
                        color="blue"
                        fluid
                        size="large"
                        style={{ marginBottom: 15 }}
                      >
                        Submit
                      </Button>                      
                    </Form>
                  </Transition>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}
export default DividerExampleVerticalForm;
