export default eventHandler(async (event) => {
  try {
    const raw = await readBody(event)
    const { pathname } = getRequestURL(event)
    return makeResponse200(await handleMessage(pathname, raw))
  }
  catch (error) {
    console.error(error)
    return new Response(errorToString(error), { status: 200 })
  }
})
