export const okResponse = (data, statusCode = 200) => ({
    statusCode: statusCode,
    body: JSON.stringify({ ...data, error: null })
});

export const errorResponse = (error, statusCode = 404) => ({
    statusCode: statusCode,
    body: JSON.stringify({ error: error })
});