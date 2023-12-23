const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./schema/movies')

const app = express()

app.use(express.json())
app.disable('x-powered-by')

app.get('/', (req, res) => {
    res.json({ message: 'hola mundo' })
})

// un endpoint es un path en el que tenemos un recurso
app.get('/movies', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    // recuperamos los valores del url
    const { genre } = req.query
    if (genre) {
        // filtra las peliculas que contengan el genero pasado, comopara el genero del json con el genero pasado por url ambas en lower case
        const genreMovies = movies.filter(movie => movie.genre.some(genreExt => genreExt.toLowerCase() === genre.toLowerCase()))
        return res.json(genreMovies)
    } 
    else{
        return res.json(movies)
    } 
    // res.status(404).json({ message: 'page not found' })
})


app.delete('/movies/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const { id } = req.params
    movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex == -1) return res.status(404).json({ message: 'page not found' })

    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie deleted' })

})
app.options('/movies/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.sendStatus(200)
})

app.post('/movies', (req, res) => {
    
    const result = validateMovie(req.body)

    if(result.error){
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = {
        id: crypto.randomUUID(), // te crea un id random
        ... result.data
    }

    movies.push(newMovie)
    res.status(201).json(newMovie)
})


app.patch('/movies/:id', (req, res) => {
    const { id } = req.params

    const result = validatePartialMovie(req.body)

    if (!result.success) return res.status(404).json({ message: 'page not found 1' })


    movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex == -1) return res.status(404).json({ message: 'page not found 2' })

    const movieToUpdate = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = movieToUpdate

    return res.json(movieToUpdate)

})


// con los 2 puntos se determina que es una variable. path to regexp
app.get('/movies/:id', (req, res) => {
    // recuperamos los valores del url
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)
    else res.status(404).json({ message: 'page not found' })
})


const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`conenctado en el puerto : http://localhost:${PORT}`)
})