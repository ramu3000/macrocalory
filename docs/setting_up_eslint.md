# Setting up eslint for our project

## Sources

* [https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [https://github.com/eslint/eslint/issues/8366](https://github.com/eslint/eslint/issues/8366)
* [https://github.com/yannickcr/eslint-plugin-react/issues/459](https://github.com/yannickcr/eslint-plugin-react/issues/459)



## Steps to success

### Install and ESLint initialization locally

#### In server/

    npm install --save -D
    ./node_modules/.bin/eslint --init

* How would you like to configure ESLint? Answer questions about your style
* Are you using ECMAScript 6 features? Yes
* Are you using ES6 modules? Yes
* Where will your code run? Node
* Do you use JSX? No
* What style of indentation do you use? Spaces
* What quotes do you use for strings? Single
* What line endings do you use? Unix
* Do you require semicolons? Yes
* What format do you want your config file to be in? JSON

#### In server/client/

    ../node_modules/.bin/eslint --init

* How would you like to configure ESLint? Answer questions about your style
* Are you using ECMAScript 6 features? Yes
* Are you using ES6 modules? Yes
* Where will your code run? Node
* Do you use JSX? No
* What style of indentation do you use? Spaces
* What quotes do you use for strings? Single
* What line endings do you use? Unix
* Do you require semicolons? Yes
* What format do you want your config file to be in? JSON

**Note: This installs eslint and eslint-plugin-react to client-side**


### Check that you have...

You should have in server-side *package.json*:
    
    "devDependencies": {
      ...,
      "eslint": "^4.19.1",
      ...
    }


You should have in client-side *package.json*:
    
    "devDependencies": {
      ...,
      "eslint": "^4.19.1",
      "eslint-plugin-react": "^7.7.0",
      ...
    }    

### Tweak .eslintrc -files

####  Indentation (both sides)

    "rules": {
        ...
        "indent": [
            "error",
            2
        ],
        ...

#### JSX-stuff (client-side)

    "rules": {
        ...
        "react/jsx-uses-vars": 2,
        "react/react-in-jsx-scope": 2,
        "react/jsx-uses-react": 2
        ...

#### ES2017-stuff (client-side)

    "parserOptions": {
        ...
        "ecmaFeatures": {
            ...
            "ecmaVersion": 2017
            ...
        },
        ...
    },
