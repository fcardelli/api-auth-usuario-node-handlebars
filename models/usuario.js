module.exports = (sequelize, Sequelize) => {
  const Usuario = sequelize.define('usuario', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    nome: {
      type: Sequelize.STRING,
      notEmpty: true
    },
    sobrenome: {
      type: Sequelize.STRING,
      notEmpty: true
    },
    usuario: {
      type: Sequelize.TEXT
    },
    sobre: {
      type: Sequelize.TEXT
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
      }
    },
    senha: {
      type: Sequelize.STRING,
      allowNull: false
    },
    ultimo_login: {
      type: Sequelize.DATE
    },
    status: {
      type: Sequelize.ENUM('ativo', 'inativo'),
      defaultValue: 'ativo'
    }
  });
  Usuario.associate = function(models) {
    // associations can be defined here
  };
  return Usuario;
};