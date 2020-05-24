exports.seed = function(knex) {
  return knex('users').insert([      // password
    { username: 'admin', email: 'abc@123.dk', password: 'password' },
    { username: 'seconduser', email: 'abc@1234.dk', password: 'mypassword' },
    { username: 'thirduser', email: 'abc@12345.dk', password: 'thirdpassword' }
  ]);
};
