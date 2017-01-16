# Photosketcher API :art: :triangular_ruler:

A RESTful backend API assisting the prototype sketching app known as Photosketcher.

## Installation

1. Clone repo :family_man_boy: if you are a collaborator, if not, click on that fork repo button :fork_and_knife:! 
2. Install NodeJS using NVM.
3. Install Mongodb.
4. Copy the content of the **.env.sample** file to a new file named **.env** then customize it to your needs, which will be your personal environment file.
4. Navigate to the project, then run `npm run dev`.
5. The server will now be running at [localhost:5000](http://localhost:500).

### NodeJS installation

Simply browse to [NVM's repository](https://github.com/creationix/nvm) and follow the steps relative to your operating system.

Then make sure NVM is installed by running `nvm --version` and that the output is a version number.

Now install the NodeJS version required for the project, which is written in the project's **.nvmrc** file. 

To do so, run `nvm install X`, **X** being the version found in the file.

After that, set this version as default, by running `nvm alias default X`.

### Mongodb installation

Install Mongodb using their documentation located [here](https://docs.mongodb.com/manual/installation/).

Then, pop open a terminal and run Mongodb by running... `mongo`.

Mongodb is a JavaScript based database system, so you will need to write JavaScript code to create the required database and user but don't fret, we've provided some copy-paste goodies.

```javascript
use protosketcherdb;
db.createUser({ user: 'protosketcherdb', pwd: 'protosketcherdb', roles: ['readWrite'] });
exit;
```

Here you go, you local document-based database is all set now :beer:!

### Linting

You will need to write quality code for it to be included on the repo, so ESLint will act as a development police :police_car:.

You can check if your code meets the required coding standards by running `npm run lint`, or by installing a text editor supporting ESLint.

If you want to get set up quickly, download [Atom](https://atom.io/) and install these packages `editorconfig es6-javascript autocomplete-flow javascript-snippets linter linter-eslint language-babel`.

**Note: you will not be able to commit if you have linting errors, it is highly recommended you fix them! :eyes: For emergency purposes only, you can force a commit using `-n` at the end of your `git commit` command.**

## Collaborators

- Justin D'Errico
- Jonathan Rainville
- Francois Lauzier
- Gabriel Latendresse
