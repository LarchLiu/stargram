export default eventHandler(async (event) => {
  try {
    const raw = await readBody(event)
    const url = getRequestURL(event)
    await initEnv(event.context.params?.token || '')
    return makeResponse200(await handleMessage(url, raw))
  }
  catch (error) {
    console.error(error)
    return new Response(errorToString(error), { status: 200 })
  }
})
