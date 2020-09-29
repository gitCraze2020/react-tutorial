
# This is to keep track of the various package and dependency installs done while developing the project


node -v
npm -v
yarn -v
#creates package.json
npm init -y

# to get typescript and node to behave with each other
# set up dependency using
yarn add -D @types/node typescript
# this gives you access to the type information for all node built-in functions

#in package.json, add a new script
# "scripts":
#   "start":"ts-node server/src/index.ts"

# to install that:
yarn add -D ts-node

#before running index.ts, you need to set up a config for typescript
# you can download the boilerplate typescript configuration file using
# npx tsconfig.json
# it prompts which framework, answer 'node'

#in package.json, add these new scripts
#  "scripts": {
#    "watch": "tsc -w",
#    "dev": "nodemon dist/index.js",
#    "start": "node dist/index.js",
#    "start2": "ts-node server/src/index.ts",
#    "dev2": "nodemon --exec ts-node server/src/index.ts"
#  },

yarn add subscription-transport-ws
# shouldn't be needed, already done above:
#npm i @types/node

yarn add urql
yarn add react

#see DefinitelyTyped/issues/47339
yarn remove @types-express

yarn add express apollo-server-express graphql type-graphql
yarn add -D @types/express
yarn add -D reflect-metadata


yarn add -D @graphql-codegen/typescript-urql

#see https://typegraphql.com/docs/validation.html#caveats
# Even if we don't use the validation feature (and we have provided { validate: false }
# option to buildSchema), we still need to have class-validator installed as a dev
# dependency in order to compile our app without errors using tsc.
yarn add -D class-validator

# create app, this creates a folder by the name web, that last parameter:
# you can pick any next.js, it will just affect what it looks like
# the below command will pick up the example from
#   github.com/vercel/next.js/tree/canary/examples/with-chakra-ui
# start in the root folder, temporary back up / rename web to web2
cd ..
mv web web2
yarn create next-app --example with-chakra-ui web
# then restore the already existing web2/src/utils/createUrqlClient.tsx to the web folder

#Success! Created web at /Users/Jurgen/Documents/business-products/Clusterwell/Factory/ciodash/web
#Inside that directory, you can run several commands:
#
#  yarn dev
#    Starts the development server.
#
#  yarn build
#    Builds the app for production.
#
#  yarn start
#    Runs the built app in production mode.
#
#We suggest that you begin by typing:
#
#  cd web
#  yarn dev

cd web
yarn dev

# then I removed all the wev/src/components/*.js files
# removed Readme file
# I reduced the src/pages/index.tsx (after renaming it from .js) to
##const Index = () => <div>Hello World!</div>;
##export default Index
# I renamed the src/pages/_app.tsx from .js
# I renamed the src/theme.tsx from .js
#then restart yarn dev
# which responded with
# We detected TypeScript in your project and created a tsconfig.json file for you.

yarn add formik

