This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) and utilizes [Mobx-State-Tree](https://github.com/mobxjs/mobx-state-tree) for state management.


## Table of Contents

- [Setup](#setup)
- [Architecture Diagram](#architecture-diagram)
- [API Reference](#api-reference)
- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)
  - [npm test](#npm-test)
  - [npm run build](#npm-run-build)
- [Using the DSL for styling](#using-the-dsl)
- [Questions? Feedback? Contribute?](#contribute)

## Setup
Once you have set up a BigCommerce store and the accompanying BigCommerce API Template, folow the directions below to cover everything needed to deploy a branded front end site. 

[DTC Setop](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit?usp=sharing)
- [CREATING THE REPO](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.yw7ms37l3dcf)
- [CONTENTFUL SETUP](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.vhae9kaunvg5)
- [S3 BUCKET SETUP](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.2nl5rd6iveg)
- [Prerender.io SETUP](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.kkcyqynbmf6e)
- [S3 BUCKET SETTINGS](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.spqye65a9t8h)
- [TRAVIS SETUP](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.fvks8ms44ymi)
- [TRAVIS.YML SETUP](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.a1z7ed3b7saa)
- [ENV VARIABLES & FILES](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.k7c61u3tjj7h)
- [DYNATRACE SETUP](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.hiauu0vrla10)
- [TOUCHPOINT CREATION](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.u7qsm4l5mdia)
- [PSAT SCAN](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.h56992ato3f)
- [DNS SETUP](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.qdm0eej9f17h)
- [CONNECTING THE ROUTE 53 HOSTED ZONE TO CLOUDFROUNT](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.k91wdssy80cp)
- [SETTING UP EMAIL SERVICE IN AWS](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.jgngrlgoumbt)
- [ANALYTICS](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.25kq1fx6253f)
  - [GTM](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.b20qefaa1np9)
  - [GoogleTagManager](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.d43qrrds5dty)
  - [Neustar](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.194fk4ckahdk)
  - [TradeDesk](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.rguebextph9p)
  - [Facebook Pixel](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.ylw97n600m3j)
  - [Optimize](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.48oqsgxb036g)
  - [Crazy Egg](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.t723wwryuqac)
- [KLAVIYO SETUP](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.3h0hhx892zyu)
- [HOW TO HOOK KLAVIYO UP IN THE BIGC-WEB-API](https://docs.google.com/document/d/1412mZ3l3b4FEPQZ1Oh-L25E4EE2WSvAj9edtpNSaxGQ/edit#heading=h.ggnad4s0amgj)

## Architecture Diagram
To learn more about the archetecture of this project, reference the Lucid Chart - Architecture Diagram: https://www.lucidchart.com/invitations/accept/27644fa1-2f6e-41cf-9175-5dc41eb1bdef
 
## API Reference
An example set of API reference docs can be viewed through postman: 
[Femcare BigC API Reference Docs](https://documenter.getpostman.com/view/4882380/RzffKVYC?version=latest#5cd45b4e-0a7c-45a3-b23d-7dc538acb53a)


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console/broswer.

### `npm test`

Launches [Cypress](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-Nutshell) end-to-end tests.


### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Test Coverage
Currently using [Cypress](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-Nutshell) for end-to-end testing.<br/>
Navigate to tests/e2e/integration:
- home_page.spec.js
- login_spec.js
- my_cart_page.spec.js
- product_show_page.spec.js
- products_page.spec.js
- registration_spec.js

## Using the DSL
This app uses [Bulma](https://bulma.io/documentation/) and [SASS](https://sass-lang.com/). It also uses a DSL template.  Go into /style/variables.scss to change variable styling colors that are integrated throughout. 

## Contribute
This template is a starting point that has a lot of room for growth as we learn more about BigCommerce and what it can do. Feel free to create a pull request or create an issue if you find a bug or have an idea on how to improve the template.
