import * as session from 'express-session';
import * as MongoDBStore from 'connect-mongodb-session';

const MongoDBStoreSession = MongoDBStore(session);

const MongoSessionStore = new MongoDBStoreSession({
  uri: 'mongodb://admin:flooder22@localhost:27017/hotel?authSource=admin',
  collection: 'sessions',
});

MongoSessionStore.on('error', function (error) {
  console.log('Ошибка подключения к хранилищу сессий MongoDB:', error);
});

export default MongoSessionStore;
