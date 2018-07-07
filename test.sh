export NODE_ENV=test &&
export DB_NAME=ivn-test &&
export DB_USER=postgres &&
export DB_CLIENT=pg &&
export TOKEN_SECRET=3ii2i &&
npx knex migrate:rollback &&
npx knex migrate:latest &&
npx knex seed:run &&
npx nyc --reporter=html --reporter=text mocha --opts __tests__/mocha.opts __tests__/**/*.spec.js --compilers js:babel-register --watch;

npx knex migrate:rollback;

echo "ALL DONE BOSS";
