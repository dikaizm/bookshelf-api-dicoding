const {
    addBooksHandler,
    getAllBooksHandler,
    getByIdBooksHandler,
    editByIdBooksHandler,
    deleteByIdBooksHandler
} = require('./handler')

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: () => {
            return 'Selamat datang di perpustakaan! Buku apa yang kamu cari?';
        }
    },
    {
        method: 'POST',
        path: '/books',
        handler: addBooksHandler
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getByIdBooksHandler
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: editByIdBooksHandler
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteByIdBooksHandler
    }
]

module.exports = routes;