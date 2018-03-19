### Problem 2019-03-20
Something went terribly wrong when getting rid of the old local copy of this repository and cloning a new one.

Running stuff in development works after:
    
    npm install
    npm install --prefix client
    npm run dev
    
**BUT** deploying to Heroku does not work anymore. 

    git push heroku master
    
There are problems with buildpack. Apparently the package.json should be located in git root directory. In this project it is in "server"-directory.

I found a way to deploy using additional buildpack. This works for now:

    heroku buildpacks:clear
    heroku buildpacks:set https://github.com/timanovsky/subdir-heroku-buildpack
    heroku buildpacks:add heroku/nodejs
    heroku config:set PROJECT_PATH=server
    git push heroku master
    
**But how did it work normally with the previous local repository (from which all the commits to this remote GitHub-repo were pushed)?**

