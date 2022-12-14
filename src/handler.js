const { nanoid } = require('nanoid');
const bookshelf = require('./books');

const addBooksHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    if (!name || name === "" || name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (readPage === pageCount);

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    };

    bookshelf.push(newBook);

    const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        })
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    })
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if (name !== undefined) {

        const response = h.response({
            status: 'success',
            data: {
                books: bookshelf
                .filter((title) => title.name.toLowerCase().includes(name.toLowerCase()))
                .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        })
        response.code(200);
        return response;
    }

    if (reading  === '1') {
        const response = h.response({
            status: 'success',
            data: {
                books: bookshelf
                    .filter((read) => read.reading === true)
                    .map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
            }
        })
        response.code(200);
        return response;
    }

    if (reading === '0') {
        const response = h.response({
            status: 'success',
            data: {
                books: bookshelf
                    .filter((read) => read.reading === false)
                    .map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
            }
        })
        response.code(200);
        return response;
    }

    if (finished === '1') {
        const response = h.response({
            status: 'success',
            data: {
                books: bookshelf
                    .filter((filter) => filter.finished === true)
                    .map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
            }
        })
        response.code(200);
        return response;
    }

    if (finished === '0') {
        const response = h.response({
            status: 'success',
            data: {
                books: bookshelf
                    .filter((finish) => finish.finished === false)
                    .map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
            }
        })
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'success',
        data: {
            books: bookshelf
                .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }))
        }
    })
    response.code(200);
    return response;
}

const getByIdBooksHandler = (request, h) => {
    const { id } = request.params;
    const book = bookshelf.filter((book) => book.id === id)[0];

    if (book) {
        return {
            status: 'success',
            data: {
                book
            }
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    })
    response.code(404);
    return response;
}

const editByIdBooksHandler = (request, h) => {
    const { id } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    const index = bookshelf.findIndex((book) => book.id === id);

    const updatedAt = new Date().toISOString();

    if (index !== -1) {
        if (!name || name === "" || name === undefined) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            })
            response.code(400);
            return response;
        }

        if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            })
            response.code(400);
            return response;
        }

        bookshelf[index] = {
            ...bookshelf[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404);
    return response;
}

const deleteByIdBooksHandler = (request, h) => {
    const { id } = request.params;

    const index = bookshelf.findIndex((book) => book.id === id);

    if (index !== -1) {
        bookshelf.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404);
    return response;
};

module.exports = {
    addBooksHandler,
    getAllBooksHandler,
    getByIdBooksHandler,
    editByIdBooksHandler,
    deleteByIdBooksHandler
};