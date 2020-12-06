# CodeManiacs

CodeManiacs is an online judge for IIT Mandi. It helps students of IIT Mandi practice problems, host contests and allows them to compete on a personal platform, specifically made for them.

## Getting Started

Install the Node Package Manager 
```bash
$ sudo snap install node --classic --channel=10
$ npm install nodemon -g
```

Fork this repo and clone it
```bash
$ git clone https://github.com/<Your User Name>/CodeManiacs.git
```

Open the folder CodeManiacs and install the dependencies
```bash
$ npm install
```

Now you need to set the config, for that open the config folder.
There create a `database.js` file with the following info
```
module.exports = {
    database: "mongodb://localhost/codemaniacs",
    secret: "Ask-Secret-From-Us"
}
```


Run the application
```bash
$ nodemon
```

The server runs at port 3000 i.e. http://localhost:3000/

## Next Step
Open localhost:3000 in your browser and there create a new user by clicking on sign up.
After signing up, you can see your profice. There you noitce you don't have admin access.

We need admin access to create new problems.
So to gain admin access, open MongoDB compass (or using terminal) and edit in users collection and set the `isAdmin` to true.
Now you have become the admin, you can create and edit new problems and contests.

**Explore the features, get familiar with the codebase and check out issues tab and contribution guide to get started**


## File Structure

The file structure of this repo is same as any other NodeJS project. The routes are in ```routes/``` directory, the logics for the routes are in ```controllers/``` directory, the models for the database used are in ```models/``` directory. The client side files are in ```public/``` directory, and the EJS (HTML Structures) files are in ```views/``` directory.

## Want to help? [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/KamandPrompt/CodeManiacs/issues)

Want to file a bug, request a feature, contribute some code, or improve documentation? Excellent! Read up on our guidelines for [contributing](CONTRIBUTING.md) and then check out one of our [issues](https://github.com/KamandPrompt/CodeManiacs/issues). Make sure you follow the guidelines before sending a contribution!

## Contribution

Peoples looking to contribute can checkout [CONTRIBUTING.md](/CONTRIBUTING.md) file.
