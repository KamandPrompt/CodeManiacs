# CodeManiacs

CodeManiacs is an online judge for IIT Mandi. It helps students of IIT Mandi practice problems, host contests and allows them to compete on a personal platform, specifically made for them.

## Getting Started

[Click to see installation video](https://asciinema.org/a/379320?speed=8&autoplay=1)

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

Next you need to set the database configurations. Create a `database.js` file in the config folder, and add the following to it.
```
module.exports = {
    database: "mongodb://localhost/codemaniacs",
    secret: "Ask-Secret-From-Us"
}
```

Make sure you have mongodb installed. Then, run the following 
```bash
$ sudo service mongod start
```

Now, run the application
```bash
$ nodemon
```

The server runs at port 3000 i.e. http://localhost:3000/

## Next Steps
Open localhost:3000 in your browser and create a new user profile.

You will need admin access to create problems, make contests etc. 
So to gain admin access, open MongoDB compass (or use command line) and edit the users collection by setting `isAdmin` to true.

Doing this will provide you admin access, and then you can explore the full functionality.

**Explore the features, get familiar with the codebase, read the contribution guide and check out the issues to get started**


## File Structure

The file structure of this repo is same as any other NodeJS project. The routes are in ```routes/``` directory, the logics for the routes are in ```controllers/``` directory, the models for the database used are in ```models/``` directory. The client side files are in ```public/``` directory, and the EJS (HTML Structures) files are in ```views/``` directory.

## Want to help? [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/KamandPrompt/CodeManiacs/issues)

Want to file a bug, request a feature, contribute some code, or improve documentation? Excellent! Read up on our guidelines for [contributing](CONTRIBUTING.md) and then check out one of our [issues](https://github.com/KamandPrompt/CodeManiacs/issues). Make sure you follow the guidelines before sending a contribution!

## Contribution

People looking to contribute can checkout the [CONTRIBUTING.md](/CONTRIBUTING.md) file.
