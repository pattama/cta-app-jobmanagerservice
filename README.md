#How to use
- clone this repository, you should clone this repo. to your expected brick name
  - `git clone git@git.sami.int.thomsonreuters.com:compass/cta-brick-boilerplate.git cta-[brickname]`
- if you don't have nvm please install it by npm install -g nvm
- change name and description in package.json to be your brick
- run npm install

##You can change git remote point to your brick repo.
- `git remote set-url origin [git url]` or deleting `.git` folder then do git init and set to repo.

###config
```
{
  executionsUrl: '',
  instancesUrl: '',
}
```
