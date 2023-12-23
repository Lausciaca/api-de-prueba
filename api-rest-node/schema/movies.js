const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'El titulo debe ser un texto',
        required_error: 'El titulo es necesario'
    }),
    year: z.number().int().positive().max(3000),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url(),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Terror', 'Drama', 'Romance'])
    )
}) 

function validateMovie (object) {
    return movieSchema.safeParse(object)
}

function validatePartialMovie (object) {
    return movieSchema.partial().safeParse(object)
    // el partial hace que las propiedades del objeto sean opcionales
}

module.exports = {
    validateMovie,
    validatePartialMovie

}
