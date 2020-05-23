exports.seed = function(knex) {
  return knex('users').insert([      // password
    { username: 'admin', email: 'abc@123.dk', password: '$2b$12$Wpmg6Wywh9FHDprDSKvMPOEnnGNkg0G6V6Qa5jjj4dAd0atYTe1TO' },
    { username: 'seconduser', email: 'abc@1234.dk', password: '$2b$12$60UWd9nGMJgPcDtO0zkPv.DAijvu46ZpG.IJkHOAQhdUztMu6NZce' },
    { username: 'thirduser', email: 'abc@12345.dk', password: '$2b$12$60UWd9nGMJgPcDtO0zkPv.DAijvu46ZpG.IJkHOAQhdUztMu6NZce' }
  ]);
};
